import fetch from 'node-fetch'
let handler = async (m, { conn, usedPrefix, command }) => {
if (!global.db.data.chats[m.chat].fRpg && m.isGroup) {
return conn.sendMessage(m.chat, { text: `*[ ⽷ ]*  Los comandos de *RPG* estan desactivados...` }, { quoted: m })
}

let monedas, experiencia
let user = global.db.data.users[m.sender]
const cooldown = 2 * 60 * 1000
user.lastAdventure = user.lastAdventure || 0

if (Date.now() < user.lastAdventure) {
const tiempoRestante = formatTime(user.lastAdventure - Date.now())
return conn.sendMessage(m.chat, { text: `Debes esperar *${tiempoRestante}* para volver a usar el comando.` }, { quoted: m })
}
monedas = Math.floor(Math.random() * 25) 
experiencia = Math.floor(Math.random() * 25) 
user.lastAdventure = Date.now() + cooldown
user.torucoin += monedas
user.toruexp += experiencia
let respuesta = `✦ *${pickRandom(aventura)}*

*${currency}* » +${monedas.toLocaleString()}
*${currency2}* » +${experiencia.toLocaleString()}

> ${textbot}`
conn.sendMessage(m.chat, { text: respuesta }, { quoted: m })
}

handler.command = ['adventure', 'aventura']
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
const aventura = [
"Has aventurado en lo lejano, comenzando desde cero y obtienes:",
"Has aventurado en zonas lejanas y derrotas varios monstruos, obtienes:",
"Exploraste en el bosque y te topaste con oponentes fuertes pero lograste vencerlos.",
"Has llegado en una aldea y te quedaste unos dias, obtienes:"
]
