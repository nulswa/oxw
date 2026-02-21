import { search, download } from 'aptoide-scraper'

const MAX_FILE_SIZE_MB = 150
const CACHE_TIME = 3 * 60 * 1000 // 3 minutos
let apkCache = {}

var handler = async (m, { conn, usedPrefix, command, text }) => {
if (!global.db.data.chats[m.chat].fSearch && m.isGroup) {
return conn.sendMessage(m.chat, { text: `*[ ⽷ ]*Los comandos de *búsquedas* están desactivados...` }, { quoted: m })
}

const botJid = conn.user.jid
let settings = global.db.data.settings[botJid]

const botName = settings?.nameBot || global.botname
const botDesc = settings?.descBot || global.textbot
const botImg = settings?.imgBot || global.toruImg
const botMenu = settings?.menuBot || global.toruMenu

if (!text) {
return conn.sendMessage(m.chat, { text: `${mess.example}\n*${usedPrefix + command}* WhatsApp` }, { quoted: m })
}

try {
await m.react('⏰')

const results = await search(text)

if (!results || results.length === 0) {
return conn.sendMessage(m.chat, { text: mess.nosear }, { quoted: m })
}

// Limitar a 10 resultados
const limitedResults = results.slice(0, 10)

let caption = `· ┄ · ⊸ 𔓕 *Apk : Search*\n\n`
caption += `\t❒ *Búsqueda* : ${text}\n`
caption += `\t❒ *Resultados* : *${limitedResults.length}* aplicaciones\n`
caption += `\t❒ *Fuente* : Aptoide\n\n📍Responda a este mensaje con el número correspondiente.\n\n\n`

for (let i = 0; i < limitedResults.length; i++) {
const app = limitedResults[i]
caption += `> *${i + 1}* » ${app.name}\n`
caption += `⩩ *ID* : ${app.id}\n`
caption += `⩩ *Paquete* : ${app.package || 'N/A'}\n\n\n`
}

caption += `⏰ *Expira en:* 3 minutos\n\n`
caption += `> ${botDesc}`

const thumbnail = limitedResults[0].icon || null

let mensajeEnviado;

if (thumbnail) {
const thumbData = (await conn.getFile(thumbnail))?.data
mensajeEnviado = await conn.sendMessage(m.chat, { 
text: caption, 
mentions: [m.sender], 
contextInfo: { 
externalAdReply: { 
title: "⧿ Apk : Search ⧿", 
body: botName, 
thumbnail: thumbData, 
sourceUrl: null, 
mediaType: 1, 
renderLargerThumbnail: false 
}
}
}, { quoted: m })
} else {
mensajeEnviado = await conn.sendMessage(m.chat, { text: caption }, { quoted: m })
}

// Guardar en caché con el ID del mensaje
const messageId = mensajeEnviado.key.id

apkCache[messageId] = { 
results: limitedResults, 
timestamp: Date.now(),
chat: m.chat,
activo: true,
expirado: false,
usuariosDescargados: {}
}

// Timer de 3 minutos
setTimeout(() => {
if (apkCache[messageId] && apkCache[messageId].activo && !apkCache[messageId].expirado) {
apkCache[messageId].expirado = true
apkCache[messageId].activo = false

conn.sendMessage(m.chat, { text: `⏰ La búsqueda de APK ha expirado.\n- Usa *[ ${usedPrefix + command} ]* para buscar de nuevo.` })

// Limpiar después de 10 segundos
setTimeout(() => {
delete apkCache[messageId]
}, 10000)
}
}, CACHE_TIME)

await m.react('✅')

} catch (error) {
console.error('Error en búsqueda de APK:', error)
await conn.sendMessage(m.chat, { text: `❌ Error: ${error.message}` }, { quoted: m })
}
}

