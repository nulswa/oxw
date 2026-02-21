import fetch from 'node-fetch'
let regex = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i
let handler = async (m, { args, usedPrefix, command, text }) => {
if (!global.db.data.chats[m.chat].fDescargas && m.isGroup) {
return conn.sendMessage(m.chat, { text: `*[ ⽷ ]*  Los comandos de *descargas* estan desactivados...` }, { quoted: m })
}

const botJid = conn.user.jid
let settings = global.db.data.settings[botJid]

const botName = settings?.nameBot || global.botname
const botDesc = settings?.descBot || global.textbot
const botImg = settings?.imgBot || global.toruImg
const botMenu = settings?.menuBot || global.toruMenu

let pruebaXd = `${mess.example}\n*${usedPrefix + command}* https://github.com/xxxx/xxxx`
if (!args[0]) return conn.sendMessage(m.chat, { text: pruebaXd }, { quoted: m })
if (!regex.test(args[0])) return conn.sendMessage(m.chat, { text: mess.unlink }, { quoted: m })
let [_, user, repo] = args[0].match(regex) || []
let sanitizedRepo = repo.replace(/.git$/, '')
let repoUrl = `https://api.github.com/repos/${user}/${sanitizedRepo}`
let zipUrl = `https://api.github.com/repos/${user}/${sanitizedRepo}/zipball`
await m.react("⏰")
const thumb = Buffer.from(await (await fetch(`${botImg}`)).arrayBuffer())
try {
let [repoResponse, zipResponse] = await Promise.all([
fetch(repoUrl),
fetch(zipUrl),
])
let repoData = await repoResponse.json()
let filename = zipResponse.headers.get('content-disposition').match(/attachment; filename=(.*)/)[1]
let type = zipResponse.headers.get('content-type')
let txt = `· ┄ · ⊸ 𔓕 *GitHub : Download*

\t＃ *Usuario* : ${user} 
\t＃ *Repo* : ${sanitizedRepo}
\t＃ *Enlace* : ${args[0]}

📍  *Descripción* : ${repoData.description || 'Undefined'}

> ${botDesc}`
await await conn.sendMessage(m.chat, { text: txt, mentions: [m.sender], contextInfo: { externalAdReply: { title: `⧿ GitHub : Download ⧿`, body: botName, thumbnail: thumb, sourceUrl: null, mediaType: 1, renderLargerThumbnail: false }}}, { quoted: m })
conn.sendFile(m.chat, await zipResponse.buffer(), filename, `${botName}\n> ${botDesc}`, m)
//await m.react("✅")
} catch (e) {
await conn.sendMessage(m.chat, { text: `${e.message}` }, { quoted: m })
}
}
handler.command = ["git", "github"]
handler.tags = ["descargas"]
export default handler


