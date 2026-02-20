var handler = async (m, {conn, usedPrefix, command}) => {
if (!global.db.data.chats[m.chat].fConvert && m.isGroup) {
return conn.sendMessage(m.chat, { text: `*[ ⽷ ]*  Los comandos de *convertidor* estan desactivados...` }, { quoted: m })
}

if (!m.quoted) return conn.sendMessage(m.chat, { text: `${emoji} Responda a un video para convertirlo el gif.` }, { quoted: m })
const q = m.quoted || m
const mime = (q.msg || q).mimetype || ''
if (!/(mp4)/.test(mime)) return conn.sendMessage(m.chat, { text: `Solo puedes responder videos...` }, { quoted: m })
await m.react("⏰")
const media = await q.download()
conn.sendMessage(m.chat, {video: media, gifPlayback: true, caption: `${botname}\n> ${textbot}`}, {quoted: m})
//await m.react("✅")
}

handler.command = ['togif']
handler.tags = ["convertidor"]
export default handler
