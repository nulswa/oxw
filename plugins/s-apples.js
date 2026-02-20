import fetch from "node-fetch";

let handler = async (m, { conn, text, usedPrefix, command }) => {
if (!global.db.data.chats[m.chat].fSearch && m.isGroup) {
return conn.sendMessage(m.chat, { text: `*[ ⽷ ]*  Los comandos de *búsquedas* estan desactivados...` }, { quoted: m })
}

if (!text) return conn.sendMessage(m.chat, { text: `${mess.example}\n*${usedPrefix + command}* Golden Brown.` }, { quoted: m });
await m.react("⏰");
try {
let res, json;
try {
res = await fetch(`https://api.delirius.store/search/applemusic?text=${encodeURIComponent(text)}`);
json = await res.json();
if (!Array.isArray(json) || json.length === 0) throw new Error(`${mess.nosear}\n- API 1...`);
} catch (e) {
res = await fetch(`https://api.delirius.store/search/applemusicv2?query=${encodeURIComponent(text)}`);
let alt = await res.json();
if (!alt?.data || alt.data.length === 0) throw new Error(`${mess.nosear}\n- API 2...`);
json = alt.data.map(v => ({ title: v.title, type: "Canción", artists: v.artist, url: v.url, image: v.image }));
}
let result = json.slice(0, 10); 
let textMsg = `· ┄ · ⊸ 𔓕 *Apple  :  Search*\n\n\t❒ *Busqueda* : ${text}\n\t❒ *Resultados* : *${result.length}* results\n\t❒ *Fuente* : AppleMusic\n\n\n`;
result.forEach((item, i) => {
textMsg += `
> *${i + 1}* » ${item.title}
⩩ *Artista* » ${item.artists}
⩩ *Tipo* » ${item.type || "Desconocido"}
⩩ *Enlace* » ${item.url}\n\n`;
});
textMsg += `> ${textbot}`;
const appleThumb = Buffer.from(await (await fetch(`https://raw.githubusercontent.com/nulswa/files/main/icons/icon-apple.jpg`)).arrayBuffer());
await conn.sendMessage(m.chat, { text: textMsg, mentions: [m.sender], contextInfo: { externalAdReply: { title: "⧿ AppleMusic : Search ⧿", body: botname, thumbnail: appleThumb, sourceUrl: null, mediaType: 1, renderLargerThumbnail: false }}}, { quoted: m });
} catch (err) {
console.error(err);
conn.sendMessage(m.chat, { text: `${err.message}` }, { quoted: m });
}
};

handler.command = ['apples'];
handler.tags = ["busquedas"];
export default handler;

