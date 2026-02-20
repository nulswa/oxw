import { gotScraping } from 'got-scraping';

const BASE_URL = 'https://cue.cuevana3.nu';
const HEADERS = {
'referer': `${BASE_URL}/`,
'x-requested-with': 'XMLHttpRequest',
'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
};

async function cuevanaSearch(query) {
const urls = [
`${BASE_URL}/wp-json/cuevana/v1/search?q=${encodeURIComponent(query)}`,
`${BASE_URL}/wp-json/cuevana/v1/search-title?q=${encodeURIComponent(query)}`
];

for (const url of urls) {
try {
const response = await gotScraping({ url, headers: HEADERS });
const data = JSON.parse(response.body);

let items = null;
if (Array.isArray(data) && data.length > 0) items = data;
else if (data?.items?.length) items = data.items;
else if (data?.data?.length) items = data.data;

if (items) return items;
} catch (e) { }
}
return [];
}

let handler = async (m, { conn, args, usedPrefix, command }) => {
if (!global.db.data.chats[m.chat].fSearch && m.isGroup) {
return conn.sendMessage(m.chat, { text: `*[ ⽷ ]*  Los comandos de *búsquedas* estan desactivados...` }, { quoted: m })
}

const text = args.length >= 1 ? args.join(" ") : null;
if (!text) return conn.sendMessage(m.chat, { text: `${mess.example}\n*${usedPrefix + command}* Gato con botas` }, { quoted: m });
try {
const results = await cuevanaSearch(text);

if (!results || results.length === 0) {
return conn.sendMessage(m.chat, { text: `${mess.nosear}` }, { quoted: m });
}

await m.react("⏰");

let msg = `· ┄ · ⊸ 𔓕 *Cuevana  :  Search*

\t＃ *Busqueda* : ${text}
\t＃ *Resultados* : ${results.length} results.
\t＃ *Fuente* : Cuevana

📍 Puedes verlo directamente presionando el enlace.\n\n\n`;

results.slice(0, 10).forEach((item, i) => {
const title = item.title || item.name || 'Sin titulo - toru-bot_whatsappp';
let url = item.url || item.permalink || item.link || '';
if (url.startsWith('/')) url = BASE_URL + url;
const year = item.release || item.year || item.release_year || '...';
const type = item.type || 'Película';

msg += `> *${i + 1}.* ${title}\n`;
msg += `⩩ *Publicado* : ${year}\n`;
msg += `⩩ *Tipo* : ${type}\n`;
msg += `⩩ *Enlace* : ${url}\n\n\n`;
});

msg += `\n> ${textbot}`;

//if (results.length > 10) msg += `_...y ${results.length - 10} resultados más_`;
const cuevaToru = Buffer.from(await (await fetch(`https://raw.githubusercontent.com/nulswa/files/main/icons/icon-pelicula.jpg`)).arrayBuffer());
await conn.sendMessage(m.chat, { text: msg.trim(), mentions: [m.sender], contextInfo: { externalAdReply: { title: "⧿ Cuevana : Search ⧿", body: botname, thumbnail: cuevaToru, sourceUrl: null, mediaType: 1, renderLargerThumbnail: false }}}, { quoted: m });
//await conn.sendMessage(m.chat, { text: msg.trim() }, { quoted: m });

} catch (e) {
console.error(e);
await conn.sendMessage(m.chat, { text: `${e.message}` }, { quoted: m });
}
}

handler.command = ['cuevana'];
handler.tags = ["busquedas"];
export default handler;
