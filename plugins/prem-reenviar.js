let handler = async (m, { conn, args }) => {
if (!global.db.data.chats[m.chat].fPremium && m.isGroup) {
return conn.sendMessage(m.chat, { text: `*[ ⽷ ]*  Este comando es exclusivo para el plan *[ Premium ]*\n- Usa *#plan* para ver los planes disponibles.` }, { quoted: m })
}

if (!m.quoted) return conn.sendMessage(m.chat, { text: `${emoji} Responda a un mensaje para reenviarlo.` }, { quoted: m })
let q = m.quoted ? m.quoted : m
let msg = await m.getQuotedObj()
let mime = (q.msg || q).mimetype || ''
let modo = (args[0] || '').toLowerCase()

if (modo === 'bot') {
if (/image|video|audio|webp|document/.test(mime)) {
let media = await q.download()
await conn.sendFile(m.chat, media, '', q.text || '', m)
} else if (q.text) {
await conn.sendMessage(m.chat, { text: q.text }, { quoted: m })
}
} else {
await conn.copyNForward(m.chat, msg, true)
}
}

handler.command = ['forward', 'rv']
handler.tags = ["premium"]
export default handler

