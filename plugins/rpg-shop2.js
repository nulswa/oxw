let handler = async (m, { conn, args, text, usedPrefix, command }) => {
if (!global.db.data.chats[m.chat].fRpg && m.isGroup) {
return conn.sendMessage(m.chat, { text: `*[ ⽷ ]*  Los comandos de *RPG* estan desactivados...` }, { quoted: m })
}

let user = global.db.data.users[m.sender]
let info, imagen, noXd
if (!args[0]) {
info = `· ┄ · ⊸ 𔓕 *Shop  :  Herramientas*
- Compra las herramientas necesarias con *(${currency2})*.

> ⽷ *Trabajos:*
• ⛏️ *Pico* » *$70*
• 🪓 *Hacha* » *$80*
• 🗡️ *Espada* » *$90*

${mess.example}
*${usedPrefix + command}* hacha

> ${textbot}`
await conn.sendMessage(m.chat, { text: info }, { quoted: m })
} else if (args[0] === "pico") {
if (user.toruexp >= 70) {
user.toruexp -= 70
user.torupico += 70
info = `Has comprado *[ ⛏️ 1 Pico ]* por $70 *${currency2}* con exito.\n- Usa *${usedPrefix}pico* para ver los detalles.`
return conn.sendMessage(m.chat, { text: info }, { quoted: m })
} else {
noXd = `No tienes suficientes *[ ${currency2} ]* para comprar el item.\n- Solo tienes *${user.toruexp.toLocaleString()} ${currency2}* en tu inventario.`
return conn.sendMessage(m.chat, { text: noXd }, { quoted: m })
 }
} else if (args[0] === "espada") {
if (user.toruexp >= 90) {
user.toruexp -= 90
user.toruesp += 90
info = `Has comprado *[ 🗡️ 1 Espada ]* por $90 *${currency2}* con exito.\n- Usa *${usedPrefix}espada* para ver los detalles.`
return conn.sendMessage(m.chat, { text: info }, { quoted: m })
} else {
noXd = `No tienes suficientes *[ ${currency2} ]* para comprar el item.\n- Solo tienes *${user.toruexp.toLocaleString()} ${currency2}* en tu inventario.`
return conn.sendMessage(m.chat, { text: noXd }, { quoted: m })
 }
} else if (args[0] === "hacha") {
if (user.toruexp >= 80) {
user.toruexp -= 80
user.toruach += 80
info = `Has comprado *[ 🪓 1 Hacha ]* por $80 *${currency2}* con exito.\n- Usa *${usedPrefix}hacha* para ver los detalles.`
return conn.sendMessage(m.chat, { text: info }, { quoted: m })
} else {
noXd = `No tienes suficientes *[ ${currency2} ]* para comprar el item.\n- Solo tienes *${user.toruexp.toLocaleString()} ${currency2}* en tu inventario.`
return conn.sendMessage(m.chat, { text: noXd }, { quoted: m })
 }
}
}

handler.command = ['rpg']
handler.tags = ["rpg"]
handler.group = true
export default handler

