let linkRegex1 = /chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i
let linkRegex2 = /whatsapp\.com\/channel\/([0-9A-Za-z]{20,24})/i

// Almacenar advertencias de admins
const adminWarnings = {};

let handler = (m) => m
handler.before = async function (m, {conn, isAdmin, isBotAdmin, isOwner, isROwner, participants}) {
if (!m.isGroup) return
if (!m.text) return
if (m.fromMe) return

let chat = global.db.data.chats[m.chat]
if (!chat.fEnlaces) return // Si antienlaces está desactivado, salir

const sender = m.sender
const isGroupOwner = isOwner || isROwner || global.owner.includes(sender.split('@')[0])

// Detectar si hay enlaces
const isGroupLink = linkRegex1.test(m.text) || linkRegex2.test(m.text)

if (isGroupLink) {
// Obtener el enlace del grupo actual
let linkThisGroup = ''
try {
linkThisGroup = `https://chat.whatsapp.com/${await conn.groupInviteCode(m.chat)}`
} catch (e) {
linkThisGroup = ''
}

// Si el enlace es del mismo grupo, permitirlo
if (m.text.includes(linkThisGroup)) return

// Si el bot no es admin, solo avisar
if (!isBotAdmin) {
await conn.sendMessage(m.chat, {
text: `📍  No puedo eliminar usuarios...`
}, {quoted: m})
return
}

// Si es propietario del bot, no hacer nada
if (isGroupOwner) {
return
}

// Si es ADMINISTRADOR del grupo
if (isAdmin) {
// Inicializar advertencias si no existe
if (!adminWarnings[m.chat]) {
adminWarnings[m.chat] = {};
}
if (!adminWarnings[m.chat][sender]) {
adminWarnings[m.chat][sender] = 0;
}

// Primera advertencia
if (adminWarnings[m.chat][sender] === 0) {
adminWarnings[m.chat][sender] = 1;

await conn.sendMessage(m.chat, {
text: `Hola @${sender.split('@')[0]}, como eres administrador del grupo solo seras advertido.\n- Si vuelves a enviar un enlace, seras degradado y eliminado del chat...`,
mentions: [sender]
}, {quoted: m})

// Eliminar el mensaje
try {
await conn.sendMessage(m.chat, {
delete: {
remoteJid: m.chat,
fromMe: false,
id: m.key.id,
participant: sender
}
})
} catch (e) {
console.log('Error al eliminar mensaje:', e)
}

return
}

// Segunda vez - Degradar y eliminar
if (adminWarnings[m.chat][sender] >= 1) {
await conn.sendMessage(m.chat, {
text: `📍  Hola @${sender.split('@')[0]}, seras degradado como admin y eliminado del chat.\n- Se agrega un limite incluso para admins...`,
mentions: [sender]
}, {quoted: m})

// Eliminar el mensaje
try {
await conn.sendMessage(m.chat, {
delete: {
remoteJid: m.chat,
fromMe: false,
id: m.key.id,
participant: sender
}
})
} catch (e) {
console.log('Error al eliminar mensaje:', e)
}

// Degradar de admin
try {
await conn.groupParticipantsUpdate(m.chat, [sender], 'demote')
} catch (e) {
console.log('Error al degradar admin:', e)
}

// Esperar un momento antes de eliminar
await new Promise(resolve => setTimeout(resolve, 1000))

// Eliminar del grupo
try {
await m.react("⏰")
await conn.groupParticipantsUpdate(m.chat, [sender], 'remove')
await m.react("✅")
} catch (e) {
console.log('Error al eliminar usuario:', e)
}

// Resetear advertencias
delete adminWarnings[m.chat][sender]

return
}
}

// Si es USUARIO NORMAL (no admin, no owner)
if (!isAdmin) {
await conn.sendMessage(m.chat, {
text: `📍  El usuario @${sender.split('@')[0]} fue eliminado por enviar un enlace.`,
mentions: [sender]
}, {quoted: m})

// Eliminar el mensaje
try {
await conn.sendMessage(m.chat, {
delete: {
remoteJid: m.chat,
fromMe: false,
id: m.key.id,
participant: sender
}
})
} catch (e) {
console.log('Error al eliminar mensaje:', e)
}

// Eliminar del grupo
try {
await conn.groupParticipantsUpdate(m.chat, [sender], 'remove')
} catch (e) {
console.log('Error al eliminar usuario:', e)
await conn.sendMessage(m.chat, {
text: `📍 No pude eliminar al usuario. Verifica que tenga los permisos necesarios.`
}, {quoted: m})
}

return
}
}

return true
}

export default handler


/*const linkRegex = /(chat\.whatsapp\.com\/[0-9A-Za-z]{20,24})|(z?https:\/\/whatsapp\.com\/channel\/[0-9A-Za-z]{20,24})/i
const allowedLinks = ['https://chat.whatsapp.com/I9bKP27LAx1FltvoBBH0kU']

export async function before(m, { conn, isAdmin, isBotAdmin, isROwner, participants }) {
if (!m.isGroup) return
if (!m || !m.text) return
const chat = global?.db?.data?.chats[m.chat]
const isGroupLink = linkRegex.test(m.text)
const isChannelLink = /whatsapp\.com\/channel\//i.test(m.text)
const hasAllowedLink = allowedLinks.some(link => m.text.includes(link))
if (hasAllowedLink) return
if ((isGroupLink || isChannelLink) && !isAdmin) {
if (isBotAdmin) {
const linkThisGroup = `https://chat.whatsapp.com/${await conn.groupInviteCode(m.chat)}`
if (isGroupLink && m.text.includes(linkThisGroup)) return !0
}
if (chat.fEnlaces && isGroupLink && !isAdmin && !isROwner && isBotAdmin && m.key.participant !== conn.user.jid) {
await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: m.key.id, participant: m.key.participant }})
await conn.sendMessage(m.chat, { text: `📍  ${global.db.data.users[m.key.participant].name || 'User' } removed for unfit links.` }, m)
await conn.groupParticipantsUpdate(m.chat, [m.key.participant], 'remove')
}}}*/