handler.before = async (m, { conn, usedPrefix }) => {
if (!m.text) return false
if (m.isBaileys) return false
if (!m.quoted) return false

// Verificar que esté citando un mensaje del bot
if (!m.quoted.fromMe) return false

// Detectar si el mensaje es solo un número del 1 al 10
const match = m.text.trim().match(/^(\d{1,2})$/i)
if (!match) return false

const index = parseInt(match[1]) - 1
const userId = m.sender

// Obtener el messageId del mensaje citado
const messageId = m.quoted.id

// Verificar si existe en el caché de APK
const searchCache = apkCache[messageId]

// Si no existe en el caché de APK, ignorar
if (!searchCache) return false

// Verificar si ya expiró
if (searchCache.expirado || !searchCache.activo) {
if (!searchCache.mensajeMostrado) {
searchCache.mensajeMostrado = true
await conn.sendMessage(m.chat, { text: `⏰ La búsqueda ha expirado.\n\n> Vuelve a usar el comando de búsqueda.` }, { quoted: m })
}
return true
}

// Verificar que el índice sea válido
if (!searchCache.results[index]) {
await conn.sendMessage(m.chat, { text: `📍 Número inválido. Elige un número entre 1 y ${searchCache.results.length}.` }, { quoted: m })
return true
}

const app = searchCache.results[index]

try {
await m.react('⏰')

// Descargar información completa de la APK
const data = await download(app.id)

if (!data || !data.dllink) {
return conn.sendMessage(m.chat, { text: mess.nosear }, { quoted: m })
}

// Verificar tamaño
const sizeText = data.size || '0 MB'
const sizeInMB = parseFloat(sizeText.replace(/[^0-9.]/g, ''))
const isGB = sizeText.includes('GB')

if (isGB || sizeInMB > MAX_FILE_SIZE_MB) {
await m.react("💾")
return await conn.sendMessage(m.chat, { 
text: `❌ *Archivo demasiado pesado*\n\n📦 Aplicación: ${data.name}\n💾 Tamaño: ${data.size}\n⚠️ Límite máximo: ${MAX_FILE_SIZE_MB}MB\n\n_No se puede descargar archivos mayores a ${MAX_FILE_SIZE_MB}MB_` 
}, { quoted: m })
}

// Enviar información de la APK
let apkInfo = `· ┄ · ⊸ 𔓕 *Apk : Download*\n\n`
apkInfo += `> ${data.name}\n\n`
apkInfo += `⩩ *Publicado* : ${data.lastup}\n`
apkInfo += `⩩ *Peso* : ${data.size}\n`
apkInfo += `⩩ *Paquete* : ${data.package}\n\n`
apkInfo += `⏳ Descargando...`

const thumb = data.icon ? (await conn.getFile(data.icon))?.data : null

if (thumb) {
await conn.sendMessage(m.chat, { 
text: apkInfo, 
mentions: [m.sender], 
contextInfo: { 
externalAdReply: { 
title: "⧿ Apk : Download ⧿", 
body: "Descargando archivo...", 
thumbnail: thumb, 
sourceUrl: null, 
mediaType: 1, 
renderLargerThumbnail: false 
}
}
}, { quoted: m })
} else {
await conn.sendMessage(m.chat, { text: apkInfo }, { quoted: m })
}

// Descargar y enviar APK
await conn.sendMessage(m.chat, { 
document: { url: data.dllink }, 
mimetype: 'application/vnd.android.package-archive', 
fileName: `${data.name}.apk`, 
caption: `✅ *Descarga completada*\n\n📦 ${data.name}\n💾 ${data.size}` 
}, { quoted: m })

await m.react('✅')

// Registrar descarga
if (!searchCache.usuariosDescargados[userId]) {
searchCache.usuariosDescargados[userId] = []
}
searchCache.usuariosDescargados[userId].push(index)

} catch (error) {
console.error('Error al descargar APK:', error)
await conn.sendMessage(m.chat, { text: `❌ Error al descargar: ${error.message}` }, { quoted: m })
}

return true
}

handler.command = ['apk', 'app', 'apks']
//handler.tags = ["busquedas"]
export default handler
