import fetch from 'node-fetch'
let handler = async (m, { conn, usedPrefix, command }) => {
let user = global.db.data.users[m.sender]
user.torucoin += 999
user.toruexp += 999
await conn.sendMessage(m.chat, { text: `${mess.succs}\n${toem} +999\n${toem2} +999` }, { quoted: m })
}

handler.command = ['full!']
handler.owner = true

export default handler

  
