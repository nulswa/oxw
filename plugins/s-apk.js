import { search, download } from 'aptoide-scraper'
import fetch from 'node-fetch'

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
caption += `⩩ *Peso* : APK\n\n`
}

caption += `⏰ *Expira en:* 3 minutos\n\n`
caption += `> ${botDesc}`

const thumbnail = "https://raw.githubusercontent.com/nulswa/files/main/icons/icon-file.jpg"

let mensajeEnviado;

if (thumbnail) {
const thumbData = Buffer.from(await (await fetch(`${thumbnail}`)).arrayBuffer()) //(await conn.getFile(thumbnail))?.data
mensajeEnviado = await conn.sendMessage(m.chat, { text: caption, mentions: [m.sender], contextInfo: { externalAdReply: { title: "⧿ Apk : Search ⧿", body: botName, thumbnail: thumbData, sourceUrl: null, mediaType: 1, renderLargerThumbnail: false }}}, { quoted: m })
} else {
mensajeEnviado = await conn.sendMessage(m.chat, { text: caption }, { quoted: m })
}

const messageId = mensajeEnviado.key.id

apkCache[messageId] = { 
results: limitedResults, 
timestamp: Date.now(),
chat: m.chat,
activo: true,
expirado: false,
usuariosDescargados: {}
}

setTimeout(() => {
if (apkCache[messageId] && apkCache[messageId].activo && !apkCache[messageId].expirado) {
apkCache[messageId].expirado = true
apkCache[messageId].activo = false

//Na mas avisar por las dudas :v
conn.sendMessage(m.chat, { text: `⏰ La búsqueda de APK ha expirado.\n- Usa *[ ${usedPrefix + command} ]* para buscar de nuevo.` })

setTimeout(() => {
delete apkCache[messageId]
}, 10000)
}
}, CACHE_TIME)

await m.react('✅')

} catch (error) {
console.error('Error en búsqueda de APK:', error)
await conn.sendMessage(m.chat, { text: `${error.message}` }, { quoted: m })
}
}

handler.before = async (m, { conn, usedPrefix }) => {

const botJids = conn.user.jid
let tarus = global.db.data.settings[botJids]

const botWa = tarus?.nameBot || global.botname
const botWe = tarus?.descBot || global.textbot

if (!m.text) return false
if (m.isBaileys) return false
if (!m.quoted) return false

if (!m.quoted.fromMe) return false

const match = m.text.trim().match(/^(\d{1,2})$/i)
if (!match) return false

const index = parseInt(match[1]) - 1
const userId = m.sender

const messageId = m.quoted.id

const searchCache = apkCache[messageId]

if (!searchCache) return false

if (searchCache.expirado || !searchCache.activo) {
if (!searchCache.mensajeMostrado) {
searchCache.mensajeMostrado = true
await conn.sendMessage(m.chat, { text: `⏰ La búsqueda ha expirado.\n> Vuelve a usar el comando de búsqueda.` }, { quoted: m })
}
return true
}

if (!searchCache.results[index]) {
await conn.sendMessage(m.chat, { text: `📍 Número inválido. Elige un número entre 1 y ${searchCache.results.length}.` }, { quoted: m })
return true
}

const app = searchCache.results[index]

try {
await m.react('⏰')

const data = await download(app.id)

if (!data || !data.dllink) {
return conn.sendMessage(m.chat, { text: mess.nosear }, { quoted: m })
}

const sizeText = data.size || 'Undefined...'
const sizeInMB = parseFloat(sizeText.replace(/[^0-9.]/g, ''))
const isGB = sizeText.includes('GB')

if (isGB || sizeInMB > MAX_FILE_SIZE_MB) {
await m.react("💾")
let esPesado = `📍 El apk *(${data.name})* pesa mas de *${data.size}MB*.\n- Desafortunadamente no podra ser enviado...

• Limite máximo » *${MAX_FILE_SIZE_MB}MB*`
return await conn.sendMessage(m.chat, { text: esPesado }, { quoted: m })
}

// Enviar información de la APK
let apkInfo = `· ┄ · ⊸ 𔓕 *Apk : Download*\n\n`
apkInfo += `> ${data.name}\n\n`
apkInfo += `⩩ *Publicado* : ${data.lastup}\n`
apkInfo += `⩩ *Peso* : ${data.size}\n`
apkInfo += `⩩ *Paquete* : ${data.package}\n\n`
apkInfo += `> ${botWe}`

const thumb = data.icon ? (await conn.getFile(data.icon))?.data : null

if (thumb) {
await conn.sendMessage(m.chat, { text: apkInfo, mentions: [m.sender], contextInfo: { externalAdReply: { title: "⧿ Apk : Download ⧿", body: "Descargando archivo...", thumbnail: thumb, sourceUrl: null, mediaType: 1, renderLargerThumbnail: false }}}, { quoted: m })
} else {
await conn.sendMessage(m.chat, { text: apkInfo }, { quoted: m })
}

await conn.sendMessage(m.chat, { document: { url: data.dllink }, mimetype: 'application/vnd.android.package-archive', fileName: `${data.name}.apk`, caption: `${mess.succs}\n\n⽷ *Nombre* » ${data.name}\n⽷ *Peso* » ${data.size}` }, { quoted: m })
await m.react('✅')

if (!searchCache.usuariosDescargados[userId]) {
searchCache.usuariosDescargados[userId] = []
}
searchCache.usuariosDescargados[userId].push(index)

} catch (error) {
console.error('Error al descargar APK:', error)
await conn.sendMessage(m.chat, { text: `${error.message}` }, { quoted: m })
}

return true
}

handler.command = ['apk', 'app', 'apks']
handler.tags = ["busquedas"]
export default handler


/*import { search, download } from 'aptoide-scraper'
var handler = async (m, { conn, usedPrefix, command, text }) => {
if (!global.db.data.chats[m.chat].fSearch && m.isGroup) {
return conn.sendMessage(m.chat, { text: `*[ ⽷ ]*  Los comandos de *búsquedas* estan desactivados...` }, { quoted: m })
}

if (!text) return conn.sendMessage(m.chat, { text: `${mess.example}\n*${usedPrefix + command}* WhatsApp` }, { quoted: m })
try {
await m.react("⏰")
let searchA = await search(text)
let data5 = await download(searchA[0].id)
let apkResultado = `· ┄ · ⊸ 𔓕 *Apk  :  Search*

> ${data5.name}
⩩ *Publicado* : ${data5.lastup}
⩩ *Peso* : ${data5.size}
⩩ *Paquete* : ${data5.package}

> ${textbot}`
const thumb = (await conn.getFile(data5.icon))?.data
await conn.sendMessage(m.chat, { text: apkResultado, mentions: [m.sender], contextInfo: { externalAdReply: { title: "⧿ Apk : Search ⧿", body: botname, thumbnail: thumb, sourceUrl: null, mediaType: 1, renderLargerThumbnail: false }}}, { quoted: m })
if (data5.size.includes('GB') || data5.size.replace(' MB', '') > 200) {
await m.react("💾")
return await conn.sendMessage(m.chat, { text: `El archivo es demasiado pesado para descargar.\n- El limite maximo de descarga es de 200MB.` }, { quoted: m })
}
await conn.sendMessage(m.chat, { document: { url: data5.dllink }, mimetype: 'application/vnd.android.package-archive', fileName: data5.name + '.apk', caption: null }, { quoted: m })
//await m.react("✅")
} catch (error) {
await conn.sendMessage(m.chat, { text: `${error.message}` }, { quoted: m })
}}
handler.command = ['apk', 'app']
handler.tags = ["busquedas"]
export default handler*/

