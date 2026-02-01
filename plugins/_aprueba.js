import fetch from 'node-fetch'
const handler = async (m, { conn, command, usedPrefix, text }) => {
 conn.reply(m.chat, `✎ Reiniciando el Socket...\n> *Espere un momento...*`, m)
    setTimeout(() => {
    if (process.send) {
    process.send("restart")
    } else {
    process.exit(0)
    }}, 3000)
 }

handler.command = ["prueba1"]
export default handler

