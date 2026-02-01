import fetch from 'node-fetch'
let handler = async (m, { conn, args, text, usedPrefix, command }) => {
if (!global.db.data.chats[m.chat].fInformation && m.isGroup) {
return conn.sendMessage(m.chat, { text: `📍  Los comandos de *[ información ]* estan desactivados...` }, { quoted: m })
}

const thumb = Buffer.from(await (await fetch(`https://files.catbox.moe/xupnrf.jpg`)).arrayBuffer())
let anuncios = `${global.anuncios}`
await conn.sendMessage(m.chat, { text: anuncios, mentions: [m.sender], contextInfo: { externalAdReply: { title: "〩 ANUNCIOS 〩", body: botname, thumbnail: thumb, sourceUrl: null, mediaType: 1, renderLargerThumbnail: false }}}, { quoted: m })
//conn.sendMessage(m.chat, { text: `` }, { quoted: m })
}
handler.command = ['anuncios', 'ads']
export default handler
