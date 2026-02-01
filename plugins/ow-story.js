const handler = async (m, { conn }) => {
if (!global.db.data.chats[m.chat].fOwners && m.isGroup) {
return conn.sendMessage(m.chat, { text: `📍  Los comandos de *[ owners ]* estan desactivados...` }, { quoted: m })
}

if ("status@broadcast" != m.quoted?.chat) return conn.sendMessage(m.chat, { text: `ᗢ Responda a un estado para descargar su contenido.` }, { quoted: m })
try {
await m.react("🔑")
let buffer = await m.quoted?.download()
await conn.sendFile(m.chat, buffer, "", m.quoted?.text || "", null, false, { quoted: m })
//await m.react("✅")
} catch (e) {
console.log(e)
await conn.sendMessage(m.chat, { text: e.message }, { quoted: m })
//conn.reply(m.chat, m.quoted?.text, m)
}}

handler.command = ["story"]
handler.owner = true
export default handler

