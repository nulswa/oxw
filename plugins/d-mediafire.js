import fetch from 'node-fetch'

let handler = async (m, {conn, args, usedPrefix, command}) => {
if (!global.db.data.chats[m.chat].fDescargas && m.isGroup) {
return conn.sendMessage(m.chat, { text: `📍  Los comandos de *[ descargas ]* estan desactivados...` }, { quoted: m })
}
  
if (!args[0]) return conn.sendMessage(m.chat, { text: `${mess.example}\n*${usedPrefix + command}*  https://www.mediafire.com/file/ejemplo/file.zip` }, { quoted: m })

// Validar URL de MediaFire
const url = args[0]
if (!/^https?:\/\/(www\.)?mediafire\.com/i.test(url)) {
return conn.sendMessage(m.chat, { text: `${mess.unlink}` }, { quoted: m })
}

await m.react('⏰')

try {
const api = `https://api.delirius.store/download/mediafire?url=${encodeURIComponent(url)}`
const res = await fetch(api)
if (!res.ok) throw new Error(`${mess.noapi}`)

const json = await res.json()

// Normalizar posibles formatos de respuesta
const data = json?.data || json?.result || json

// Campos típicos que puede devolver la API
const fileUrl = data?.url || data?.link || data?.download || data?.dl || data?.download_url
const fileTitle = data?.title || data?.filename || data?.name || 'archivo'
const fileSize = data?.size || data?.filesize || 'Desconocido'
const fileMime = data?.mime || data?.mimetype || 'application/octet-stream'

if (!fileUrl) throw new Error('No se pudo obtener el enlace de descarga.')

const caption = `· ┄ · ⊸ 𔓕 *Mediafire : Download *

\t＃ *Titulo* : ${fileTitle}
\t＃ *Peso* : ${fileSize}
\t＃ *Paquete* : ${fileMime}
\t＃ *Fuente* : Mediafire

> ${textbot}`.trim()
const thumb = Buffer.from(await (await fetch(`https://files.catbox.moe/293guw.jpg`)).arrayBuffer())
await conn.sendMessage(m.chat, { text: caption, mentions: [m.sender], contextInfo: { externalAdReply: { title: `⧿ Mediafire : Download ⧿`, body: botname, thumbnail: thumb, sourceUrl: null, mediaType: 1, renderLargerThumbnail: false }}}, { quoted: m })
await conn.sendFile(m.chat, fileUrl, fileTitle, caption, m, null, {mimetype: fileMime, asDocument: true})
} catch (e) {
console.error('❌ Error en mediafire:', e)
conn.sendMessage(m.chat, { text: e.message }, { quoted: m })
}
}

handler.command = ["mediafire", "mf"]
export default handler

