let handler = async (m, {conn, usedPrefix, command}) => {
if (!global.db.data.chats[m.chat].fRpg && m.isGroup) {
return conn.sendMessage(m.chat, { text: `*[ ⽷ ]*  Los comandos de *RPG* estan desactivados...` }, { quoted: m })
}

let who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.sender
if (who == conn.user.jid) return error 
if (!(who in global.db.data.users)) return conn.sendMessage(m.chat, { text: `El usuario mencionado no esta en la base de datos.` }, { quoted: m })
let user = global.db.data.users[who]
const name = await conn.getName(who || m.sender)
//let imagen = Buffer.from(await (await fetch(`https://files.catbox.moe/smx37m.jpg`)).arrayBuffer())
let yo = `· ┄ · ⊸ 𔓕 *STATS : RPG*
- _Mira tus estadisticas en el modo rpg._

> 🝐 *Tus estadísticas*
⋇ *Usuario* » @${name}
⋇ *Salud* » ${user.health}%
⋇ *Mana* » ${user.torumana}%
⋇ *Poder* » ^${user.torupoder}.00
⋇ *Fuerza* » ^${user.torufuerza}.00
⋇ *Velocidad* » ^${user.toruvelos}.00
⋇ *Resistencia* » (${user.resistent})

> 🝐 *Destacado*
⋇ *Rango* » #${user.rangos}
⋇ *Nivel* » lvl_${user.nivele}

> 🝐 *Equipo*
\t⛏️ *Pico* » ${user.torupico}%
\t🗡️ *Espada* » ${user.toruesp}%
\t🪓 *Hacha* » ${user.toruach}%

> 🝐 *Nivel : Magia*
🌳 *Tierra* » *#${user.ttierra}^*
💧 *Agua* » *#${user.tagua}^*
🔥 *Fuego* » *#${user.tfuego}^*
💨 *Aire* » *#${user.taire}^*

> 📍  Derrota enemigos o juega comandos *rpg* para ganar eatatus.`
await conn.sendMessage(m.chat, { text: yo }, { quoted: m })
//conn.sendMessage(m.chat, { text: yo, mentions: await conn.parseMention(yo), contextInfo: { externalAdReply: { title: "〩  S T A T S  〩", body: botname, thumbnail: imagen, sourceUrl: null, mediaType: 1, renderLargerThumbnail: false }}}, { quoted: m })
//conn.sendMessage(m.chat, { text: `${who == m.sender ? `${yo}` : `${tu}`}`, mentions: [who] }, { quoted: m }
//m.reply(`${who == m.sender ? `${yo}` : `${tu}`}`, null, { mentions: [who] })
}


handler.command = ['stats', 'estadistica']
handler.tags = ["rpg"]
handler.group = true 
export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)
