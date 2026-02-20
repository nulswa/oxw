import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix }) => {
if (!global.db.data.chats[m.chat].fRpg && m.isGroup) {
return conn.sendMessage(m.chat, { text: `*[ ⽷ ]*  Los comandos de *RPG* estan desactivados...` }, { quoted: m })
}

let mentionedJid = await m.mentionedJid
let who = mentionedJid[0] ? mentionedJid[0] : m.quoted ? await m.quoted.sender : m.sender
let name = await (async () => global.db.data.users[who].name || (async () => { try { const n = await conn.getName(who); return typeof n === 'string' && n.trim() ? n : who.split('@')[0] } catch { return who.split('@')[0] } })())()
if (!(who in global.db.data.users)) return conn.sendMessage(m.chat, { text: `El usuario no se encuentra en la base de datos.` }, { quoted: m })

let user = global.db.data.users[who]
let torucoin = user.torucoin || 0
let bank = user.bank || 0
let bankk = user.bankk || 0
let toruexp = user.toruexp || 0
let llaves = user.llaves || 0
let boletos = user.boletos || 0
let toruregal = user.toruregal || 0
let torupiesa = user.torupiesa || 0
let torupesc = user.torupesc || 0

const texto = `✦ *¡Bienvenido a tu inventario!* Aqui estan tus cosas.

𝇈 *${currency}* » ${toNum(user.torucoin)}
𝇈 *${currency2}* » ${toNum(user.toruexp)}

𝇈 *${currency}* » ${toNum(user.bank)}* (bank)
𝇈 *${currency2}* » ${toNum(user.bankk)}* (bank)
${readMore}
\t⽷ \`Utiles\`
𝇈 *Llaves* » ${torullave.toLocaleString()}
𝇈 *Piesas* » ${torupiesa.toLocaleString()}
𝇈 *Regalos* » ${toruregal.toLocaleString()}
𝇈 *Boletos* » ${boletos.toLocaleString()}
𝇈 *Pescados* » ${torupesc.toLocaleString()}

> ${textbot}`
await conn.sendMessage(m.chat, { text: texto, mentions: [m.sender], contextInfo: { externalAdReply: { title: "⫶☰  I N V E N T A R I O", body: `🎒 Hola @${name}, este es tu inventario.`, thumbnail: thumb, sourceUrl: null, mediaType: 1, renderLargerThumbnail: false }}}, { quoted: m })
}

handler.command = ['inventario', 'inv'] 
handler.tags = ["rpg"]
handler.group = true 

export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)
                                                                              
function toNum(number) {
if (number >= 1000 && number < 1000000) { return (number / 1000).toFixed(1) + 'k' } else if (number >= 1000000) { return (number / 1000000).toFixed(1) + 'M' } else if (number <= -1000 && number > -1000000) { return (number / 1000).toFixed(1) + 'k' } else if (number <= -1000000) { return (number / 1000000).toFixed(1) + 'M' } else { return number.toString() }}

