const handler = async (m, { conn, usedPrefix, command, participants }) => {
try {
const cooldown = 2 * 60 * 60 * 1000;
const now = Date.now(); 

let senderJid = m.sender;
if (m.sender.endsWith('@lid') && m.isGroup) {
const pInfo = participants.find(p => p.lid === m.sender);
if (pInfo && pInfo.id) senderJid = pInfo.id; 
}

const user = global.db?.data?.users?.[senderJid];
if (!user) return conn.sendMessage(m.chat, { text: `${emoji} El usuario no esta registrado en la base de datos.\n- Debe usar *${usedPrefix}new <nombre>* para registrarse.` }, { quoted: m });

let target = null;
if (m.isGroup) {
target = (m.mentionedJid && m.mentionedJid.length > 0) ? m.mentionedJid[0] : (m.quoted && m.quoted.sender ? m.quoted.sender : null);
} else {
target = m.chat;
}

if (!target) {
return conn.sendMessage(m.chat, { text: `${emoji} Responda o mencione a un usuario para robarle recursos.\n\n${mess.example}\n*${usedPrefix + command}* @${m.sender.split`@`[0]}`, mentions: [m.sender] }, { quoted: m });
}

let targetJid = target;
if (target.endsWith('@lid') && m.isGroup) {
const pInfo = participants.find(p => p.lid === target);
if (pInfo && pInfo.id) targetJid = pInfo.id; 
}

if (targetJid === senderJid) {
return conn.sendMessage(m.chat, { text: `No puedes robarte a ti mismo...` }, { quoted: m });
}

if (!global.db?.data?.users?.[targetJid]) {
return conn.sendMessage(m.chat, { text: `${emoji} El usuario no esta registrado en la base de datos.\n- Debe usar *${usedPrefix}new <nombre>* para registrarse.` }, { quoted: m });
}

const targetUser = global.db.data.users[targetJid];

targetUser.coin = Number.isFinite(targetUser.coin) ? Math.max(0, Number(targetUser.coin)) : 0;
user.coin = Number.isFinite(user.coin) ? Number(user.coin) : 0;

if (user.lastrob2 && (now - Number(user.lastrob2) < cooldown)) {
const remaining = Number(user.lastrob2) + cooldown - now;
const time = msToTime(remaining);
return conn.sendMessage(m.chat, { text: `${emoji} *¡Ya has hecho un robo!*\n- Vuelva en *${time}* para robar de nuevo.` }, { quoted: m });
}

const MIN_ROB = 1000;
const MAX_ROB = 20000;
const robAmount = Math.floor(Math.random() * (MAX_ROB - MIN_ROB + 1)) + MIN_ROB;

if (targetUser.coin < MIN_ROB) {
return conn.sendMessage(m.chat, { text: `✦ El usuario @${target.split('@')[0]} no tiene ni *${MIN_ROB.toLocaleString()}* de *${currency}*.\n- No vale la pena intentar robarlo...`, mentions: [target] }, { quoted: m });
//conn.reply(m.chat, `${emoji} @${target.split("@")[0]} *no tiene al menos ¥${MIN_ROB.toLocaleString()} ${m.moneda} fuera del banco para que valga la pena intentarlo.*`, m, { mentions: [target] });
}

const finalRob = Math.min(robAmount, targetUser.coin);

targetUser.coin = Math.max(0, targetUser.coin - finalRob);
user.coin = (user.coin || 0) + finalRob;
user.lastrob2 = now;

const frases = [
`✦ *¡Robo exitoso!* Acabas de robarle *${finalRob.toLocaleString()} ${currency}* al usuario @${target.split('@')[0]}`,
`✦ Has robado *${finalRob.toLocaleString()} ${currency}* al usuario @${target.split('@')[0]} con éxito.`,
`✦ Le robaste *${finalRob.toLocaleString()} ${currency}* al usuario @${target.split('@')[0]} de manera exitosa.`,
`✦ *¡Robo con astucia!* Acabas de robar *${finalRob.toLocaleString()} ${currency}* al usuario @${target.split('@')[0]} con éxito.`
];

await conn.reply(m.chat, pickRandom(frases), m, { mentions: [target] });
} catch (err) {
return conn.sendMessage(m.chat, { text: `${err.message}` }, { quoted: m });
}
};


handler.tags = ['rpg'];
handler.command = ['robar', 'rob'];
handler.group = true;
export default handler;
function pickRandom(list) {
return list[Math.floor(Math.random() * list.length)];
}
function msToTime(duration) {
const totalSeconds = Math.max(0, Math.floor(duration / 1000));
const hours = Math.floor(totalSeconds / 3600);
const minutes = Math.floor((totalSeconds % 3600) / 60);
return `${hours} Hora(s) ${minutes} Minuto(s)`;
}