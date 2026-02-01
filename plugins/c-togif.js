var handler = async (m, {conn, usedPrefix, command}) => {
if (!global.db.data.chats[m.chat].fConvert && m.isGroup) {
return conn.sendMessage(m.chat, { text: `${mssg.noias}` }, { quoted: m })
}

if (!m.quoted) return conn.sendMessage(m.chat, { text: `${mssg.replya('mp4')}` }, { quoted: m })
const q = m.quoted || m
const mime = (q.msg || q).mimetype || ''
if (!/(mp4)/.test(mime)) return conn.sendMessage(m.chat, { text: `${mssg.unsolo('mp4')}` }, { quoted: m })
await m.react("⏰")
const media = await q.download()
conn.sendMessage(m.chat, {video: media, gifPlayback: true, caption: `${botname}\n> ${textbot}`}, {quoted: m})
//await m.react("✅")
}

handler.command = ['togif']
export default handler
