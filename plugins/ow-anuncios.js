import fs from 'fs';
import path from 'path';
let handler = async (m, { conn, usedPrefix, command, args, text, isOwner, isPrems, isRowner }) => {
if (!global.db.data.chats[m.chat].fOwners && m.isGroup) {
return conn.sendMessage(m.chat, { text: `📍  Los comandos de *[ owners ]* estan desactivados...` }, { quoted: m })
}

const newAnunce = m.text.trim().split(' ').slice(1).join(' ');
if (!newAnunce) return conn.sendMessage(m.chat, { text: mess.example + `\n*${usedPrefix + command}* Hola` }, { quoted: m });
await m.react("⏰");
global.anuncios = newAnunce;
conn.sendMessage(m.chat, { text: mess.succs }, { quoted: m });
await m.react("✅");
};

handler.command = ['new-ads']; 
handler.owner = true;
export default handler;




