import axios from 'axios'
import fetch from 'node-fetch'
let handler = async (m, { conn, usedPrefix, command, text, args }) => {
let prueba, prueba2, prueba3
const img = Buffer.from(await (await fetch(`${global.toruImg}`)).arrayBuffer())
const img2 = Buffer.from(await (await fetch(`${global.toruMenu}`)).arrayBuffer())

const buttonUrl = { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: 'URL', url: 'https://whatsapp.com/channel/0029Vb7Rtoc5K3zQ08ioYc21'}) }
const buttonReply = { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: 'prueba', id: `prueba` }) }
const buttonCopy = { name: 'cta_copy', buttonParamsJson: JSON.stringify({ display_text: "Copiar", id: "prueba", copy_code: `prueba` }) }
const buttonList = { name: 'single_select', buttonParamsJson = JSON.stringify({ title: 'VER LISTA', description: 'Mensaje descripción', sections: [ { title: '📍 Primera Lista', highlight_label: 'Popular', rows: [ { header: 'Mensaje de prueba.', title: 'Mensaje titular.', description: 'Mensaje descripción.', id: 'prueba' }, { header: 'Mensaje de prueba.', title: 'Mensaje titular.', description: 'Mensaje descripción.', id: 'prueba' }, { header: 'Mensaje de prueba.', title: 'Mensaje titular.', description: 'Mensaje descripción.', id: 'prueba' } ] }, { title: '📍 Segunda Lista', highlight_label: 'Popular', rows: [ { header: 'Mensaje de prueba.', title: 'Mensaje titular.', description: 'Mensaje descripción.', id: 'prueba' }, { header: 'Mensaje de prueba.', title: 'Mensaje titular.', description: 'Mensaje descripción.', id: 'prueba' }, { header: 'Mensaje de prueba.', title: 'Mensaje titular.', description: 'Mensaje descripción.', id: 'prueba' } ] } )} }

if (command === "text1") {
prueba = `Mensaje de prueba.`
return conn.sendMessage(m.chat, { text: prueba }, { quoted: m })
}

if (command === "text2") {
prueba = `Mensaje de prueba.`
prueba2 = `Mensaje titular.`
prueba3 = `Mensaje descripción.`
return await conn.sendMessage(m.chat, { text: prueba, mentions: [m.sender], contextInfo: { externalAdReply: { title: prueba2, body: prueba3, thumbnail: img, sourceUrl: null, mediaType: 1, renderLargerThumbnail: false }}}, { quoted: m })
}

if (command === "text3") {
prueba = `Mensaje de prueba.`
prueba2 = `Mensaje titular.`
prueba3 = `Mensaje descripción.`
return conn.sendMessage(m.chat, { text: prueba, contextInfo: { forwardingScore: 1, isForwarded: false, externalAdReply: { showAdAttribution: false, renderLargerThumbnail: true, title: prueba2, body: prueba3, containsAutoReply: true, mediaType: 1, thumbnailUrl: global.toruMenu, sourceUrl: null }}}, { quoted: m })
}

if (command === "text4") {
prueba = `Mensaje de prueba.`
prueba3 = `Mensaje descripción.`
await conn.sendMessage(m.chat, { product: { productImage: { url: img2 }, productId: '24529689176623820', title: botname, currencyCode: 'USD', priceAmount1000: '0', retailerId: 1677, productImageCount: 1 }, businessOwnerJid: m.sender, caption: prueba.trim(), footer: `\n${prueba3}`, interactiveButtons: [
buttonUrl
], mentions: [m.sender] })
//conn.sendMessage(m.chat, { text: prueba }, { quoted: m })
}

if (command === "text5") {
prueba = `Mensaje de prueba.`
prueba3 = `Mensaje descripción.`
await conn.sendMessage(m.chat, { product: { productImage: { url: img2 }, productId: '24529689176623820', title: botname, currencyCode: 'USD', priceAmount1000: '0', retailerId: 1677, productImageCount: 1 }, businessOwnerJid: m.sender, caption: prueba.trim(), footer: `\n${prueba3}`, interactiveButtons: [
buttonUrl
], mentions: [m.sender] })
//conn.sendMessage(m.chat, { text: prueba }, { quoted: m })
}

if (command === "text6") {
prueba = `Mensaje de prueba.`
prueba3 = `Mensaje descripción.`
await conn.sendMessage(m.chat, { product: { productImage: { url: img2 }, productId: '24529689176623820', title: botname, currencyCode: 'USD', priceAmount1000: '0', retailerId: 1677, productImageCount: 1 }, businessOwnerJid: m.sender, caption: prueba.trim(), footer: `\n${prueba3}`, interactiveButtons: [
buttonUrl
], mentions: [m.sender] })
//conn.sendMessage(m.chat, { text: prueba }, { quoted: m })
}

if (command === "text7") {
prueba = `Mensaje de prueba.`
prueba3 = `Mensaje descripción.`
await conn.sendMessage(m.chat, { product: { productImage: { url: img2 }, productId: '24529689176623820', title: botname, currencyCode: 'USD', priceAmount1000: '0', retailerId: 1677, productImageCount: 1 }, businessOwnerJid: m.sender, caption: prueba.trim(), footer: `\n${prueba3}`, interactiveButtons: [
buttonReply
], mentions: [m.sender] })
//conn.sendMessage(m.chat, { text: prueba }, { quoted: m })
}

if (command === "text8") {
prueba = `Mensaje de prueba.`
prueba3 = `Mensaje descripción.`
await conn.sendMessage(m.chat, { product: { productImage: { url: img2 }, productId: '24529689176623820', title: botname, currencyCode: 'USD', priceAmount1000: '0', retailerId: 1677, productImageCount: 1 }, businessOwnerJid: m.sender, caption: prueba.trim(), footer: `\n${prueba3}`, interactiveButtons: [
buttonCopy
], mentions: [m.sender] })
//conn.sendMessage(m.chat, { text: prueba }, { quoted: m })
}

if (command === "text9") {
prueba = `Mensaje de prueba.`
prueba3 = `Mensaje descripción.`
await conn.sendMessage(m.chat, { product: { productImage: { url: img2 }, productId: '24529689176623820', title: botname, currencyCode: 'USD', priceAmount1000: '0', retailerId: 1677, productImageCount: 1 }, businessOwnerJid: m.sender, caption: prueba.trim(), footer: `\n${prueba3}`, interactiveButtons: [
buttonList
], mentions: [m.sender] })
//conn.sendMessage(m.chat, { text: prueba }, { quoted: m })
}

if (command === "text10") {
prueba = `Mensaje de prueba.`
prueba3 = `Mensaje descripción.`
await conn.sendMessage(m.chat, { product: { productImage: { url: img2 }, productId: '24529689176623820', title: botname, currencyCode: 'USD', priceAmount1000: '0', retailerId: 1677, productImageCount: 1 }, businessOwnerJid: m.sender, caption: prueba.trim(), footer: `\n${prueba3}`, interactiveButtons: [
buttonReply,
buttonList
], mentions: [m.sender] })
//conn.sendMessage(m.chat, { text: prueba }, { quoted: m })
}

if (command === "text11") {
prueba = `Mensaje de prueba.`
prueba3 = `Mensaje descripción.`
await conn.sendMessage(m.chat, { product: { productImage: { url: img2 }, productId: '24529689176623820', title: botname, currencyCode: 'USD', priceAmount1000: '0', retailerId: 1677, productImageCount: 1 }, businessOwnerJid: m.sender, caption: prueba.trim(), footer: `\n${prueba3}`, interactiveButtons: [
buttonList,
buttonReply,
buttonUrl
], mentions: [m.sender] })
//conn.sendMessage(m.chat, { text: prueba }, { quoted: m })
}

if (command === "text12") {
prueba = `Mensaje de prueba.`
prueba3 = `Mensaje descripción.`
await conn.sendMessage(m.chat, { product: { productImage: { url: img2 }, productId: '24529689176623820', title: botname, currencyCode: 'USD', priceAmount1000: '0', retailerId: 1677, productImageCount: 1 }, businessOwnerJid: m.sender, caption: prueba.trim(), footer: `\n${prueba3}`, interactiveButtons: [
buttonList,
buttonReply,
buttonUrl,
buttonCopy
], mentions: [m.sender] })
//conn.sendMessage(m.chat, { text: prueba }, { quoted: m })
}

}
handler.command = ["text1", "text2", "text3", "text4", "text5", "text6", "text7", "text8", "text9", "text10", "text11", "text12"]
handler.tags = ["pruebas"]
export default handler



