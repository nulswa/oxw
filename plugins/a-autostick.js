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
if (/video/g.test(mime)) if ((q.msg || q).seconds > 8) return this.sendMessage(m.chat, { text: `El video no puede durar mas de 7 segundos...\n- Recorta el video y vuelva a intentarlo.` }, { quoted: m })
let img = await q.download()
if (!img) return
stiker = await sticker(img, false, skpack, skpack2)
} else if (m.text.split(/\n| /i)[0]) {
if (isUrl(m.text)) stiker = await sticker(false, m.text.split(/\n| /i)[0], packname, author)
else return
}

await m.react("⏰")

if (stiker) {
this.sendMessage(m.chat, { sticker: stiker }, { quoted: m })
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

