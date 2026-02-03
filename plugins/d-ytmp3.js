import fetch from "node-fetch";
import axios from "axios";

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
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
const fileName = `${cleanTitle}.mp3`;

const caption = `${title}\n\n${botname}\n> ${textbot}`;
let toruWa = `· ┄ · ⊸ 𔓕 *YouTube  :  Download*

${title}

\t＃ *Fuente* : YouTube
\t＃ *Tipo* : Audio *(mp3)*

> ${textbot}`;

const toruYt = await fetch("https://files.catbox.moe/d9picr.jpg");
  const thumb3 = Buffer.from(await toruYt.arrayBuffer());
  const toruEstilo = { key: { fromMe: false, participant: "0@s.whatsapp.net" }, message: { documentMessage: { title: textbot, fileName: "⧿ YouTube : Download ⧿", jpegThumbnail: thumb3 }}};
await conn.sendMessage(m.chat, { text: toruWa }, { quoted: toruEstilo });
  
let head = await fetch(dl_url, { method: "HEAD" });
let fileSize = head.headers.get("content-length") || 0;
let fileSizeMB = (fileSize / (1024 * 1024)).toFixed(2);

if (fileSizeMB >= 10) {
await conn.sendMessage(m.chat, { document: { url: dl_url }, mimetype: 'audio/mpeg', fileName, caption: `${caption}\n📍 Enviado como documento por *10MB*...`}, { quoted: m });
} else {
await conn.sendMessage(m.chat, { audio: { url: dl_url }, mimetype: "audio/mpeg", fileName: title }, { quoted: m })
//await conn.sendMessage(m.chat, { video: { url: dl_url }, mimetype: 'video/mp4', caption }, { quoted: m });
}

//await conn.sendMessage(m.chat, { react: { text: '✔️', key: m.key } });

} catch (e) {
console.error(e);
conn.sendMessage(m.chat, { text: e.message }, { quoted: m });
}
};

handler.command = ['ytmp3', 'mp3'];

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

  
