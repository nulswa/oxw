let handler = async (m, { conn, usedPrefix, command, text, args, isRowner }) => {
if (!global.db.data.chats[m.chat].fEdits && m.isGroup) {
return conn.sendMessage(m.chat, { text: `📍  Este conando es exclusivo para el plan *[ Editor ]*\n- Usa *#plan* para ver los planes disponibles.` }, { quoted: m });
};

const newDesc = m.text.trim().split(' ').slice(1).join(' ');
if (!newDesc) {
return conn.sendMessage(m.chat, { text: mess.example + `\n*${usedPrefix + command}* Inteligencia Artificial.` }, { quoted: m });
};

await m.react("⏰");
global.textbot = newDesc;
conn.sendMessage(m.chat, { text: mess.succs }, { quoted: m })
await m.react("✅");
};

handler.command = ['new-desc']; 
handler.admin = true;
export default handler;
