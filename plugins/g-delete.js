let handler = async (m, {conn, args, usedPrefix, command}) => {
if (!m.quoted && !m.mentionedJid?.length && !args[0])
return conn.sendMessage(m.chat, { text: `${emoji} Responda a un usuario para eliminar su mensaje.` }, { quoted: m })
try {
if (m.quoted) {
let delet = m.quoted.sender
let bang = m.quoted.id
return conn.sendMessage(m.chat, {delete: {remoteJid: m.chat, fromMe: false, id: bang, participant: delet}})
}

let target = ''
if (m.mentionedJid?.length) {
target = m.mentionedJid[0]
} else if (args[0] && args[0].startsWith('+')) {
target = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net'
} else {
return conn.sendMessage(m.chat, { text: `${emoji} Responda o mencione a un usuario para eliminar su mensaje.` }, { quoted: m })
}

let chats = (await conn.chats[m.chat]?.messages) || []
let messagesToDelete = Object.values(chats).filter((msg) => msg.key.participant === target || msg.key.remoteJid === target)

if (!messagesToDelete.length) return conn.sendMessage(m.chat, { text: `No se han encontrado mensajes recientes...` }, { quoted: m })
let totalToDelete = Math.min(messagesToDelete.length, 50) // Máximo 50 mensajes
let deletedCount = 0

for (let i = 0; i < totalToDelete; i++) {
let message = messagesToDelete[i]
try {
await conn.sendMessage(m.chat, {delete: message.key})
deletedCount++
await delay(100)
} catch (err) {
await conn.sendMessage(m.chat, { text: `${mess.fallo}` }, { quoted: m })
}
}
await conn.sendMessage(m.chat, { text: `${mess.succs}\n- Se eliminaron *${deletedCount}* del *[ ${target.incluides('@s.whatsapp.net') ? `${args[0]}` : `usuario mencionado.`}` }, { quoted: m })
} catch (err) {
conn.sendMessage(m.chat, { text: err.message }, { quoted: m })
console.error(err)
}
}

handler.tags = ['grupos']
handler.command = ["del"]
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
