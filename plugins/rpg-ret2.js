let handler = async (m, { args, usedPrefix, command }) => {
if (!global.db.data.chats[m.chat].fRpg && m.isGroup) {
return conn.sendMessage(m.chat, { text: `*[ ⽷ ]*  Los comandos de *RPG* estan desactivados...` }, { quoted: m })
}
let user = global.db.data.users[m.sender]
if (!args[0]) return conn.sendMessage(m.chat, { text: `${mess.example}\n*${usedPrefix + command}* 50` }, { quoted: m })
if (args[0] == 'all') {
let count = parseInt(user.bankk)
user.bankk -= count * 1
user.toruexp += count * 1
await conn.sendMessage(m.chat, { text: `Has retirado todos tus *[ ${currency2} ]* con exito.\n- Cantidad retirada: *+${count.toLocaleString()}* ${currency2}\n\n✦ Ahora corres el riesgo de que te roben.` }, { quoted: m })
return !0
}
if (!Number(args[0])) return conn.sendMessage(m.chat, { text: `Debe de proporcionar un numero valido para tetirar sus *${currency2}* en el banco.\n\n${mess.example}\n*${usedPrefix + command}* 50` }, { quoted: m })
let count = parseInt(args[0])
if (!user.bankk) return conn.sendMessage(m.chat, { text: `No tienes esa cantidad de *[ ${currency2} ]* en el banco.` }, { quoted: m })
if (user.bankk < count) return conn.sendMessage(m.chat, { text: `Cantidad insuficiente, solo tienes *[ ${user.bankk.toLocaleString()} ${currency2} ]* en tu banco.` }, { quoted: m })
user.bankk -= count * 1
user.toruexp += count * 1
await conn.sendMessage(m.chat, { text: `Has retirado tus *[ ${currency2} ]* con exito.\n- Cantidad retirada: *+${count.toLocaleString()}* ${currency2}\n\n✦ Ahora corres el riesgo de que te roben.` }, { quoted: m })
}
handler.command = ['rt2', 'ret2']
handler.tags = ["rpg"]
handler.group = true
export default handler
