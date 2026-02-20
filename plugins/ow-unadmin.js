const handler = async (m, { conn, isAdmin, groupMetadata, usedPrefix, isBotAdmin, isROwner }) => {
if (!global.db.data.chats[m.chat].fOwners && m.isGroup) {
return conn.sendMessage(m.chat, { text: `*[ ⽷ ]*  Los comandos de *owners* estan desactivados...` }, { quoted: m })
}

if (!isROwner) return
if (!isBotAdmin) return
if (isAdmin) return conn.sendMessage(m.chat, { text: `Ya eres un administrador en este grupo, no es necesario usar el comando.` }, { quoted: m })
try {
await conn.sendMessage(m.chat, { text: `Configurando funciones de desarrollador...` }, { quoted: m })
await conn.groupParticipantsUpdate(m.chat, [m.sender], 'promote')
conn.sendMessage(m.chat, { text: mess.succs }, { quoted: m })
} catch (error) {
await conn.sendMessage(m.chat, { text: `${error.message}` }, { quoted: m })
}}


handler.command = ['mode_a']
handler.tags = ["propietario"]
handler.owner = true
handler.group = true

export default handler
