import fetch from 'node-fetch'
let handler = async (m, { conn, usedPrefix, command }) => {
if (!global.db.data.chats[m.chat].fRpg && m.isGroup) {
return conn.sendMessage(m.chat, { text: `*[ ⽷ ]*  Los comandos de *RPG* estan desactivados...` }, { quoted: m })
}

let monedas, experiencia, fragmentos, puntoss, imagen, noXd
let user = global.db.data.users[m.sender]
const cooldown = 5 * 60 * 1000
user.lastmadera = user.lastmadera || 0
user.health = user.health || 100

if (user.health < 10) {
return conn.sendMessage(m.chat, { text: `No tienes la salud suficiente para buscar madera.\n- Tu salud es de *[ ❤️ ${user.health}% ]*, usa *${usedPrefix}curar* para sanar.` }, { quoted: m })
}

if (Date.now() < user.lastmadera) {
const tiempoRestante = formatTime(user.lastmadera - Date.now())
return conn.sendMessage(m.chat, { text: `Debes esperar *${tiempoRestante}* para volver a usar el comando.` }, { quoted: m })
}

if (user.toruach >= 20) {
monedas = Math.floor(Math.random() * 75) 
experiencia = Math.floor(Math.random() * 75) 
user.lastmadera = Date.now() + cooldown
user.torucoin += monedas
user.toruexp += experiencia
let minResultado = `✦ *${pickRandom(talador)}*

𝇈 *${currency}* » +${monedas.toLocaleString()}
𝇈 *${currency2}* » +${experiencia.toLocaleString()}

> ${textbot}`
conn.sendMessage(m.chat, { text: minResultado }, { quoted: m })
user.health -= 10
user.toruach -= 20
} else {
noXd = `Te falta un *[ 🪓 Hacha ]* para talar.\n- Compra con *${usedPrefix}rpg* por *[ 50 ${currency2} ]* en total o mejora la durabilidad.`
return conn.sendMessage(m.chat, { text: noXd }, { quoted: m })
}
}

handler.command = ['talar', 'madera']
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
const talador = [
"Fuiste al bosque para talar madera para vender y obtienes lo siguiente.",
"Fuiste al bosque para talar arboles para hacer carbon para un pedido y obtienes lo siguiente.",
"Has talado un arbol para hacer tablillas y obtienes lo siguiente.",
"Has talado un arbol para hacer carbon y venderlo, obtienes lo siguiente."
]

