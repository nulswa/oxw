let linkRegex1 = /chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i
let linkRegex2 = /whatsapp\.com\/channel\/([0-9A-Za-z]{20,24})/i

let handler = (m) => m
handler.before = async function (m, {conn, isAdmin, isBotAdmin, isOwner}) {

if (!m.isGroup) return true
if (!m.text) return true
if (m.fromMe) return true

let chat = global.db.data.chats[m.chat]
if (!chat || !chat.fEnlaces) return true 

const sender = m.sender

const isGlobalOwner = global.owner.some(([ownerNumber]) => {
return sender === `${ownerNumber}@s.whatsapp.net` || sender.split('@')[0] === ownerNumber.toString()
})

if (isOwner || isGlobalOwner) return true //Ignora si es un owner.

// Detectar si hay enlaces
const hasGroupLink = linkRegex1.test(m.text)
const hasChannelLink = linkRegex2.test(m.text)

if (hasGroupLink || hasChannelLink) {

// Obtener el enlace del grupo actual
let linkThisGroup = ''
try {
const groupCode = await conn.groupInviteCode(m.chat)
linkThisGroup = `https://chat.whatsapp.com/${groupCode}`
} catch (e) {
console.log(e.message)
}

if (linkThisGroup && m.text.includes(linkThisGroup)) {
return true //Permite solo si el enlace es del mismo grupo.
}

if (!isBotAdmin) {
await conn.reply(m.chat, `📍  Se detecto un enlace en este chat.\n- No soy admin para continuar la expulsión...`, m)
return true
}

if (isAdmin) {
await conn.sendMessage(m.chat, { text: `📍  Hola, @${sender.split('@')[0]}, como eres administrador, se te recomienda no enviar enlaces grupales.`, mentions: [sender] })
try {
await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: m.key.id, participant: sender }})
} catch (e) {
console.log(e.message)
}

return false
}

if (!isAdmin) {
await conn.sendMessage(m.chat, { text: `📍El usuario @${sender.split('@')[0]} sera eliminado en breve por enviar un enlace al chat...`, mentions: [sender] })
try {
await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: m.key.id, participant: sender }})
} catch (e) {
console.log(e.message)
}
await new Promise(resolve => setTimeout(resolve, 1000))
try {
await conn.groupParticipantsUpdate(m.chat, [sender], 'remove')
} catch (e) {
await conn.sendMessage(m.chat, { text: `📍  No pude eliminar al usuario, es posible que no haya permisos o posible fallo...` })
}

return false
}
}

return true
}

export default handler
