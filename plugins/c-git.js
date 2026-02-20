import fetch from 'node-fetch'
import { fileTypeFromBuffer } from "file-type"
import crypto from "crypto"

const GITHUB_TOKEN = '' // Reemplaza con tu token personal de GitHub
const GITHUB_OWNER = '' // Dueño del repositorio
const GITHUB_REPO = '' // Nombre del repositorio
const GITHUB_BRANCH = 'main' // Rama donde se subirán los archivos (puede ser 'main' o 'master')
let handler = async (m, { conn, args, usedPrefix, command, text }) => {
if (!global.db.data.chats[m.chat].fConvert && m.isGroup) {
return conn.sendMessage(m.chat, { text: `*[ ⽷ ]*  Los comandos de *convertidor* estan desactivados...` }, { quoted: m })
}

try {
let q = m.quoted ? m.quoted : m
let mime = (q.msg || q).mimetype || ''

if (!mime) {
return conn.sendMessage(m.chat, { text: `${emoji} Responda a una extensión para subirlo a Mediafire.` }, { quoted: m })
}

const media = await q.download()

const fileType = await fileTypeFromBuffer(media)
const ext = fileType ? fileType.ext : 'bin'
const fuente = "GitHub"
const randomName = crypto.randomBytes(8).toString('hex')
const fileName = `${randomName}.${ext}`

await m.react("⏰")
//conn.sendMessage(m.chat, { text: `Subiendo archivo al repositorio...` }, { quoted: m })

const link = await uploadToGitHub(media, fileName)
let toruContext = `· ┄ · ⊸ 𔓕 *Upload : GitHub*

\t＃ *Nombre* : ${fileName}
\t＃ *Peso* : ${formatBytes(media.length)}
\t＃ *Fuente* : ${fuente}
\t＃ *Enlace* : ${link}

> ${textbot}`
await conn.sendMessage(m.chat, { text: toruContext }, { quoted: m })

} catch (error) {
console.error('Error:', error)
await conn.sendMessage(m.chat, { 
text: `${error.message}` 
}, { quoted: m })
}
}

handler.command = ["upgit"]
handler.tags = ["convertidor"]
export default handler

function formatBytes(bytes) {
if (bytes === 0) return '0 B'
const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
const i = Math.floor(Math.log(bytes) / Math.log(1024))
return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`
}

async function uploadToGitHub(buffer, fileName) {
try {

const content = buffer.toString('base64')

const filePath = `uploads/${fileName}`

const body = {
message: `Upload ${fileName}`,
content: content,
branch: GITHUB_BRANCH
}

const response = await fetch(
`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`,
{
method: 'PUT',
headers: {
'Authorization': `token ${GITHUB_TOKEN}`,
'Content-Type': 'application/json',
'User-Agent': 'WhatsApp-Bot'
},
body: JSON.stringify(body)
}
)

if (!response.ok) {
const errorData = await response.json()
throw new Error(`${errorData.message || response.statusText}`)
}

const data = await response.json()

return data.content.download_url || data.content.html_url

} catch (error) {
throw new Error(`${error.message}`)
}
}

