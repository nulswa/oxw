import fetch from 'node-fetch'
import fs from 'fs'
let handler = async (m, {conn, usedPrefix, command, args, isOwner, isAdmin, isROwner, text}) => {
if (!global.db.data.chats[m.chat].fOwners && m.isGroup) {
return conn.sendMessage(m.chat, { text: `*[ ⽷ ]*  Los comandos de *owners* estan desactivados...` }, { quoted: m })
}

let chat = global.db.data.chats[m.chat]
let user = global.db.data.users[m.sender]
let bot = global.db.data.settings[conn.user.jid] || {}
let toUser = `${m.sender.split('@')[0]}`
let aa = toUser + '@s.whatsapp.net'
let name = await conn.getName(m.sender)
let isEnable = /true|enable|(turn)?on|1/i.test(command)
let type = (args[0] || '').toLowerCase()
let opciones = `${emoji} Activa los comandos exclusivos...

\t＃ *Funciones* » *6* results
\t＃ *Tipo* » Owners

${mess.example}
*${usedPrefix + command}* premium
${readMore}
⊸ *${usedPrefix}true/false* premium
⊸ *${usedPrefix}true/false* target
⊸ *${usedPrefix}true/false* moderador
⊸ *${usedPrefix}true/false* adminbot
⊸ *${usedPrefix}true/false* editor
⊸ *${usedPrefix}true/false* menu
⊸ *${usedPrefix}true/false* jadi
⊸ *${usedPrefix}true/false* privado

> ${textbot}`
//await conn.sendMessage(m.chat, { text: opciones }, { quoted: m })
let isAll = false,
isUser = false
switch (type) {
case 'prems':
case 'premium':
if (m.isGroup) {
if (!(isAdmin || isOwner)) {
global.dfail('admin', m, conn)
throw false
}
}
chat.fPremium = isEnable
break

case 'mods':
case 'moderador':
if (m.isGroup) {
if (!(isAdmin || isOwner)) {
global.dfail('admin', m, conn)
throw false
}
}
chat.fModers = isEnable
break

case 'adminbot':
case 'owners':
if (m.isGroup) {
if (!(isAdmin || isOwner)) {
global.dfail('admin', m, conn)
throw false
}
}
chat.fAdminbot = isEnable
break

case 'privado':
case 'priv': {
isAll = true
if (!isROwner) {
global.dfail('rowner', m, conn)
throw false
}
bot.fPrivado = isEnable
break
}

case 'jadi':
case 'jadibot':
if (m.isGroup) {
if (!(isAdmin || isOwner)) {
global.dfail('admin', m, conn)
throw false
}
}
bot.fJadibot = isEnable
break

case 'target':
case 'business':
if (m.isGroup) {
if (!(isAdmin || isOwner)) {
global.dfail('admin', m, conn)
throw false
}
}
chat.fTarget = isEnable
break

case 'edits':
case 'editor':
if (m.isGroup) {
if (!(isAdmin || isOwner)) {
global.dfail('admin', m, conn)
throw false
}
}
chat.fEdits = isEnable
break

case 'menu':
if (m.isGroup) {
if (!(isAdmin || isOwner)) {
global.dfail('admin', m, conn)
throw false
}
}
chat.fMenu = isEnable
break
default:
if (!/[01]/.test(command))
return await conn.sendMessage(m.chat, { text: opciones }, { quoted: m })
throw false
}
await conn.sendMessage(m.chat, { text: `✅  Se han ${isEnable ? 'activado' : 'desactivado'} los comandos tipo *[ ${type} ]* en este chat.` }, { quoted: m })
}
handler.command = ["true", "false"]
handler.tags = ["propietario"]
handler.owner = true
export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)
