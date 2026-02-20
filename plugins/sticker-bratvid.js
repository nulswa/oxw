import axios from 'axios'
import { sticker } from '../lib/sticker.js'

const fetchStickerVideo = async (text) => {
const response = await axios.get(`https://velyn.mom/api/maker/bratgif`, {
params: { text },
responseType: 'arraybuffer'
})
if (!response.data) throw new Error(`${mess.noapi}`)
return response.data
}

let handler = async (m, { conn, text }) => {
if (!global.db.data.chats[m.chat].fStickers && m.isGroup) {
return conn.sendMessage(m.chat, { text: `*[ ⽷ ]*  Los comandos de *stickers* estan desactivados...` }, { quoted: m })
}

if (m.quoted && m.quoted.text) {
text = m.quoted.text
} else if (!text) {
return conn.sendMessage(m.chat, { text: `${mess.example}\n*${usedPrefix + command}* Hola` }, { quoted: m })
}

let userId = m.sender
let packstickers = global.db.data.users[userId] || {}

let texto1 = packstickers.text1 || global.skpack
let texto2 = packstickers.text2 || global.skpack2

try {
await m.react("⏰")
const videoBuffer = await fetchStickerVideo(text)
const stickerBuffer = await sticker(videoBuffer, null, texto1, texto2)
await conn.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: m })
} catch (e) {
await conn.sendMessage(m.chat, { text: `${e.message}` }, { quoted: m })
}
}

handler.command = ['bratvid', 'bratv']
handler.tags = ["stickers"]
export default handler

