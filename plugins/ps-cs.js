///También tuyo

import { promises as fs } from 'fs';

const ccFilePath = './scrapers/ows/cc.json'; //Cambia la dirección segun donde pongas tu json. :v

async function loadColecs() {
try {
const data = await fs.readFile(ccFilePath, 'utf-8');
return JSON.parse(data);
} catch (error) {
return [];
}
}

let handler = async (m, { conn, usedPrefix }) => {
if (!global.db.data.chats[m.chat].fCards && m.isGroup) {
return conn.sendMessage(m.chat, { text: `*[ ⽷ ]*  Los comandos de *cartas* estan desactivados...` }, { quoted: m })
}

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
let mensaje = `\t〤 \`Coleccion : Personajes\`\n`;
mensaje += `- 👤 Tus personajes: *${userColeccion.personajes.length}* en total.\n${readMore}\n`;

// Agrupar personajes por rareza :v
const rarityOrder = { 'Golden': 1, 'Rare': 2, 'Common': 3 };
const personajesOrdenados = userColeccion.personajes.sort((a, b) => {
return (rarityOrder[a.rarity] || 999) - (rarityOrder[b.rarity] || 999);
});

personajesOrdenados.forEach((personaje, index) => {
// Emoji según rareza jsjs (eliminalo si quieres) :v
/*let rarityEmoji = '';
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
}*/

mensaje += `${index + 1}. ${personaje.name} *(${personaje.rarity})*\n`;
});

// Calcular estadísticas totales :3
/*const totalPoder = personajesOrdenados.reduce((sum, p) => sum + parseInt(p.poder || 0), 0);
const totalFuerza = personajesOrdenados.reduce((sum, p) => sum + parseInt(p.fuerza || 0), 0);
const totalMagia = personajesOrdenados.reduce((sum, p) => sum + parseInt(p.magia || 0), 0);
const valorTotal = personajesOrdenados.reduce((sum, p) => sum + parseInt(p.value || 0), 0);

mensaje += `⚡ *Poder Total* : ${totalPoder}\n`;
mensaje += `💪 *Fuerza Total* : ${totalFuerza}\n`;
mensaje += `✨ *Magia Total* : ${totalMagia}\n`;
mensaje += `💰 *Valor Total* : ${valorTotal} Boletos 🧧\n\n`;

// Contador por rareza (agrega mas rarezas si añades mas personajes.) ._.
const goldenCount = personajesOrdenados.filter(p => p.rarity === 'Golden').length;
const rareCount = personajesOrdenados.filter(p => p.rarity === 'Rare').length;
const commonCount = personajesOrdenados.filter(p => p.rarity === 'Common').length;

if (goldenCount > 0 || rareCount > 0 || commonCount > 0) {
mensaje += `\t〤 \`Por Rangos\`\n`;
if (goldenCount > 0) mensaje += `👑 Golden: ${goldenCount}\n`;
if (rareCount > 0) mensaje += `💎 Rare: ${rareCount}\n`;
if (commonCount > 0) mensaje += `⭐ Common: ${commonCount}\n`;
}*/

mensaje += `\n> ${textbot}`;

await conn.sendMessage(m.chat, { text: mensaje, contextInfo: { forwardingScore: 1, isForwarded: false, externalAdReply: { showAdAttribution: false, renderLargerThumbnail: true, title: "Coleccion : Personajes", body: textbot, containsAutoReply: true, mediaType: 1, thumbnailUrl: global.toruMenu, sourceUrl: null }}}, { quoted: m });
//conn.reply(m.chat, mensaje, m); me gusta com imagen :b

} catch (error) {
console.error(error);
await conn.sendMessage(m.chat, { text: `${error.message}` }, { quoted: m });
}
};

handler.command = ['cs', 'coleccion', 'collection'];
handler.tags = ["coleccion"];
handler.group = true;

export default handler;

const more = String.fromCharCode(8206) //Readme, por si es molesto con todo el texto tapando el chat.
const readMore = more.repeat(4001)

/* 
Asegurate de que el codigo en cc.json quede asi cuando el usuario compra el personaje.

[
{
"userId": "123456789@s.whatsapp.net",
"personajes": [
{
"id": "RW5kZWF2b3I=",
"name": "Endeavor",
"gender": "Hombre",
...etc
}
]
}
]

em fin, código tuyo :b

*/