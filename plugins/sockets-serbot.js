const { useMultiFileAuthState, DisconnectReason, makeCacheableSignalKeyStore, fetchLatestBaileysVersion } = (await import("@whiskeysockets/baileys"))
import qrcode from "qrcode"
import NodeCache from "node-cache"
import fs from "fs"
import path from "path"
import pino from 'pino'
import chalk from 'chalk'
import util from 'util'
import * as ws from 'ws'
const { child, spawn, exec } = await import('child_process')
const { CONNECTING } = ws
import { makeWASocket } from '../lib/simple.js'
import { fileURLToPath } from 'url'
let crm1 = "Y2QgcGx1Z2lucy"
let crm2 = "A7IG1kNXN1b"
let crm3 = "SBpbmZvLWRvbmFyLmpz"
let crm4 = "IF9hdXRvcmVzcG9uZGVyLmpzIGluZm8tYm90Lmpz"
let drm1 = ""
let drm2 = ""
let rtx = `📍 Conectate como *sub-bot*.
- Escanea el codigo QR para vincularte.

1. _Entra en los tres puntos._
2. _Presiona en *Dispositivos Vinculado*._
3. _Presiona en *Vincular un dispositivo*._

⏰ Escanea el codigo *QR*, expira en *45* segundos...`
let rtx2 = `📍 Conectate como *sub-bot*.
- Copia y pega el codigo de emparejamiento.

1. _Se te enviará un codigo de *8* caracteres._
2. _Copia el codigo y entra a la notificación._
3. _Pega el codigo y conectate._

⏰ El codigo expirara en *45* segundos...`
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const alanJs_Option = {}
if (global.conns instanceof Array) console.log()
else global.conns = []
function isSubBotConnected(jid) { return global.conns.some(sock => sock?.user?.jid && sock.user.jid.split("@")[0] === jid.split("@")[0]) }
let handler = async (m, { conn, args, usedPrefix, command, isOwner }) => {
if (!global.db.data.chats[m.chat].fPremium && m.isGroup) {
return conn.sendMessage(m.chat, { text: `*[ ⽷ ]*  Este comando es exclusivo para el plan *[ Premium ]*\n- Usa *#plan* para ver los planes disponibles.` }, { quoted: m })
}

let time = global.db.data.users[m.sender].Subs + 120000
if (new Date - global.db.data.users[m.sender].Subs < 120000) return conn.reply(m.chat, `📍  Debe de esperar ${msToTime(time - new Date())} para volver a usar el comando.`, m)
let socklimit = global.conns.filter(sock => sock?.user).length
if (socklimit >= 15) {
return conn.reply(m.chat, "📍  No hay servidores activos por el momento.\n- Los servidores estan llenos.", m)
}
let mentionedJid = await m.mentionedJid
let who = mentionedJid && mentionedJid[0] ? mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let id = `${who.split`@`[0]}`
let alanJsPath = path.join(`./${jadi}/`, id)
if (!fs.existsSync(alanJsPath)){
fs.mkdirSync(alanJsPath, { recursive: true })
}
alanJs_Option.alanJsPath = alanJsPath
alanJs_Option.m = m
alanJs_Option.conn = conn
alanJs_Option.args = args
alanJs_Option.usedPrefix = usedPrefix
alanJs_Option.command = command
alanJs_Option.fromCommand = true
alanJsWa(alanJs_Option)
global.db.data.users[m.sender].Subs = new Date * 1
}

handler.tags = ["socket"]
handler.command = ['code', 'serbot']
export default handler 

