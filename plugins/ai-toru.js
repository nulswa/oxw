import axios from 'axios'
import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix, command, text }) => {
const isQuotedImage = m.quoted && (m.quoted.msg || m.quoted).mimetype && (m.quoted.msg || m.quoted).mimetype.startsWith('image/')
const username = `${conn.getName(m.sender)}`
const basePrompt = `Tu nombre sera "Toru" una ia de genero masculino, haz sido creado por Farguts, tu comportamiento es algo serio respondiendo con menos respuesta o con mas respuestas dependiendo, tambien podras hablar a las personas por su nombre ( @${username} ) de ves en cuando.`
if (isQuotedImage) {
const q = m.quoted
const img = await q.download?.()
if (!img) {
console.error(`${mess.fallo}`)
return conn.sendMessage(m.chat, { text: `*[ @T O R U ]* no pudo descargar la imagen.` }, { quoted: m })

}

const content = `¿Que se observa en la imagen?`
try {
const imageAnalysis = await fetchImageBuffer(content, img)
const query = `Descríbeme la imagen y detalla por qué actúan así. También dime quién eres`
const prompt = `${basePrompt}. La imagen que se analiza es: ${imageAnalysis.result}`
const description = await luminsesi(query, username, prompt)
await conn.sendMessage(m.chat, { text: description }, { quoted: m })
//conn.reply(m.chat, description, m)
} catch {
//await m.react(error)
await conn.sendMessage(m.chat, { text: mess.fallo }, { quoted: m })
}
} else {
if (!text) { return conn.sendMessage(m.chat, { text: `${mess.example}\n*${usedPrefix + command}* Hola` }, { quoted: m })

}
await m.react("💬")
try {
const { key } = await conn.sendMessage(m.chat, {text: `Hmn...`}, {quoted: m})
const query = text
const prompt = `${basePrompt} Asi que responde lo siguiente en este mensaje, dime que dice: ${query}`
const response = await luminsesi(query, username, prompt)
await conn.sendMessage(m.chat, {text: response, edit: key})
} catch {
await conn.sendMessage(m.chat, { text: `${mess.noapi}` }, { quoted: m })
}}}

handler.command = ['toru']

export default handler

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Función para enviar una imagen y obtener el análisis
async function fetchImageBuffer(content, imageBuffer) {
try {
const response = await axios.post('https://Luminai.my.id', {
content: content,
imageBuffer: imageBuffer 
}, {
headers: {
'Content-Type': 'application/json' 
}})
return response.data
} catch (error) {
console.error('Error:', error)
throw error }}
// Función para interactuar con la IA usando prompts
async function luminsesi(q, username, logic) {
try {
const response = await axios.post("https://Luminai.my.id", {
content: q,
user: username,
prompt: logic,
webSearchMode: false
})
return response.data.result
} catch (error) {
console.error(`Error al obtener:`, error)
throw error }}


/*import axios from 'axios'
import fetch from 'node-fetch'
let handler = async (m, { conn, usedPrefix, command, text }) => {
if (!global.db.data.chats[m.chat].fAis && m.isGroup) {
return conn.sendMessage(m.chat, { text: `📍  Los comandos de *[ inteligencia artificial ]* estan desactivados...` }, { quoted: m })
}

if (!text) return conn.sendMessage(m.chat, { text: `${mess.example}\n*${usedPrefix + command}* Hola` }, { quoted: m })
try {
let data = await fetch(`https://api.soymaycol.icu/ai-pukamind?q=${text}&apikey=soymaycol%3C3`)
let toru = await data.json()
if (!toru?.status || !toru?.result) return conn.sendMessage(m.chat, { text: mssg.apino }, { quoted: m })
await conn.sendMessage(m.chat, { text: toru.result }, { quoted: m })
} catch (error) {
conn.sendMessage(m.chat, { text: `${error.message}` }, { quoted: m })
}}

handler.command = ["toru"]
export default handler
 */
 
