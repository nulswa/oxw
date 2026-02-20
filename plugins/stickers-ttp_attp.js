import { sticker } from '../lib/sticker.js'
import fetch from 'node-fetch'
import axios from 'axios'

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
if (!global.db.data.chats[m.chat].fStickers && m.isGroup) {
return conn.sendMessage(m.chat, { text: `*[ ⽷ ]*  Los comandos de *stickers* estan desactivados...` }, { quoted: m })
}

if (!text) {
if (m.quoted && m.quoted.text) {
text = m.quoted.text
} else {
return conn.sendMessage(m.chat, { text: `${mess.example}\n*${usedPrefix + command}* Hola` }, { quoted: m })
}
}

let teks = encodeURI(text)
let userId = m.sender
let packstickers = global.db.data.users[userId] || {}

let texto1 = packstickers.text1 || global.skpack
let texto2 = packstickers.text2 || global.skpack2

if (command == 'attp') {
let stiker = await sticker(null, `https://api.fgmods.xyz/api/maker/attp?text=${teks}&apikey=dylux`, texto1, texto2)
conn.sendFile(m.chat, stiker, 'sticker.webp', '', m, true)
}

if (command == 'ttp') {
let stiker = await sticker(null, `https://api.fgmods.xyz/api/maker/ttp?text=${teks}&apikey=dylux`, texto1, texto2)
conn.sendFile(m.chat, stiker, 'sticker.webp', '', m, true)
}
}

handler.command = ['ttp', 'attp']
handler.tags = ["stickers"]
export default handler

