const waifusList = [
{
id: 1,
name: 'TORU',
image: 'https://files.catbox.moe/8oz9sy.jpg',
anime: 'mx-community',
genero: 'Hombre',
altura: '1.87',
perso: 'Jugueton',
rarity: 'Epico'
},
{
id: 2,
name: 'ONIX',
image: 'https://files.catbox.moe/s6zgpa.jpg',
anime: 'mx-community',
genero: 'Hombre',
altura: '1.98',
perso: 'Algo gruñón.',
rarity: 'Epico'
}
];

let adoptedWaifus = {};

const handler = async (m, { conn, usedPrefix, command }) => {
try {
const sender = m.sender;
const groupId = m.chat;


if (!adoptedWaifus[groupId]) {
adoptedWaifus[groupId] = {};
}

const cmd = command.toLowerCase();


if (cmd === 'abrir') {
return adoptarWaifu(m, conn, groupId, sender, usedPrefix);
}

 
if (cmd === 'mibot') {
return verMiWaifu(m, conn, groupId, sender);
}


if (cmd === 'pert') {
return listarWaifusGrupo(m, groupId);
}


if (cmd === 'doplist') {
return verWaifusDisponibles(m, groupId, usedPrefix);
}


if (cmd === 'alimentar') {
return alimentarWaifu(m, groupId, sender, usedPrefix);
}


if (cmd === 'relation') {
return tenerRelaciones(m, conn, groupId, sender, usedPrefix);
}


if (cmd === 'infoadop') {
return mostrarAyuda(m, usedPrefix);
}

} catch (error) {
console.error(error);
conn.sendMessage(m.chat, { text: error.message }, { quoted: m });
}
};


async function adoptarWaifu(m, conn, groupId, sender, usedPrefix) {
if (adoptedWaifus[groupId][sender]) {
const waifu = adoptedWaifus[groupId][sender];
return conn.sendMessage(m.chat, { text: `Ya adoptaste a *@${waifu.name}*, solo puedes adaptar a uno.\n- Cuida *@${waifu.name}* y subelo de nivel...` }, { quoted: m });
}


const waifusAdoptadas = Object.values(adoptedWaifus[groupId]);
const disponibles = waifusList.filter(w => 
!waifusAdoptadas.some(aw => aw.id === w.id)
);

if (disponibles.length === 0) {
return conn.sendMessage(m.chat, { text: `No quedan mas paquetes de adopción.\n- Solo existen 2 tipos de bots en cada grupo.` }, { quoted: m });
}

const waifu = disponibles[Math.floor(Math.random() * disponibles.length)];

adoptedWaifus[groupId][sender] = {
...waifu,
fecha: new Date().toLocaleDateString(),
hambre: 50,
felicidad: 50,
nivel: 1,
relaciones: 0 
};

let consBots = `\t『 *ADOPCIÓN* 』
- ¡Has adoptado a un bot personal!

❒ *Nombre* : ${waifu.name}
❒ *Lugar* : ${waifu.anime}
❒ *Genero* : ${waifu.genero}
❒ *Altura* : ${waifu.altura}
❒ *Rareza* : ${waifu.rarity}
❒ *Personalidad* : ${waifu.perso}
❒ *Relaciones* : ${waifu.relaciones}

📆 Adopción de ${new Date().toLocaleDateString()}
> Use *#mibot* sus estadísticas.`
await conn.sendMessage(m.chat, { image: { url: waifu.image }, caption: consBots }, { quoted: m });
}


