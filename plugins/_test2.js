import fetch from "node-fetch"
import axios from "axios"
import yts from 'yt-search'

const CACHE_TIME = 1 * 60 * 1000 // 1 minutos
let playCache = {}

let handler = async (m, { conn, text, usedPrefix, command }) => {
if (!global.db.data.chats[m.chat].fSearch && m.isGroup) {
return conn.sendMessage(m.chat, { text: `*[ ⽷ ]*  Los comandos de *búsquedas* están desactivados...` }, { quoted: m })
}

const botJid = conn.user.jid
let settings = global.db.data.settings[botJid]

const botName = settings?.nameBot || global.botname
const botDesc = settings?.descBot || global.textbot

if (!text) {
return conn.sendMessage(m.chat, { text: `${mess.example}\n*${usedPrefix + command}* Golden Brown` }, { quoted: m })
}

try {
await m.react('⏰')

let videoData;

// Verificar si es un enlace de YouTube
if (/^(?:https?:\/\/)?(?:www\.|m\.|music\.)?youtu\.?be/.test(text)) {
// Es un enlace directo
const videoId = text.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([^&\n?#]+)/)?.[1]

if (!videoId) {
return conn.sendMessage(m.chat, { text: mess.unlink }, { quoted: m })
}

const searchResult = await yts({ videoId })
videoData = searchResult
} else {

const search = await yts(text)

if (!search.videos || search.videos.length === 0) {
return conn.sendMessage(m.chat, { text: mess.nosear }, { quoted: m })
}

videoData = search.videos[0]
}

let caption = `· ┄ · ⊸ 𔓕 *YouTube : Play*\n\n`
caption += `📹 *Título:* ${videoData.title}\n`
caption += `👤 *Autor:* ${videoData.author.name}\n`
caption += `⏱️ *Duración:* ${videoData.timestamp}\n`
caption += `👁️ *Vistas:* ${videoData.views.toLocaleString()}\n`
caption += `📅 *Publicado:* ${videoData.ago}\n`
caption += `🔗 *URL:* ${videoData.url}\n\n`
caption += `━━━━━━━━━━━━━━━━━━━\n\n`
caption += `📍 *Selecciona el formato respondiendo con:*\n\n`
caption += `1️⃣ *Audio* - Descarga en audio MP3\n`
caption += `2️⃣ *Video* - Descarga en video MP4\n`
caption += `3️⃣ *Audio-doc* - Audio como documento\n`
caption += `4️⃣ *Video-doc* - Video como documento\n\n`
caption += `⏰ *Expira en:* 3 minutos\n\n`
caption += `> ${botDesc}`

const thumbnail = videoData.thumbnail || videoData.image

let mensajeEnviado;

if (thumbnail) {
const thumbData = (await conn.getFile(thumbnail))?.data
mensajeEnviado = await conn.sendMessage(m.chat, { 
text: caption, 
mentions: [m.sender], 
contextInfo: { 
externalAdReply: { 
title: "⧿ YouTube : Play ⧿", 
body: botName, 
thumbnail: thumbData, 
sourceUrl: videoData.url, 
mediaType: 1, 
renderLargerThumbnail: true 
}
}
}, { quoted: m })
} else {
mensajeEnviado = await conn.sendMessage(m.chat, { text: caption }, { quoted: m })
}

// Guardar en caché
const messageId = mensajeEnviado.key.id

playCache[messageId] = { 
videoData: videoData,
timestamp: Date.now(),
chat: m.chat,
activo: true,
expirado: false
}

// Timer de 3 minutos
setTimeout(() => {
if (playCache[messageId] && playCache[messageId].activo && !playCache[messageId].expirado) {
playCache[messageId].expirado = true
playCache[messageId].activo = false

conn.sendMessage(m.chat, { text: `⏰La búsqueda de YouTube ha expirado.\n- Usa *[ ${usedPrefix + command} ]* para buscar de nuevo.` })

setTimeout(() => {
delete playCache[messageId]
}, 10000)
}
}, CACHE_TIME)

await m.react('✅')

} catch (error) {
console.error('Error en play:', error)
await conn.sendMessage(m.chat, { text: `❌ Error: ${error.message}` }, { quoted: m })
}
}

handler.before = async (m, { conn, usedPrefix }) => {
if (!m.text) return false
if (m.isBaileys) return false
if (!m.quoted) return false
if (!m.quoted.fromMe) return false

const messageId = m.quoted.id
const searchCache = playCache[messageId]

if (!searchCache) return false

if (searchCache.expirado || !searchCache.activo) {
if (!searchCache.mensajeMostrado) {
searchCache.mensajeMostrado = true
await conn.sendMessage(m.chat, { text: `⏰La búsqueda ha expirado.\n\n> Vuelve a usar el comando de búsqueda.` }, { quoted: m })
}
return true
}

const input = m.text.trim().toLowerCase()
let formato = null
let asDoc = false

// Detectar formato
if (input === '1' || input === 'audio') {
formato = 'audio'
asDoc = false
} else if (input === '2' || input === 'video') {
formato = 'video'
asDoc = false
} else if (input === '3' || input === 'audio-doc' || input === 'audiodoc') {
formato = 'audio'
asDoc = true
} else if (input === '4' || input === 'video-doc' || input === 'videodoc') {
formato = 'video'
asDoc = true
} else {
return false
}

const videoData = searchCache.videoData
const botName = global.botname
const botDesc = global.textbot

try {
await m.react('⏰')

let apiURL, mimeType, fileExt, tipoTexto;

if (formato === 'audio') {
apiURL = `https://sylphy.xyz/download/v2/ytmp3?url=${encodeURIComponent(videoData.url)}&api_key=sylphy-c0ZDE6V`
mimeType = 'audio/mpeg'
fileExt = 'mp3'
tipoTexto = 'Audio (MP3)'
} else {
apiURL = `https://sylphy.xyz/download/ytmp4?url=${encodeURIComponent(videoData.url)}&api_key=sylphy-c0ZDE6V`
mimeType = 'video/mp4'
fileExt = 'mp4'
tipoTexto = 'Video (MP4)'
}

let data = await tryAPI(apiURL)

if (!data?.status || !data?.result?.dl_url) {
return conn.sendMessage(m.chat, { text: mess.noapi }, { quoted: m })
}

const { title, dl_url } = data.result
const cleanTitle = title.replace(/[^\w\s]/gi, '').trim().replace(/\s+/g, '_')
const fileName = `${cleanTitle}.${fileExt}`

// Obtener tamaño del archivo
let head = await fetch(dl_url, { method: "HEAD" })
let fileSize = head.headers.get("content-length") || 0
let fileSizeMB = (fileSize / (1024 * 1024)).toFixed(2)

let infoMsg = `· ┄ · ⊸ 𔓕 *YouTube : Download*\n\n`
infoMsg += `📹 ${title}\n\n`
infoMsg += `\t＃ *Fuente* : YouTube\n`
infoMsg += `\t＃ *Tipo* : ${tipoTexto}\n`
infoMsg += `\t＃ *Tamaño* : ${fileSizeMB} MB\n`
infoMsg += asDoc ? `\t＃ *Formato* : Documento\n` : ''
infoMsg += `\n⏳ Descargando...\n\n`
infoMsg += `> ${botDesc}`

const thumbMp = Buffer.from(await (await fetch(`https://raw.githubusercontent.com/nulswa/files/main/icons/icon-youtube.jpg`)).arrayBuffer())

await conn.sendMessage(m.chat, { 
text: infoMsg, 
mentions: [m.sender], 
contextInfo: { 
externalAdReply: { 
title: `⧿ YouTube : ${formato.toUpperCase()} ⧿`, 
body: botName, 
thumbnail: thumbMp, 
sourceUrl: null, 
mediaType: 1, 
renderLargerThumbnail: false 
}
}
}, { quoted: m })

const caption = `${botName}\n> ${botDesc}`

// Enviar según el formato y si es documento o no
if (asDoc) {
// Enviar como documento
await conn.sendMessage(m.chat, { 
document: { url: dl_url }, 
mimetype: mimeType, 
fileName: fileName, 
caption: `${caption}\n\n📍 Enviado como documento` 
}, { quoted: m })
} else {
// Enviar como audio o video normal
if (formato === 'audio') {
if (fileSizeMB >= 10) {
await conn.sendMessage(m.chat, { 
document: { url: dl_url }, 
mimetype: mimeType, 
fileName: fileName, 
caption: `${caption}\n\n📍 Enviado como documento por exceder 10MB` 
}, { quoted: m })
} else {
await conn.sendMessage(m.chat, { 
audio: { url: dl_url }, 
mimetype: mimeType, 
fileName: fileName 
}, { quoted: m })
}
} else {
if (fileSizeMB >= 10) {
await conn.sendMessage(m.chat, { 
document: { url: dl_url }, 
mimetype: mimeType, 
fileName: fileName, 
caption: `${caption}\n\n📍 Enviado como documento por exceder 10MB` 
}, { quoted: m })
} else {
await conn.sendMessage(m.chat, { 
video: { url: dl_url }, 
mimetype: mimeType, 
fileName: fileName 
}, { quoted: m })
}
}
}

await m.react('✅')

} catch (error) {
console.error('Error al descargar:', error)
await conn.sendMessage(m.chat, { text: `❌ Error al descargar: ${error.message}` }, { quoted: m })
}

return true
}

handler.command = ['play', 'yt', 'ytplay']
handler.tags = ["descargas"]
export default handler

async function tryAPI(url) {
try {
const res = await fetch(url)
const data = await res.json()
if (data?.status) return data
} catch {}
try {
const res = await fetch(url)
return await res.json()
} catch {
return null
}
}

async function formatSize(bytes) {
const units = ['B', 'KB', 'MB', 'GB']
let i = 0
if (!bytes || isNaN(bytes)) return 'Desconocido'
while (bytes >= 1024 && i < units.length - 1) {
bytes /= 1024
i++
}
return `${bytes.toFixed(2)} ${units[i]}`
}

async function getSize(url) {
try {
const res = await axios.head(url)
const length = res.headers['content-length']
return length ? parseInt(length, 10) : null
} catch {
return null
}
}
