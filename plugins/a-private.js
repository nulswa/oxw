export async function before(m, { conn, isAdmin, isBotAdmin, isROwner }) {
if (m.isBaileys && m.fromMe) return !0
if (m.isGroup) return !1
if (!m.message) return !0
if (m.sender === conn.user?.jid) return
if (m.text.includes('PIEDRA') || m.text.includes('PAPEL') || m.text.includes('TIJERA') || m.text.includes('code') || m.text.includes('qr')) return !0
const chat = global.db.data.chats[m.chat]
const bot = global.db.data.settings[conn.user.jid] || {}
let mensajito = `📍  Hola usuario.
- No puedes hablar individualmente con el bot.

> \`Sugerencia\`
- Te sugerimos que uses el bot en un chat grupal, sea alojado o principal.
- Unete al nuevo canal de este proyecto para que puedas enterarte de nuevas novedades.

Gracias por leer.
*att:* Farguts.`
if (m.chat === '120363402356085997@newsletter') return !0
if (bot.fPrivado && !isROwner) {
await await conn.sendMessage(m.chat, { product: { productImage: { url: global.toruMenu }, productId: '24529689176623820', title: botname, currencyCode: 'USD', priceAmount1000: '0', retailerId: 1677, productImageCount: 1 }, businessOwnerJid: m.sender, caption: mensajito.trim(), footer: `\n¡Unete a nuestro nuevo canal!`, interactiveButtons: [
{ name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: 'canal', url: 'https://whatsapp.com/channel/0029Vb7Rtoc5K3zQ08ioYc21'}) }
], mentions: [m.sender] })
//conn.sendMessage(m.chat, { text: mensajito, mentions: await conn.parseMention(mensajito) }, { quoted: m })
await this.updateBlockStatus(m.chat, 'block')
}
return !1
}
