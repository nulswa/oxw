import fetch from 'node-fetch'
import yts from 'yt-search'

let handler = async (m, { conn, usedPrefix, command, text }) => {
if (!global.db.data.chats[m.chat].fDescargas && m.isGroup) {
return conn.sendMessage(m.chat, { text: `*[ ⽷ ]*  Los comandos de *descargas* estan desactivados...` }, { quoted: m })
}

const botJid = conn.user.jid
let settings = global.db.data.settings[botJid]

const botName = settings?.nameBot || global.botname
const botDesc = settings?.descBot || global.textbot
const botImg = settings?.imgBot || global.toruImg
const botMenu = settings?.menuBot || global.toruMenu

if (command === "tiktok" || command === "tt") {
if (!text) return conn.sendMessage(m.chat, { text: `${mess.example}\n*${usedPrefix + command}* https://vm.tiktok.com/xxx/` }, { quoted: m })
try {
let regex = /https?:\/\/(?:www\.|vm\.|vt\.)?tiktok\.com\/[^\s]+/i
let match = m.text.match(regex)
if (!match) return conn.sendMessage(m.chat, { text: mess.unlink }, { quoted: m })
let url = match[0]
let api = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}?hd=1`
let res = await fetch(api)
let json = await res.json()
if (!json || json.code !== 0 || !json.data) return conn.sendMessage(m.chat, { text: mess.noapi }, { quoted: m })
const data = json.data
const { id, region, title, cover, origin_cover, duration, play, wmplay, music, music_info, play_count, digg_count, comment_count, share_count, download_count, author, images, create_time } = data
await m.react("⏰")
await conn.sendMessage(m.chat, { video: { url: play }, caption: `${botName}\n> ${botDesc}`, gifPlayback: false, jpegThumbnail: Buffer.from(await (await fetch(cover)).arrayBuffer()) }, { quoted: m })
//await m.react("✅")
} catch (err) {
console.error(err)
await conn.sendMessage(m.chat, { text: `${err.message}` }, { quoted: m })
  }
 }
}

handler.command = ["tiktok", "tt"]
handler.tags = ["descargas"]
export default handler
 
