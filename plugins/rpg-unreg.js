import { createHash } from 'crypto';
import fetch from 'node-fetch';
const handler = async (m, { conn, command, usedPrefix, text }) => {
let user = global.db.data.users[m.sender];
if (!user) return conn.sendMessage(m.chat, { text: `` }, { quoted: m });

const confirmar = text?.toLowerCase();
if (confirmar !== 'si') {
return conn.sendMessage(m.chat, { text: `${emoji} Confirme con *${usedPrefix + command} si* para eliminar su registro.` }, { quoted: m });
}
delete global.db.data.users[m.sender];

return conn.sendMessage(m.chat, { text: mess.succs }, { quoted: m });
};

handler.tags = ['rpg'];
handler.command = ['dreg'];

export default handler;