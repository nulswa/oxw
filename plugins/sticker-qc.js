import { sticker } from '../lib/sticker.js'
import axios from 'axios'

const handler = async (m, { conn, args, usedPrefix, command }) => {
if (!global.db.data.chats[m.chat].fStickers && m.isGroup) {
return conn.sendMessage(m.chat, { text: `*[ ⽷ ]*  Los comandos de *stickers* estan desactivados...` }, { quoted: m })
}

let text
if (args.length >= 1) {
text = args.slice(0).join(" ")
} else if (m.quoted && m.quoted.text) {
text = m.quoted.text
} else {
return conn.sendMessage(m.chat, { text: `${mess.example}\n*${usedPrefix + command}* Hola` }, { quoted: m })
}

if (!text) return conn.sendMessage(m.chat, { text: mess.example + `\n*${usedPrefix + command}* Hola` }, { quoted: m })

const mentionedUser = m.quoted ? m.quoted.sender : m.sender
const pp = await conn.profilePictureUrl(mentionedUser).catch((_) => 'https://telegra.ph/file/24fa902ead26340f3df2c.png')
const nombre = await conn.getName(mentionedUser)

const mentionRegex = new RegExp(`@${mentionedUser.split('@')[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*`, 'g')
const mishi = text.replace(mentionRegex, '')

if (mishi.length > 30) return conn.sendMessage(m.chat, { text: `${emoji} El texto no debe tener mas de 30 características.` }, { quoted: m })

const obj = {
"type": "quote",
"format": "png",
"backgroundColor": "#000000",
"width": 512,
"height": 768,
"scale": 2,
"messages": [{
"entities": [],
"avatar": true,
"from": {
"id": 1,
"name": `${nombre}`,
"photo": { url: `${pp}` }
},
"text": mishi,
"replyMessage": {}
}]
}

const json = await axios.post('https://bot.lyo.su/quote/generate', obj, { headers: { 'Content-Type': 'application/json' } })
const buffer = Buffer.from(json.data.result.image, 'base64')

let userId = m.sender
let packstickers = global.db.data.users[userId] || {}

let texto1 = packstickers.text1 || global.skpack
let texto2 = packstickers.text2 || global.skpack2

let stiker = await sticker(buffer, false, texto1, texto2)
if (stiker) return conn.sendFile(m.chat, stiker, 'sticker.webp', '', m)
}


handler.command = ['qc']
handler.tags = ["stickers"]
export default handler

