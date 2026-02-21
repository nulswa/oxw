import fetch from "node-fetch";
import axios from "axios";

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
if (!global.db.data.chats[m.chat].fDescargas && m.isGroup) {
return conn.sendMessage(m.chat, { text: `*[ ⽷ ]*  Los comandos de *descargas* estan desactivados...` }, { quoted: m })
}

const botJid = conn.user.jid
let settings = global.db.data.settings[botJid]

const botName = settings?.nameBot || global.botname
const botDesc = settings?.descBot || global.textbot
const botImg = settings?.imgBot || global.toruImg
const botMenu = settings?.menuBot || global.toruMenu

try {
if (!text) return conn.sendMessage(m.chat, { text: mess.example + `\n*${usedPrefix + command}* https://youtube.com/xxxx` }, { quoted: m });
if (!/^(?:https?:\/\/)?(?:www\.|m\.|music\.)?youtu\.?be/.test(args[0])) {
return conn.sendMessage(m.chat, { text: mess.unlink }, { quoted: m });
}

await m.react("⏰");

let apiURL = `https://sylphy.xyz/download/v2/ytmp3?url=${encodeURIComponent(args[0])}&api_key=sylphy-c0ZDE6V`;
let data = await tryAPI(apiURL);

if (!data?.status || !data?.result?.dl_url) {
return conn.sendMessage(m.chat, { text: mess.noapi }, { quoted: m });
}

const { title, dl_url } = data.result;

const size = await getSize(dl_url);
const sizeStr = size ? await formatSize(size) : 'Desconocido';

const cleanTitle = title.replace(/[^\w\s]/gi, '').trim().replace(/\s+/g, '_');
const fileName = `${cleanTitle}`;

const caption = `${botName}\n> ${botDesc}`;
let toruWa = `· ┄ · ⊸ 𔓕 *YouTube  :  Download*

${title}

\t＃ *Fuente* : YouTube
\t＃ *Tipo* : Audio *(mp3)*

> ${botName}`;

const thumbMp = Buffer.from(await (await fetch(`https://raw.githubusercontent.com/nulswa/files/main/icons/icon-youtube.jpg`)).arrayBuffer())
await conn.sendMessage(m.chat, { text: toruWa, mentions: [m.sender], contextInfo: { externalAdReply: { title: "⧿ YouTube : MP3 ⧿", body: botName, thumbnail: thumbMp, sourceUrl: null, mediaType: 1, renderLargerThumbnail: false }}}, { quoted: m })

let head = await fetch(dl_url, { method: "HEAD" });
let fileSize = head.headers.get("content-length") || 0;
let fileSizeMB = (fileSize / (1024 * 1024)).toFixed(2);

if (fileSizeMB >= 10) {
await conn.sendMessage(m.chat, { document: { url: dl_url }, mimetype: 'audio/mpeg', fileName, caption: `${caption}\n📍 Enviado como documento por *10MB*...`}, { quoted: m });
} else {
await conn.sendMessage(m.chat, { audio: { url: dl_url }, mimetype: "audio/mpeg", fileName: title }, { quoted: m })
 }
} catch (e) {
console.error(e);
conn.sendMessage(m.chat, { text: e.message }, { quoted: m });
}
};

handler.command = ['ytmp3', 'mp3', 'audio'];
handler.tags = ["descargas"];
export default handler;


async function tryAPI(url) {
try {
const res = await fetch(url);
const data = await res.json();
if (data?.status) return data;
} catch {}

try {
const res = await fetch(url);
return await res.json();
} catch {
return null;
}
}

async function formatSize(bytes) {
const units = ['B', 'KB', 'MB', 'GB'];
let i = 0;
if (!bytes || isNaN(bytes)) return 'Desconocido';
while (bytes >= 1024 && i < units.length - 1) {
bytes /= 1024;
i++;
}
return `${bytes.toFixed(2)} ${units[i]}`;
}

async function getSize(url) {
try {
const res = await axios.head(url);
const length = res.headers['content-length'];
return length ? parseInt(length, 10) : null;
} catch {
return null;
}
}

  
