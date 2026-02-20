import { addExif } from '../lib/sticker.js';
import { sticker } from '../lib/sticker.js';
import fetch from 'node-fetch';
import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
if (!global.db.data.chats[m.chat].fStickers && m.isGroup) {
return conn.sendMessage(m.chat, { text: `*[ ⽷ ]*  Los comandos de *stickers* estan desactivados...` }, { quoted: m })
}

if (!m.quoted) return conn.sendMessage(m.chat, { text: `${emoji} Responda a un sticker para asignarle un nuevo nombre.\n\n${usedPrefix + command}\n*${usedPrefix + command}* toru` }, { quoted: m });

const sticker = await m.quoted.download();
if (!sticker) return conn.sendMessage(m.chat, { text: mess.fallo }, { quoted: m });

const textoParts = text.split(/[\u2022|]/).map(part => part.trim());
const userId = m.sender;
let packstickers = global.db.data.users[userId] || {};

let texto1 = textoParts[0] || packstickers.text1 || global.skpack;
let texto2 = textoParts[1] || packstickers.text2 || global.skpack2;

const exif = await addExif(sticker, texto1, texto2);

await conn.sendMessage(m.chat, { sticker: exif }, { quoted: m });
};

handler.command = ['take', 'wm'];
handler.tags = ["stickers"];
export default handler;

