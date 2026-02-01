import axios from 'axios'
import fetch from 'node-fetch'
let handler = async (m, { conn, usedPrefix, command, text }) => {
if (!global.db.data.chats[m.chat].fPremium && m.isGroup) {
return conn.sendMessage(m.chat, { text: `📍  Lo siento, este comando solo se utiliza al comprar un plan con premium incluído.\n\n- Usa el comando *#plan* para ver los planes disponibles.` }, { quoted: m })
}

if (!text) return client.sendMessage(m.chat, { text: mess.example + `\n*${usedPrefix + command}* Un caballo con sombrero.` }, { quoted: m })
await m.react("⏰")
try {
let data = await fetch(`https://api.soymaycol.icu/ai-image?q=Imagina+${text}&apikey=soymaycol%3C3`)
let toru = await data.json()

if (!toru?.status || !toru?.url) {
return conn.sendMessage(m.chat, { text: `📍  La api no obtuvo respuestas, intentalo en un minuto...` }, { quoted: m })
}

await conn.sendMessage(m.chat, { image: { url: toru.url }, caption: `${botname}\n> ${textbot}` }, { quoted: m })
//await m.react("✅")
} catch (error) {
conn.sendMessage(m.chat, { text: `${error.message}` }, { quoted: m })
}}

handler.command = ["txtimg"]
export default handler
  
