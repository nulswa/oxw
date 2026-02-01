import axios from 'axios'
import fetch from 'node-fetch'
let handler = async (m, { conn, usedPrefix, command, text }) => {
if (!global.db.data.chats[m.chat].fAis && m.isGroup) {
return conn.sendMessage(m.chat, { text: `📍  Los comandos de *[ inteligencia artificial ]* estan desactivados...` }, { quoted: m })
}

if (!text) return conn.sendMessage(m.chat, { text: `ᗢ Proporcione un texto para hablar con Venice AI.\n\n\t⚶ Por ejemplo:\n*${usedPrefix + command}* Como usar metodos de Hacking en facebook.` }, { quoted: m })
await m.react("⏰")
try {
let data = await fetch(`https://api.soymaycol.icu/ai-venice?q=${text}&apikey=soymaycol%3C3`)
let toru = await data.json()

if (!toru?.status || !toru?.result) {
return conn.sendMessage(m.chat, { text: `📍  La API no obtuvo respuestas, intentalo en un minuto...` }, { quoted: m })
}

await conn.sendMessage(m.chat, { text: toru.result }, { quoted: m })
//conn.sendMessage(m.chat, { image: { url: toru.url }, caption: `${botname}\n> ${textbot}` }, { quoted: m })
await m.react("✅")
} catch (error) {
conn.sendMessage(m.chat, { text: `${error.message}` }, { quoted: m })
}}

handler.command = ["venice"]
export default handler


