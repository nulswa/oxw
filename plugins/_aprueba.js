import axios from 'axios'

const handler = async (m, { conn, text, usedPrefix, command}) => {
if (!text) return conn.sendMessage(m.chat, { text: `${mess.example}\n*${usedPrefix + command}* trends de baile.` }, { quoted: m })
const isUrl = /(?:https:?\/{2})?(?:www\.|vm\.|vt\.|t\.)?tiktok\.com\/([^\s&]+)/gi.test(text)
try {
await m.react('⏰')
if (isUrl) {
const res = await axios.get(`https://www.tikwm.com/api/?url=${encodeURIComponent(text)}?hd=1`)
const data = res.data?.data;
if (!data?.play) return conn.sendMessage(m.chat, { text: `No se han encontrado resultados.` }, { quoted: m })
const { title, duration, author, created_at, type, images, music, play } = data
const caption = createCaption(title, author, duration, created_at)
if (type === 'image' && Array.isArray(images)) {
const medias = images.map(url => ({ type: 'image', data: { url }, caption }));
await conn.sendSylphy(m.chat, medias, { quoted: m })
if (music) {
await conn.sendMessage(m.chat, { audio: { url: music }, mimetype: 'audio/mp4', fileName: 'tiktok_audio.mp4' }, { quoted: m })
}} else {
await conn.sendMessage(m.chat, { video: { url: play }, caption }, { quoted: m })
}} else {
const res = await axios({ method: 'POST', url: 'https://tikwm.com/api/feed/search', headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'Cookie': 'current_language=en', 'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36' }, data: { keywords: text, count: 20, cursor: 0, HD: 1 }})
const results = res.data?.data?.videos?.filter(v => v.play) || []
if (results.length < 2) return conn.reply(m.chat, 'Se requiere al menos 2 resultados.', m)
const medias = results.slice(0, 10).map(v => ({ type: 'video', data: { url: v.play }, caption: createSearchCaption(v) }))
await conn.sendSylphy(m.chat, medias, { quoted: m })
}

} catch (e) {
await await conn.sendMessage(m.chat, { text: `${e.message}` }, { quoted: m })
}}
function createCaption(title, author, duration, created_at = '') {
return `· ┄ · ⊸ 𔓕 *TikTok  :  Search*\n\n⏍ *Titulo:* ${title || 'Desconocido.'} / ${created_at || "Undefined Date."}\nⴵ *Duración:* ${duration || "Undefined."}\n🜲 *Creador:* ${author?.unique_id} *(@${author?.nickname})`
}
function createSearchCaption(data) {
return `· ┄ · ⊸ 𔓕 *TikTok  :  Search*

⏍ Tipo : *Search*
⏍ Fuente : *TikTok*
⏍ Resultados : *10* videos`
}

handler.help = ['tiktoks', 'tts']
handler.tags = ['buscadores']
handler.command = ['tiktoks', 'tts']

export default handler

