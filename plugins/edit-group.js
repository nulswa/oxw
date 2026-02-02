let handler = async (m, { conn, text, args, usedPrefix, command, isRowner }) => {
if (!global.db.data.chats[m.chat].fEdits && m.isGroup) {
return conn.sendMessage(m.chat, { text: `📍  Este conando es exclusivo para el plan *[ Editor ]*\n- Usa *#plan* para ver los planes disponibles.` }, { quoted: m });
};

const newGrupo = m.text.trim().split(' ').slice(1).join(' ');
if (!newGrupo) {
return conn.sendMessage(m.chat, { text: mess.example + `\n*${usedPrefix + command}* https://chat.whatsapp.com/xxxx` }, { quoted: m });
};

if (!/^(https?:\/\/)?(www\.)?(chat\.whatsapp\.com)\//i.test(newGrupo)) return conn.sendMessage(m.chat, { text: mess.unlink }, { quoted: m });
await m.react("⏰");
global.botgroup = newGrupo;
conn.sendMessage(m.chat, { text: mess.succs }, { quoted: m });
await m.react("✅");
};

handler.command = ['new-group']; 
handler.admin = true;
export default handler;
