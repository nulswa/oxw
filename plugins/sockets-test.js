import fs from 'fs'
import path from 'path'
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
prefix: '#'
}
}

if (command === "sub_icon") {
let resT = `\t⽷ \`Test de prueba : Icono\`

> 📍 "Edita a tu gusto el bot principal o las funciones disponibles del *sub-bot*, recuerda reportar el error posible de la configuración."

⩩ *Nombre* » ${settings.nameBot || global.botname}
⩩ *Descripción* » ${settings.descBot || global.botname}
⩩ *Canal* » ${settings.canalBot || global.botname}
⩩ *Grupo* » ${settings.groupBot || global.botname}
⩩ *Web* » ${settings.linkBot || global.botweb}
⩩ *Prefix* » ${settings.prefix}`
return conn.sendMessage(m.chat, { image: { url: settings.imgBot || global.toruImg }, caption: resT }, { quoted: m })
}

if (command === "sub_menu") {
let resC = `\t⽷ \`Test de prueba : Menu\`

> 📍 "Edita a tu gusto el bot principal o las funciones disponibles del *sub-bot*, recuerda reportar el error posible de la configuración."

⩩ *Nombre* » ${settings.nameBot || global.botname}
⩩ *Descripción* » ${settings.descBot || global.botname}
⩩ *Canal* » ${settings.canalBot || global.botname}
⩩ *Grupo* » ${settings.groupBot || global.botname}
⩩ *Web* » ${settings.linkBot || global.botweb}
⩩ *Prefix* » ${settings.prefix}`
return conn.sendMessage(m.chat, { image: { url: settings.menuBot || global.toruMenu }, caption: resC }, { quoted: m })
}

}

handler.command = ['sub_icon', 'sub_menu']
handler.tags = ["socket"]

export default handler
