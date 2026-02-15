import moment from 'moment-timezone'
import fetch from 'node-fetch' 

let handler = async (m, { conn, usedPrefix }) => {
const file = 'https://cdn.yupra.my.id/yp/6zu4qxn5.jpg'
let xd = `Mensaje de prueba xd`
await conn.sendMessage(m.chat, {
product: {
productImage: { url: global.toruMenu },
productId: '24529689176623820',
title: botname,
currencyCode: 'USD',
priceAmount1000: '1',
retailerId: 1677,
productImageCount: 1
},
businessOwnerJid: m.sender,
caption: xd.trim(),
footer: `\n${textbot}`,
interactiveButtons: [
{
name: 'cta_url',
buttonParamsJson: JSON.stringify({
display_text: 'Ko-Fi',
url: botweb
})
},
{
name: 'quick_reply',
buttonParamsJson: JSON.stringify({
display_text: 'MENU',
id: `${usedPrefix}menu`
})
}
],
mentions: [m.sender]
})
}

handler.command = ['test2']
export default handler
