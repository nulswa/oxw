import axios from 'axios'
import fetch from 'node-fetch'
let handler = async (m, { conn, usedPrefix, command, text }) => {
if (!global.db.data.chats[m.chat].fAis && m.isGroup) {
return conn.sendMessage(m.chat, { text: `*[ ⽷ ]*  Los comandos de *inteligencia artificial* estan desactivados...` }, { quoted: m })
}

if (!text) return client.sendMessage(m.chat, { text: `${mess.example}\n*${usedPrefix + command}* Haz un codigo de html basico de hola mundo.` }, { quoted: m })
await m.react("⏰")
try {
let data = await fetch(`https://api.soymaycol.icu/ai-codestral?q=${text}&apikey=soymaycol%3C3`)
let toru = await data.json()

if (!toru?.status || !toru?.result) {
return conn.sendMessage(m.chat, { text: mess.noapi }, { quoted: m })
}

await conn.sendMessage(m.chat, { text: toru.result }, { quoted: m })
} catch (error) {
conn.sendMessage(m.chat, { text: `${error.message}` }, { quoted: m })
}}

handler.command = ["codex"]
handler.tags = ["inteligencia"]
export default handler

  
