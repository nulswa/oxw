let handler = async (m, { conn, usedPrefix, command }) => {
if (!global.db.data.chats[m.chat].fConvert && m.isGroup) {
return conn.sendMessage(m.chat, { text: `${mssg.noconv}` }, { quoted: m })
}

if (!m.quoted) {
return conn.sendMessage(m.chat, { text: `${mssg.replya('webp')}` }, { quoted: m })
}
await m.react('⏰')
let xx = m.quoted
let imgBuffer = await xx.download()   
if (!imgBuffer) {
return conn.sendMessage(m.chat, { text: `${mssg.noresult}` }, { quoted: m })
}
await conn.sendMessage(m.chat, { image: imgBuffer, caption: null}, { quoted: m })
//await m.react('✅')
}

handler.command = ['timg'] 

export default handler
