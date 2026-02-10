
import { gotScraping } from 'got-scraping';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import * as cheerio from 'cheerio';

const BASE_URL = 'https://www.dramaboxdb.com';
const DOWNLOAD_DIR = './tmp';

const CONFIG = {
downloadMode: 'mp4',
freeOnly: true,
maxEpisodes: 5,
delayBetween: 2000,
maxRetries: 3,
};

function slugify(text) {
if (!text) return '';
return text.toString().toLowerCase()
.replace(/\s+/g, '-')
.replace(/[^\w\-]+/g, '')
.replace(/\-\-+/g, '-')
.replace(/^-+/, '')
.replace(/-+$/, '');
}

function formatBytes(bytes) {
if (bytes === 0) return '0 B';
const k = 1024;
const sizes = ['B', 'KB', 'MB', 'GB'];
const i = Math.floor(Math.log(bytes) / Math.log(k));
return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDuration(ms) {
const totalSec = Math.floor(ms / 1000);
const min = Math.floor(totalSec / 60);
const sec = totalSec % 60;
return `${min}:${sec.toString().padStart(2, '0')}`;
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const GOT_OPTIONS = {
headerGeneratorOptions: {
browsers: [{ name: 'chrome', minVersion: 120 }],
devices: ['desktop'],
operatingSystems: ['windows']
}
};

// ─── SCRAPER ─────────────────────────────────────────────────────────────

const BROWSER_HEADERS = {
'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
'Accept-Language': 'en-US,en;q=0.9',
'Accept-Encoding': 'gzip, deflate, br',
'Cache-Control': 'no-cache',
'Pragma': 'no-cache',
'Sec-Ch-Ua': '"Chromium";v="125", "Not.A/Brand";v="24", "Google Chrome";v="125"',
'Sec-Ch-Ua-Mobile': '?0',
'Sec-Ch-Ua-Platform': '"Windows"',
'Sec-Fetch-Dest': 'document',
'Sec-Fetch-Mode': 'navigate',
'Sec-Fetch-Site': 'none',
'Sec-Fetch-User': '?1',
'Upgrade-Insecure-Requests': '1',
};

async function fetchPage(url) {
const proxies = [
(u) => `https://corsproxy.io/?${encodeURIComponent(u)}`,
(u) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
(u) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(u)}`,
];

try {
const resp = await gotScraping({ url, ...GOT_OPTIONS, timeout: { request: 15000 } });
if (resp.body && resp.body.includes('__NEXT_DATA__')) return resp.body;
} catch (e) { /* fallback */ }

try {
const resp = await axios.get(url, {
headers: { ...BROWSER_HEADERS, 'Referer': BASE_URL + '/' },
timeout: 15000,
});
if (resp.data && typeof resp.data === 'string' && resp.data.includes('__NEXT_DATA__')) return resp.data;
} catch (e) { /* fallback */ }

for (let i = 0; i < proxies.length; i++) {
const proxyUrl = proxies[i](url);
try {
const resp = await axios.get(proxyUrl, {
timeout: 20000,
headers: { 'User-Agent': BROWSER_HEADERS['User-Agent'] },
});
const data = typeof resp.data === 'string' ? resp.data : JSON.stringify(resp.data);
if (data.includes('__NEXT_DATA__')) return data;
} catch (e) { /* next proxy */ }
}

throw new Error('[ ERROR ] la pagina bloquea la IP o es un error de la api.');
}

async function getDramaInfo(dramaUrl) {
let urlPath = dramaUrl.replace(BASE_URL, '');
if (urlPath.startsWith('http')) urlPath = new URL(dramaUrl).pathname;

if (urlPath.includes('/ep/')) {
const parts = urlPath.split('/ep/');
if (parts[1]) {
const moviePart = parts[1].split('/')[0];
const moviePath = moviePart.replace('_', '/');
return getDramaInfo(`${BASE_URL}/movie/${moviePath}`);
}
}

if (urlPath.match(/\/movie\/\d+_/)) {
urlPath = urlPath.replace(/\/movie\/(\d+)_/, '/movie/$1/');
}

const targetUrl = `${BASE_URL}${urlPath}`;
const html = await fetchPage(targetUrl);

const $ = cheerio.load(html);
const nextDataStr = $('#__NEXT_DATA__').html();

if (!nextDataStr) {
const title = $('title').text();
const bodyLen = html.length;
throw new Error(`[ Undefined ] "${title}" = ${bodyLen} bytes`);
}

const json = JSON.parse(nextDataStr);
const pageProps = json.props?.pageProps || {};

if (pageProps.__N_REDIRECT) {
return getDramaInfo(`${BASE_URL}${pageProps.__N_REDIRECT}`);
}

const bookInfo = pageProps.bookInfo || {};
const chapterList = pageProps.chapterList || [];

if (!bookInfo.bookName && chapterList.length === 0) {
throw new Error(`${mess.nosear}`);
}

return {
title: bookInfo.bookName || 'Undefined',
id: bookInfo.bookId,
chapters: chapterList.map((ch, i) => ({
id: ch.id,
name: ch.name,
index: ch.index ?? i,
indexStr: ch.indexStr || String(i + 1).padStart(3, '0'),
unlock: ch.unlock,
mp4: ch.mp4 || null,
m3u8: ch.m3u8Url || null,
cover: ch.cover || null,
duration: ch.duration || 0,
price: ch.chapterPrice || 0,
}))
};
}

async function downloadMP4(url, outputPath, retries = CONFIG.maxRetries) {
for (let attempt = 1; attempt <= retries; attempt++) {
try {
const response = await gotScraping({
url,
responseType: 'buffer',
headers: {
'Referer': 'https://www.dramaboxdb.com/',
'Accept': '*/*',
},
...GOT_OPTIONS,
timeout: { request: 300000 },
});

if (response.statusCode === 200 && response.body.length > 0) {
fs.writeFileSync(outputPath, response.body);
return { success: true, size: response.body.length };
}
} catch (error) {
if (attempt < retries) await sleep(3000 * attempt);
}
}
return { success: false, size: 0 };
}

async function downloadM3U8(url, outputPath) {
try {
const cmd = `ffmpeg -y -i "${url}" -c copy -bsf:a aac_adtstoasc "${outputPath}" -loglevel error`;
execSync(cmd, { timeout: 600000 });

if (fs.existsSync(outputPath)) {
const stats = fs.statSync(outputPath);
return { success: true, size: stats.size };
}
} catch (error) {
console.log(`ffmpeg error: ${error.message}`);
}
return { success: false, size: 0 };
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
if (!text) return conn.reply(m.chat, `${mess.example}\n*${usedPrefix + command}* https://www.dramaboxdb.com/movie/xxxx`, m);

await m.react('⏰');

try {
const drama = await getDramaInfo(text);

const freeChapters = drama.chapters.filter(c => c.unlock);
const limit = 5;
const chaptersToDownload = freeChapters.slice(0, limit);

if (chaptersToDownload.length === 0) {
return conn.sendMessage(m.chat, { text: `${mess.nosear}` }, { quoted: m });
}

let infoTxt = `· ┄ · ⊸ 𔓕 *DramaBox  :  Download*
- ${drama.id}

\t＃ *Titulo* : ${drama.title}
\t＃ *Episodios* : ${drama.chapters.length} *(${freeChapters.length} free)*
\t＃ *Fuente* : DramaBox
\t＃ *Proceso* : onix-api/dramabox

📍 Se estan descargando los episodios gratuitos...`;

await conn.sendMessage(m.chat, { text: infoTxt }, { quoted: m });
//m.reply(infoTxt);

const dramaDir = path.join(DOWNLOAD_DIR, `dramabox_${drama.id}_${Date.now()}`);
if (!fs.existsSync(dramaDir)) fs.mkdirSync(dramaDir, { recursive: true });

for (const ch of chaptersToDownload) {
const epNum = ch.indexStr || String(ch.index + 1).padStart(3, '0');
const fileName = `${epNum}_${slugify(ch.name) || 'toru-episode_dramabox'}.mp4`;
const outputPath = path.join(dramaDir, fileName);

const videoUrl = CONFIG.downloadMode === 'm3u8' ? ch.m3u8 : ch.mp4;

if (!videoUrl) continue;

let result;
if (CONFIG.downloadMode === 'm3u8') {
result = await downloadM3U8(videoUrl, outputPath);
} else {
result = await downloadMP4(videoUrl, outputPath);
}

if (result.success) {
await conn.sendMessage(m.chat, { 
video: { url: outputPath }, 
caption: `*${drama.title}* - Ep ${epNum}\n${ch.name}` 
}, { quoted: m });

try { fs.unlinkSync(outputPath); } catch (e) {}
}

await sleep(CONFIG.delayBetween);
}

try { fs.rmSync(dramaDir, { recursive: true, force: true }); } catch (e) {}
//await m.react('✅');

} catch (e) {
console.error(e);
await conn.sendMessage(m.chat, { text: e.message }, { quoted: m });
//m.reply(`❌ Ocurrió un error: ${e.message}`);
//await m.react('❌');
}
}

handler.command = ["dramabox"];

export default handler;
