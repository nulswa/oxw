import { promises as fs } from 'fs'

const charactersFilePath = './scrapers/personajes.json'
const haremFilePath = './acrapers/harem.json'

async function loadCharacters() {
try {
const data = await fs.readFile(charactersFilePath, 'utf-8')
return JSON.parse(data)
} catch (error) {
throw new Error(error.message)
}
}

async function loadHarem() {
try {
const data = await fs.readFile(haremFilePath, 'utf-8')
return JSON.parse(data)
} catch (error) {
return []
}
}

let handler = async (m, { conn, args, participants }) => {
try {
const characters = await loadCharacters()
const harem = await loadHarem()
let rawUserId

if (m.quoted && m.quoted.sender) {
rawUserId = m.quoted.sender
} else if (m.mentionedJid && m.mentionedJid[0]) {
rawUserId = m.mentionedJid[0]
} else if (args[0] && args[0].startsWith('@')) {
rawUserId = args[0].replace('@', '') + '@s.whatsapp.net'
} else {
rawUserId = m.sender
}

let userId = rawUserId
if (rawUserId.endsWith('@lid') && m.isGroup) {
const pInfo = participants.find(p => p.lid === rawUserId)
if (pInfo && pInfo.id) userId = pInfo.id
}

const userCharacters = characters.filter(character => character.user === userId)

if (userCharacters.length === 0) {
await conn.sendMessage(m.chat, { text: `📍  No tienes personajes reclamados...` }, { quoted: m })
return
}

let pageArg = args.find(arg => /^\d+$/.test(arg))
const page = parseInt(pageArg) || 1
const charactersPerPage = 50
const totalCharacters = userCharacters.length
const totalPages = Math.ceil(totalCharacters / charactersPerPage)
const startIndex = (page - 1) * charactersPerPage
const endIndex = Math.min(startIndex + charactersPerPage, totalCharacters)

if (page < 1 || page > totalPages) {
await conn.sendMessage(m.chat, { text: `📍  La pagina no es valida.\n- Disponible del *1* al *${totalPages}*...` }, { quoted: m })
return
}

let message = `· ┄ · ⊸ 𔓕 *Claims  :  Harem*\n- Personajes reclamados.\n\n`
message += `▢ *Usuario* : @${userId.split('@')[0]}\n`
message += `▢ *Personajes* : ${totalCharacters}\n`
message += `▢ *Pagina* : ${page}/${totalPages}\n\n\n`

for (let i = startIndex; i < endIndex; i++) {
const character = userCharacters[i]
message += `🝔 ${character.name} » (*$${character.value}*)\n`
}

message += `> ${textbot}`

await conn.reply(m.chat, message, m, { mentions: [userId] })
} catch (error) {
conn.sendMessage(m.chat, { text: error.message }, { quoted: m })
}
}

handler.command = ['harem', 'claims']
handler.group = true

export default handler