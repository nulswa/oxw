import axios from 'axios'

let handler = async (m, { conn, text, usedPrefix, command }) => {
let user = global.db.data.users[m.sender];

if (!user.premium || user.premiumTime < Date.now()) {
return conn.sendMessage(m.chat, { text: `📍  No tienes el estado como *[ Premium ]*\n- Puedes usar *${usedPrefix}addme* para solicitar un nuevo plan.` }, { quoted: m });
}

if (!text) {
return conn.sendMessage(m.chat, { text: `${mess.example}\n*${usedPrefix + command}* Genera un gato bailando con sombrero.` }, { quoted: m });
}

try {
await conn.sendMessage(m.chat, { text: `Generando el video, espere 2-3 minutos...` }, { quoted: m });

const apiUrl = `https://mayapi.ooguy.com/ai-sora?q=${encodeURIComponent(text)}&apikey=may-f53d1d49`

let res;
try {
res = await axios.get(apiUrl, { timeout: 60000 })
} catch (apiError) {
throw new Error(`${mess.noapi}`);
}

const videoUrl = res?.data?.video

if (!videoUrl) {
throw new Error(`${mess.fallo}`);
}

await conn.sendFile(m.chat, videoUrl, 'miku-sora-video.mp4', `${botname}\n> ${textbot}`, m)
//await m.react('✅')
} catch (error) {
await conn.sendMessage(m.chat, { text: error.message }, { quoted: m });
}
}


handler.command = ['sora']
handler.premium = true

export default handler

