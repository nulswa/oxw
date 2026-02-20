import fetch from 'node-fetch'
let handler = async (m, { conn, usedPrefix, command }) => {
if (!global.db.data.chats[m.chat].fRpg && m.isGroup) {
return conn.sendMessage(m.chat, { text: `*[ ⽷ ]*  Los comandos de *RPG* estan desactivados...` }, { quoted: m })
}

let monedas, experiencia
let user = global.db.data.users[m.sender]
const cooldown = 2 * 60 * 1000
user.lastwork = user.lastwork || 0

if (Date.now() < user.lastwork) {
const tiempoRestante = formatTime(user.lastwork - Date.now())
return conn.sendMessage(m.chat, { text: `Debes esperar *${tiempoRestante}* para volver a usar el comando.` }, { quoted: m })
}
monedas = Math.floor(Math.random() * 20) 
experiencia = Math.floor(Math.random() * 25) 
user.lastwork = Date.now() + cooldown
user.torucoin += monedas
user.toruexp += experiencia
let workResultado = `✦ *${pickRandom(trabajo)}*

*${currency}* » +${monedas.toLocaleString()}
*${currency2}* » +${experiencia.toLocaleString()}

> ${textbot}`
conn.sendMessage(m.chat, { text: workResultado }, { quoted: m })
}


handler.command = ['w', 'work', 'trabajar']
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
const trabajo = [
"Trabajas como cortador de galletas y ganas",
"Trabaja para una empresa militar privada, ganando",
"Organiza un evento de cata de vinos y obtienes",
"Limpias la chimenea y encuentras",
"Desarrollas juegos para ganarte la vida y ganas",
"Trabajaste en la oficina horas extras por",
"Trabajas como secuestrador de novias y ganas",
"Alguien vino y representó una obra de teatro. Por mirar te dieron",
"Compraste y vendiste artículos y ganaste",
"Trabajas en el restaurante de la abuela como cocinera y ganas",
"Trabajas 50 minutos en un Pizza Hut local. Ganaste",
"Trabajas como escritor(a) de galletas de la fortuna y ganas",
"Revisas tu bolso y decides vender algunos artículos inútiles que no necesitas. Resulta que toda esa basura valía",
"Desarrollas juegos para ganarte la vida y ganas",
"Trabajas todo el día en la empresa por",
"Diseñaste un logo para una empresa por",
"¡Trabajó lo mejor que pudo en una imprenta que estaba contratando y ganó su bien merecido!",
"Trabajas como podador de arbustos y ganas",
"Trabajas como actor de voz para Bob Esponja y te las arreglaste para ganar",
"Estabas cultivando y Ganaste",
"Trabajas como constructor de castillos de arena y ganas",
"Trabajas como artista callejera y ganas",
"¡Hiciste trabajo social por una buena causa! por tu buena causa Recibiste",
"Reparaste un tanque T-60 averiado en Afganistán. La tripulación te pagó",
"Trabajas como ecologista de anguilas y ganas",
"Trabajas en Disneyland como un panda disfrazado y ganas",
"Reparas las máquinas recreativas y recibes",
"Hiciste algunos trabajos ocasionales en la ciudad y ganaste",
"Limpias un poco de moho tóxico de la ventilación y ganas",
"Resolviste el misterio del brote de cólera y el gobierno te recompensó con una suma de",
"Trabajas como zoólogo y ganas",
"Vendiste sándwiches de pescado y obtuviste",
"Reparas las máquinas recreativas y recibes"
]
