import { gotScraping } from 'got-scraping';
import { CookieJar } from 'tough-cookie';
import crypto from 'crypto';

const CONFIG = {
SITE_URL: 'https://fastdl.app',
API_URL: 'https://api-wh.fastdl.app/api/convert',
MSEC_URL: 'https://fastdl.app/msec',
HMAC_KEY: '34ac9a1aa6aaa7d69a7075611898f16a85d496b1d8f1c7aaa5640a2d93d7af80',
BUILD_TOKEN: 1770240123231,
UA: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
};

function signRequest(url, ts) {
return crypto.createHmac('sha256', Buffer.from(CONFIG.HMAC_KEY, 'hex'))
 .update(url + ts)
 .digest('hex');
}

function formatNumber(num) {
if (!num && num !== 0) return '0';
if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
return String(num);
}

async function fetchMedia(targetUrl) {
const cookieJar = new CookieJar();

await gotScraping({ url: CONFIG.SITE_URL, cookieJar, headers: { 'User-Agent': CONFIG.UA } });

let ts = Date.now();
try {
const msec = await gotScraping({ url: CONFIG.MSEC_URL, cookieJar, responseType: 'json',
headers: { 'Referer': CONFIG.SITE_URL } });
const serverMs = Math.floor(msec.body.msec * 1000);
if (Math.abs(ts - serverMs) >= 60000) ts -= (ts - serverMs);
} catch(e) {}

// Firmar y enviar
const sig = signRequest(targetUrl, ts);
const res = await gotScraping.post({
url: CONFIG.API_URL,
cookieJar,
form: { sf_url: targetUrl, ts: String(ts), _ts: String(CONFIG.BUILD_TOKEN), _tsc: '0', _sv: '2', _s: sig },
headers: {
'Origin': CONFIG.SITE_URL, 'Referer': CONFIG.SITE_URL + '/',
'Accept': 'application/json, text/plain, */*',
'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
'User-Agent': CONFIG.UA,
},
responseType: 'json',
});
return res.body;
}

let handler = async (m, { conn, args, usedPrefix, command }) => {
if (!global.db.data.chats[m.chat].fDescargas && m.isGroup) {
return conn.sendMessage(m.chat, { text: `*[ ⽷ ]*  Los comandos de *descargas* estan desactivados...` }, { quoted: m })
}

const botJid = conn.user.jid
let settings = global.db.data.settings[botJid]

const botName = settings?.nameBot || global.botname
const botDesc = settings?.descBot || global.textbot
const botImg = settings?.imgBot || global.toruImg
const botMenu = settings?.menuBot || global.toruMenu

const text = args.length >= 1 ? args.join(" ") : null;
if (!text) return conn.sendMessage(m.chat, { text: `${mess.example}\n*${usedPrefix + command}* https://instagram.com/xxx` }, { quoted: m });

try {
await m.react('⏰');
const data = await fetchMedia(text);

if (!data || !data.url || data.url.length === 0) {
return conn.sendMessage(m.chat, { text: `${mess.nosear}` }, { quoted: m });
}

const videoList = data.url.filter(v => v.url);
if (videoList.length === 0) return conn.sendMessage(m.chat, { text: `${mess.fallo}\n- Error de descarga...` }, { quoted: m });
const bestVideo = videoList[0]; 

const meta = data.meta || {};
const title = meta.title || meta.source || '';

let caption = '';
if (title) caption += `📝 ${title}`;
if (meta.like_count || data.like_count) caption += `\n❤️ *Likes:* ${formatNumber(meta.like_count || data.like_count)}`;
if (meta.comment_count || data.comment_count) caption += `\n💬 *Comentarios:* ${formatNumber(meta.comment_count || data.comment_count)}`;
caption = caption.trim();

await conn.sendMessage(m.chat, { video: { url: bestVideo.url }, caption: `${botName}\n> ${botDesc}` }, { quoted: m });
//await m.react('✅');

} catch (e) {
console.error(e);
conn.sendMessage(m.chat, { text: e.message }, { quoted: m });
}
}

handler.tags = ['descargas']
handler.command = ['ig', 'instagram']

export default handler;

