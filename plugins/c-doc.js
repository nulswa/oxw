import { toAudio } from '../lib/converter.js'

let handler = async (m, { conn, text, usedPrefix, command }) => {
if (!global.db.data.chats[m.chat].fConvert && m.isGroup) {
return conn.sendMessage(m.chat, { text: `${mssg.noconv}` }, { quoted: m })
}

let q = m.quoted || m
let mime = (q.msg || q).mimetype || ''
if (!m.quoted) return conn.sendMessage(m.chat, { text: `${mssg.replyb('mp3/mp4')}\n\n${mssg.ejemplo}\n*${usedPrefix + command}* toru` }, { quoted: m })
if(!text) return conn.sendMessage(m.chat, { text: `${mssg.replyb('mp3/mp4')}\n\n${mssg.ejemplo}\n*${usedPrefix + command}* toru` }, { quoted: m })
if (!/audio|video/.test(mime)) return conn.sendMessage(m.chat, { text: `${mssg.unsolo('mp3/mp4')}` }, { quoted: m })
let media = await q.download?.()
if (!media) return conn.sendMessage(m.chat, { text: mssg.noresult }, { quoted: m })
await m.react('⏰')
if (/video/.test(mime)) {
return conn.sendMessage(m.chat, { document: media, mimetype: 'video/mp4', fileName: `${text}.mp4`}, {quoted: m})
} else if (/audio/.test(mime)) {
return conn.sendMessage(m.chat, { document: media, mimetype: 'audio/mpeg', fileName: `${text}.mp3`}, {quoted: m})
 }
}

handler.command = ['docu', 'doc']
export default handler

