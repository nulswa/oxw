import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'
import crypto from 'crypto'
import { FormData, Blob } from 'formdata-node'
import { fileTypeFromBuffer } from 'file-type'

// Función para validar si es una imagen válida
const isImageValid = (buffer) => {
const magicBytes = buffer.slice(0, 4).toString('hex');
if (magicBytes === 'ffd8ffe0' || magicBytes === 'ffd8ffe1' || magicBytes === 'ffd8ffe2') return true; // JPEG
if (magicBytes === '89504e47') return true; // PNG
if (magicBytes === '47494638') return true; // GIF
return false; 
};

// Función para subir imagen a Catbox
async function catbox(content) {
const { ext, mime } = (await fileTypeFromBuffer(content)) || {};
const blob = new Blob([content.toArrayBuffer()], { type: mime });
const formData = new FormData();
const randomBytes = crypto.randomBytes(5).toString("hex");
formData.append("reqtype", "fileupload");
formData.append("fileToUpload", blob, randomBytes + "." + ext);
const response = await fetch("https://catbox.moe/user/api.php", {
method: "POST",
body: formData,
headers: {
"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36",
},
});
return await response.text();
}

let handler = async (m, { conn, usedPrefix, command, text, args }) => {
const botJid = conn.user.jid
let settings = global.db.data.settings[botJid]

if (!settings) {
settings = global.db.data.settings[botJid] = {
menuBot: global.toruMenu,
imgBot: global.toruImg,
nameBot: global.botname,
descBot: global.textbot,
canalBot: global.botcanal,
groupBot: global.botgroup,
linkBot: global.botweb,
prefix: '*/i!#$%+£¢€¥^°=¶∆×÷π√✓©®&.\\-.@'
}
}

if (!args[0]) {
const currentPrefix = settings.prefix || 'ninguno'

let menu = `\t⽷ \`Configuracion\`

> 📍 "Edita a tu gusto el bot principal o las funciones disponibles del *sub-bot*, recuerda reportar el error posible de la configuración."

> *Lista de edición*
- *${usedPrefix + command}* name *<nombre>*
- *${usedPrefix + command}* desc *<descripción>*
- *${usedPrefix + command}* canal *<link>*
- *${usedPrefix + command}* grupo *<link>*
- *${usedPrefix + command}* web *<link>*
- *${usedPrefix + command}* icon *<reply/link>*
- *${usedPrefix + command}* menu *<reply/link>*
- *${usedPrefix + command}* prefix

📍 *Restablece las funciones con:* ${usedPrefix + command} reset

❒ *${usedPrefix}sub_menu* - *${usedPrefix}sub_icon*
> *Usa estos comandos para ver tu test de menu y foto.*`

return conn.sendMessage(m.chat, { text: menu }, { quoted: m })
}

const option = args[0].toLowerCase()
const value = args.slice(1).join(' ')

switch(option) {
case 'nombre':
case 'name':
if (!value) return conn.sendMessage(m.chat, { text: `${emoji} Proporciona el argumento seguido del nombre.\n\n${mess.example}\n*${usedPrefix + command} name Takeda MD*` }, { quoted: m })
settings.nameBot = value
await conn.sendMessage(m.chat, { text: `${mess.succs}\n- New Name: *${value}*` }, { quoted: m })
break

case 'desc':
case 'descripcion':
if (!value) return conn.sendMessage(m.chat, { text: `${emoji} Proporciona el argumento seguido de la descripción.\n\n${mess.example}\n*${usedPrefix + command}* desc Bot by @Farguts` }, { quoted: m })
settings.descBot = value
await conn.sendMessage(m.chat, { text: `${mess.succs}\n- New Desc: *${value}*` }, { quoted: m })
break

case 'icon':
try {
let iconUrl = null

// Verificar si respondió a una imagen
if (m.quoted && /image/.test(m.quoted.mimetype)) {
const media = await m.quoted.download()

if (!isImageValid(media)) {
return conn.sendMessage(m.chat, { text: `${emoji} Solo puedes responder imágenes válidas (JPG, JPEG, PNG)...` }, { quoted: m })
}

// Subir a Catbox
await m.react("⏰")
iconUrl = await catbox(media)

} else if (value) {
// Verificar si proporcionó un enlace
const urlRegex = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i
if (!urlRegex.test(value)) {
return conn.sendMessage(m.chat, { text: `${mess.unlink}\n\n${emoji} Formato válido: JPG, JPEG, PNG` }, { quoted: m })
}
iconUrl = value

} else {
return conn.sendMessage(m.chat, { text: `${emoji} Responda a una imagen o proporciona un enlace para cambiar el icono del bot.\n\n${mess.example}\n*${usedPrefix + command}* icon https://i.imgur.com/abc123.jpg\n_O responde a una imagen con:_ *${usedPrefix + command}* icon` }, { quoted: m })
}

settings.imgBot = iconUrl
await conn.sendMessage(m.chat, { text: `${mess.succs}\n- New Icon » *${usedPrefix}sub_icon*\n- URL: ${iconUrl}` }, { quoted: m })

try {
await conn.sendFile(m.chat, iconUrl, 'icon.jpg', '📍 Vista previa del nuevo icono.', m)
} catch (e) {
await conn.sendMessage(m.chat, { text: `📍 No se pudo cargar la vista previa.\n- ${e.message}` }, { quoted: m })
}

} catch (error) {
await conn.sendMessage(m.chat, { text: `${error.message}` }, { quoted: m })
}
break

case 'menu':
try {
let menuUrl = null

// Verificar si respondió a una imagen
if (m.quoted && /image/.test(m.quoted.mimetype)) {
const media = await m.quoted.download()

if (!isImageValid(media)) {
return conn.sendMessage(m.chat, { text: `${emoji} Solo puedes responder imágenes válidas (JPG, JPEG, PNG)...` }, { quoted: m })
}

// Subir a Catbox
await m.react("⏰")
menuUrl = await catbox(media)

} else if (value) {
// Verificar si proporcionó un enlace
const urlRegex = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i
if (!urlRegex.test(value)) {
return conn.sendMessage(m.chat, { text: `${mess.unlink}\n\n${emoji} Formato válido: JPG, JPEG, PNG` }, { quoted: m })
}
menuUrl = value

} else {
return conn.sendMessage(m.chat, { text: `${emoji} Responda a una imagen o proporciona un enlace para cambiar el menú del bot.\n\n${mess.example}\n*${usedPrefix + command}* menu https://i.imgur.com/menu123.jpg\n_O responde a una imagen con:_ *${usedPrefix + command}* menu` }, { quoted: m })
}

settings.menuBot = menuUrl
await conn.sendMessage(m.chat, { text: `${mess.succs}\n- New Menu » *${usedPrefix}sub_menu*\n- URL: ${menuUrl}` }, { quoted: m })

try {
await conn.sendFile(m.chat, menuUrl, 'menu.jpg', '📍 Vista previa del nuevo menú.', m)
} catch (e) {
await conn.sendMessage(m.chat, { text: `📍 No se pudo cargar la vista previa.\n- ${e.message}` }, { quoted: m })
}

} catch (error) {
await conn.sendMessage(m.chat, { text: `${error.message}` }, { quoted: m })
}
break

case 'canal':
if (!value) return conn.sendMessage(m.chat, { text: `${emoji} Proporciona un enlace de canal.\n\n${mess.example}\n*${usedPrefix + command}* canal https://whatsapp.com/channel/...` }, { quoted: m })
if (!/^(https?:\/\/)?(www\.)?(whatsapp\.com\/channel)\//i.test(value)) return conn.sendMessage(m.chat, { text: `${mess.unlink}` }, { quoted: m })
settings.canalBot = value
await conn.sendMessage(m.chat, { text: `${mess.succs}\n- New Canal: *${value}*` }, { quoted: m })
break

case 'grupo':
case 'group':
if (!value) return conn.sendMessage(m.chat, { text: `${emoji} Proporciona un enlace de grupo.\n\n${mess.example}\n*${usedPrefix + command}* grupo https://chat.whatsapp.com/...` }, { quoted: m })
if (!/^(https?:\/\/)?(www\.)?(chat\.whatsapp\.com)\//i.test(value)) return conn.sendMessage(m.chat, { text: `${mess.unlink}` }, { quoted: m })
settings.groupBot = value
await conn.sendMessage(m.chat, { text: `${mess.succs}\n- New Grupo: *${value}*` }, { quoted: m })
break

case 'web':
case 'link':
if (!value) return conn.sendMessage(m.chat, { text: `${emoji} Proporciona un enlace web.\n\n${mess.example}\n*${usedPrefix + command}* web https://ejemplo.com` }, { quoted: m })
if (!/^(https?:\/\/)?(www\.)?\//i.test(value)) return conn.sendMessage(m.chat, { text: `${mess.unlink}` }, { quoted: m })
settings.linkBot = value
await conn.sendMessage(m.chat, { text: `${mess.succs}\n- New Web: *${value}*` }, { quoted: m })
break

case 'prefix':
case 'prefijo':
const currentPrefix = settings.prefix || 'ninguno'

let listadoPrefix = `✦ *Configuración de Prefijos*

*Prefijo actual:* ${currentPrefix}

*Opciones disponibles:*
1. Establecer prefijo personalizado
2. *multiprefix* » Todos los prefijos
3. *noprefix* » Sin prefijos
4. *delete <símbolo>* » Eliminar un prefijo

${mess.example}
*${usedPrefix + command} prefix #*
*${usedPrefix + command} prefix multiprefix*
*${usedPrefix + command} prefix noprefix*
*${usedPrefix + command} prefix delete #*`

if (!value) {
return conn.sendMessage(m.chat, { text: listadoPrefix }, { quoted: m })
}

const prefixArgs = value.trim().split(' ')
const prefixAction = prefixArgs[0].toLowerCase()

// MULTIPREFIX - Todos los prefijos predeterminados
if (prefixAction === 'multiprefix') {
const allPrefixes = '*/i!#$%+£¢€¥^°=¶∆×÷π√✓©®&.\\-.@'

if (settings.prefix === allPrefixes) {
await conn.sendMessage(m.chat, { text: `${emoji} Ya tienes todos los prefijos establecidos...` }, { quoted: m })
return
}

settings.prefix = allPrefixes
global.db.data.settings[botJid] = settings
await conn.sendMessage(m.chat, { text: `${mess.succs}\n- Establecido con todos los prefijos\n- Prefijos: *${allPrefixes}*` }, { quoted: m })
return
}

// NOPREFIX - Sin prefijos
if (prefixAction === 'noprefix') {
if (!settings.prefix || settings.prefix === null) {
await conn.sendMessage(m.chat, { text: `${emoji} El bot ya está configurado sin prefijos...` }, { quoted: m })
return
}

settings.prefix = null
global.db.data.settings[botJid] = settings
await conn.sendMessage(m.chat, { text: `${mess.succs}\n- Establecido sin prefijos...` }, { quoted: m })
return
}

// DELETE - Eliminar un prefijo específico
if (prefixAction === 'delete') {
const prefixToDelete = prefixArgs[1]

if (!prefixToDelete) {
await conn.sendMessage(m.chat, { text: `${emoji} Debe proporcionar un prefijo existente para eliminarlo.\n\n${mess.example}\n*${usedPrefix + command} prefix delete #*` }, { quoted: m })
return
}

if (!settings.prefix) {
await conn.sendMessage(m.chat, { text: `${emoji} No hay prefijos configurados para eliminar...` }, { quoted: m })
return
}

if (!settings.prefix.includes(prefixToDelete)) {
await conn.sendMessage(m.chat, { text: `${emoji} El prefijo *[ ${prefixToDelete} ]* no existe en la lista actual...` }, { quoted: m })
return
}

settings.prefix = settings.prefix.replace(new RegExp(prefixToDelete.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '')

if (settings.prefix === '') settings.prefix = null

global.db.data.settings[botJid] = settings
const updatedPrefix = settings.prefix || 'ninguno'
await conn.sendMessage(m.chat, { text: `${mess.succs}\n- Eliminado: *${prefixToDelete}*\n- Prefijos actuales: *${updatedPrefix}*` }, { quoted: m })
return
}

// ESTABLECER PREFIJO PERSONALIZADO
const newPrefix = value.trim()

if (settings.prefix === newPrefix) {
await conn.sendMessage(m.chat, { text: `${emoji} Los prefijos *[ ${newPrefix} ]* ya están establecidos...` }, { quoted: m })
return
}

settings.prefix = newPrefix
global.db.data.settings[botJid] = settings
await conn.sendMessage(m.chat, { text: `${mess.succs}\n- New Prefix: *${newPrefix}*` }, { quoted: m })
break

case 'reset':
settings.nameBot = global.botname
settings.descBot = global.textbot
settings.imgBot = global.toruImg
settings.menuBot = global.toruMenu
settings.linkBot = global.botweb
settings.canalBot = global.botcanal
settings.groupBot = global.botgroup
settings.prefix = '*/i!#$%+£¢€¥^°=¶∆×÷π√✓©®&.\\-.@'
await conn.sendMessage(m.chat, { text: '✅ Configuración restaurada a los valores por defecto.' }, { quoted: m })
break

default:
return conn.sendMessage(m.chat, { text: `📍 Opción no válida.\n- Usa *${usedPrefix}${command}* para ver las opciones disponibles.` }, { quoted: m })
}
}

handler.command = ['sub', 'edit']
handler.tags = ["socket"]

export default handler
