import axios from 'axios'
let handler = async (m, { conn, text, args, usedPrefix, command }) => {
if (!global.db.data.chats[m.chat].fAis && m.isGroup) {
return conn.sendMessage(m.chat, { text: `${mssg.noias}` }, { quoted: m })
}

if (!text) return client.sendMessage(m.chat, { text: `${mssg.ejemplo}\n*${usedPrefix + command}* Un gato con sombrero.` }, { quoted: m })
await m.react('⏰')
const res = await global.sendOptishield({ type: "text2img", text: "imagina" + text})
await conn.sendMessage(m.chat, { image: { url: res.result.img }, caption: `${botname}\n> ${textbot}` }, { quoted: m })
//await m.react('✅')
}
handler.command = ['imagina']
export default handler
