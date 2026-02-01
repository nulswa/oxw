import fetch from 'node-fetch'

let handler = async (m, {conn, args, usedPrefix, command}) => {
if (!global.db.data.chats[m.chat].fDescargas && m.isGroup) {
return conn.sendMessage(m.chat, { text: `${mssg.nodesca}` }, { quoted: m })
}

let infoXd = `${mssg.ejemplo}\n*${usedPrefix + command}* https://www.mediafire.com/xxxx/xxxx`
if (!args[0]) return conn.sendMessage(m.chat, { text: infoXd }, { quoted: m })
const url = args[0]
if (!/^https?:\/\/(www\.)?mediafire\.com/i.test(url)) return conn.sendMessage(m.chat, { text: mssg.nolink }, { quoted: m })
await m.react('⏰')
try {
const api = `https://api.delirius.store/download/mediafire?url=${encodeURIComponent(url)}`
const res = await fetch(api)
if (!res.ok) conn.sendMessage(m.chat, { text: mssg.apino }, { quoted: m })
const json = await res.json()
const data = json?.data || json?.result || json
const fileUrl = data?.url || data?.link || data?.download || data?.dl || data?.download_url
const fileTitle = data?.title || data?.filename || data?.name || 'archivo'
const fileSize = data?.size || data?.filesize || 'Undefined'
const fileMime = data?.mime || data?.mimetype || 'application/octet-stream'
const thumbBot = Buffer.from(await (await fetch(`${global.toruImg}`)).arrayBuffer())
if (!fileUrl) throw new Error('[ !fileUrl ] error en la descarga...')
const caption = `· ┄ · ⊸ 𔓕 *${mssg.udesca}  :  Mediafire*

＃ *${mssg.titulos}* : ${fileTitle}
＃ *${mssg.peso}* : ${fileSize}
＃ *${mssg.paquete}* : ${fileMime}

> ${textbot}`.trim()
const thumb = Buffer.from(await (await fetch(`https://files.catbox.moe/293guw.jpg`)).arrayBuffer())
await conn.sendMessage(m.chat, { text: caption, mentions: [m.sender], contextInfo: { externalAdReply: { title: `⧿ Mediafire : ${mssg.udesca} ⧿`, body: botname, thumbnail: thumb, sourceUrl: null, mediaType: 1, renderLargerThumbnail: false }}}, { quoted: m })
conn.sendFile(m.chat, fileUrl, fileTitle, `${botname}\n> ${textbot}`, m, null, {mimetype: fileMime, asDocument: true})
//await m.react('✅')
} catch (e) {
await conn.sendMessage(m.chat, { text: `${e.message}` }, { quoted: m })
}
}

handler.command = ["mf", "mfire", "mediafire"]
export default handler
