 import { sticker } from '../lib/sticker.js'

let handler = (m) => m
handler.before = async function (m) {
let chat = db.data.chats[m.chat]
let user = db.data.users[m.sender]

if (chat.fWaStick && m.isGroup) {
let q = m
let stiker = false
let mime = (q.msg || q).mimetype || q.mediaType || ''
if (/webp/g.test(mime)) return
if (/image/g.test(mime)) {
let img = await q.download?.()
if (!img) return
stiker = await sticker(img, false, skpack, skpack2)
} else if (/video/g.test(mime)) {
if (/video/g.test(mime)) if ((q.msg || q).seconds > 16) return this.sendMessage(m.chat, { text: `El video no puede durar mas de 15 segundos...` }, { quoted: m })
let img = await q.download()
if (!img) return
stiker = await sticker(img, false, skpack, skpack2)
} else if (m.text.split(/\n| /i)[0]) {
if (isUrl(m.text)) stiker = await sticker(false, m.text.split(/\n| /i)[0], skpack, skpack2)
else return
}

await m.react("⏰")

if (stiker) {
await this.sendMessage(m.chat, { sticker: stiker }, { quoted: m })
//this.sendFile(m.chat, stiker, null, { asSticker: true })
}
}
return !0
}
export default handler

const isUrl = (text) => {
return text.match(
new RegExp(/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)(jpe?g|gif|png|mp4)/, 'gi')
)
}

