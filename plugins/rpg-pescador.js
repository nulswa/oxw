import fetch from 'node-fetch'
let handler = async (m, { conn, usedPrefix, command }) => {
if (!global.db.data.chats[m.chat].fRpg && m.isGroup) {
return conn.sendMessage(m.chat, { text: `*[ ⽷ ]*  Los comandos de *RPG* estan desactivados...` }, { quoted: m })
}

let user = global.db.data.users[m.sender]
const cooldown = 1 * 60 * 1000
user.lastpesca = user.lastpesca || 0

if (Date.now() < user.lastpesca) {
const tiempoRestante = formatTime(user.lastpesca - Date.now())
return conn.sendMessage(m.chat, { text: `Debes esperar *${tiempoRestante}* para volver a usar el comando.` }, { quoted: m })
}

if (user.torupesc >= 30) {
let monedas, experiencia, piesas, boletoss
monedas = Math.floor(Math.random() * 30) 
experiencia = Math.floor(Math.random() * 300) 
piesas = Math.floor(Math.random() * 20) 
boletoss = Math.floor(Math.random() * 800) 
user.lastpesca = Date.now() + cooldown
user.torucoin += monedas
user.toruexp += experiencia
user.torupiesa += piesas
user.boletos += boletoss
let pesXd = `✦ *¡Has vendido los pescados al mercader!* Obtienes lo siguiente.

*${currency}* » +${monedas.toLocaleString()}
*${currency2}* » +${experiencia.toLocaleString()}
*Piesas* » +${piesas.toLocaleString()}
*Boletos* » +${boletoss.toLocaleString()}

> 🐟 _Busca 30 pescados mas para una recompensa._`
conn.sendMessage(m.chat, { text: pesXd }, { quoted: m })
user.torupesc -= 30
} else {
let noXd = `No tienes suficientes *[ 🐟 Pescados ]* para una recompensa.\n- Tienes 🐟 *${user.torupesc} Pescados* en tu inventario.`
return conn.sendMessage(m.chat, { text: noXd }, { quoted: m })
 }
}

handler.command = ['mercader']
handler.tags = ["rpg"]
handler.group = true

export default handler

function formatTime(ms) {
const totalSec = Math.ceil(ms / 1000)
const minutes = Math.floor((totalSec % 3600) / 60)
const seconds = totalSec % 60
const parts = []
if (minutes > 0) parts.push(`${minutes} minuto${minutes !== 1 ? 's' : ''}`)
parts.push(`${seconds} segundo${seconds !== 1 ? 's' : ''}`)
return parts.join(' ')
}
function pickRandom(list) {
return list[Math.floor(list.length * Math.random())]
}
