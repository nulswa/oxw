let handler = async (m, { text, usedPrefix, command }) => {
if (!global.db.data.chats[m.chat].fStickers && m.isGroup) {
return conn.sendMessage(m.chat, { text: `*[ ⽷ ]*  Los comandos de *stickers* estan desactivados...` }, { quoted: m })
}

const userId = m.sender;

if (command === 'exif+') {
const packParts = text.split(/[\u2022|]/).map(part => part.trim());
if (packParts.length < 2) {
return conn.sendMessage(m.chat, { text: `${mess.example}\n*${usedPrefix + command}* toru • whatsapp` }, { quoted: m });
}

const packText1 = packParts[0];
const packText2 = packParts[1];

if (!global.db.data.users[userId]) {
global.db.data.users[userId] = {};
}

const packstickers = global.db.data.users[userId];

if (packstickers.text1 || packstickers.text2) {
return conn.sendMessage(m.chat, { text: `${emoji} Ya tienes un nombre asignado para tus stickers.\n- Usa *${usedPrefix}exif-* para eliminarlo.` }, { quoted: m });
}

packstickers.text1 = packText1;
packstickers.text2 = packText2;

try { await global.saveDB?.() } catch (e) { console.error(e) }

return conn.sendMessage(m.chat, { text: `${mess.succs}` }, { quoted: m });
}

if (command === 'exif-') {
if (!global.db.data.users[userId] || (!global.db.data.users[userId].text1 && !global.db.data.users[userId].text2)) {
return conn.sendMessage(m.chat, { text: `${emoji} No tienes un nombre asignado para tus stickers.\n- Usa *${usedPrefix}exif+* para crear el nombre de tus stickers.` }, { quoted: m });
}

const packstickers = global.db.data.users[userId];
delete packstickers.text1;
delete packstickers.text2;

try { await global.saveDB?.() } catch (e) { console.error(e) }

return conn.sendMessage(m.chat, { text: `${mess.succs}` }, { quoted: m });
}
};

handler.command = ['exif+', 'exif-'];
handler.tags = ["stickers"];
export default handler;



