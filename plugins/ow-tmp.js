import { tmpdir } from 'os'
import path, {join} from 'path'
import { existsSync, readdirSync, readFileSync, statSync, unlinkSync, watch } from 'fs'
let handler = async (m, {conn, usedPrefix: _p, __dirname, command, args}) => {
if (!global.db.data.chats[m.chat].fOwners && m.isGroup) {
return conn.sendMessage(m.chat, { text: `*[ ⽷ ]*  Los comandos de *owners* estan desactivados...` }, { quoted: m })
}

await conn.sendMessage(m.chat, { text: `Limpiando carpeta *tmp*...` }, { quoted: m })
await m.react("📍")

const tmp = [tmpdir(), join(__dirname, '../tmp')]
const filename = []
tmp.forEach((dirname) => readdirSync(dirname).forEach((file) => filename.push(join(dirname, file))))
return filename.map((file) => {
const stats = statSync(file)
unlinkSync(file)
})

await conn.sendMessage(m.chat, { text: `${mess.succs}` }, { quoted: m })
} 

handler.command = ["tmp_d"]
handler.tags = ["propietario"]
handler.owner = true
export default handler

