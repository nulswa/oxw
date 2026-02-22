import fetch from 'node-fetch'
import fs from 'fs'
import { readdirSync, readFileSync } from 'fs'
import path from 'path'
import moment from 'moment-timezone'
import PhoneNumber from 'awesome-phonenumber'

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

//separado : #fb • #facebook
//unsolo : #fb
//todo : #fb\n#facebook

const comandosTipo = {
'informacion': 'separado',
'descargas': 'separado',
'busquedas': 'separado',
'convertidor': 'separado',
'grupos': 'separado',
'juegos': 'separado',
'rpg': 'separado',
'utiles': 'separado',
'socket': 'separado',
'logos': 'todo',
'ajustes': 'todo',
'premium': 'unsolo',
'coleccion': 'unsolo',
'editor': 'unsolo',
'random': 'unsolo',
'reaccion': 'todo',
'stickers': 'separado',
'tienda': 'unsolo',
'business': 'unsolo',
'inteligncia': 'unsolo',
'pruebas': 'todo',
'propietario': 'unsolo'
}

function getAllPlugins() {
const pluginsPath = path.join(process.cwd(), 'plugins')
const plugins = []

function readDir(dir) {
const files = readdirSync(dir, { withFileTypes: true })

for (const file of files) {
const fullPath = path.join(dir, file.name)

if (file.isDirectory()) {
readDir(fullPath)
} else if (file.name.endsWith('.js')) {
try {
const content = readFileSync(fullPath, 'utf-8')

// Extraer handler.command ._.
const commandMatch = content.match(/handler\.command\s*=\s*\[([^\]]+)\]/)

// Extraer handler.tags ._.
const tagsMatch = content.match(/handler\.tags\s*=\s*\[([^\]]+)\]/)

if (commandMatch && tagsMatch) {
const commands = commandMatch[1]
.split(',')
.map(c => c.trim().replace(/['"]/g, ''))

const tags = tagsMatch[1]
.split(',')
.map(t => t.trim().replace(/['"]/g, ''))

plugins.push({
file: file.name,
commands: commands,
tags: tags
})
}
} catch (e) {
// Ignorar archivos con errores (importante)
}
}
}
}

try {
readDir(pluginsPath)
} catch (e) {
console.error('Error leyendo plugins:', e)
}

return plugins
}

function formatPluginCommands(commands, type, prefix = '#') {
if (!commands || commands.length === 0) return ''

switch(type) {
case 'separado':
return `\t⊸≻ ${commands.map(cmd => `${prefix}${cmd}`).join(' • ')}`

case 'todo':
return commands.map(cmd => `\t⊸≻ ${prefix}${cmd}`).join('\n')

case 'unsolo':
return `\t⊸≻ ${prefix}${commands[0]}`

default:
return `\t⊸≻ ${commands.map(cmd => `${prefix}${cmd}`).join('\n')}`
}
}

function organizeByTags(plugins) {
const organized = {}

for (const plugin of plugins) {
for (const tag of plugin.tags) {
if (!organized[tag]) {
organized[tag] = []
}

organized[tag].push({
commands: plugin.commands,
file: plugin.file
})
}
}

return organized
}

function generateSectionMenu(tag, pluginsList, prefix = '#') {
const type = comandosTipo[tag]
let menu = `⽷ \`${tag.toUpperCase()}\` ≻\n\n> 📍 Bienvenido/a a esta sección, reporte con *${prefix}support* si encuentras un error.\n\n`

// Generar líneas para cada plugin
const lines = []
for (const plugin of pluginsList) {
const formatted = formatPluginCommands(plugin.commands, type, prefix)
lines.push(formatted)
}

menu += lines.join('\n')
menu += `\n`

return menu
}

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

let handler = async (m, { conn, usedPrefix, args, command }) => {

  const botJid = conn.user.jid
let settings = global.db.data.settings[botJid]

const botName = settings?.nameBot || global.botname
const botDesc = settings?.descBot || global.textbot
const botImg = settings?.imgBot || global.toruImg
const botMenu = settings?.menuBot || global.toruMenu
const botLink = settings?.linkBot || global.botweb
const botPrefix = getPrefixType(settings?.prefix)
  
const imageMenu = Buffer.from(await (await fetch(`${botImg}`)).arrayBuffer())

try {
const user = global.db.data.users[m.sender]
const plugins = getAllPlugins()
const organized = organizeByTags(plugins)

const sections = Object.keys(organized).sort()

if (!args[0]) {
let menu = `\t⽷ \`Lista de Menu\` ⽷\n\n`
menu += `\t📍 "Ingrese un argumento valido para ver el menu."\n\n`

sections.forEach((tag, index) => {
const count = organized[tag].length
menu += `▢ *${usedPrefix + command}* » ${tag} - *${index + 1}*\n`
})


menu += `\n${mess.example}\n`
menu += `*${usedPrefix + command}* all\n\n> ${botDesc}`
return await conn.sendMessage(m.chat, { text: menu, mentions: [m.sender], contextInfo: { externalAdReply: { title: botName, body: botDesc, thumbnail: imageMenu, sourceUrl: null, mediaType: 1, renderLargerThumbnail: false }}}, { quoted: m })
//conn.reply(m.chat, menu, m)
}

const arg = args[0].toLowerCase()

if (arg === '0' || arg === 'all') {
let fullMenu = `> 📍 Bienvenido/a al menu completo, ante cualquier error puede reportar con *${usedPrefix}support* para una solución pendiente.\n\n`
fullMenu += `⩩ *Version* : ${vs}\n⩩ *Tipo* : ${modevs}\n⩩ *Prefix* : ${botPrefix}\n⩩ *Secciones* : ${sections.length}\n⩩ *Plugins* : ${plugins.length}\n⩩ *URL* : ${botLink}\n${readMore}\n`

for (const tag of sections) {
// Usar siempre tipo "separado" para ver todos
const type = comandosTipo[tag] // 'separado'

fullMenu += `\t⽷ \`${tag.toUpperCase()}\` ≻\n`
const lines = []
for (const plugin of organized[tag]) {
const formatted = formatPluginCommands(plugin.commands, type, usedPrefix)
lines.push(formatted)
}

fullMenu += lines.join('\n')
fullMenu += `\n\n\n`
}

fullMenu += `\n> ${botDesc}`

return await conn.sendMessage(m.chat, { text: fullMenu, contextInfo: { forwardingScore: 1, isForwarded: false, externalAdReply: { showAdAttribution: false, renderLargerThumbnail: true, title: botName, body: botDesc, containsAutoReply: true, mediaType: 1, thumbnailUrl: botMenu, sourceUrl: null }}}, { quoted: m })
//conn.reply(m.chat, fullMenu, m)
}

// Buscar por número o por nombre
let selectedTag = null

// Intentar por número
const num = parseInt(arg)
if (!isNaN(num) && num > 0 && num <= sections.length) {
selectedTag = sections[num - 1]
}
// Intentar por nombre
else {
selectedTag = sections.find(tag => tag.toLowerCase() === arg)
}

// Si no se encuentra la sección
if (!selectedTag) {
return await conn.reply(m.chat, `📍 Sección no encontrada.\n- Usa *${usedPrefix}${command}* para ver las secciones disponibles.`, m)
}

// Generar menú de la sección seleccionada
const sectionMenu = generateSectionMenu(selectedTag, organized[selectedTag], usedPrefix)

let finalMenu = sectionMenu
finalMenu += `\n`
finalMenu += `⩩ *Menu Tipo* : *${comandosTipo[selectedTag]}*\n`
finalMenu += `⩩ *Comandos* : ${organized[selectedTag].length}\n\n> ${botDesc}`

await conn.sendMessage(m.chat, { text: finalMenu, mentions: [m.sender], contextInfo: { externalAdReply: { title: botName, body: botDesc, thumbnail: imageMenu, sourceUrl: null, mediaType: 1, renderLargerThumbnail: false }}}, { quoted: m })
//conn.reply(m.chat, finalMenu, m)

} catch (error) {
await conn.reply(m.chat, error.message, m)
}
}

handler.command = ['menu', 'help', 'menú', 'comandos']
export default handler
