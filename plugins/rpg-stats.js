let handler = async (m, {conn, usedPrefix, command}) => {
if (!global.db.data.chats[m.chat].fRpg && m.isGroup) {
return conn.sendMessage(m.chat, { text: `📍  Los comandos de *[ rpg ]* estan desactivados...` }, { quoted: m })
}
let who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.sender
if (who == conn.user.jid) return error 
if (!(who in global.db.data.users)) return conn.sendMessage(m.chat, { text: `El usuario mencionado no esta en la base de datos.` }, { quoted: m })
let user = global.db.data.users[who]
let imagen = Buffer.from(await (await fetch(`https://files.catbox.moe/smx37m.jpg`)).arrayBuffer())
let yo = `· ┄ · ⊸ 𔓕 *STATS : RPG*
- _Mira tus estadisticas en el modo rpg._

> 🝐 *Tus estadísticas*
\t👤 *Tu* : @${m.sender.split`@`[0]}
\t❤️ *Salud* : ${user.health}%
\t🔮 *Mana* : ${user.torumana}%
\t🔱 *Poder* : ^${user.torupoder}.00
\t💪🏻 *Fuerza* : ^${user.torufuerza}.00
\t⚡ *Velocidad* : *^${user.toruvelos}.00
\t🛡️ *Resistencia* : (${user.resistent})

> 🝐 Destacado*
\t🏆 *Rango* : #${user.rangos}
\t🥇 *Nivel* : lvl_${user.nivele}

> 🝐 *Equipo*
\t⛏️ *Pico* : ${user.torupico}%
\t🗡️ *Espada* : ${user.toruesp}%
\t🪓 *Hacha* : ${user.toruach}%

> 🝐 *Nivel : Magia*
🌳 *Tierra* : *#${user.ttierra}^*
💧 *Agua* : *#${user.tagua}^*
🔥 *Fuego* : *#${user.tfuego}^*
💨 *Aire* : *#${user.taire}^*

> 📍  Derrota enemigos o juega comandos para ganar eatatus.`
await conn.sendMessage(m.chat, { text: yo, mentions: await conn.parseMention(yo), contextInfo: { externalAdReply: { title: "〩  S T A T S  〩", body: botname, thumbnail: imagen, sourceUrl: null, mediaType: 1, renderLargerThumbnail: false }}}, { quoted: m })
//conn.sendMessage(m.chat, { text: `${who == m.sender ? `${yo}` : `${tu}`}`, mentions: [who] }, { quoted: m }
//m.reply(`${who == m.sender ? `${yo}` : `${tu}`}`, null, { mentions: [who] })
}


handler.command = ['stats', 'estadistica']
handler.group = true 
export default handler

