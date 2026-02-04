import { createHash } from 'crypto'
const { proto, generateWAMessageFromContent, prepareWAMessageMedia } = (await import("@whiskeysockets/baileys")).default

let handler = async function (m, { conn, text, usedPrefix, command }) {

let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let user = global.db.data.users[m.sender]
let name2 = conn.getName(m.sender)

if (user.registered === true) return conn.reply(m.chat, "Ya haz puesto tu nombre en la lista de usuarios.", m)
if (!text) return conn.sendMessage(m.chat, { text: `${mess.example}\n*${usedPrefix + command}* @${name2}` }, { quoted: m })
if (text.length >= 20) return conn.sendMessage(m.chat, { text: `Maximo 20 caracteres...` }, { quoted: m })

user.name = text.trim()
user.regTime = +new Date
user.registered = true

//Magia
user.tfuego += 5
user.taire += 5
user.tagua += 5
user.ttierra += 5

//Estatus
user.torufuerza += 6
user.toruvelos += 3
user.torupoder += 4
user.resistent += 2
user.torumana += 10

//Destacado
user.nivele += 1
user.rangos += 1


if (global.db && global.db.write) {
await global.db.write()
}

let sn = createHash('md5').update(m.sender).digest('hex').slice(0, 20)

await conn.sendMessage(m.chat, { text: `✅  Registrado en la lista.\n- Nombre *( ${text} )* y codigo de serie *[${sn}]*` }, { quoted: m })
}

handler.command = ['new', 'nuevo', 'nueva']
export default handler

