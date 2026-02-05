///También tuyo

import { promises as fs } from 'fs';

const ccFilePath = './scrapers/ows/cc.json';

async function loadColecs() {
try {
const data = await fs.readFile(ccFilePath, 'utf-8');
return JSON.parse(data);
} catch (error) {
return [];
}
}

let handler = async (m, { conn, usedPrefix }) => {
const userId = m.sender;

try {
// Cargar colecciones :v
const colecciones = await loadColecs();

// Buscar la colección del usuario :v
const userColeccion = colecciones.find(c => c.userId === userId);

// Verificar si el usuario tiene personajes :v
if (!userColeccion || !userColeccion.personajes || userColeccion.personajes.length === 0) {
let mensaje = `📍  No tienes personajes coleccionados.\n- Usa *${usedPrefix}cbuy* o gana personajes en eventos.`
return await conn.reply(m.chat, mensaje, m);
}

// Construir mensaje con los personajes del usuario :v
let mensaje = `\t〤 *Coleccion : Personajes*\n\n`;
mensaje += `- 👤 Tus personajes: *${userColeccion.personajes.length}*\n${readMore}\n`;

// Agrupar personajes por rareza :v
const rarityOrder = { 'Golden': 1, 'Rare': 2, 'Common': 3 };
const personajesOrdenados = userColeccion.personajes.sort((a, b) => {
return (rarityOrder[a.rarity] || 999) - (rarityOrder[b.rarity] || 999);
});

personajesOrdenados.forEach((personaje, index) => {
// Emoji según rareza jsjs :v
let rarityEmoji = '';
switch(personaje.rarity) {
case 'Golden':
rarityEmoji = '👑';
break;
case 'Rare':
rarityEmoji = '💎';
break;
case 'Common':
rarityEmoji = '⭐';
break;
default:
rarityEmoji = '🎴';
}

mensaje += `${rarityEmoji} *${index + 1}. ${personaje.name}*\n`;
mensaje += `▢ *Anime* : ${personaje.anime} *(${personaje.rarity})*\n`;
mensaje += `▢ *Base* : ${personaje.base}\n`;
mensaje += `▢ *Valor* : ${personaje.value} ${toem}\n`;
mensaje += `> 💯 *Personaje* : P-${personaje.poder} / F-${personaje.fuerza} / M-${personaje.magia}\n`;
mensaje += `> 📍  *Habilidades* : ${personaje.habili}\n\n\n`;
});

// Calcular estadísticas totales
const totalPoder = personajesOrdenados.reduce((sum, p) => sum + parseInt(p.poder || 0), 0);
const totalFuerza = personajesOrdenados.reduce((sum, p) => sum + parseInt(p.fuerza || 0), 0);
const totalMagia = personajesOrdenados.reduce((sum, p) => sum + parseInt(p.magia || 0), 0);
const valorTotal = personajesOrdenados.reduce((sum, p) => sum + parseInt(p.value || 0), 0);

mensaje += `•────────────────────•\n\n\t〤 *TU ESTATUS:*\n`;
mensaje += `⚡ *Poder Total* : ${totalPoder}\n`;
mensaje += `💪 *Fuerza Total* : ${totalFuerza}\n`;
mensaje += `✨ *Magia Total* : ${totalMagia}\n`;
mensaje += `💰 *Valor Total* : ${valorTotal} ${toem} ${currency}\n\n`;

// Contador por rareza (agrega mas rarezas si añades mas personajes.)
const goldenCount = personajesOrdenados.filter(p => p.rarity === 'Golden').length;
const rareCount = personajesOrdenados.filter(p => p.rarity === 'Rare').length;
const commonCount = personajesOrdenados.filter(p => p.rarity === 'Common').length;

if (goldenCount > 0 || rareCount > 0 || commonCount > 0) {
mensaje += `\t〤 *COLECCION POR RANGO:*\n`;
if (goldenCount > 0) mensaje += `👑 Golden: ${goldenCount}\n`;
if (rareCount > 0) mensaje += `💎 Rare: ${rareCount}\n`;
if (commonCount > 0) mensaje += `⭐ Common: ${commonCount}\n`;
}

mensaje += `\n> ${textbot}`;

await conn.sendMessage(m.chat, { text: mensaje, contextInfo: { forwardingScore: 1, isForwarded: false, externalAdReply: { showAdAttribution: false, renderLargerThumbnail: true, title: "Coleccion : Personajes", body: textbot, containsAutoReply: true, mediaType: 1, thumbnailUrl: "https://i.postimg.cc/fWftFVZV/Picsart-26-01-17-02-46-49-331.jpg", sourceUrl: null }}}, { quoted: m });
//conn.reply(m.chat, mensaje, m);

} catch (error) {
console.error(error);
await conn.reply(m.chat, `❌ Error al cargar tu colección: ${error.message}`, m);
}
};

handler.command = ['cs', 'coleccion', 'collection'];
handler.group = true;

export default handler;

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)




