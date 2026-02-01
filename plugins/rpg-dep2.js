//import emojis from './rpg-emojis.js'
import fetch from 'node-fetch'
let handler = async (m, { args, usedPrefix, command }) => {
if (!global.db.data.chats[m.chat].fRpg && m.isGroup) {
return conn.sendMessage(m.chat, { text: `📍  Los comandos de *[ rpg ]* estan desactivados...` }, { quoted: m })
}

let user = global.db.data.users[m.sender]
if (!args[0]) return conn.sendMessage(m.chat, { text: `ᗢ Proporcione la cantidad de *[ ${toem2} ${currency2} ]* para transferir.\n\n\t⚶ Por ejemplo:\n*${usedPrefix + command}* 50` }, { quoted: m })
if ((args[0]) < 1) return conn.sendMessage(m.chat, { text: `Debes ingresar una cantidad valida de *[ ${toem2} ${currency2} ]* para depositar.\n\n\t⚶ Por ejemplo:\n*${usedPrefix + command}* 50` }, { quoted: m })
if (args[0] == 'all') {
let count = parseInt(user.toruexp)
user.toruexp -= count * 1
user.bankk += count * 1
await conn.sendMessage(m.chat, { text: `Depositaste todos tus *[ ${toem2} ${currency} ]* con exito.` }, { quoted: m })
return !0
}
if (!Number(args[0])) return conn.sendMessage(m.chat, { text: `Debes usar numeros para la cantidad de *[ ${toem2} ${currency2} ]* para depositar.\n\n\t⚶ Por ejemplo:\n*${usedPrefix + command}* 50` }, { quoted: m })
let count = parseInt(args[0])
if (!user.toruexp) return conn.sendMessage(m.chat, { text: `No tienes suficientes *[ ${toem2} ${currency2} ]* para transferir.\n- Solo tienes ${toem2} *${user.toruexp} ${currency2}* en tu inventario.` }, { quoted: m })
if (user.toruexp < count) return conn.sendMessage(m.chat, { text: `Solo tienes *[ ${toem2} ${user.toruexp} ${currency2} ]* en tu inventario, no es suficiente.` }, { quoted: m })
user.toruexp -= count * 1
user.bankk += count * 1
await conn.sendMessage(m.chat, { text: `Depositaste *[ ${toem2} ${count} ${currency2} ]* con exito al banco.` }, { quoted: m })
}

handler.command = ['depositar2', 'd2', 'dep2']
handler.group = true

export default handler
