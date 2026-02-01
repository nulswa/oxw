const handler = async (m, { text, conn, usedPrefix, command }) => {
if (!global.db.data.chats[m.chat].fAjustes && m.isGroup) {
return conn.sendMessage(m.chat, { text: `📍  Los comandos de *[ herramientas ]* estan desactivados...` }, { quoted: m })
}

try {
if (!text) return client.sendMessage(m.chat, { text: mess.example + `\n*${usedPrefix + command}* https://whatsapp.com/channel/xxx` }, { quoted: m });
await m.react("⏰");
const regex = /https?:\/\/(www\.)?whatsapp\.com\/channel\/([a-zA-Z0-9-_]+)/;
const match = text.match(regex);
if (!match) return conn.sendMessage(m.chat, { text: `El enlace ingresado no es válido.` }, { quoted: m });
let channelId = match[2];
let res = await conn.newsletterMetadata("invite", channelId);
if (!res || !res.id) return conn.sendMessage(m.chat, { text: `No se ha podido obtener datos del canal, intentalo de nuevo.` }, { quoted: m });
let chMdmx = `· ┄ · ⊸ 𔓕 *Info  :  Canal*

⧡ Nombre : *${res.name}*
⧡ Seguidores : *${res.subscribers.toLocaleString()}* en total.
⧡ Verificación : *${res.verification === "VERIFIED" ? "Si." : "No."}*

> ${textbot}`;
await conn.sendMessage(m.chat, { text: chMdmx }, { quoted: m });
conn.sendMessage(m.chat, { text: res.id }, m );
//await m.react("✅");
} catch (error) {
console.error(error);
return conn.sendMessage(m.chat, { text: `${error.message}` }, { quoted: m });
}
};

handler.command = ["cid", "idc"];
export default handler;

/* 
Comando para poder sacar la id de un canal de WhatsApp.
Por el momento en face beta, se estima mejoras superiores a este proximamente.
 */
  
