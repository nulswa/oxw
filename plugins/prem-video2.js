import fetch from 'node-fetch'
import axios from 'axios'

let handler = async (m, {conn, args, text, usedPrefix, command}) => {
if (!global.db.data.chats[m.chat].fPrem && m.isGroup) {
return conn.sendMessage(m.chat, { text: `📍  Lo siento, este comando solo se utiliza al comprar un plan con premium incluído.\n\n- Usa el comando *#plan* para ver los planes disponibles.` }, { quoted: m })
}

if (!text) return conn.sendMessage(m.chat, { text: `ᗢ Proporcione un texto para generar un video.\n\n\t⚶ Por ejemplo:\n*${usedPrefix + command}* Haz una caja con un gato dentro dormido y cómodo.` }, { quoted: m })
try {
await m.react('⏰')
await conn.sendMessage(m.chat, { text: `Generando el video, espere 2-3 minutos...` }, { quoted: m })
const taskRes = await fetch(`https://api.soymaycol.icu/ai-qwen-task?q=${encodeURIComponent(text)}&apikey=soymaycol%3C3`)
const taskJson = await taskRes.json()
if (!taskJson?.status || !taskJson?.check_url) {
throw new Error('📍  task_failed...')
}
const checkUrl = taskJson.check_url
let resultUrl = null
for (let i = 0; i < 90; i++) {
await new Promise(r => setTimeout(r, 2000))
const checkRes = await fetch(checkUrl)
const checkJson = await checkRes.json()
if (checkJson?.status && checkJson?.state === 'success' && checkJson?.result?.original_url) {
resultUrl = checkJson.result.original_url
break
}
if (!checkJson?.status) {
throw new Error('📍  process_failed...')
}
}
if (!resultUrl) {
throw new Error('📍  timeout...')
}
const videoRes = await axios.get(resultUrl, { responseType: 'arraybuffer' })
await conn.sendMessage(m.chat, { video: Buffer.from(videoRes.data), caption: `${botname}\n> ${textbot}` }, { quoted: m })
await m.react('✅')
} catch (e) {
await conn.sendMessage(m.chat, { text: `${e.message}` }, { quoted: m })
}
}

handler.command = ["aivid2"]
export default handler


