import cp from 'child_process'
import { promisify } from 'util'
const exec = promisify(cp.exec).bind(cp)

const handler = async (m) => {
if (!global.db.data.chats[m.chat].fInformation && m.isGroup) {
return conn.sendMessage(m.chat, { text: `*[ ⽷ ]*  Los comandos de *información* estan desactivados...` }, { quoted: m })
}

let o
m.react("⏰")
try {
o = await exec('python3 speed.py --secure --share')
const {stdout, stderr} = o
if (stdout.trim()) {
const match = stdout.match(/http[^"]+\.png/)
const urlImagen = match ? match[0] : null
await conn.sendMessage(m.chat, {image: {url: urlImagen}, caption: stdout.trim()}, {quoted: m})
}
if (stderr.trim()) {
const match2 = stderr.match(/http[^"]+\.png/)
const urlImagen2 = match2 ? match2[0] : null
await conn.sendMessage(m.chat, {image: {url: urlImagen2}, caption: stderr.trim()}, {quoted: m})
}
} catch (e) {
o = e.message
return m.reply(o)
}
}
handler.command = ["speed"]
handler.tags = ["informacion"]
export default handler
