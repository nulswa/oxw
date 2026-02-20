import { createHash } from 'crypto'
const { proto, generateWAMessageFromContent, prepareWAMessageMedia } = (await import("@whiskeysockets/baileys")).default

let handler = async function (m, { conn, text, usedPrefix, command }) {

let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let user = global.db.data.users[m.sender]
let name2 = conn.getName(m.sender)

if (user.registered === true) return conn.sendMessage(m.chat, { text: `${emoji} Ya estas registrado en la base de datos.\n- Si quieres eliminarlo usa el comando *${usedPrefix}dreg*` }, { quoted: m })

let [_, name, splitter] = text.match(Reg)

if (!name) return conn.sendMessage(m.chat, { text: `Debe ingresar el nombre como es debido.\n\n${mess.example}\n*${usedPrefix + command}* ${name2}` }, { quoted: m })
if (name.length >= 25) return conn.sendMessage(m.chat, { text: `El nombre no puede tener mas de 25 caracteres.` }, { quoted: m })

user.name = name.trim()
user.regTime = +new Date
user.registered = true

if (global.db && global.db.write) {
await global.db.write()
}

let sn = createHash('md5').update(m.sender).digest('hex').slice(0, 20)
await conn.sendMessage(m.chat, { text: `${mess.succs}\n- Registrado en la base de datos con exito.` }, { quoted: m })
await conn.sendMessage(m.chat, { text: `CODE: ${sn}` }, { quoted: m })
}

handler.tags = ['rpg']
handler.command = ['new', 'nuevo', 'nueva']

export default handler