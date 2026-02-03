let handler = async (m, { args, usedPrefix, command }) => {
let user = global.db.data.users[m.sender]
const tusCoins = `
╭──────────────۰
│${toem} *${currency}* : ${user.torucoins}
│${toem2} *${currency2}* : ${user.toruexp}
╰──────────────۰

> ${textbot}`
await conn.sendMessage(m.chat, { text: tusCoins }, { quoted: m });
}

handler.command = ['coins', 'exps'];
handler.group = true;
export default handler;
