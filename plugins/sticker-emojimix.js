import MessageType from '@whiskeysockets/baileys'
import fetch from 'node-fetch'
import { sticker } from '../lib/sticker.js'
import fs from "fs"

const fetchJson = (url, options) => new Promise(async (resolve, reject) => {
fetch(url, options)
.then(response => response.json())
.then(json => {
resolve(json)
})
.catch((err) => {
reject(err)
})
})

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
if (!global.db.data.chats[m.chat].fStickers && m.isGroup) {
return conn.sendMessage(m.chat, { text: `*[ ⽷ ]*  Los comandos de *stickers* estan desactivados...` }, { quoted: m })
}

if (!args[0]) return conn.sendMessage(m.chat, { text: `${mess.example}\n*${usedPrefix + command}* 🥶, 🥵` }, { quoted: m })

let [emoji, emoji2] = text.split`,`
let anu = await fetchJson(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emoji)}_${encodeURIComponent(emoji2)}`)

for (let res of anu.results) {
let userId = m.sender
let packstickers = global.db.data.users[userId] || {}

let texto1 = packstickers.text1 || global.skpack
let texto2 = packstickers.text2 || global.skpack2

let stiker = await sticker(false, res.url, texto1, texto2)
conn.sendFile(m.chat, stiker, null, { asSticker: true }, m)
}
}

handler.command = ['emojix'] 
handler.tags = ["stickers"]
export default handler
