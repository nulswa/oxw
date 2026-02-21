import pkg from '@whiskeysockets/baileys'
import fs from 'fs'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone'
const { generateWAMessageFromContent, prepareWAMessageMedia, proto } = pkg

var handler = m => m
handler.all = async function (m) { 

  /*
const botJid = conn.user.jid
let settings = global.db.data.settings[botJid]

global.botMenu = settings?.menuBot || global.toruMenu
global.botImg = settings?.imgBot || global.toruImg
global.botName = settings?.nameBot || global.botname
global.botDesc = settings?.descBot || global.textbot
global.botLink = settings?.linkBot || global.botweb
global.botGroup = settings?.groupBot || global.botgroup
global.botCanal = settings?.canalBot || global.botcanal
global.botMon = settings?.moneBot || global.currency
global.botExp = settings?.expeBot || global.currency2
*/
  
global.canalIdM = ["120363424098891946@newsletter", "120363405568666234@newsletter"]
global.canalNombreM = ["[  MX COMMUNITY  ]", "[  MX  ]"]
global.channelRD = await getRandomChannel()

global.nombre = m.pushName || 'Anónimo'
global.skpack = `•ᗧ ·───── • ─────· ᗤ•\nNew Sticker : WhatsApp Bot\n•ᗧ ·───── • ─────· ᗤ•\n`
global.skpack2 = `\n${global.botname}`

global.wapi = "toru-api"
global.torub = "toru/baileys"
  
global.miapi = {
vreden: "https://api.vreden.web.id",
nekos: "https://api.nekolabs.web.id",
siput: "https://api.siputzx.my.id",
dls: "https://api.delirius.store",
izumi: "https://api.ootaizumi.web.id", 
faa: "https://api-faa.my.id",
xyro: "https://api.xyro.site",
yupra: "https://api.yupra.my.id"
}

global.fkontak = { key: { participants:"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }


}
export default handler

function pickRandom(list) {
return list[Math.floor(Math.random() * list.length)]
}

async function getRandomChannel() {
let randomIndex = Math.floor(Math.random() * canalIdM.length)
let id = canalIdM[randomIndex]
let name = canalNombreM[randomIndex]
return { id, name }
}
