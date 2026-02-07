import { sticker } from '../lib/sticker.js'
let handler = async (m, {conn}) => {

if (db.data.chats[m.chat].fAutoStick) {
let nombre = skpack //nombre del sticker en config.js
let nombre2 = skpack2 //nombre del sticker en config.js

//Sticker de hola
if (/^hola$/i.test(m.text)) {
let stiker = await sticker(null, hola[Math.floor(Math.random() * hola.length)], nombre, nombre2)
await delay(3 * 1000)
if (stiker)
await conn.sendMessage(m.chat, { sticker: stiker }, m )
}

//Copia y pega.
if (/^alegre$/i.test(m.text)) {
let stiker = await sticker(null, alegre[Math.floor(Math.random() * alegre.length)], nombre, nombre2)
await delay(3 * 1000)
if (stiker)
await conn.sendMessage(m.chat, { sticker: stiker }, m )
 }

if (/^amor$/i.test(m.text)) {
let stiker = await sticker(null, amor[Math.floor(Math.random() * amor.length)], nombre, nombre2)
await delay(3 * 1000)
if (stiker)
await conn.sendMessage(m.chat, { sticker: stiker }, { quoted: m })
 }

if (/^toru$/i.test(m.text)) {
let stiker = await sticker(null, toru[Math.floor(Math.random() * toru.length)], nombre, nombre2)
const tao = ['Que?', 'Ah?', '¿Que quieres?', 'Hmn.', 'Dime.']
let txt = tao[Math.floor(Math.random() * tao.length)]
conn.sendMessage(m.chat, { text: txt }, { quoted: m })
await delay(2 * 1000)
if (stiker)
await conn.sendMessage(m.chat, { sticker: stiker }, m )
 }

if (/^xd$/i.test(m.text)) {
let stiker = await sticker(null, xd[Math.floor(Math.random() * xd.length)], nombre, nombre2)
await delay(3 * 1000)
if (stiker)
await conn.sendMessage(m.chat, { sticker: stiker }, m )
 }

}}
handler.customPrefix = /hola|alegre|amor|xd|toru/i
handler.command = new RegExp()
export default handler

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const hola = [
'https://files.catbox.moe/m48dwb.jpg',
'https://files.catbox.moe/ce5bek.jpg',
'https://files.catbox.moe/69ukdx.jpg'
]

const alegre = [
'https://files.catbox.moe/bvlwza.jpg',
'https://files.catbox.moe/alwhkc.jpg',
'https://files.catbox.moe/yh0pu6.jpg'
]

const amor = [
'https://files.catbox.moe/reo4er.jpg',
'https://files.catbox.moe/7j6efk.jpg',
'https://files.catbox.moe/znuu79.jpg',
'https://files.catbox.moe/dfm6ln.jpg',
'https://files.catbox.moe/4tij7q.jpg',
'https://files.catbox.moe/vej9bc.jpg'
]

const toru = [
'https://files.catbox.moe/za6r0p.jpg',
'https://files.catbox.moe/0hu3ip.jpg',
'https://files.catbox.moe/e2sip0.jpg'
]

const xd = [
'https://files.catbox.moe/txgn7s.jpg',
'https://files.catbox.moe/fa7qiz.jpg',
'https://files.catbox.moe/wx7ay3.jpg',
'https://files.catbox.moe/ytbwzj.jpg',
'https://files.catbox.moe/lgd0mv.jpg'
]
