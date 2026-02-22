let handler = async (m, { text, usedPrefix, command }) => {
let mensajito = `Mensaje directo en .../scrapers/commands`;
await conn.sendMessage(m.chat, { text: mensajito }, { quoted: m });
};
handler.command = ["mtest"];
export default handler;
