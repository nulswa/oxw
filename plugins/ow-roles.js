let handler = async (m, {conn, text, command, usedPrefix}) => {
if (!global.db.data.chats[m.chat].fOwners && m.isGroup) {
return conn.sendMessage(m.chat, { text: `📍  Los comandos de *[ owners ]* estan desactivados...` }, { quoted: m })
}

let who
if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text
else who = m.chat

if (command === "-prem") {
if (!who) return conn.sendMessage(m.chat, { text: `ᗢ Mencione a un usuario *premium* para quitar su rol.\n\n\t⚶ Por ejemplo:\n*${usedPrefix + command}* @${m.sender.split`@`[0]}`, mentions: [m.sender] }, { quoted: m })
if (!global.prems.includes(who.split`@`[0])) return conn.sendMessage(m.chat, { text: `El usuario mencionado no es un usuario premium.` }, { quoted: m })
let index = global.prems.findIndex((v) => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net' === who.replace(/[^0-9]/g, '') + '@s.whatsapp.net')
global.prems.splice(index, 1)
conn.sendMessage(m.chat, { text: `El usuario *[ @${who.split`@`[0]} ]* ya no es un usuario premium.`, mentions: [who] }, { quoted: m })
}

if (command === "-mod") {
if (!who) return conn.sendMessage(m.chat, { text: `ᗢ Mencione a un usuario *moderador* para quitar su rol.\n\n\t⚶ Por ejemplo:\n*${usedPrefix + command}* @${m.sender.split`@`[0]}`, mentions: [m.sender] }, { quoted: m })
if (!global.mods.includes(who.split`@`[0])) return conn.sendMessage(m.chat, { text: `El usuario mencionado no es un usuario moderador.` }, { quoted: m })
let index = global.mods.findIndex((v) => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net' === who.replace(/[^0-9]/g, '') + '@s.whatsapp.net')
global.mods.splice(index, 1)
conn.sendMessage(m.chat, { text: `El usuario *[ @${who.split`@`[0]} ]* ya no es un usuario moderador.`, mentions: [who] }, { quoted: m })
}

if (command === "-admin") {
if (!who) return conn.sendMessage(m.chat, { text: `ᗢ Mencione a un usuario *admin bot* para quitar su rol.\n\n\t⚶ Por ejemplo:\n*${usedPrefix + command}* @${m.sender.split`@`[0]}`, mentions: [m.sender] }, { quoted: m })
if (!global.owner.includes(who.split`@`[0])) return conn.sendMessage(m.chat, { text: `El usuario mencionado no es un usuario administrador del bot.` }, { quoted: m })
let index = global.owner.findIndex((v) => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net' === who.replace(/[^0-9]/g, '') + '@s.whatsapp.net')
global.owner.splice(index, 1)
conn.sendMessage(m.chat, { text: `El usuario *[ @${who.split`@`[0]} ]* ya no es un usuario administrador del bot.`, mentions: [who] }, { quoted: m })
}

}


handler.command = ["-prem", "-mod", "-admin"]
handler.rowner = true
export default handler
