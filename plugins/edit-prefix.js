const handler = async (m, {conn, text, usedPrefix, command}) => {
const settings = global.db.data.settings[conn.user.jid] || {}
if (!('prefix' in settings)) settings.prefix = opts['prefix'] || '*/i!#$%+£¢€¥^°=¶∆×÷π√✓©®&.\\-.@' // Prefijos por defecto
const currentPrefix = settings.prefix || 'ninguno'

let listado = `✦ *Configuración:*
1. */*
2. *noprefix*
3. *delete* /`
if (!text) return conn.sendMessage(m.chat, { text: `${listado}\n\n${mess.example}\n*${usedPrefix + command}* #\n*${usedPrefix + command}* noprefix\n*${usedPrefix + command}* delete #` }, { quoted: m });
const args = text.trim().split(' ')
const action = args[0].toLowerCase()

if (action === 'noprefix') {
if (!settings.prefix) {
await conn.sendMessage(m.chat, { text: `${emoji} El bot ya esta configurado sin prefijos...` }, { quoted: m })
return
}
settings.prefix = null // Sin prefijos
global.db.data.settings[conn.user.jid] = settings
await conn.sendMessage(m.chat, { text: `${mess.succs}\n- Establecido sin prefijos...` }, { quoted: m })
} else if (action === 'delete') {
const prefixToDelete = args[1]
if (!prefixToDelete) {
await conn.sendMessage(m.chat, { text: `${emoji} Debe proporcionar un prefijo existente para eliminarlo.\n\n${mess.example}\n*${usedPrefix + command}* delete /` }, { quoted: m })
return
}
if (!settings.prefix) {
await conn.sendMessage(m.chat, { text: `${emoji} No hay prefijos configurados para eliminar...` }, { quoted: m })
return
}
if (!settings.prefix.includes(prefixToDelete)) {
await conn.sendMessage(m.chat, { text: `${emoji} El prefijo *[ ${prefixToDelete} ]* ya fue eliminado o no existe en la lista...` }, { quoted: m })
return
}
settings.prefix = settings.prefix.replace(prefixToDelete, '') // Elimina el prefijo específico
if (settings.prefix === '') settings.prefix = null
global.db.data.settings[conn.user.jid] = settings
const updatedPrefix = settings.prefix || 'ninguno'
await conn.sendMessage(m.chat, { text: `${mess.succs}\n- Delete *${prefixToDelete}*` }, { quoted: m })
} else {
const newPrefix = text
if (settings.prefix === newPrefix) {
await conn.sendMessage(m.chat, { text: `${emoji} Los prefijos *[ ${newPrefix} ]* ya estan establecidos...` }, { quoted: m })
return
}
settings.prefix = newPrefix
global.db.data.settings[conn.user.jid] = settings
await conn.sendMessage(m.chat, { text: `${mess.succs}\n- New Prefixs *[ ${newPrefix} ]*` }, { quoted: m })
}
}


handler.tags = ["editor"];
handler.command = ["prefix"];
handler.admin = true;
export default handler
