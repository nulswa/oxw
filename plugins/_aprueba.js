import pkg from '@whiskeysockets/baileys'
const {generateWAMessageFromContent, proto} = pkg

var handler = async (m, {conn, usedPrefix}) => {
let msg = generateWAMessageFromContent(
m.chat,
{
viewOnceMessage: {
message: {
messageContextInfo: {
deviceListMetadata: {},
deviceListMetadataVersion: 2
},
interactiveMessage: proto.Message.InteractiveMessage.create({
body: proto.Message.InteractiveMessage.Body.create({
text: 'test'
}),
footer: proto.Message.InteractiveMessage.Footer.create({
text: 'test'
}),
header: proto.Message.InteractiveMessage.Header.create({
title: 'test',
subtitle: 'test',
hasMediaAttachment: false
}),
nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
buttons: [
{
name: 'single_select',
buttonParamsJson:
'{"title":"title","sections":[{"title":"title","highlight_label":"label","rows":[{"header":"header","title":"title","description":"description","id":"id"},{"header":"header","title":"title","description":"description","id":"id"}]}]}'
},
{
name: 'quick_reply',
buttonParamsJson: '{"display_text":"quick_reply","usedPrefix":"menu"}'
},
{
name: 'cta_url',
buttonParamsJson: '{"display_text":"url","url":"https://www.google.com","merchant_url":"https://www.google.com"}'
},
{
name: 'cta_call',
buttonParamsJson: '{"display_text":"call","id":"message"}'
},
{
name: 'cta_copy',
buttonParamsJson: '{"display_text":"copy","id":"123456789","copy_code":"message"}'
},
{
name: 'cta_reminder',
buttonParamsJson: '{"display_text":"cta_reminder","id":"message"}'
},
{
name: 'cta_cancel_reminder',
buttonParamsJson: '{"display_text":"cta_cancel_reminder","id":"message"}'
},
{
name: 'address_message',
buttonParamsJson: '{"display_text":"address_message","id":"message"}'
},
{
name: 'send_location',
buttonParamsJson: ''
}
]
})
})
}
}
},
{}
)

await conn.relayMessage(msg.key.remoteJid, msg.message, {messageId: msg.key.id})
}
handler.command = ["test2"]

export default handler



/*import moment from 'moment-timezone'
import fetch from 'node-fetch' 

let handler = async (m, { conn, usedPrefix }) => {

const buttonParamsJson = JSON.stringify({
title: 'VER LISTA',
description: 'Infórmate por medios oficiales sobre GataBot',
sections: [
{
title: 'ℹ️ Información',
highlight_label: 'Popular',
rows: [
{
header: '✅ Redes',
title: '🔓 Para: Todos',
description: 'Infórmate por medios oficiales sobre GataBot',
id: usedPrefix + 'cuentasgb'
},
{header: '📢 Grupos/Canales', title: '🔓 Para: Todos', description: '¡Te esperamos!', id: usedPrefix + 'grupos'},
{
header: '🎁 Donar',
title: '🔓 Para: Todos',
description: 'GataBot se mantiene funcionando gracias a donaciones ¡tú también puedes sumarte apoyando el proyecto!',
id: usedPrefix + 'donar'
}
]
},
{
title: '🔖 Atajos',
highlight_label: 'Popular',
rows: [
{
header: '🆕 Ser Bot (código)',
title: '🔓 Para: Todos',
description: '¡Conviértete en Bot con el método de código de 8 dígitos!',
id: usedPrefix + 'serbot --code'
},
{header: '🤖 Ser Bot (qr)', title: '🔓 Para: Todos', description: 'Forma estándar de ser bot con código QR', id: '/serbot'},
{
header: '🚄 Velocidad',
title: '🔓 Para: Todos',
description: 'Seleccione esto si desea saber el ping del Bot',
id: usedPrefix + 'ping'
},
{header: '😺 Estado', title: '🔓 Para: Todos', description: 'Conoce en que estado se encuentra GataBot', id: usedPrefix + 'estado'}
]
},
{
title: 'Ⓜ️ Menú',
highlight_label: 'Popular',
rows: [{header: '⭐ Menú completo', title: '', description: 'Visita todos los comandos', id: usedPrefix + 'allmenu'}]
}
]
})
          
const file = 'https://cdn.yupra.my.id/yp/6zu4qxn5.jpg'
let xd = `Mensaje de prueba xd`
await conn.sendMessage(m.chat, {
product: {
productImage: { url: global.toruMenu },
productId: '24529689176623820',
title: botname,
currencyCode: 'USD',
priceAmount1000: '0',
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
display_text: 'tap here',
url: 'https://whatsapp.com/channel/0029Vb6BDQc0lwgsDN1GJ31i'
})
},
          {
            name: 'quick_reply',
            buttonParamsJson: JSON.stringify({
              display_text: 'MENU',
              id: `#menu`
            })
          },
          {
name: 'single_select',
buttonParamsJson
          }
],
mentions: [m.sender]
})
}

handler.command = ['test2']
export default handler
*/
