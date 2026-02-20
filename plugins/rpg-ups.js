import fetch from 'node-fetch'
let handler = async (m, { conn, args, text, usedPrefix, command }) => {
if (!global.db.data.chats[m.chat].fRpg && m.isGroup) {
return conn.sendMessage(m.chat, { text: `*[ ⽷ ]*  Los comandos de *RPG* estan desactivados...` }, { quoted: m })
}

let user = global.db.data.users[m.sender]
let exito, noXd, imagen
if (command === "pico") {
if (!args[0]) {
let pico = `⛏️ *${user.torupico}%* de Durabilidad.

✦ *Mejora* » 50 ${currency2}
✦ *Durabilidad* » +60^
✦ *Utilidad* » #minar, #mining
✦ *Consumo* » -10% por mina

> Usa *(${usedPrefix + command} --up)* para mejorar la durabilidad.`
await conn.sendMessage(m.chat, { text: pico }, { quoted: m })
} else if (args[0] === "--up") {
if (user.toruexp >= 50) {
user.torupico += 60
user.toruexp -= 50
exito = `Mejoraste el *[ ⛏️ Pico ]* en *+60* puntos de durabilidad.`
return conn.sendMessage(m.chat, { text: exito }, { quoted: m })
} else {
noXd = `Necesitas *[ 50 ${currency2} ]* para mejorar el pico.\n- Solo tienes *${user.toruexp} ${currency2}* en tu inventario.`
return conn.sendMessage(m.chat, { text: noXd }, { quoted: m })
}}}

if (command === "espada") {
if (!args[0]) {
let espada = `🗡️ *${user.toruesp}%* de Durabilidad.

✦ *Mejora* » 70 ${currency2}
✦ *Durabilidad* » +80^
✦ *Utilidad* » #hunt, #cazar
✦ *Consumo* » -30% por cazar

> Usa *(${usedPrefix + command} --up)* para mejorar la durabilidad.`
await conn.sendMessage(m.chat, { text: espada }, { quoted: m })
} else if (args[0] === "--up") {
if (user.toruexp >= 70) {
user.toruesp += 80
user.toruexp -= 70
exito = `Mejoraste la *[ 🗡️ Espada ]* en *+80* puntos de durabilidad.`
return conn.sendMessage(m.chat, { text: exito }, { quoted: m })
} else {
noXd = `Necesitas *[ 70 ${currency2} ]* para mejorar la espada.\n- Solo tienes *${user.toruexp} ${currency2}* en tu inventario.`
return conn.sendMessage(m.chat, { text: noXd }, { quoted: m })
}
}
}

if (command === "hacha") {
if (!args[0]) {
let hacha = `🪓 *${user.toruach}%* de Durabilidad.

✦ *Mejora* » 60 ${currency2}
✦ *Durabilidad* » +70^
✦ *Utilidad* » #madera, #talar
✦ *Consumo* » -20% por talar

> Usa *(${usedPrefix + command} --up)* para mejorar la durabilidad.`
await conn.sendMessage(m.chat, { text: hacha }, { quoted: m })
} else if (args[0] === "--up") {
if (user.toruexp >= 60) {
user.toruach += 70
user.toruexp -= 60
exito = `Mejoraste el *[ 🪓 Hacha ]* en *+70* puntos de durabilidad.`
return conn.sendMessage(m.chat, { text: exito }, { quoted: m })
} else {
imagen = Buffer.from(await (await fetch(`https://files.catbox.moe/r0t9ng.jpg`)).arrayBuffer())
noXd = `Necesitas *[ 50 ${currency2} ]* para mejorar el hacha.\n- Solo tienes *${user.toruexp} ${currency2}* en tu inventario.`
return conn.sendMessage(m.chat, { text: noXd }, { quoted: m })
}
}
}

}

handler.command = ['pico', 'espada', 'hacha']
handler.tags = ["rpg"]
handler.group = true

export default handler

