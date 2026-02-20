const pHora = 1000
const pDia = 3000
const cHora = 1
const cDia = 20

let handler = async (m, { conn, usedPrefix, command, args }) => {
await conn.sendMessage(m.chat, { text: `Xd` }, { quoted: m })
}

handler.command = ['vip', 'premium']
handler.tags = ["tienda"]
export default handler

