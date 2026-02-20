const handler = async (m, { conn, text, usedPrefix, command }) => {
if (!global.db.data.chats[m.chat].fOwners && m.isGroup) {
return conn.sendMessage(m.chat, { text: `*[ ⽷ ]*  Los comandos de *owners* estan desactivados...` }, { quoted: m })
}

const numberPattern = /\d+/g;
let user = '';
const numberMatches = text.match(numberPattern);
if (numberMatches) {
const number = numberMatches.join('');
user = number + '@s.whatsapp.net';
} else if (m.quoted && m.quoted.sender) {
const quotedNumberMatches = m.quoted.sender.match(numberPattern);
if (quotedNumberMatches) {
const number = quotedNumberMatches.join('');
user = number + '@s.whatsapp.net';
} else {
return conn.sendMessage(m.chat, {text: `${emoji} Mencione a un usuario para restablecer sus datos.\n\n${mess.example}\n*${usedPrefix + command}* @${m.sender.split`@`[0]}`, mentions: [m.sender] }, {quoted: m});
}
} else {
return conn.sendMessage(m.chat, {text: `${emoji} Mencione a un usuario para restablecer sus datos.\n\n${mess.example}\n*${usedPrefix + command}* @${m.sender.split`@`[0]}`, mentions: [m.sender] }, {quoted: m});
}
const groupMetadata = m.isGroup ? await conn.groupMetadata(m.chat) : {};
const participants = m.isGroup ? groupMetadata.participants : [];
const users = m.isGroup ? participants.find(u => u.jid == user) : {};
const userNumber = user.split('@')[0];
if (!global.global.db.data.users[user] || global.global.db.data.users[user] == '') {
return conn.sendMessage(m.chat, {text: `El usuario @${userNumber} no se encuentra en la base de datos...`, mentions: [user]}, {quoted: m});
 }
delete global.global.db.data.users[user];
conn.sendMessage(m.chat, {text: `${mess.succs}`}, {quoted: m});
};

handler.command = ['user--'];
handler.tags = ["propietario"];
handler.owner = true;
export default handler;

