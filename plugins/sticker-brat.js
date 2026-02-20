import { sticker } from '../lib/sticker.js'
import axios from 'axios'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const fetchSticker = async (text, attempt = 1) => {
try {
const response = await axios.get(`https://api.nekorinn.my.id/maker/brat-v2`, {
params: { text },
responseType: 'arraybuffer',
})
return response.data
} catch (error) {
if (error.response?.status === 429 && attempt <= 3) {
const retryAfter = error.response.headers['retry-after'] || 5
await delay(retryAfter * 1000)
return fetchSticker(text, attempt + 1)
}
throw error
}
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
if (!global.db.data.chats[m.chat].fStickers && m.isGroup) {
return conn.sendMessage(m.chat, { text: `*[ ⽷ ]*  Los comandos de *stickers* estan desactivados...` }, { quoted: m })
}

if (m.quoted && m.quoted.text) {
text = m.quoted.text
} else if (!text) {
return conn.sendMessage(m.chat, { text: `${mess.example}\n*${usedPrefix + command}* Hola` }, { quoted: m })
}

try {
const buffer = await fetchSticker(text)
let userId = m.sender
let packstickers = global.db.data.users[userId] || {}

let texto1 = packstickers.text1 || global.skpack
let texto2 = packstickers.text2 || global.skpack2

let stiker = await sticker(buffer, false, texto1, texto2)

if (stiker) {
await m.react("⏰")
return conn.sendMessage(m.chat, { sticker: stiker }, { quoted: m })
//conn.sendFile(m.chat, stiker, 'sticker.webp', '', m)
} else {
throw new Error(`${mess.fallo}`)
}
} catch (error) {
return conn.sendMessage(m.chat, { text: `${error.message}` }, { quoted: m })
}
}

handler.command = ['brat']
handler.tags = ["stickers"]
export default handler

