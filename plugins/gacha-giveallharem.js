import { promises as fs } from 'fs';

const charactersFilePath = './scrapers/personajes.json';
const confirmaciones = new Map();

async function loadCharacters() {
const data = await fs.readFile(charactersFilePath, 'utf-8');
return JSON.parse(data);
}

async function saveCharacters(characters) {
await fs.writeFile(charactersFilePath, JSON.stringify(characters, null, 2), 'utf-8');
}

let handler = async (m, { conn, participants }) => {
let senderJid = m.sender;
if (m.sender.endsWith('@lid') && m.isGroup) {
const pInfo = participants.find(p => p.lid === m.sender);
if (pInfo && pInfo.id) senderJid = pInfo.id;
}

let mentionedJid = m.mentionedJid?.[0];
if (mentionedJid && mentionedJid.endsWith('@lid') && m.isGroup) {
const pInfo = participants.find(p => p.lid === mentionedJid);
if (pInfo && pInfo.id) mentionedJid = pInfo.id;
}

if (!mentionedJid) return conn.sendMessage(m.chat, { text: `ᗢ Mencione a un usuario para darle tus personajes.\n\n${mess.example}\n*${usedPrefix + command}* @${m.sender.split`@`[0]}`, mentions: [m.sender] }, { quoted: m });
if (mentionedJid === senderJid) return conn.sendMessage(m.chat, { text: `📍  No puedes retalarte tus propios personajes...` }, { quoted: m })

const characters = await loadCharacters();
const myWaifus = characters.filter(c => c.user === senderJid);

if (myWaifus.length === 0) return conn.sendMessage(m.chat, { text: `📍  No tienes personajes para regalar...` }, { quoted: m })

const valorTotal = myWaifus.reduce((acc, w) => acc + (parseInt(w.value) || 0), 0);

confirmaciones.set(senderJid, {
waifus: myWaifus.map(c => c.id),
receptor: mentionedJid,
valorTotal
});

const textoConfirmacion = `⏰ ¿Quieres dar todos tus personajes?

▢ *Usuario* > @${mentionedJid.split('@')[0]}
▢ *Personajes* > ${myWaifus.length}
▢ *Valor* > ${valorTotal.toLocaleString()}

> 📍  Para confirmar escriba *"Aceptar"*, recuerde que la accion no se puede deshacer.`;

await conn.sendMessage(m.chat, {
text: textoConfirmacion,
mentions: [senderJid, mentionedJid]
}, { quoted: m });
};

handler.before = async function (m, { conn, participants }) {
let senderJid = m.sender;
if (m.sender.endsWith('@lid') && m.isGroup) {
const pInfo = participants.find(p => p.lid === m.sender);
if (pInfo && pInfo.id) senderJid = pInfo.id;
}

const data = confirmaciones.get(senderJid);
if (!data) return;

if (m.text?.trim().toLowerCase() === 'aceptar') {
confirmaciones.delete(senderJid);

const characters = await loadCharacters();
let regalados = 0;

for (const char of characters) {
if (data.waifus.includes(char.id) && char.user === senderJid) {
char.user = data.receptor;
char.status = "Reclamado";
regalados++;
}
}

await saveCharacters(characters);

return conn.sendMessage(m.chat, {
text: `✅  Haz dato todos tus personajes a @${data.receptor.split('@')[0]} correctamente..`,
mentions: [data.receptor]
}, { quoted: m });
}
};

handler.command = ['givec'];
handler.group = true;

export default handler;