async function verMiWaifu(m, conn, groupId, sender) {
if (!adoptedWaifus[groupId][sender]) {
return conn.sendMessage(m.chat, { text: `❔ No tienes un bot adoptado, usa *#abrir* para ver tu bot aleatorio.` }, { quoted: m });
}

const waifu = adoptedWaifus[groupId][sender];
let consTats = `\t\t〩 *Estadísticas : Bot* 〩
- ¡Estadísticas de tu bot adoptado!

❒ *Nombre* : ${waifu.name}
❒ *Lugar* : ${waifu.anime}
❒ *Genero* : ${waifu.genero}
❒ *Altura* : ${waifu.altura}
❒ *Rareza* : ${waifu.rarity}
❒ *Personalidad* : ${waifu.perso}
❒ *Relaciones* : ${waifu.relaciones}

> *Detalles*
⧡ *Hambre* : ${waifu.hambre}/100
⧡ *Felicidad* : ${waifu.felicidad}/100
⧡ *Relaciones* : ${waifu..relaciones} veces`
await conn.sendMessage(m.chat, { image: { url: waifu.image }, caption: consTats }, { quoted: m });
}


function listarWaifusGrupo(m, groupId) {
if (!adoptedWaifus[groupId] || Object.keys(adoptedWaifus[groupId]).length === 0) {
return conn.sendMessage(m.chat, { text: 'No hay bots adoptados en este grupo.' }, { quoted: m });
}

let lista = '· ┄ · ⊸ 𔓕 *Bot  :  Adopcion*\n\n';
let i = 1;

for (const [userId, waifu] of Object.entries(adoptedWaifus[groupId])) {
const user = userId.split('@')[0];
lista += `＃${i}. *${waifu.name}*\n`;
lista += `＃ *Dueño/a* : ${user}\n`;
lista += `＃ *Tipo* : ${waifu.genero}\n`;
lista += `＃ *Rareza* : ${waifu.rarity}\n`;
lista += `＃ *Nivel* : ${waifu.nivel}\n\n`;
lista += `──────\n\n`;
i++;
}

lista += `\n📍 Total: ${i-1} bots adoptados.`;
m.reply(lista);
}


function verWaifusDisponibles(m, groupId, usedPrefix) {
const waifusAdoptadas = Object.values(adoptedWaifus[groupId] || {});
const disponibles = waifusList.filter(w => 
!waifusAdoptadas.some(aw => aw.id === w.id)
);

if (disponibles.length === 0) {
return conn.sendMessage(m.chat, { text: `No hay bots para adoptar...` }, { quoted: m });
}

let lista = '🎌 *Waifus Disponibles* 🎌\n\n';

disponibles.forEach((waifu, index) => {
lista += `\t▢ ${index+1}. *${waifu.name}*\n`;
lista += `\t▢ *Genero* : ${waifu.genero}\n`;
lista += `\t▢ *Rareza* : ${waifu.rarity}\n`;
lista += `━━━━━━━━━━━━\n`;
});

lista += `\nUsa *${usedPrefix}adoptar* para adoptar una`;
m.reply(lista);
}


function alimentarWaifu(m, groupId, sender, usedPrefix) {
if (!adoptedWaifus[groupId][sender]) {
return m.reply(`❌ No tienes una waifu\nUsa *${usedPrefix}adoptar* primero`);
}

const waifu = adoptedWaifus[groupId][sender];


waifu.hambre = Math.min(100, waifu.hambre + 20);
waifu.felicidad = Math.min(100, waifu.felicidad + 15);


if (waifu.hambre >= 100 && waifu.nivel < 20) {
waifu.nivel++;
waifu.hambre = 50; 
m.reply(`🎉 *¡${waifu.name} ha subido al nivel ${waifu.nivel}!*`);
}


m.reply(`🍽️ *${waifu.name}* ha sido alimentada\n\n` +
`📊 *Nuevas estadísticas:*\n` +
`\t▢ *Hambre* : ${waifu.hambre}/100 (+20)\n` +
`\t▢ *Felicidad*. : ${waifu.felicidad}/100 (+15)\n` +
`\t▢ *Nivel* : ${waifu.nivel}\n\n` +
`❤️ ¡${waifu.name} está contento!`);
}


