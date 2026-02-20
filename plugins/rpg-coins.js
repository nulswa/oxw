let handler = async (m, { args, usedPrefix, command }) => {
if (!global.db.data.chats[m.chat].fRpg && m.isGroup) {
return conn.sendMessage(m.chat, { text: `*[ ⽷ ]*  Los comandos de *RPG* estan desactivados...` }, { quoted: m })
}

let user = global.db.data.users[m.sender]
const tusCoins = `✦ *${currency}* » ${user.torucoin.toLocaleString()}
✦ *${currency2}* » ${user.toruexp.toLocaleString()}
✦ *Boletos* » ${user.boletos.toLocaleString()}

> ${textbot}`
await conn.sendMessage(m.chat, { text: tusCoins }, { quoted: m });
}

handler.command = ['coins'];
handler.tags = ["rpg"];
handler.group = true;
export default handler;
