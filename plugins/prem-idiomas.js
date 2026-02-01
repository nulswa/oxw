let handler = async (m, { conn, text, args, usedPrefix, command }) => {
if (!global.db.data.chats[m.chat].fPrem && m.isGroup) {
return conn.sendMessage(m.chat, { text: `📍  Lo siento, este comando solo se utiliza al comprar un plan con premium incluído.\n\n- Usa el comando *#plan* para ver los planes disponibles.` }, { quoted: m })
}

let te = `${mssg.iselec}\n\n- es (Español)\n- en (Inglés)\n- id (Indonesia)\n- pt (Portugues)\n- ar (Árabe)\n- fr (Francés)\n\n${mssg.ejemplo}\n*${usedPrefix + command}* en`
if (!text) return conn.sendMessage(m.chat, { text: te }, { quoted: m })
let user = global.db.data.users[m.sender]
 if (args[0] === "es") {
 user.language = args[0]
conn.sendMessage(m.chat, { text: `${mssg.selci('Español')}` }, { quoted: m })
} else if (args[0] === "en") {
 user.language = args[0]
conn.sendMessage(m.chat, { text: `${mssg.selci('English')}` }, { quoted: m })
} else if (args[0] === "id") {
user.language = args[0]
conn.sendMessage(m.chat, { text: `${mssg.selci('Indonesio')}` }, { quoted: m })
} else if (args[0] === "pt") {
user.language = args[0]
conn.sendMessage(m.chat, { text: `${mssg.selci('Portugués')}` }, { quoted: m })
 } else if (args[0] === "ar") {
user.language = args[0]
conn.sendMessage(m.chat, { text: `${mssg.selci('Arabe')}` }, { quoted: m })
} else if (args[0] === "fr") {
user.language = args[0]
conn.sendMessage(m.chat, { text: `${mssg.selci('Francés')}` }, { quoted: m })
} else {
let noXd = `[ ❌ ] ERROR: #lang`
return conn.sendMessage(m.chat, { text: noXd }, { quoted: m })
 }

 }

 handler.tags = ['prem']
 handler.command = ['lang', 'idioma'] 
 
 export default handler
