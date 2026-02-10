const pHora = 1000
const pDia = 3000
const cHora = 1
const cDia = 20

let handler = async (m, { conn, usedPrefix, command, args }) => {
let texto = `ᗢ Proporciona un numero y el tipo de duración.

> *Duracion:*
h = Por hora ( $1,000 *ARS* )
d = Por dia ( $3,000 *ARS* )

${mess.example}
*${usedPrefix + command}* 3 d`
let name = await conn.getName(m.sender)
if (!args[0]) return conn.sendMessage(m.chat, { text: texto }, { quoted: m })
//conn.reply(m.chat, texto, m)
let type
let user = global.db.data.users[m.sender]
if (isNaN(args[0])) return conn.sendMessage(m.chat, { text: `Solo se aceptan numeros...\n\n${mess.example}\n*${usedPrefix + command}* 3 d` }, { quoted: m })
let kk = args[1] || "h"
let precio = kk === "h" ? pHora : pDia
if (!args[1] || (args[1] !== "h" && args[1] !== "d")) {
return conn.sendMessage(m.chat, { text: `El formato no es valido, solo puedes usar *"h"* o *"d"* como hora o dia.\n\n${mess.example}\n*${usedPrefix + command}* 1 h` }, { quoted: m })
}
if (user.toars < (precio)) {
return conn.sendMessage(m.chat, { text: `No tienes *[ 💵 ARS ]* en tu cuenta.\n- Puedes solicitar un deposito para guardarlo en tu cuenta de *[ TORU ]*.` }, { quoted: m })
}
let tiempo
if (args[1] === "h") {
tiempo = 3600000 * args[0]
let now = new Date() * 1
if (now < user.premiumTime) user.premiumTime += tiempo
else user.premiumTime = now + tiempo
user.premium = true
user.toars -= (pHora * args[0])
type = "Hora(s)"
} else if (args[1] === "d") {
tiempo = 86400000 * args[0]
let now = new Date() * 1
if (now < user.premiumTime) user.premiumTime += tiempo
else user.premiumTime = now + tiempo
user.premium = true
user.toars -= (pDia * args[0])
type = "Día(s)"
}
let cap = `· ┄ · ⊸ 𔓕 *New  :  Premium*

👤 @${m.sender.splir`@`[0]}
⏰ *Tiempo* : ${args[0]} ${type}
💵 *Pago* : ${precio * args[0]} *ARS*
🟢 *Estado* : Premium

> 📍  Ahora eres un usuario *premium*, puedes disfrutar de los comandos premium. ¡Gracias por usar este proyecto!`
conn.sendMessage(m.chat, { text: cap, mentions: [m.sender] }, { quoted: m })
}

handler.command = ['vip', 'premium']
export default handler

