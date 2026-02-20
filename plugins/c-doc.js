import { toAudio } from '../lib/converter.js'

let handler = async (m, { conn, text, usedPrefix, command }) => {
if (!global.db.data.chats[m.chat].fConvert && m.isGroup) {
return conn.sendMessage(m.chat, { text: `*[ ⽷ ]*  Los comandos de *convertidor* estan desactivados...` }, { quoted: m })
}

let q = m.quoted || m
let mime = (q.msg || q).mimetype || ''
if (!m.quoted) return conn.sendMessage(m.chat, { text: `${emoji} Responda a un audio o video.\n- Proporciona un nombre al archivo.\n\n${mssg.ejemplo}\n*${usedPrefix + command}* toru` }, { quoted: m })
if(!text) return conn.sendMessage(m.chat, { text: `${emoji} Responda a un audio o video.\n- Proporciona un nombre al archivo.\n\n${mssg.ejemplo}\n*${usedPrefix + command}* toru` }, { quoted: m })
if (!/audio|video/.test(mime)) return conn.sendMessage(m.chat, { text: `Solo puedes responder audios o videos...` }, { quoted: m })
let media = await q.download?.()
if (!media) return conn.sendMessage(m.chat, { text: mess.fallo }, { quoted: m })
await m.react('⏰')
if (/video/.test(mime)) {
return conn.sendMessage(m.chat, { document: media, mimetype: 'video/mp4', fileName: `${text}.mp4`}, {quoted: m})
} else if (/audio/.test(mime)) {
return conn.sendMessage(m.chat, { document: media, mimetype: 'audio/mpeg', fileName: `${text}.mp3`}, {quoted: m})
 }
}

handler.command = ['docu', 'doc']
handler.tags = ["convertidor"]
export default handler

