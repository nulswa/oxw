
import axios from 'axios';
import cheerio from 'cheerio';
import { lookup } from 'mime-types';
import fetch from 'node-fetch';

let handler = async (m, { conn, args, usedPrefix, command }) => {
if (!global.db.data.chats[m.chat].fDescargas && m.isGroup) {
return conn.sendMessage(m.chat, { text: `📍  Los comandos de *[ descargas ]* estan desactivados...` }, { quoted: m })
}
  
  if (!args[0]) return conn.sendMessage(m.chat, { text: `${mess.example}\n*${usedPrefix + command}* https://www.mediafire.com/file/ejemplo/file.zip` }, { quoted: m });
try {
await m.react("⏰");
const res = await mediafireDl(args[0]);
const {name, size, date, mime, link} = res;
const caption = `· ┄ · ⊸ 𔓕 *Mediafire : Download *

\t＃ *Nombre* : ${name}
\t＃ *Peso* : ${formatBytes(size)}
\t＃ *Publicado* : ${date}
\t＃ *Fuente* : Mediafire

> ${textbot}`.trim();
const thumb = Buffer.from(await (await fetch(`https://files.catbox.moe/293guw.jpg`)).arrayBuffer())
await conn.sendMessage(m.chat, { text: caption, mentions: [m.sender], contextInfo: { externalAdReply: { title: `⧿ Mediafire : Download ⧿`, body: botname, thumbnail: thumb, sourceUrl: null, mediaType: 1, renderLargerThumbnail: false }}}, { quoted: m })
await conn.sendFile(m.chat, link, name, '', m, null, {mimetype: mime, asDocument: true});
} catch (error) {
await conn.sendMessage(m.chat, { text: error.message }, { quoted: m });
}
}

handler.command = ["mediafire", "mf"];
export default handler;

function formatBytes(bytes) {
if (bytes === 0) return '0 B'
const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
const i = Math.floor(Math.log(bytes) / Math.log(1024))
return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`
}

async function mediafireDl(url) {
try {
if (!url.includes('www.mediafire.com')) throw new Error(`${mess.unlink}`);
let res;
let $;
let link = null;
try {
res = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }});
$ = cheerio.load(res.data);
const downloadButton = $('#downloadButton');
link = downloadButton.attr('href');
if (!link || link.includes('javascript:void(0)')) { 
link = downloadButton.attr('data-href') || downloadButton.attr('data-url') || downloadButton.attr('data-link');
const scrambledUrl = downloadButton.attr('data-scrambled-url');
if (scrambledUrl) {
try {
link = atob(scrambledUrl);
} catch (e) {
console.log('Error decodificando scrambled URL:', e.message);
}
}
if (!link || link.includes('javascript:void(0)')) {
const htmlContent = res.data;
const linkMatch = htmlContent.match(/href="(https:\/\/download\d+\.mediafire\.com[^"]+)"/);
if (linkMatch) {
link = linkMatch[1];
} else {
const altMatch = htmlContent.match(/"(https:\/\/[^"]*mediafire[^"]*\.(zip|rar|pdf|jpg|jpeg|png|gif|mp4|mp3|exe|apk|txt)[^"]*)"/i);
if (altMatch) {
link = altMatch[1];
}
}
}
}
} catch (directError) {
const translateUrl = `https://www-mediafire-com.translate.goog/${url.replace('https://www.mediafire.com/', '')}?_x_tr_sl=en&_x_tr_tl=fr&_x_tr_hl=en&_x_tr_pto=wapp`;
res = await axios.get(translateUrl, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }});
$ = cheerio.load(res.data);
const downloadButton = $('#downloadButton');
link = downloadButton.attr('href');
if (!link || link.includes('javascript:void(0)')) {
const scrambledUrl = downloadButton.attr('data-scrambled-url');
if (scrambledUrl) {
try {
link = atob(scrambledUrl);
} catch (e) {}
}
}
}
if (!link || link.includes('javascript:void(0)')) throw new Error('No se pudo encontrar el enlace de descarga válido');
const name = $('body > main > div.content > div.center > div > div.dl-btn-cont > div.dl-btn-labelWrap > div.promoDownloadName.notranslate > div').attr('title')?.replace(/\s+/g, '')?.replace(/\n/g, '') || $('.dl-btn-label').attr('title') || $('.filename').text().trim() || 'archivo_descargado';
const date = $('body > main > div.content > div.center > div > div.dl-info > ul > li:nth-child(2) > span').text().trim() || $('.details li:nth-child(2) span').text().trim() || 'Fecha no disponible';
const size = $('#downloadButton').text().replace('Download', '').replace(/[()]/g, '').replace(/\n/g, '').replace(/\s+/g, ' ').trim() || $('.details li:first-child span').text().trim() || 'Tamaño no disponible';
let mime = '';
const ext = name.split('.').pop()?.toLowerCase();
mime = lookup(ext) || 'application/octet-stream';
if (!link.startsWith('http')) throw new Error('Enlace de descarga inválido');
return { name, size, date, mime, link };
} catch (error) {
console.error('Error en mediafireDl:', error.message);
throw new Error(`Error al procesar MediaFire: ${error.message}`);
}
}

