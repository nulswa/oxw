let handler = async (m, { conn, text, args, usedPrefix, command, isRowner }) => {
if (!global.db.data.chats[m.chat].fEdits && m.isGroup) {
return conn.sendMessage(m.chat, { text: `*[ ⽷ ]*  Este comando es exclusivo para el plan *[ Editor ]*\n- Usa *#plan* para ver los planes disponibles.` }, { quoted: m });
};

const newCanal = m.text.trim().split(' ').slice(1).join(' ');
if (!newCanal) {
return conn.sendMessage(m.chat, { text: mess.example + `\n*${usedPrefix + command}* https://whatsapp.com/channel/xxxx` }, { quoted: m });
};

if (!/^(https?:\/\/)?(www\.)?(whatsapp\.com\/channel)\//i.test(newCanal)) return conn.sendMessage(m.chat, { text: mess.unlink }, { quoted: m });
await m.react("⏰");
global.botcanal = newCanal;
conn.sendMessage(m.chat, { text: mess.succs }, { quoted: m });
//await m.react("✅");
};

handler.command = ['new-ch']; 
handler.tags = ["editor"];
handler.admin = true;
export default handler;
