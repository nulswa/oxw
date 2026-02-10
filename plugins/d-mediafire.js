
import { gotScraping } from 'got-scraping';
import fs from 'fs';
import * as cheerio from 'cheerio';
import path from 'path';
import fetch from 'node-fetch';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36';

async function getMediaFireLink(url) {
const r = await gotScraping({ 
url, 
headers: { 
'User-Agent': UA, 
'Accept': 'text/html' 
} 
});

const $ = cheerio.load(r.body);
const downloadLink = $('#downloadButton').attr('href') || 
 $('a.popsok').attr('href') || 
 $('a[aria-label="Download file"]').attr('href');

if (!downloadLink) throw new Error(`${mess.noapi}`);

return downloadLink;
}

let handler = async (m, { conn, args, usedPrefix, command }) => {
if (!global.db.data.chats[m.chat].fDescargas && m.isGroup) {
return conn.sendMessage(m.chat, { text: `📍  Los comandos de *[ descargas ]* estan desactivados...` }, { quoted: m })
}

if (!args[0]) return conn.sendMessage(m.chat, { text: `${mess.example}\n*${usedPrefix + command}* https://mediafire.com/xxx` }, { quoted: m });

if (!args[0].match(/mediafire\.com/)) return conn.sendMessage(m.chat, { text: `${mess.unlink}` }, { quoted: m });

try {
const directLink = await getMediaFireLink(args[0]);
const fileName = decodeURIComponent(directLink.split('/').pop());

await m.react("⏰");

const response = await gotScraping({ 
url: directLink, 
headers: { 'User-Agent': UA }, 
responseType: 'buffer', 
timeout: { request: 600000 } 
});

if (!response.body) throw new Error(`${mess.fallo}`);

const tmpPath = path.join('./tmp', fileName);
if (!fs.existsSync('./tmp')) fs.mkdirSync('./tmp');
fs.writeFileSync(tmpPath, response.body);


const size = response.body.length / 1024 / 1024;
const sizeStr = size.toFixed(2) + ' MB';

let toruWa = `· ┄ · ⊸ 𔓕 *  :  *

\t＃ *Nombre* : ${fileName}
\t＃ *Peso* : ${sizeSrt}
\t＃ *Acesso* : toru-api/mediafire
\t＃ *Fuente* : Mediafire

📍  Descargando archivo, espere un momento...`
const thumbBot = Buffer.from(await (await fetch(`https://files.catbox.moe/293guw.jpg`)).arrayBuffer())
await conn.sendMessage(m.chat, { text: caption, mentions: [m.sender], contextInfo: { externalAdReply: { title: `⧿ Mediafire : Download ⧿`, body: botname, thumbnail: thumbBot, sourceUrl: null, mediaType: 1, renderLargerThumbnail: false }}}, { quoted: m })
await conn.sendFile(m.chat, tmpPath, fileName, `${botname}\n> ${textbot}`, m);

if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
//await m.react('✅');

} catch (e) {
console.error(e);
  await conn.sendMessage(m.chat, { text: e.message }, { quoted: m });
//await m.reply(`❌ Ocurrió un error: ${e.message}`);
//await m.react('❌');
}
}

handler.command = ["mediafire", "mf"];
export default handler;
