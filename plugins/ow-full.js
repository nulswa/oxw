import fetch from 'node-fetch'
let handler = async (m, { conn, usedPrefix, command }) => {
if (!global.db.data.chats[m.chat].fOwners && m.isGroup) {
return conn.sendMessage(m.chat, { text: `*[ ⽷ ]*  Los comandos de *owners* estan desactivados...` }, { quoted: m })
}

let user = global.db.data.users[m.sender]
user.torucoin += 999
user.toruexp += 999
await conn.sendMessage(m.chat, { text: `${mess.succs}\n${toem} +999\n${toem2} +999` }, { quoted: m })
}

handler.command = ['full!']
handler.tags = ["propietario"]
handler.owner = true

export default handler

  
