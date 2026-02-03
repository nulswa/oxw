import fetch from 'node-fetch'
let handler = async (m, { conn, args, text, usedPrefix, command }) => {
if (!global.db.data.chats[m.chat].fRpg && m.isGroup) {
return conn.sendMessage(m.chat, { text: `📍  Los comandos de *[ rpg ]* estan desactivados...` }, { quoted: m })
}

let user = global.db.data.users[m.sender]
let exito, noXd, imagen
if (command === "pico") {
if (!args[0]) {
let pico = `· ┄ · ⊸ 𔓕 *Pico  :  RPG*
- _Mejora tu pico de minería._

> 〩 *Durabilidad:*
\t⛏️ *${user.torupico}%*

● Mejora : *$50 ${currency2}*
● Utilidad : *#minar, #mining*
● Consumo : *-10% por mina*

> Usa *(${usedPrefix + command} --up)* para mejorar la durabilidad.`
//imagen = Buffer.from(await (await fetch(`https://files.catbox.moe/bt96yl.jpg`)).arrayBuffer())
await conn.sendMessage(m.chat, { text: pico }, { quoted: m })
//conn.sendMessage(m.chat, { text: pico, mentions: [m.sender], contextInfo: { externalAdReply: { title: "PICO  :  RPG", body: botname, thumbnail: imagen, sourceUrl: null, mediaType: 1, renderLargerThumbnail: false }}}, { quoted: m })
} else if (args[0] === "--up") {
if (user.toruexp >= 50) {
user.torupico += 60
user.toruexp -= 50
exito = `Mejoraste el *[ ⛏️ Pico ]* en *+60* puntos de durabilidad.`
return conn.sendMessage(m.chat, { text: exito }, { quoted: m })
} else {
//imagen = Buffer.from(await (await fetch(`https://files.catbox.moe/r0t9ng.jpg`)).arrayBuffer())
noXd = `Necesitas *[ ${toem2} $50 ${currency2} ]* para mejorar el pico.\n- Solo tienes ${toem2} *${user.toruexp} ${currency2}* en tu inventario.`
return conn.sendMessage(m.chat, { text: noXd }, { quoted: m })
//conn.sendMessage(m.chat, { text: noXd, mentions: [m.sender], contextInfo: { externalAdReply: { title: "¡Sin estrellas suficientes!", body: botname, thumbnail: imagen, sourceUrl: null, mediaType: 1, renderLargerThumbnail: false }}}, { quoted: m })
}
}
}

if (command === "espada") {
if (!args[0]) {
let espada = `· ┄ · ⊸ 𔓕 *Espada  :  RPG*
- _Mejora tu espada de batalla._

> 〩 *Durabilidad:*
\t🗡️ *${user.toruesp}%*

● Mejora : *$60 ${currency2}*
● Utilidad : *#hunt, #cazar*
● Consumo : *-30% por cazar*

> Usa *(${usedPrefix + command} --up)* para mejorar la durabilidad.`
//imagen = Buffer.from(await (await fetch(`https://files.catbox.moe/36pk4m.jpg`)).arrayBuffer())
await conn.sendMessage(m.chat, { text: espada }, { quoted: m })
//conn.sendMessage(m.chat, { text: espada, mentions: [m.sender], contextInfo: { externalAdReply: { title: "ESPADA  :  RPG", body: botname, thumbnail: imagen, sourceUrl: null, mediaType: 1, renderLargerThumbnail: false }}}, { quoted: m })
} else if (args[0] === "--up") {
if (user.toruexp >= 60) {
user.toruesp += 80
user.toruexp -= 60
exito = `Mejoraste la *[ 🗡️ Espada ]* en *+80* puntos de durabilidad.`
return conn.sendMessage(m.chat, { text: exito }, { quoted: m })
} else {
//imagen = Buffer.from(await (await fetch(`https://files.catbox.moe/r0t9ng.jpg`)).arrayBuffer())
noXd = `Necesitas *[ ${toem2} $60 ${currency2} ]* para mejorar la espada.\n- Solo tienes ${toem2} *${user.toruexp} ${currency2}* en tu inventario.`
return conn.sendMessage(m.chat, { text: noXd }, { quoted: m })
//conn.sendMessage(m.chat, { text: noXd, mentions: [m.sender], contextInfo: { externalAdReply: { title: "¡Sin estrellas suficientes!", body: botname, thumbnail: imagen, sourceUrl: null, mediaType: 1, renderLargerThumbnail: false }}}, { quoted: m })
}
}
}

if (command === "hacha") {
if (!args[0]) {
let hacha = `· ┄ · ⊸ 𔓕 *Hacha  :  RPG*
- _Mejora tu hacha de trabajo._

> 〩 *Durabilidad:*
\t🪓 *${user.toruach}%*

● Mejora  :  *$50 ${currency2}*
● Utilidad  :  *#madera, #talar*
● Consumo  :  *-20% por talar*

> Usa *(${usedPrefix + command} --up)* para mejorar la durabilidad.`
//imagen = Buffer.from(await (await fetch(`https://files.catbox.moe/pg6w1t.jpg`)).arrayBuffer())
await conn.sendMessage(m.chat, { text: hacha }, { quoted: m })
//conn.sendMessage(m.chat, { text: hacha, mentions: [m.sender], contextInfo: { externalAdReply: { title: "HACHA  :  RPG", body: botname, thumbnail: imagen, sourceUrl: null, mediaType: 1, renderLargerThumbnail: false }}}, { quoted: m })
} else if (args[0] === "--up") {
if (user.toruexp >= 50) {
user.toruach += 70
user.toruexp -= 50
exito = `Mejoraste el *[ 🪓 Hacha ]* en +60 puntos de durabilidad.`
return conn.sendMessage(m.chat, { text: exito }, { quoted: m })
} else {
imagen = Buffer.from(await (await fetch(`https://files.catbox.moe/r0t9ng.jpg`)).arrayBuffer())
noXd = `Necesitas *[ ${toem2} $50 ${currency2} ]* para mejorar el hacha.\n- Solo tienes ${toem2} *${user.toruexp} ${currency2}* en tu inventario.`
return conn.sendMessage(m.chat, { text: noXd }, { quoted: m })
//conn.sendMessage(m.chat, { text: noXd, mentions: [m.sender], contextInfo: { externalAdReply: { title: "¡Sin estrellas suficientes!", body: botname, thumbnail: imagen, sourceUrl: null, mediaType: 1, renderLargerThumbnail: false }}}, { quoted: m })
}
}
}

}

handler.command = ['pico', 'espada', 'hacha']
handler.group = true

export default handler

