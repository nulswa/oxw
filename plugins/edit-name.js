let handler = async (m, { conn, usedPrefix, command, text, args, isRowner }) => {
if (!global.db.data.chats[m.chat].fEdits && m.isGroup) {
return conn.sendMessage(m.chat, { text: `*[ ⽷ ]*  Este comando es exclusivo para el plan *[ Editor ]*\n- Usa *#plan* para ver los planes disponibles.` }, { quoted: m });
};

const newName = m.text.trim().split(' ').slice(1).join(' ');
if (!newName) {
return conn.sendMessage(m.chat, { text: mess.example + `\n*${usedPrefix + command}* Toru` }, { quoted: m });
};

await m.react("⏰");
global.botname = newName;
conn.sendMessage(m.chat, { text: mess.succs }, { quoted: m });
//await m.react("✅");
};

handler.command = ['new-name']; 
handler.tags = ["editor"];
handler.admin = true;
export default handler;
