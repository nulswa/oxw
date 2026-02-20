import fetch from 'node-fetch'

let handler = async (m, { text, conn, command, usedPrefix }) => {
if (!global.db.data.chats[m.chat].fSearch && m.isGroup) {
return conn.sendMessage(m.chat, { text: `*[ ⽷ ]*  Los comandos de *búsquedas* estan desactivados...` }, { quoted: m })
}

if (!text) return conn.sendMessage(m.chat, { text: `${mess.example}\n*${usedPrefix + command}* WhatsApp` }, { quoted: m })
try {
await m.react('⏰')
let api = await fetch(`https://api.vreden.web.id/api/v1/search/fdroid?query=${encodeURIComponent(text)}`)
let res = await api.json()
if (!res.result?.search_data?.length) return conn.sendMessage(m.chat, { text: `${mess.nosear}` }, { quoted: m })
let data = res.result.search_data
let count = res.result.count || data.length
let encabezado = `· ┄ · ⊸ 𔓕 *fdroid  :  search*

\t❒ *Busquedas* : ${text}
\t❒ *Resultados* : *${count}* apps
\t❒ *Fuente* : FDroid\n\n\n`
let listado = data.map(v => {
return `> ${v.name}
⩩ *Licencia* : ${v.license}
⩩ *Descripción* : ${v.summary}
⩩ *Enlace* : ${v.link}`
}).join('\n\n\n')
const fileToru = Buffer.from(await (await fetch(`https://raw.githubusercontent.com/nulswa/files/main/icons/icon-file.jpg`)).arrayBuffer())
await conn.sendMessage(m.chat, { text: encabezado + listado + `> ${textbot}`, mentions: [m.sender], contextInfo: { externalAdReply: { title: "⧿ FDroid : Search ⧿", body: botname, thumbnail: fileToru, sourceUrl: null, mediaType: 1, renderLargerThumbnail: false }}}, { quoted: m })
//await m.react('✅')
} catch (e) {
conn.sendMessage(m.chat, { text: `${e.message}` }, { quoted: m })
}
}

handler.command = ['fds', 'fdroids']
handler.tags = ["busquedas"]
export default handler
