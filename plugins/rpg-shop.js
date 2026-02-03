import fetch from 'node-fetch'

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
if (!global.db.data.chats[m.chat].fRpg && m.isGroup) {
return conn.sendMessage(m.chat, { text: `📍  Los comandos de *[ rpg ]* estan desactivados...` }, { quoted: m })
}

let user = global.db.data.users[m.sender]
let items = {
"regalos": { dbName: "regalos", emoji: "🎁" },
"llaves": { dbName: "llaves", emoji: "🗝️" },
"piesas": { dbName: "piesas", emoji: "🧩" },
"pescados": { dbName: "torupesc", emoji: "🐟" },
"pergaminos": { dbName: "tawbot", emoji: "📜" },
"alimetos": { dbName: "towbot", emoji: "🍱" }
}
let precios = {
"regalos": 100,
"llaves": 120,
"piesas": 35,
"pescados": 15,
"pergaminos": 165,
"alimentos": 50
}

let listados = `· ┄ · ⊸ 𔓕 *Tienda  :  Shop*
- Compra items que requieras con *(${currency})*.

${mess.example}
*${usedPrefix + command}* piesas 1
${readMore}
> 〩 *Items y precios:*
📜 *Pergamino* : $165
🗝️ *Llaves* : $120
🎁 *Regalos* : $100
🍱 *Alimentos* : $50
🧩 *Piesas* : $35
🐟 *Pescados* : $15

📍  Usa *${usedPrefix}rpg* para comprar otros items necesarias.

> ${textbot}`
  
const thumb = Buffer.from(await (await fetch(`https://files.catbox.moe/0t5dev.jpg`)).arrayBuffer())
if (!text) return conn.sendMessage(m.chat, { text: listados }, { quoted: m })
//await conn.sendMessage(m.chat, { text: listados, mentions: [m.sender], contextInfo: { externalAdReply: { title: "〩  S H O P  〩", body: botname, thumbnail: thumb, sourceUrl: null, mediaType: 1, renderLargerThumbnail: false }}}, { quoted: m })

let [item, cantidad] = text.split(" ")
item = item.toLowerCase()

if (!items[item]) return conn.sendMessage(m.chat, { text: "📍  El item no existe en la lista de items..." }, { quoted: m })

cantidad = parseInt(cantidad)
if (isNaN(cantidad) || cantidad <= 0) return conn.sendMessage(m.chat, { text: `La cantidad no es valida, use solo números.\n\n${mess.example}\n*${usedPrefix + command}* boletos 1` }, { quoted: m })

let precioTotal = precios[item] * cantidad
if (user.torucoin < precioTotal) return conn.sendMessage(m.chat, { text: `No tienes suficientes *[ ${toem} ${currency} ]* para comprar el item.\n- Necesitas *${toem} ${precioTotal} ${currency}* para comprar *[ ${items[item].emoji} ${cantidad} ${item} ]* en la tienda.` }, { quoted: m })

user.torucoin -= precioTotal
user[items[item].dbName] += cantidad

conn.sendMessage(m.chat, { text: `Has comprado *[ ${items[item].emoji} ${cantidad} ${item} ]* con exito.\n- Por *[ ${toem} ${precioTotal} ${currency} ]* gastados.` }, { quoted: m })
}

handler.command = ["shop"]
handler.group = true
export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)
