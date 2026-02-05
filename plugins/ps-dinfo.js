import { promises as fs } from 'fs';

const personajePath = './scrapers/ows/personajes.json';
const ccFilePath = './scrapers/ows/cc.json';

async function loadPersonaje() {
try {
const data = await fs.readFile(personajePath, 'utf-8');
return JSON.parse(data);
} catch (error) {
throw new Error('No se pudo cargar el archivo personajes.json.');
}
}

async function loadColecs() {
try {
const data = await fs.readFile(ccFilePath, 'utf-8');
return JSON.parse(data);
} catch (error) {
return [];
}
}

let handler = async (m, { conn, usedPrefix, command, text }) => {
const userId = m.sender;

// Verificar que se haya proporcionado un nombre o ID
if (!text) {
return await conn.reply(m.chat, `${mess.example}\n*${usedPrefix + command}* Endeavor\n*${usedPrefix + command}* RW5kZWF2b3I=`, m);
}

try {
// Cargar personajes y colecciones :v
const personajes = await loadPersonaje();
const colecciones = await loadColecs();

// Buscar el personaje por nombre o ID (case insensitive), es decir, da igual si esta en mayúscula o minúscula :v 
const busqueda = text.trim().toLowerCase();
const personaje = personajes.find(p => 
p.name.toLowerCase() === busqueda || 
p.id.toLowerCase() === busqueda
);

if (!personaje) {
return await conn.reply(m.chat, `📍  No se encontró ningún personaje con el nombre o ID *[ ${text} ]*.\n- Usa *${usedPrefix}cbuy* para ver la lista de personajes disponibles`, m);
}

// Verificar si el usuario tiene este personaje
const userColeccion = colecciones.find(c => c.userId === userId);
let loTiene = false;

if (userColeccion && userColeccion.personajes) {
loTiene = userColeccion.personajes.some(p => p.id === personaje.id);
}

// Construir mensaje con los detalles del personaje
let mensaje = `✨ *INFORMACIÓN DEL PERSONAJE* ✨\n\n`;
mensaje += `📛 *Nombre:* ${personaje.name}\n`;
mensaje += `🆔 *ID:* ${personaje.id}\n`;
mensaje += `👤 *Género:* ${personaje.gender}\n`;
mensaje += `📺 *Anime:* ${personaje.anime}\n`;
mensaje += `💎 *Rareza:* ${personaje.rarity}\n`;
mensaje += `📊 *Estado:* ${personaje.status}\n\n`;

mensaje += `⚔️ *ESTADÍSTICAS:*\n`;
mensaje += `⚡ Poder: ${personaje.poder}\n`;
mensaje += `💪 Fuerza: ${personaje.fuerza}\n`;
mensaje += `✨ Magia: ${personaje.magia}\n`;
mensaje += `🎯 Base: ${personaje.base}\n\n`;

mensaje += `🎯 *HABILIDADES:*\n`;
mensaje += `${personaje.habili}\n\n`;

mensaje += `💰 *Valor:* ${personaje.value} ToruCoins\n`;
mensaje += `⭐ *Votos:* ${personaje.vote}\n\n`;

// Indicar si el usuario tiene o no el personaje
if (loTiene) {
mensaje += `✅ *¡Ya tienes este personaje en tu colección!*`;
} else {
mensaje += `❌ *No tienes este personaje*\n`;
if (personaje.status === 'Disponible') {
mensaje += `📍 _Puedes comprarlo con *${usedPrefix}cbuy ${personaje.name}*_`;
} else {
mensaje += `📍 _Este personaje no está disponible actualmente_`;
}
}

// Enviar imagen con los detalles
const imagenUrl = personaje.dfoto || personaje.pfoto;

if (imagenUrl) {
await //conn.sendMessage(m.chat, { text: mensaje, contextInfo: { forwardingScore: 1, isForwarded: false, externalAdReply: { showAdAttribution: false, renderLargerThumbnail: true, title: `${personaje.name} : ${personaje.status}`, body: textbot, containsAutoReply: true, mediaType: 1, thumbnailUrl: personaje.dfoto, sourceUrl: null }}}, { quoted: m })
  conn.sendFile(m.chat, personaje.pfoto, 'toru.jpg', mensaje, m);
} else {
await conn.reply(m.chat, mensaje, m);
}

} catch (error) {
console.error(error);
await conn.reply(m.chat, `${error.message}`, m);
}
};

handler.command = ['dinfo', 'charinfo', 'personajeinfo'];
handler.group = true;

export default handler;
