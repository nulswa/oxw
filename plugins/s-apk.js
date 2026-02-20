import { search, download } from 'aptoide-scraper'
var handler = async (m, { conn, usedPrefix, command, text }) => {
if (!global.db.data.chats[m.chat].fSearch && m.isGroup) {
return conn.sendMessage(m.chat, { text: `*[ ⽷ ]*  Los comandos de *búsquedas* estan desactivados...` }, { quoted: m })
}

if (!text) return conn.sendMessage(m.chat, { text: `${mess.example}\n*${usedPrefix + command}* WhatsApp` }, { quoted: m })
try {
await m.react("⏰")
let searchA = await search(text)
let data5 = await download(searchA[0].id)
let apkResultado = `· ┄ · ⊸ 𔓕 *Apk  :  Search*

> ${data5.name}
⩩ *Publicado* : ${data5.lastup}
⩩ *Peso* : ${data5.size}
⩩ *Paquete* : ${data5.package}

> ${textbot}`
const thumb = (await conn.getFile(data5.icon))?.data
await conn.sendMessage(m.chat, { text: apkResultado, mentions: [m.sender], contextInfo: { externalAdReply: { title: "⧿ Apk : Search ⧿", body: botname, thumbnail: thumb, sourceUrl: null, mediaType: 1, renderLargerThumbnail: false }}}, { quoted: m })
if (data5.size.includes('GB') || data5.size.replace(' MB', '') > 200) {
await m.react("💾")
return await conn.sendMessage(m.chat, { text: `El archivo es demasiado pesado para descargar.\n- El limite maximo de descarga es de 200MB.` }, { quoted: m })
}
await conn.sendMessage(m.chat, { document: { url: data5.dllink }, mimetype: 'application/vnd.android.package-archive', fileName: data5.name + '.apk', caption: null }, { quoted: m })
//await m.react("✅")
} catch (error) {
await conn.sendMessage(m.chat, { text: `${error.message}` }, { quoted: m })
}}
handler.command = ['apk', 'app']
handler.tags = ["busquedas"]
export default handler

