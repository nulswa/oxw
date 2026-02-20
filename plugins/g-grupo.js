import { makeWASocket } from '@whiskeysockets/baileys'

const handler = async (m, { conn, args, text, command, usedPrefix }) => {
if (!global.db.data.chats[m.chat].fGrupos && m.isGroup) {
return conn.sendMessage(m.chat, { text: `*[ ⽷ ]*  Los comandos de *grupos* estan desactivados...` }, { quoted: m })
}

try {
switch (command) {
case 'g-img': {
const q = m.quoted || m
const mime = (q.msg || q).mimetype || ''
if (!/image\/(png|jpe?g)/.test(mime)) return conn.sendMessage(m.chat, { text: `ᗢ Responda a una imagen.` }, { quoted: m })
const img = await q.download()
if (!img) return conn.sendMessage(m.chat, { text: `Solo puedes responder imagenes.` }, { quoted: m })
await m.react('⏰')
await conn.updateProfilePicture(m.chat, img)
//await m.react('✅')
conn.sendMessage(m.chat, { text: mess.succs }, { quoted: m })
break
}
case 'g-desc': {
if (!args.length) return client.sendMessage(m.chat, { text: mess.example + `\n*${usedPrefix + command}* NewDesc` }, { quoted: m })
await m.react('⏰')
await conn.groupUpdateDescription(m.chat, args.join(' '))
//await m.react('✅')
conn.sendMessage(m.chat, { text: mess.succs }, { quoted: m })
break
}
case 'g-name': {
if (!text) return client.sendMessage(m.chat, { text: mess.example + `\n*${usedPrefix + command}* NewGroup` }, { quoted: m })
await m.react('⏰')
await conn.groupUpdateSubject(m.chat, text)
//await m.react('✅')
conn.sendMessage(m.chat, { text: mess.succs }, { quoted: m })
break
}}} catch (e) {
await conn.sendMessage(m.chat, { text: `${e.message}` }, { quoted: m })
}}

handler.command = ['g-img', 'g-desc', 'g-name']
handler.tags = ["grupos"]
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler

  
