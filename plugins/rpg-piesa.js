import fetch from 'node-fetch'
let handler = async (m, { conn, usedPrefix, command }) => {
if (!global.db.data.chats[m.chat].fRpg && m.isGroup) {
return conn.sendMessage(m.chat, { text: `*[ ⽷ ]*  Los comandos de *RPG* estan desactivados...` }, { quoted: m })
}

const thumbNo = Buffer.from(await (await fetch(`https://files.catbox.moe/9rldx2.jpg`)).arrayBuffer())
let user = global.db.data.users[m.sender]
if (user.torupiesa >= 30) {

const piesaImagen = [
"https://files.catbox.moe/hky7eb.jpg", "https://files.catbox.moe/v9ntjs.jpg", 
"https://files.catbox.moe/qj9hje.jpg", "https://files.catbox.moe/ucw1hj.jpg", 
"https://files.catbox.moe/v852yh.jpeg", "https://files.catbox.moe/wezfzz.jpg", 
"https://files.catbox.moe/bi7d3g.jpg"
]

user.torucoin = user.torucoin || 0
user.toruexp = user.toruexp || 0
user.llaves = user.llaves || 0
user.boletos = user.boletos || 0
 
let ganado = Math.floor(Math.random() * 20) 
let ganado2 = Math.floor(Math.random() * 150) 
let ganado3 = Math.floor(Math.random() * 1) 
let ganado4 = Math.floor(Math.random() * 900) 
user.torucoin += ganado
user.toruexp += ganado2
user.llaves += ganado3
user.boletos += ganado4

let piesaXd = `✦ *¡Has armado una piesa!* Aqui tienes tu recompensa.

*${currency}* » +${ganado.toLocaleString()}
*${currency2}* » +${ganado2.toLocaleString()}
*Boletos* » +${ganado4.toLocaleString()}
*Llaves* » +${ganado5.toLocaleString()}

> 🧩 _Reune mas piesas para ganar mas recompensas._`

user.torupiesa -= 30
await m.react("🧩")
let thumb = piesaImagen[Math.floor(Math.random() * piesaImagen.length)];
await conn.sendMessage(m.chat, { image: { url: thumb }, caption: piesaXd }, { quoted: m })
} else {
let noXd = `Solo tienes *[ 🧩 ${user.torupiesa} piesas ]* en tu inventario.\n- Reune *🧩 30 piesas* para revelar una imagen y obtener una recompensa.`
return conn.sendMessage(m.chat, { text: noXd }, { quoted: m })
 }
}

handler.command = ['revelar', 'piesas']
handler.tags = ["rpg"]
handler.group = true

export default handler

function formatTime(totalSec) {
const h = Math.floor(totalSec / 3600)
const m = Math.floor((totalSec % 3600) / 60)
const s = totalSec % 60
const txt = []
if (h > 0) txt.push(`${h} hora${h !== 1 ? 's' : ''}`)
if (m > 0 || h > 0) txt.push(`${m} minuto${m !== 1 ? 's' : ''}`)
txt.push(`${s} segundo${s !== 1 ? 's' : ''}`)
return txt.join(' ')
}

function pickRandom(list) {
return list[Math.floor(Math.random() * list.length)]
}

                         
