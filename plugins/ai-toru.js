import axios from 'axios'
import fetch from 'node-fetch'
let handler = async (m, { conn, usedPrefix, command, text }) => {
if (!global.db.data.chats[m.chat].fAis && m.isGroup) {
return conn.sendMessage(m.chat, { text: `📍  Los comandos de *[ inteligencia artificial ]* estan desactivados...` }, { quoted: m })
}

if (!text) return conn.sendMessage(m.chat, { text: `¡Hola! ¿Quieres hablar? dime que quieres saber...` }, { quoted: m })
try {
let data = await fetch(`https://api.soymaycol.icu/ai-pukamind?q=${text}&apikey=soymaycol%3C3`)
let toru = await data.json()
if (!toru?.status || !toru?.result) return conn.sendMessage(m.chat, { text: `📍  La api no obtuvo respuestas, intentalo en un minuto...` }, { quoted: m })
await conn.sendMessage(m.chat, { text: toru.result }, { quoted: m })
} catch (error) {
conn.sendMessage(m.chat, { text: `${error.message}` }, { quoted: m })
}}

handler.command = ["toru"]
export default handler
 
 