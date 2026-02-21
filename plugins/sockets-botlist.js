import ws from "ws"
import fs from 'fs'
import path from 'path'

// Función para formatear runtime
function formatRuntime(ms) {
const seconds = Math.floor((ms / 1000) % 60)
const minutes = Math.floor((ms / (1000 * 60)) % 60)
const hours = Math.floor((ms / (1000 * 60 * 60)) % 24)
const days = Math.floor(ms / (1000 * 60 * 60 * 24))

let result = []
if (days > 0) result.push(`${days}d`)
if (hours > 0) result.push(`${hours}h`)
if (minutes > 0) result.push(`${minutes}m`)
if (seconds > 0) result.push(`${seconds}s`)

return result.length > 0 ? result.join(' ') : '0s'
}

// Función para censurar número
function censorNumber(jid) {
const number = jid.split('@')[0]
if (number.length <= 6) return number

const visible = 3 // Mostrar primeros 3 dígitos
const lastVisible = 3 // Mostrar últimos 3 dígitos
const censored = number.substring(0, visible) + '×'.repeat(number.length - visible - lastVisible) + number.substring(number.length - lastVisible)

return `+${censored}`
}

// Función para obtener tipo de prefijo
function getPrefixType(prefix) {
if (!prefix || prefix === null) {
return 'noprefix'
}

const multiPrefix = '*/i!#$%+£¢€¥^°=¶∆×÷π√✓©®&.\\-.@'

if (prefix === multiPrefix) {
return 'multi-prefix'
}

return prefix
}

let handler = async (m, { conn, usedPrefix, command, text, args }) => {
try {
// Obtener todos los bots conectados
const bots = [
{ conn: global.conn, user: global.conn.user, isMain: true },
...global.conns
.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED)
.map((conn) => ({ conn, user: conn.user, isMain: false }))
]

// Si no hay argumentos, mostrar lista de todos los bots
if (!args[0]) {
let menu = `\t\t⽷ \`Sockets : Connected\`

⩩ *Total* » *${bots.length}* bots
⩩ *Principal* » 1
⩩ *Sub-Bots* » *${bots.length - 1}*

📍 Si al querer ver un *sub-bot* puedes usar su index:
- Por ejemplo: *${usedPrefix + command} 2*\n\n\n`

bots.forEach((bot, index) => {
const botJid = bot.user.jid
const settings = global.db.data.settings[botJid] || {}

const botName = settings.nameBot || global.botname || 'Bot'
const prefixType = getPrefixType(settings.prefix)
const censoredNumber = censorNumber(botJid)

// Calcular runtime (tiempo desde que se conectó)
const startTime = bot.conn.startTime || Date.now()
const runtime = formatRuntime(Date.now() - startTime)

const tipo = bot.isMain ? 'Principal' : 'Sub-Bot'

menu += `> *${index + 1}. ${botName}*\n`
menu += `⩩ *Tipo* » ${tipo}\n`
menu += `⩩ *Numero* » ${censoredNumber}\n`
menu += `⩩ *Prefix* » ${prefixType}\n`
menu += `⩩ *Estado* » Activo\n\n\n`
})


menu += `> Puedes usar el mismo comando con el index para ver sus detalles...`

return await conn.sendMessage(m.chat, { text: menu }, { quoted: m })
}

// Si hay argumento numérico, mostrar info detallada del bot
const botIndex = parseInt(args[0]) - 1

if (isNaN(botIndex) || botIndex < 0 || botIndex >= bots.length) {
return await conn.sendMessage(m.chat, { text: `📍  Número de bot inválido.\n- *Bots disponibles:* 1 de ${bots.length || 0}\n\nDebe usar *${usedPrefix}${command}* para ver la lista.` }, { quoted: m })
}

const selectedBot = bots[botIndex]
const botJid = selectedBot.user.jid
const settings = global.db.data.settings[botJid] || {}

const botName = settings.nameBot || global.botname
const botDesc = settings.descBot || global.textbot
const prefixType = getPrefixType(settings.prefix)
const fullNumber = botJid.split('@')[0]

const startTime = selectedBot.conn.startTime || Date.now()
const runtime = formatRuntime(Date.now() - startTime)

const tipo = selectedBot.isMain ? 'Principal' : 'Sub-Bot'

let detailMenu = `\t\t⽷ \`Info : Socket\` ⽷

> *${botIndex + 1}.* ${botName}
⩩ *Tipo* » ${tipo}
⩩ *Numero* » +${fullNumber}
⩩ *Prefix* » ${prefixType}
⩩ *Runtime* » ${runtime}
⩩ *Estado* » ✅\n\n`


/*if (settings.canalBot) {
detailMenu += `📢 Canal: ${settings.canalBot}\n`
}
if (settings.groupBot) {
detailMenu += `👥 Grupo: ${settings.groupBot}\n`
}
if (settings.linkBot) {
detailMenu += `🌐 Web: ${settings.linkBot}\n`
}*/

//detailMenu += `> ${botDesc}`

// Enviar con la imagen del bot si existe
const botImg = settings.imgBot || global.toruImg

if (botImg) {
try {
await conn.sendFile(m.chat, botImg, 'bot.jpg', detailMenu, m)
} catch (e) {
await conn.sendMessage(m.chat, { text: detailMenu }, { quoted: m })
}
} else {
await conn.sendMessage(m.chat, { text: detailMenu }, { quoted: m })
}

} catch (error) {
console.error('Error en comando sockets:', error)
await conn.sendMessage(m.chat, { text: `${error.message}` }, { quoted: m })
}
}

