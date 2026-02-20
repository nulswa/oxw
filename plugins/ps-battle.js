import { promises as fs } from 'fs';

const ccFilePath = './src/cc.json';

async function loadColecs() {
try {
const data = await fs.readFile(ccFilePath, 'utf-8');
return JSON.parse(data);
} catch (error) {
return [];
}
}

let handler = async (m, { conn, usedPrefix, command, participants }) => {
if (!global.db.data.chats[m.chat].fCards && m.isGroup) {
return conn.sendMessage(m.chat, { text: `*[ ⽷ ]*  Los comandos de *cartas* estan desactivados...` }, { quoted: m })
}

const attackerId = m.sender;
let attacker = global.db.data.users[attackerId];

try {
// Obtener el objetivo (usuario mencionado o citado)
let targetId;

// Verificar si es una respuesta a un mensaje
if (m.quoted && m.quoted.sender) {
targetId = m.quoted.sender;
}
// Verificar si hay una mención
else if (m.mentionedJid && m.mentionedJid.length > 0) {
targetId = m.mentionedJid[0];
}
else {
return await conn.reply(m.chat, `${emoji} Responda el mensaje de un usuario para un kill instantaneo.`, m);
}

// Verificar que no se desafíe a sí mismo
if (targetId === attackerId) {
return await conn.reply(m.chat, `📍 No puedes desafiarte a ti mismo...`, m);
}

let target = global.db.data.users[targetId];
if (!target) {
target = global.db.data.users[targetId] = {
boletos: 0
};
}

// Cargar colecciones
const colecciones = await loadColecs();

// Obtener colecciones de ambos usuarios
const attackerColeccion = colecciones.find(c => c.userId === attackerId);
const targetColeccion = colecciones.find(c => c.userId === targetId);

// Verificar que el atacante tenga personajes
if (!attackerColeccion || !attackerColeccion.personajes || attackerColeccion.personajes.length === 0) {
return await conn.reply(m.chat, `📍 No tienes personajes para batallar.\n- Usa *${usedPrefix}cpay* para comprar personajes`, m);
}

// Verificar que el objetivo tenga personajes
if (!targetColeccion || !targetColeccion.personajes || targetColeccion.personajes.length === 0) {
const targetTag = `@${targetId.split('@')[0]}`;
return await conn.reply(m.chat, `📍 ${targetTag} no tiene personajes para batallar.`, m, {
mentions: [targetId]
});
}

// Calcular estadísticas totales del atacante
const attackerStats = {
totalPoder: attackerColeccion.personajes.reduce((sum, p) => sum + parseInt(p.poder || 0), 0),
totalFuerza: attackerColeccion.personajes.reduce((sum, p) => sum + parseInt(p.fuerza || 0), 0),
totalMagia: attackerColeccion.personajes.reduce((sum, p) => sum + parseInt(p.magia || 0), 0),
cantidadPersonajes: attackerColeccion.personajes.length,
personajes: attackerColeccion.personajes
};

// Calcular estadísticas totales del objetivo
const targetStats = {
totalPoder: targetColeccion.personajes.reduce((sum, p) => sum + parseInt(p.poder || 0), 0),
totalFuerza: targetColeccion.personajes.reduce((sum, p) => sum + parseInt(p.fuerza || 0), 0),
totalMagia: targetColeccion.personajes.reduce((sum, p) => sum + parseInt(p.magia || 0), 0),
cantidadPersonajes: targetColeccion.personajes.length,
personajes: targetColeccion.personajes
};

// Calcular poder total combinado (poder + fuerza + magia)
const attackerPowerTotal = attackerStats.totalPoder + attackerStats.totalFuerza + attackerStats.totalMagia;
const targetPowerTotal = targetStats.totalPoder + targetStats.totalFuerza + targetStats.totalMagia;

// Obtener personaje más fuerte de cada usuario para mostrar
const attackerBestChar = attackerStats.personajes.reduce((best, current) => {
const currentPower = parseInt(current.poder || 0) + parseInt(current.fuerza || 0) + parseInt(current.magia || 0);
const bestPower = parseInt(best.poder || 0) + parseInt(best.fuerza || 0) + parseInt(best.magia || 0);
return currentPower > bestPower ? current : best;
});

const targetBestChar = targetStats.personajes.reduce((best, current) => {
const currentPower = parseInt(current.poder || 0) + parseInt(current.fuerza || 0) + parseInt(current.magia || 0);
const bestPower = parseInt(best.poder || 0) + parseInt(best.fuerza || 0) + parseInt(best.magia || 0);
return currentPower > bestPower ? current : best;
});

// Tags de los usuarios
const attackerTag = `@${attackerId.split('@')[0]}`;
const targetTag = `@${targetId.split('@')[0]}`;

// Mensaje de inicio de batalla
let battleMsg = `⚔️ \`[ ESTADISTICAS ]\`⚔️
- ¡Gana el que tiene mas poder y nivel!

▢ 1️⃣ ${attackerTag} *(lvl_${attackerPowerTotal})*
▢ *PS*  »  ${attackerStats.cantidadPersonajes} en total.
⚔️ *Mejor Card:*
> N-${attackerBestChar.name} *(${attackerBestChar.rarity})* / P-${attackerBestChar.poder} / F-${attackerBestChar.fuerza} / M-${attackerBestChar.magia}


▢ 2️⃣ ${targetTag} *(lvl_${targetPowerTotal})*
▢ *PS*  »  ${targetStats.cantidadPersonajes}
⚔️ *Mejor Card:*
> N-${targetBestChar.name} *(${targetBestChar.rarity})* / P-${targetBestChar.poder} / F-${targetBestChar.fuerza} / M-${targetBestChar.magia}`;
// Determinar ganador
let winner, loser, winnerId, loserId, winnerTag, loserTag;

if (attackerPowerTotal > targetPowerTotal) {
winner = attacker;
loser = target;
winnerId = attackerId;
loserId = targetId;
winnerTag = attackerTag;
loserTag = targetTag;
} else if (targetPowerTotal > attackerPowerTotal) {
winner = target;
loser = attacker;
winnerId = targetId;
loserId = attackerId;
winnerTag = targetTag;
loserTag = attackerTag;
} else {
// Empate - gana el que tiene más personajes
if (attackerStats.cantidadPersonajes > targetStats.cantidadPersonajes) {
winner = attacker;
loser = target;
winnerId = attackerId;
loserId = targetId;
winnerTag = attackerTag;
loserTag = targetTag;
} else if (targetStats.cantidadPersonajes > attackerStats.cantidadPersonajes) {
winner = target;
loser = attacker;
winnerId = targetId;
loserId = attackerId;
winnerTag = targetTag;
loserTag = attackerTag;
} else {
// Empate total - gana el atacante
winner = attacker;
loser = target;
winnerId = attackerId;
loserId = targetId;
winnerTag = attackerTag;
loserTag = targetTag;
}
}

// Calcular recompensa (mitad de las boletoss del perdedor)
const loserCoins = loser.boletos || 0;
const reward = Math.floor(loserCoins / 2);

// Transferir boletoss
if (reward > 0) {
winner.boletos = (winner.boletos || 0) + reward;
loser.boletos = loserCoins - reward;
}

// Mensaje de resultado
let battleTercer = `🏆 GANADOR: ${winnerTag}\n\n`;

if (reward > 0) {
battleTercer += `${toem} ${winnerTag} Gano: ${reward} ${currency}\n`;
battleTercer += `${toem} Su saldo: ${winner.boletos} ${currency}\n\n`;
battleTercer += `${toem} ${loserTag} perdió: ${reward} ${currency}\n`;
battleTercer += `${toem} Su saldo: ${loser.boletos} ${currency}\n\n`;
} else {
battleTercer += `${loserTag} no tenía ${currency} para perder :v\n\n`;
}

// Razón de victoria
if (attackerPowerTotal > targetPowerTotal || targetPowerTotal > attackerPowerTotal) {
battleTercer += `⚡ ¡¡Victoria por mayor poder total!!\n`;
} else if (attackerStats.cantidadPersonajes !== targetStats.cantidadPersonajes) {
battleTercer += `🎴 ¡¡Victoria por mayor cantidad de personajes!!\n`;
} else {
battleTercer += `🎯 ¡¡Victoria por iniciativa de combate!!\n`;
}

battleTercer += `\n\n_¡Batalla finalizada!_`;

conn.reply(m.chat, battleMsg, m, { mentions: [attackerId, targetId] });
conn.reply(m.chat, battleTercer, m, { mentions: [attackerId, targetId] });
} catch (error) {
console.error('Error en batalla:', error);
await conn.sendMessage(m.chat, { text: `${error.message}` }, { quoted: m });
}
};

handler.command = ['killc', 'battle'];
handler.tags = ["coleccion"];
handler.group = true;

export default handler;

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)
