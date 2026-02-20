let handler = async (m, {conn, isOwner, command}) => {
if (!global.db.data.chats[m.chat].fInformation && m.isGroup) {
return conn.sendMessage(m.chat, { text: `*[ ⽷ ]*  Los comandos de *información* estan desactivados...` }, { quoted: m })
}

let vip = global.db.data.users[m.sender].premium
let prem = Object.entries(global.db.data.users).filter((user) => user[1].premium)
let mo = global.db.data.users[m.sender].moderador
let mod = Object.entries(global.db.data.users).filter((user) => user[1].moderador)
let ad = global.db.data.users[m.sender].administ
let admin = Object.entries(global.db.data.users).filter((user) => user[1].administ)

if (command === "prems!") {
let caption = `〤 *P R E M I U M S*

\t々 Tu : *${vip ? 'Premium ✓' : '(No. #plan)'}*
\t々 Usuarios : *${prem.length}_prems*
${prem ? '\n' + prem .map(([jid], i) => `\t＃ *${i + 1}.* » ${isOwner ? '@' + jid.split`@`[0] : jid} ✓`.trim()).join('\n\n') : '' }`
await conn.sendMessage(m.chat, { text: caption, mentions: await conn.parseMention(caption) }, { quoted: m })
}

if (command === "mods!") {
let caption = `〤 *M O D E R A T O R S*

\t々 Tu : *${mo ? 'Moderador ✓' : '(No. #plan)'}*
\t々 Usuarios : *${mod.length}_mods*
${mod ? '\n' + mod .map(([jid], i) => `\t＃ *${i + 1}.* » ${isOwner ? '@' + jid.split`@`[0] : jid} ✓`.trim()).join('\n\n') : '' }`
await conn.sendMessage(m.chat, { text: caption, mentions: await conn.parseMention(caption) }, { quoted: m })
}

if (command === "admins!") {
let caption = `〤 *A D M I N S  :  B O T*

\t々 Tu : *${ad ? 'Admin-Bot ✓' : '(No. #plan)'}*
\t々 Usuarios : *${admin.length}_admins*
${admin ? '\n' + admin .map(([jid], i) => `\t＃ *${i + 1}.* » ${isOwner ? '@' + jid.split`@`[0] : jid} ✓`.trim()).join('\n\n') : '' }`
await conn.sendMessage(m.chat, { text: caption, mentions: await conn.parseMention(caption) }, { quoted: m })
}

}
handler.command = ["prems!", "mods!", "admins!"]
handler.tags = ["informacion"]
export default handler