async function tenerRelaciones(m, conn, groupId, sender, usedPrefix) {
if (!adoptedWaifus[groupId][sender]) {
return m.reply(`❌ No tienes una waifu\nUsa *${usedPrefix}adoptar* primero`);
}

const waifu = adoptedWaifus[groupId][sender];


if (waifu.nivel < 20) {
return m.reply(`❌ *${waifu.name}* necesita alcanzar el nivel 20 para tener relaciones\n` +
`📈 Nivel actual: ${waifu.nivel}/20\n` +
`💡 Alimenta a tu waifu más veces para subir de nivel`);
}


if (waifu.hambre < 30) {
return m.reply(`❌ *${waifu.name}* tiene demasiada hambre para tener relaciones\n` +
`🍽️ Hambre actual: ${waifu.hambre}/100\n` +
`💡 Usa *${usedPrefix}alimentar* primero`);
}

if (waifu.felicidad < 40) {
return m.reply(`❌ *${waifu.name}* está muy triste para tener relaciones\n` +
`💖 Felicidad actual: ${waifu.felicidad}/100\n` +
`💡 Alimenta a tu waifu para aumentar su felicidad`);
}


waifu.relaciones++;
waifu.hambre = Math.max(0, waifu.hambre - 15);
waifu.felicidad = Math.min(100, waifu.felicidad + 10);


const mensajesRelaciones = [
`💕 *¡Has tenido relaciones con ${waifu.name}!*\n\n` +
`🏩 *${waifu.name}* está muy feliz contigo\n` +
`✨ Relaciones totales: ${waifu.relaciones}\n\n` +
`📊 *Cambios en estadísticas:*\n` +
`• Hambre: ${waifu.hambre}/100 (-15)\n` +
`• Felicidad: ${waifu.felicidad}/100 (+10)\n` +
`💘 ¡La conexión con tu waifu se ha fortalecido!`,

`💑 *Momento íntimo con ${waifu.name}*\n\n` +
`🌸 *${waifu.name}* te mira con cariño\n` +
`❤️ Veces que han estado juntos: ${waifu.relaciones}\n\n` +
`📈 *Efectos:*\n` +
`• Energía: ${waifu.hambre}/100\n` +
`• Amor: ${waifu.felicidad}/100\n` +
`🔥 ¡La pasión arde entre ustedes!`,

`🛏️ *Noche de pasión con ${waifu.name}*\n\n` +
`💖 *${waifu.name}* está más unida a ti ahora\n` +
`💕 Momentos íntimos: ${waifu.relaciones}\n\n` +
`📊 *Estado actual:*\n` +
`• Cansancio: ${waifu.hambre}/100\n` +
`• Satisfacción: ${waifu.felicidad}/100\n` +
`🌙 ¡Una noche inolvidable!`
];


const mensaje = mensajesRelaciones[Math.floor(Math.random() * mensajesRelaciones.length)];


await conn.sendFile(m.chat, waifu.image, 'waifu.jpg', mensaje, m);
}


function mostrarAyuda(m, usedPrefix) {
const ayuda = `🌸 *Sistema de Waifus* 🌸\n\n` +
 `📋 *Comandos:*\n` +
 `• ${usedPrefix}adoptar - Adoptar una waifu\n` +
 `• ${usedPrefix}miwaifu - Ver tu waifu\n` +
 `• ${usedPrefix}listawaifus - Ver waifus del grupo\n` +
 `• ${usedPrefix}waifusdisponibles - Ver waifus disponibles\n` +
 `• ${usedPrefix}alimentar - Alimentar tu waifu\n` +
 `• ${usedPrefix}relaciones - Tener relaciones (nivel 20+)\n\n` +
 `✨ *Reglas:*\n` +
 `• Solo 1 waifu por usuario\n` +
 `• Alimenta a tu waifu regularmente\n` +
 `• Las waifus son por grupo\n` +
 `• Relaciones disponibles desde nivel 20`;

m.reply(ayuda);
}


handler.help = ['adoptar', 'miwaifu', 'listawaifus', 'waifusdisponibles', 'alimentar', 'relaciones', 'waifus'];
handler.tags = ['waifu', 'juegos'];
handler.command = ['adoptar', 'miwaifu', 'listawaifus', 'waifusdisponibles', 'alimentar', 'relaciones', 'waifus'];
handler.group = true;

export default handler;