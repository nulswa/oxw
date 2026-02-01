import { sticker } from '../lib/sticker.js'
let handler = async (m, {conn}) => {

if (db.data.chats[m.chat].fAutoStick) {
let nombre = 'new sticker' //nombre del sticker en config.js
let nombre2 = 'toru-mx' //nombre del sticker en config.js

//Sticker de hola
if (/^hola|hello|holi|oli|ola$/i.test(m.text)) {
let stiker = await sticker(null, hola[Math.floor(Math.random() * hola.length)], nombre, nombre2) //Cambia "hola" por otro constante si copias este.
await delay(3 * 3000)
if (stiker)
await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m)
  //conn.sendMessage(m.chat, { sticker: stiker }, { quoted: m })
}

//Copia y pega.


}}
handler.customPrefix = /hola|hello|holi|oli|ola/i
handler.command = new RegExp()
export default handler

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

//Agrega mas consonantes y define su argumento.
//Constante hola
const hola = [
'https://c.tenor.com/-8qgEEd80skAAAAi/chika.gif',
'https://c.tenor.com/GLpWclhFs28AAAAi/mine-funny.gif',
'https://c.tenor.com/KyoAsIz_GH8AAAAi/heat-wave.gif'
]

/* //copiar
const = [
'',
'',
''
]
*/ 

//Agrega comas cada nuevo url que agregues pero no agregues coma al ultimo url.
