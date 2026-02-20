import fetch from 'node-fetch'
let handler = async (m, { conn, text, args, usedPrefix, command }) => {
if (!global.db.data.chats[m.chat].fRpg && m.isGroup) {
return conn.sendMessage(m.chat, { text: `*[ ⽷ ]*  Los comandos de *RPG* estan desactivados...` }, { quoted: m })
}

let user = global.db.data.users[m.sender]
let nivelado, estadistica, monedas, experiencia, piesas, llavess
if (!args[0]) {
let estado = `✦ *¡Sube de nivel y rango para mayor recompensa!*

- \`Estado Actual\`
𖡛 Nivel : *lvl_${user.nivele}*
🜲 Rango : *#${user.rangos}*

> Usa los siguientes comandos para subir de nivel o rango.
*${usedPrefix + command}* --up
*${usedPrefix + command}* --rk`
conn.sendMessage(m.chat, { text: estado }, { quoted: m })
} else if (args[0] === "--up") {
if (user.tawbot >= 1) {
nivelado = 1
llavess = Math.floor(Math.random() * 2)
monedas = Math.floor(Math.random() * 25)
experiencia = Math.floor(Math.random() * 25)
user.torucoin += monedas
user.toruexp += experiencia
user.llaves += llavess
user.nivele += nivelado
user.boletos += 800
let respNivel = `✦ *¡Subiste de nivel exitosamente!* Estos son tus resultados.

*Nivel* » +1
*Llaves* » +${llaves.toLocaleString()}
*${currency}* » +${monedas.toLocaleString()}
*${currency2}* » +${experiencia.toLocaleString()}
*Boletos* » +800

> Sacrificaste un *[ -1 Pergamino 📜 ]* para subir de nivel...`
conn.sendMessage(m.chat, { text: respNivel }, { quoted: m })
user.tawbot -= 1
} else {
let noFrag = `No tienes suficientes *[ 📜 Pergaminos ]* para subir de nivel.\n- Solo tienes 📜 *${user.tawbot} Pergaminos* en tu inventario.`
return conn.sendMessage(m.chat, { text: noFrag }, { quoted: m })
 }
} else if (args[0] === "--rk") {
if (user.torumana >= 200) {
estadistica = 1
llavess = Math.floor(Math.random() * 2)
monedas = Math.floor(Math.random() * 25)
experiencia = Math.floor(Math.random() * 25)
user.torucoin += monedas
user.toruexp += experiencia
user.llaves += llavess
user.rangos += estadistica
user.boletos += 2500
let respRank = `✦ *¡Subiste de rango exitosamente!* Estos son tus resultados.

*Rango* » +1
*Llaves* » +${llaves.toLocaleString()}
*${currency}* » +${monedas.toLocaleString()}
*${currency2}* » +${experiencia.toLocaleString()}
*Boletos* » +2,500

> Consumiste *[ -200 Mana ]* para subir de rango y recibir recompensas.`
conn.sendMessage(m.chat, { text: respRank }, { quoted: m })
user.torumana -= 200
} else {
let noPunt = `No tienes suficientes *[ Mana ]* para subir de rango.\n- Solo tienes *${user.torumana} de Mana* actualmente.`
return conn.sendMessage(m.chat, { text: noPunt }, { quoted: m })
  }
 }
}

handler.command = ['nivel', 'level']
handler.tags = ["rpg"]
handler.group = true

export default handler

function pickRandom(list) {
return list[Math.floor(Math.random() * list.length)]
}

