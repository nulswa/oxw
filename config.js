import { watchFile, unwatchFile } from "fs"
import chalk from "chalk"
import axios from "axios"
import fetch from 'node-fetch'
import { fileURLToPath } from "url"
import fs from "fs"

global.botNumber = ""

global.owner = ["5493873655135", "5493873634786", "5493876639332", "523142183828"]
global.prems = ["5493873655135"]
global.mods = ["5493873655135"]
global.suittag = "5493873655135"

global.apikeyOptishield = "ebe2e764b8a003d278472b711498aec7" 

global.toruOptishield = async (params) => {
params.apikey = global.apikeyOptishield;
const { data: json } = await axios("https://optishield.uk/api/", { params });
return json
}

global.mess = {
  example: '✦  *Ejemplo de uso:*',
  unlink: '✦  *Invalid link for the requets...*',
  nosear: '✦  *No data found matching your search...*',
  neces: '✦  *Requires at least 2 items...*',
  fallo: '✦  *Failed to get metadata...*',
  noapi: '✦  *API status: (error code: X)...*',
  succs: '✓  *Command executed successfully...*',
  socket: '✦  *Only sub-bots can use this command...*',
  amigoss: '✦  *Only friends added by the owner...*'
}

global.fargs = {
  prop: '✦  *No puedes usar este comando...*',
  dAdmin: '✦  *Solo administradores del bot...*',
  moder: '✦  *Solo moderadores...*',
  prem: '✦  *Solo usuarios premium...*',
  grupo: '✦  *Solo en chats grupales...*',
  privado: '✦  *Solo en chats individuales...*',
  admins: '✦  *Solo administradores...*',
  bAdmin: '✦  *Solo si el bot es administrador...*',
  registro: '✦  *Añade tu nombre a la lista de usuarios.*\n\n> *Por ejemplo:*\n*#new* Alan',
  amigos: '✦  *Solo amigos agendados por @Farguts...*',
  estric: '✦  *Comando restringido...*'
}

global.botname = "⽷ TORU > Ⓒmx_3.0.2-lt (norm)"
global.modevs = "(norm)"
global.botweb = "https://ko-fi.com/farguts"
global.textbot = "ᴍᴏᴅᴜʟᴀʀ ᴡʜᴀᴛsᴀᴘᴘ ʙᴏᴛ ᴄʀᴇᴀᴛᴇᴅ ʙʏ @Farguts"
global.botcanal = "https://whatsapp.com/channel/0029Vb7Rtoc5K3zQ08ioYc21"
global.botgroup = "https://chat.whatsapp.com/I9bKP27LAx1FltvoBBH0kU"
global.toruImg = "https://i.postimg.cc/vmTrzt2Q/IMG-20260127-WA0051.jpg"
global.toruMenu = "https://i.postimg.cc/QtVfF3Zq/Picsart-26-01-17-02-46-49-331.jpg"

global.vs = "Ⓒmx_3.0.2-lt"
global.sessions = "Sessions/Principal"
global.jadi = "Sessions/SubBot"
global.alanWasock = true

global.currency = "Toems"
global.currency2 = "Wips"

global.emoji = "⽷"
global.toem = "💸"
global.toem2 = "🔮"
global.toruads = "⽷  Sin anuncios por el momento..."

global.toruCh = "https://i.postimg.cc/qRnCbb82/348d094689e5f711ca282a202f4f8ef1.jpg"

global.ch = { ch1: "120363424098891946@newsletter" }


let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
unwatchFile(file)
console.log(chalk.greenBright("Update 'config.js'"))
import(`${file}?update=${Date.now()}`)
})

