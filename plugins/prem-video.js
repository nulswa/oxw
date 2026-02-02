import axios from 'axios'
import fetch from 'node-fetch'
let handler = async (m, { conn, usedPrefix, command, text }) => {
if (!global.db.data.chats[m.chat].fPremium && m.isGroup) {
return conn.sendMessage(m.chat, { text: `📍  Lo siento, este comando solo se utiliza al comprar un plan con premium incluído.\n\n- Usa el comando *#plan* para ver los planes disponibles.` }, { quoted: m })
}

if (!text) return conn.sendMessage(m.chat, { text: `${mess.example}\n*${usedPrefix + command}* Gato durmiendo en una cama cómodamente.` }, { quoted: m })
await conn.sendMessage(m.chat, { text: "Generando el video, espere 2-3 minutos..." }, { quoted: m })
try {
let data = await fetch(`https://api.soymaycol.icu/ai-pixverse?q=${text}&apikey=soymaycol%3C3`)
let toru = await data.json()

if (!toru?.status || !toru?.video) {
return conn.sendMessage(m.chat, { text: mess.apino }, { quoted: m })
}

await conn.sendMessage(m.chat, { video: { url: toru.video }, caption: `${botname}\n> ${textbot}` }, { quoted: m })
//await m.react("✅")
} catch (error) {
conn.sendMessage(m.chat, { text: `${error.message}` }, { quoted: m })
}}

handler.command = ["aivid"]
export default handler
  