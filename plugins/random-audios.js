import util from 'util'
import path from 'path'

let handler = (m) => m
handler.all = async function (m) {
let chat = global.db.data.chats[m.chat]
if (m.isBot || m.sender.includes('bot') || m.sender.includes('Bot')) return true
if (chat.isBanned) return
if (m.fromMe) return !0
if (!db.data.chats[m.chat].fAudios) return

const audioMap = [
{regex: /^Hola$/i, url: 'https://files.catbox.moe/52bs4z.mp3'},
{regex: /^Buenos dias$/i, url: 'https://files.catbox.moe/sgj3un.mp3', 'https://files.catbox.moe/ttw75j.mp3', 'https://files.catbox.moe/nwwqqs.mp3'},
{regex: /^Bienvenido al nuevo|Bienvenida al nuevo|Bienvenidos a todos$/i, url: 'https://files.catbox.moe/0eys11.mp3'}
]

let matchedAudio = audioMap.find((audio) => audio.regex.test(m.text))

if (matchedAudio) {
try {
this.sendPresenceUpdate('recording', m.chat)
this.sendFile(m.chat, matchedAudio.url, 'toru.mp3', null, m, true, { type: 'audioMessage', ptt: true })
} catch (e) {
console.error(e)
} finally {
}
}

return !0
}
export default handler
