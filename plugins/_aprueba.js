import fetch from 'node-fetch'
const handler = async (m, { conn, command, usedPrefix, text }) => {
let hola = `Mensaje de idioma:

${mssg.ejemplo}\n*${usedPrefix}lang* en`
await conn.sendMessage(m.chat, { text: hola }, { quoted: m })
}

handler.command = ["prueba1"]
export default handler

