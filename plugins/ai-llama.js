import fetch from 'node-fetch'

let handler = async (m, { conn, command, text, usedPrefix }) => {
let user = global.db.data.users[m.sender];
if (!user.premium || user.premiumTime < Date.now()) {
return conn.sendMessage(m.chat, { text: `📍  Se termino tu estado como *[ Premium ]*\n- Puedes usar *${usedPrefix}addme* para solicitar un nuevo plan.` }, { quoted: m });
};

if (!text) return conn.sendMessage(m.chat, { text: `${mess.example}\n*${usedPrefix + command}* Hola` }, { quoted: m });
try {
await m.react("💬");
let api = await fetch(`https://delirius-apiofc.vercel.app/ia/llamaia?query=${text}`)
let json = await api.json()
let responseMessage = json.data;
await conn.sendMessage(m.chat, { text: responseMessage }, { quoted: m });
} catch (error) { 
console.error(error)
await conn.sendMessage(m.chat, { text: error.message }, { quoted: m });
}
}

handler.command = ['llama']
export default handler

