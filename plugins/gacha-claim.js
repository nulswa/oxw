import { promises as fs } from 'fs';

const charactersFilePath = './scrapers/personajes.json';
const claimMsgFile = './scrapers/reclamados.json';
export const cooldowns = {};

async function loadCharacters() {
const data = await fs.readFile(charactersFilePath, 'utf-8');
return JSON.parse(data);
}

async function saveCharacters(characters) {
await fs.writeFile(charactersFilePath, JSON.stringify(characters, null, 2), 'utf-8');
}

async function loadClaimMessages() {
try {
const data = await fs.readFile(claimMsgFile, 'utf-8');
return JSON.parse(data);
} catch {
return {};
}
}

async function getCustomClaimMessage(userId, username, characterName) {
const messages = await loadClaimMessages();
const template = messages[userId] || '✅  *$user* ha reclamado a *$character* con exito.';
return template.replace(/\$user/g, username).replace(/\$character/g, characterName);
}

let handler = async (m, { conn }) => {
const userId = m.sender;
const now = Date.now();

if (cooldowns[userId] && now < cooldowns[userId]) {
const remaining = cooldowns[userId] - now;
const minutes = Math.floor(remaining / 60000);
const seconds = Math.floor((remaining % 60000) / 1000);
return conn.sendMessage(m.chat, { text: `📍 Debes esperar *${minutes} minutos* y *${seconds} segundos* para volver a usar el comando.` }, { quoted: m });
}

if (!m.quoted || !m.quoted.text) {
return conn.sendMessage(m.chat, { text: `ᗢ Responda a un personaje usando valido.\n- Usa *${usedPrefix}rw* por si no haz comenzado.` }, { quoted: m });
}

try {
const characters = await loadCharacters();
const match = m.quoted.text.match(/🆔.*?\*(\d+)\*/);
if (!match) return conn.sendMessage(m.chat, { text: `📍  No se ha podido detectar el ID del personaje.` }, { quoted: m });

const id = match[1].trim();
const character = characters.find(c => c.id === id);

if (!character) return conn.sendMessage(m.chat, { text: `📍  Personaje no encontrado...` }, { quoted: m });

const rollData = global.activeRolls ? global.activeRolls[id] : null;

let timeElapsedStr = "";

if (rollData) {
const timeElapsed = now - rollData.time;
const protectionTime = 30000;
const expirationTime = 60000;

if (timeElapsed > expirationTime) {
delete global.activeRolls[id];
return conn.sendMessage(m.chat, { text: `⏰  Este personaje ya expiro, reclamalo en la próxima...` }, { quoted: m });
}

if (timeElapsed < protectionTime && rollData.user !== userId) {
const protectedBy = await conn.getName(rollData.user);
const remainingProtection = Math.ceil((protectionTime - timeElapsed) / 1000);
return conn.sendMessage(m.chat, { text: `⏰  El personaje *( ${character.name} )* tiene una protección de *${remainingProtection}* segundos por @${protectedBy}.` }, { quoted: m });
}

timeElapsedStr = ` (${(timeElapsed / 1000).toFixed(1)}s)`;
} else {
if (!character.user) {
return conn.sendMessage(m.chat, { text: `⏰  Este personaje ya expiro, reclamalo en la próxima...` }, { quoted: m });
}
}

const owner = '5493873655135@s.whatsapp.net';
if (character.id === "35" && userId !== owner) {
return conn.sendMessage(m.chat, { text: `📍  Personaje exclusivo por un usuario premium...` }, { quoted: m });
}

if (character.user && character.user !== userId) {
return conn.sendMessage(m.chat, { text: `📍  El personaje ya fue reclamado por @${character.user.split`@`[0]}`, mentions: [character.user] }, { quoted: m });
}

character.user = userId;
character.status = 'Reclamado';
await saveCharacters(characters);

if (global.activeRolls && global.activeRolls[id]) {
delete global.activeRolls[id];
}

const username = await conn.getName(userId);
const baseMessage = await getCustomClaimMessage(userId, username, character.name);
const mensajeFinal = `${baseMessage}${timeElapsedStr}`; 

await conn.reply(m.chat, mensajeFinal, m);

cooldowns[userId] = now + 30 * 60 * 1000;

} catch (e) {
conn.sendMessage(m.chat, { text: e.message }, { quoted: m });
}
};

handler.help = ['claim'];
handler.tags = ['waifus'];
handler.command = ['claim', 'reclamar', 'c'];
handler.group = true;
export default handler;