handler.command = ['sockets', 'bots', 'listbots']
handler.tags = ["socket"]

export default handler

/*import ws from "ws"

const handler = async (m, { conn, command, usedPrefix, participants }) => {
try {
const users = [global.conn.user.jid, ...new Set(global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED).map((conn) => conn.user.jid))]
function convertirMsADiasHorasMinutosSegundos(ms) {
const segundos = Math.floor(ms / 1000)
const minutos = Math.floor(segundos / 60)
const horas = Math.floor(minutos / 60)
const días = Math.floor(horas / 24)
const segRest = segundos % 60
const minRest = minutos % 60
const horasRest = horas % 24
let resultado = ""
if (días) resultado += `${días} días, `
if (horasRest) resultado += `${horasRest} horas, `
if (minRest) resultado += `${minRest} minutos, `
if (segRest) resultado += `${segRest} segundos`
return resultado.trim()
}
let groupBots = users.filter((bot) => participants.some((p) => p.id === bot))
if (participants.some((p) => p.id === global.conn.user.jid) && !groupBots.includes(global.conn.user.jid)) { groupBots.push(global.conn.user.jid) }
const botsGroup = groupBots.length > 0 ? groupBots.map((bot) => {
const isMainBot = bot === global.conn.user.jid
const v = global.conns.find((conn) => conn.user.jid === bot)
const uptime = isMainBot ? convertirMsADiasHorasMinutosSegundos(Date.now() - global.conn.uptime) : v?.uptime ? convertirMsADiasHorasMinutosSegundos(Date.now() - v.uptime) : "Activo desde ahora"
const mention = bot.replace(/[^0-9]/g, '')
return `🜲 *Servidor:* @${mention || "Undefined."}
⫹⫺ *Estado:* ${isMainBot ? 'Principal.' : 'New-Server.'}
ⴵ *Actividad:* ${uptime}`}).join("\n\n") : `📍  No hay servidores activos en este momento.\n- Vuelva mas tarde para comprobar.`
const message = `
╭──• · ✦ \`Servers : Bot\` ✦ · · ·
│⊹ ✎ *Principal:* 1 (@${botname})
│⊹ ✎ *Servidores:* ${users.length - 1} en total.
│⊹ ✎ *Chat:* ${groupBots.length + " servidores en este chat." || "Chat sin servidores."}
╰──────────────• · · ·
 
${botsGroup}`
const mentionList = groupBots.map(bot => bot.endsWith("@s.whatsapp.net") ? bot : `${bot}@s.whatsapp.net`)
await conn.sendMessage(m.chat, { text: message, mentionedJid: [mentionList] }, { quoted: m })
} catch (error) {
await conn.sendMessage(m.chat, { text: `${error.message}` }, { quoted: m })
}}

handler.command = ["servers", "sockets", "servidores"]
handler.tags = ["socket"]
export default handler
 */