export async function alanJsWa(options) {
let { alanJsPath, m, conn, args, usedPrefix, command } = options
if (command === 'newserver') {
command = 'newbot'
args.unshift('digito')
}
const mcode = args[0] && /(--wa|8)/.test(args[0].trim()) ? true : args[1] && /(--wa|8)/.test(args[1].trim()) ? true : false
let txtCode, codeBot, txtQR
if (mcode) {
args[0] = args[0].replace(/^--wa$|^8$/, "").trim()
if (args[1]) args[1] = args[1].replace(/^--wa$|^8$/, "").trim()
if (args[0] == "") args[0] = undefined
}
const pathCreds = path.join(alanJsPath, "creds.json")
if (!fs.existsSync(alanJsPath)){
fs.mkdirSync(alanJsPath, { recursive: true })}
try {
args[0] && args[0] != undefined ? fs.writeFileSync(pathCreds, JSON.stringify(JSON.parse(Buffer.from(args[0], "base64").toString("utf-8")), null, '\t')) : ""
} catch {
conn.reply(m.chat, `📍  Debe de ingresar el comando mas el codigo o simplemente ingresarlo.\n\n• Por ejemplo:\n*#newbot* = (normal qr)\n*#newbot* digito = (por codigo)`, m)
return
}
const comb = Buffer.from(crm1 + crm2 + crm3 + crm4, "base64")
exec(comb.toString("utf-8"), async (err, stdout, stderr) => {
const drmer = Buffer.from(drm1 + drm2, `base64`)
let { version, isLatest } = await fetchLatestBaileysVersion()
const msgRetry = (MessageRetryMap) => { }
const msgRetryCache = new NodeCache()
const { state, saveState, saveCreds } = await useMultiFileAuthState(alanJsPath)
const connectionOptions = {
logger: pino({ level: "fatal" }),
printQRInTerminal: false,
auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({level: 'silent'})) },
msgRetry,
msgRetryCache, 
browser: ['Windows', 'Firefox'],
version: version,
generateHighQualityLinkPreview: true
}
let sock = makeWASocket(connectionOptions)
sock.isInit = false
let isInit = true
setTimeout(async () => {
if (!sock.user) {
try { fs.rmSync(alanJsPath, { recursive: true, force: true }) } catch {}
try { sock.ws?.close() } catch {}
sock.ev.removeAllListeners()
let i = global.conns.indexOf(sock)
if (i >= 0) global.conns.splice(i, 1)
console.log(`[AUTO-LIMPIEZA] Sesión ${path.basename(alanJsPath)} eliminada credenciales invalidos.`)
}}, 60000)
async function connectionUpdate(update) {
const { connection, lastDisconnect, isNewLogin, qr } = update
if (isNewLogin) sock.isInit = false
if (qr && !mcode) {
if (m?.chat) {
txtQR = await conn.sendMessage(m.chat, { image: await qrcode.toBuffer(qr, { scale: 8 }), caption: rtx.trim()}, { quoted: m})
} else {
return 
}
if (txtQR && txtQR.key) {
setTimeout(() => { conn.sendMessage(m.sender, { delete: txtQR.key })}, 30000)
}
return
} 
if (qr && mcode) {
let secret = await sock.requestPairingCode((m.sender.split`@`[0]))
secret = secret.match(/.{1,4}/g)?.join("-")
txtCode = await conn.sendMessage(m.chat, {image: { url: `https://i.postimg.cc/Y0gqYR4g/Picsart-26-01-31-23-16-33-390.jpg` }, caption: rtx2}, { quoted: m })
codeBot = await conn.reply(m.chat, secret, m)
console.log(secret)
}
if (txtCode && txtCode.key) {
setTimeout(() => { conn.sendMessage(m.sender, { delete: txtCode.key })}, 30000)
}
if (codeBot && codeBot.key) {
setTimeout(() => { conn.sendMessage(m.sender, { delete: codeBot.key })}, 30000)
}
const endSesion = async (loaded) => {
if (!loaded) {
try {
sock.ws.close()
} catch {
}
sock.ev.removeAllListeners()
let i = global.conns.indexOf(sock)                
if (i < 0) return 
delete global.conns[i]
global.conns.splice(i, 1)
}}
const reason = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode
if (connection === 'close') {
if (reason === 428) {
console.log(chalk.bold.magentaBright(`\n📍 La conexión (+${path.basename(alanJsPath)}) fue cerrada inesperadamente. Intentando reconectar...`))
await creloadHandler(true).catch(console.error)
}
if (reason === 408) {
console.log(chalk.bold.magentaBright(`\n📍 La conexión (+${path.basename(alanJsPath)}) se perdió o expiró. Razón: ${reason}. Intentando reconectar...`))
await creloadHandler(true).catch(console.error)
}
if (reason === 440) {
console.log(chalk.bold.magentaBright(`\n📍 La conexión (+${path.basename(alanJsPath)}) fue reemplazada por otra sesión activa.`))
try {
if (options.fromCommand) m?.chat ? await conn.sendMessage(`${path.basename(alanJsPath)}@s.whatsapp.net`, {text : '📍  Elimine la sesion nueva para evitar errores...' }, { quoted: m || null }) : ""
} catch (error) {
console.error(chalk.bold.yellow(`🔐 Error 440 no se pudo enviar mensaje a: +${path.basename(alanJsPath)}`))
}}
if (reason == 405 || reason == 401) {
console.log(chalk.bold.magentaBright(`\n📍 La sesión (+${path.basename(alanJsPath)}) fue cerrada. Credenciales no válidas o dispositivo desconectado manualmente.`))
try {
if (options.fromCommand) m?.chat ? await conn.sendMessage(`${path.basename(alanJsPath)}@s.whatsapp.net`, {text : '📍  Se ha perdido la conexión, esto puede ser una desconexión manual o error.' }, { quoted: m || null }) : ""
} catch (error) {
console.error(chalk.bold.yellow(`🔐 Error 405 no se pudo enviar mensaje a: +${path.basename(alanJsPath)}`))
}
fs.rmdirSync(alanJsPath, { recursive: true })
}
if (reason === 500) {
console.log(chalk.bold.magentaBright(`\n📍  Conexión perdida en la sesión (+${path.basename(alanJsPath)}). Borrando datos...`))
if (options.fromCommand) m?.chat ? await conn.sendMessage(`${path.basename(alanJsPath)}@s.whatsapp.net`, {text : '📍  Conexion perdida, esto puede ser un error o desconexión en el dispositivo.' }, { quoted: m || null }) : ""
return creloadHandler(true).catch(console.error)
}
if (reason === 515) {
console.log(chalk.bold.magentaBright(`\n📍  Reinicio automático para la sesión (+${path.basename(alanJsPath)}).`))
await creloadHandler(true).catch(console.error)
}
if (reason === 403) {
console.log(chalk.bold.magentaBright(`\n📍  Sesión cerrada o cuenta en soporte para la sesión (+${path.basename(alanJsPath)}).`))
fs.rmdirSync(alanJsPath, { recursive: true })
}}
if (global.db.data == null) loadDatabase()
if (connection == `open`) {
if (!global.db.data?.users) loadDatabase()
await joinChannels(conn)
let userName, userJid 
userName = sock.authState.creds.me.name || 'Anónimo'
userJid = sock.authState.creds.me.jid || `${path.basename(alanJsPath)}@s.whatsapp.net`
console.log(chalk.bold.cyanBright(`\n[ NUEVO SUB-BOT ] --> ${userName} (+${path.basename(alanJsPath)}) conectado exitosamente.`))
sock.isInit = true
global.conns.push(sock)
m?.chat ? await conn.sendMessage(m.chat, { text: isSubBotConnected(m.sender) ? `[ @${m.sender.split('@')[0]} ] ahora eres un usuario sub-bot...\n- Paquetes ya instalados correctamente.` : `[ @${m.sender.split('@')[0]} ] esperando mensajes entrantes...`, mentions: [m.sender] }, { quoted: m }) : ''
}}
setInterval(async () => {
if (!sock.user) {
try { sock.ws.close() } catch (e) {}
sock.ev.removeAllListeners()
let i = global.conns.indexOf(sock)
if (i < 0) return
delete global.conns[i]
global.conns.splice(i, 1)
}}, 60000)
let handler = await import('../handler.js')
let creloadHandler = async function (restatConn) {
try {
const Handler = await import(`../handler.js?update=${Date.now()}`).catch(console.error)
if (Object.keys(Handler || {}).length) handler = Handler
} catch (e) {
console.error('Nuevo error: ', e)
}
if (restatConn) {
const oldChats = sock.chats
try { sock.ws.close() } catch { }
sock.ev.removeAllListeners()
sock = makeWASocket(connectionOptions, { chats: oldChats })
isInit = true
}
if (!isInit) {
sock.ev.off("messages.upsert", sock.handler)
sock.ev.off("connection.update", sock.connectionUpdate)
sock.ev.off('creds.update', sock.credsUpdate)
}
sock.handler = handler.handler.bind(sock)
sock.connectionUpdate = connectionUpdate.bind(sock)
sock.credsUpdate = saveCreds.bind(sock, true)
sock.ev.on("messages.upsert", sock.handler)
sock.ev.on("connection.update", sock.connectionUpdate)
sock.ev.on("creds.update", sock.credsUpdate)
isInit = false
return true
}
creloadHandler(false)
})
}
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
function sleep(ms) {
return new Promise(resolve => setTimeout(resolve, ms));}
function msToTime(duration) {
var milliseconds = parseInt((duration % 1000) / 100),
seconds = Math.floor((duration / 1000) % 60),
minutes = Math.floor((duration / (1000 * 60)) % 60),
hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
hours = (hours < 10) ? '0' + hours : hours
minutes = (minutes < 10) ? '0' + minutes : minutes
seconds = (seconds < 10) ? '0' + seconds : seconds
return minutes + ' m y ' + seconds + ' s '
}

async function joinChannels(sock) {
for (const value of Object.values(global.ch)) {
if (typeof value === 'string' && value.endsWith('@newsletter')) {
await sock.newsletterFollow(value).catch(() => {})
}}}
