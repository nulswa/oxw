import { gotScraping } from 'got-scraping'
import { readFileSync } from 'fs'
import { extname, basename } from 'path'

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36'

const API_URL = 'https://aifreeforever.com/api/generate-ai-answer'

const HEADERS = {
'accept': 'application/json, text/plain, */*',
'accept-language': 'en-US,en;q=0.9',
'content-type': 'application/json',
'origin': 'https://aifreeforever.com',
'referer': 'https://aifreeforever.com/',
'sec-ch-ua': '"Not(A:Brand";v="8", "Chromium";v="144", "Google Chrome";v="144"',
'sec-ch-ua-mobile': '?0',
'sec-ch-ua-platform': '"Windows"',
'sec-fetch-dest': 'empty',
'sec-fetch-mode': 'cors',
'sec-fetch-site': 'same-origin',
'user-agent': UA
}

const MIME_TYPES = {
'.png': 'image/png',
'.jpg': 'image/jpeg',
'.jpeg': 'image/jpeg',
'.gif': 'image/gif',
'.webp': 'image/webp'
}


function extraerRespuesta(data) {
if (typeof data === 'string') return data
if (data.answer) return data.answer
if (data.response) return data.response
if (data.text) return data.text
if (data.content) return data.content
if (data.message) return data.message
return JSON.stringify(data, null, 2)
}

function prepararImagen(imagePath) {
const fileBuffer = readFileSync(imagePath)
const ext = extname(imagePath).toLowerCase()
return {
data: fileBuffer.toString('base64'),
type: MIME_TYPES[ext] || 'image/png',
name: basename(imagePath)
}
}


export async function aiPreguntar(pregunta, opciones = {}) {
const { tono = 'friendly', formato = 'paragraph', historial = [] } = opciones

const payload = {
question: pregunta,
tone: tono,
format: formato,
file: null,
conversationHistory: historial
}

const response = await gotScraping({
url: API_URL,
method: 'POST',
headers: HEADERS,
json: payload,
responseType: 'json',
http2: true,
timeout: { request: 60000 },
retry: { limit: 2 }
})

return {
respuesta: extraerRespuesta(response.body),
raw: response.body,
status: response.statusCode
}
}


export async function aiAnalizarImagen(imagePath, pregunta = '¿Qué ves en esta imagen?', opciones = {}) {
const { tono = 'friendly', formato = 'paragraph', historial = [] } = opciones

const payload = {
question: pregunta,
tone: tono,
format: formato,
file: prepararImagen(imagePath),
conversationHistory: historial
}

const response = await gotScraping({
url: API_URL,
method: 'POST',
headers: HEADERS,
json: payload,
responseType: 'json',
http2: true,
timeout: { request: 120000 },
retry: { limit: 2 }
})

return {
respuesta: extraerRespuesta(response.body),
raw: response.body,
status: response.statusCode
}
}


export async function aiAnalizarImagenBuffer(buffer, pregunta = '¿Qué ves en esta imagen?', opciones = {}) {
const { tono = 'friendly', formato = 'paragraph', historial = [], mimeType = 'image/jpeg', nombre = 'imagen.jpg' } = opciones

const payload = {
question: pregunta,
tone: tono,
format: formato,
file: {
data: buffer.toString('base64'),
type: mimeType,
name: nombre
},
conversationHistory: historial
}

const response = await gotScraping({
url: API_URL,
method: 'POST',
headers: HEADERS,
json: payload,
responseType: 'json',
http2: true,
timeout: { request: 120000 },
retry: { limit: 2 }
})

return {
respuesta: extraerRespuesta(response.body),
raw: response.body,
status: response.statusCode
}
}


export async function aiChat(historial, mensaje, opciones = {}) {
return aiPreguntar(mensaje, { ...opciones, historial })
}


let handler = async (m, { conn, text, usedPrefix, command }) => {
try {
const quoted = m.quoted ? m.quoted : m
const mime = (quoted.msg || quoted).mimetype || ''
const isImage = /image\/(png|jpe?g|gif|webp)/i.test(mime)

if (isImage) {
const pregunta = text || '¿Qué ves en esta imagen?'

await m.react("⏰")
//conn.reply(m.chat, '🔍 Analizando imagen...', m)

const buffer = await quoted.download()

if (!buffer || buffer.length < 100) {
return conn.sendMessage(m.chat, { text: `${emoji} No se pudo descargar la imagen...` }, { quoted: m })
}

const mimeType = mime.split(';')[0] || 'image/jpeg'
const ext = mimeType.split('/')[1] || 'jpg'

const resultado = await aiAnalizarImagenBuffer(buffer, pregunta, {
mimeType,
nombre: `imagen.${ext}`
})

if (!resultado.respuesta) {
return conn.sendMessage(m.chat, { text: `${emoji} No se pudo analizar la imagen...` }, { quoted: m })
}
await conn.sendMessage(m.chat, { text: `${resultado.respuesta}` }, { quoted: m })
return
}

if (!text) {
return conn.sendMessage(m.chat, { text: `${mess.example}\n*${usedPrefix + command}* ¿Que ves en esta imagen? <reply image>\n*${usedPrefix + command}* Hola, que tal?` }, { quoted: m })
}

await m.react("⏰")

const resultado = await aiPreguntar(text)

if (!resultado.respuesta) {
return conn.sendMessage(m.chat, { text: `${mess.fallo}` }, { quoted: m })
}

await conn.sendMessage(m.chat, { text: `${resultado.respuesta}`}, { quoted: m })

} catch (error) {
conn.sendMessage(m.chat, { text: `${error.message}` }, { quoted: m })
}
}

handler.tags = ['inteligencia']
handler.command = ["vix"]
export default handler

