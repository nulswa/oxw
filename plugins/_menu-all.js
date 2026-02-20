import fetch from 'node-fetch'
import fs from 'fs'
import { readdirSync, readFileSync } from 'fs'
import path from 'path'
import moment from 'moment-timezone'
import PhoneNumber from 'awesome-phonenumber'

const comandosTipo = {
'informacion': 'separado',
'descargas': 'separado',
'busquedas': 'separado',
'convertidor': 'separado',
'grupos': 'separado',
'juegos': 'separado',
'rpg': 'separado',
'coleccion': 'separado',
'utiles': 'separado',
'logos': 'todo',
'random': 'separado',
'reaccion': 'todo',
'stickers': 'separado',
'inteligencia': 'separado',
'socket': 'separado',
'editor': 'unsolo',
'premium': 'separado',
'pruebas': 'todo',
'business': 'unsolo',
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

// Extraer handler.command :v
const commandMatch = content.match(/handler\.command\s*=\s*\[([^\]]+)\]/)

// Extraer handler.tags :v
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
// #fb • #facebook
return `│${commands.map(cmd => `${prefix}${cmd}`).join(' • ')}`

case 'todo':
// #fb
// #facebook
return commands.map(cmd => `│${prefix}${cmd}`).join('\n')

case 'unsolo':
// #fb (solo el primero)
return `│${prefix}${commands[0]}`

default:
return `│${commands.map(cmd => `${prefix}${cmd}`).join(' • ')}`
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
const type = comandosTipo[tag] || 'separado'
let menu = `╭─────────────────────\n`
menu += `│ 📂 *${tag.toUpperCase()}*\n`
menu += `╰─────────────────────\n`
menu += `╭─────────────────────\n`

const lines = []
for (const plugin of pluginsList) {
const formatted = formatPluginCommands(plugin.commands, type, prefix)
lines.push(formatted)
}

menu += lines.join('\n')
menu += `\n╰─────────────────────\n`

return menu
}


let handler = async (m, { conn, usedPrefix, args, command }) => {
try {
const user = global.db.data.users[m.sender]
const plugins = getAllPlugins()
const organized = organizeByTags(plugins)

const sections = Object.keys(organized).sort()

if (!args[0]) {
let menu = `╭─────────────────────\n`
menu += `│ 📋 *MENÚ PRINCIPAL*\n`
menu += `╰─────────────────────\n\n`
menu += `Selecciona una sección para ver sus comandos:\n\n`

sections.forEach((tag, index) => {
const count = organized[tag].length
menu += `*${index + 1}.* ${tag} (${count} comandos)\n`
})

menu += `\n━━━━━━━━━━━━━━━━━━━\n\n`
menu += `*💡 Uso:*\n`
menu += `• ${usedPrefix}${command} <número>\n`
menu += `• ${usedPrefix}${command} <nombre>\n\n`
menu += `*📌 Ejemplos:*\n`
menu += `${usedPrefix}${command} 1\n`
menu += `${usedPrefix}${command} descargas\n`
menu += `${usedPrefix}${command} 0 _(todos los comandos)_\n`
menu += `${usedPrefix}${command} all _(todos los comandos)_`

return await conn.reply(m.chat, menu, m)
}

const arg = args[0].toLowerCase()

// Si es 0 o "all", mostrar TODOS los comandos en formato separado
if (arg === '0' || arg === 'all') {
let fullMenu = `╭─────────────────────\n`
fullMenu += `│ 📚 *TODOS LOS COMANDOS*\n`
fullMenu += `╰─────────────────────\n\n`

for (const tag of sections) {
// Usar siempre tipo "separado" para ver todos
const type = 'separado'

fullMenu += `╭─────────────────────\n`
fullMenu += `│ 📂 *${tag.toUpperCase()}*\n`
fullMenu += `╰─────────────────────\n`
fullMenu += `╭─────────────────────\n`

const lines = []
for (const plugin of organized[tag]) {
const formatted = formatPluginCommands(plugin.commands, type, usedPrefix)
lines.push(formatted)
}

fullMenu += lines.join('\n')
fullMenu += `\n╰─────────────────────\n\n`
}

fullMenu += `Total de secciones: ${sections.length}\n`
fullMenu += `Total de plugins: ${plugins.length}`

return await conn.reply(m.chat, fullMenu, m)
}

let selectedTag = null

const num = parseInt(arg)
if (!isNaN(num) && num > 0 && num <= sections.length) {
selectedTag = sections[num - 1]
}
else {
selectedTag = sections.find(tag => tag.toLowerCase() === arg)
}

if (!selectedTag) {
return await conn.reply(m.chat, `${emoji} Sección no encontrada.\n- Usa *${usedPrefix}${command}* para ver las secciones disponibles.`, m)
}

const sectionMenu = generateSectionMenu(selectedTag, organized[selectedTag], usedPrefix)

let finalMenu = sectionMenu
finalMenu += `\n━━━━━━━━━━━━━━━━━━━\n`
finalMenu += `Tipo: *${comandosTipo[selectedTag] || 'separado'}*\n`
finalMenu += `Plugins: ${organized[selectedTag].length}`

await conn.reply(m.chat, finalMenu, m)

} catch (error) {
await conn.reply(m.chat, error.message, m)
}
}

handler.command = ['menu', 'help', 'menú', 'comandos']
export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)


/*import fetch from 'node-fetch'
import fs from 'fs'
import moment from 'moment-timezone'
import PhoneNumber from 'awesome-phonenumber'
let handler = async (m, { conn, usedPrefix, args, command, __dirname, participants }) => {

let menu = `· ┄ · ⊸ 𔓕 *Menu:List*
`
await conn.sendMessae(m.chat, { text: menu }, { quoted: m })
}

handler.command = ['menu', 'help', 'menú']
export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)
*/