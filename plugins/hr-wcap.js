import fetch from 'node-fetch';

let handler = async (m, {conn, text, args, usedPrefix, command}) => { 
if (!global.db.data.chats[m.chat].fAjustes && m.isGroup) {
return conn.sendMessage(m.chat, { text: `*[ ⽷ ]*  Los comandos de *herramientas* estan desactivados...` }, { quoted: m })
}

if (!args[0]) return client.sendMessage(m.chat, { text: mess.example + `\n*${usedPrefix + command}* https://ejemplo.com` }, { quoted: m });
await m.react("⏰");
let nameIds = `${botname}\n> ${textbot}`;
 try {
 const ss = await (await fetch(`https://image.thum.io/get/fullpage/${args[0]}`)).buffer();
conn.sendFile(m.chat, ss, '', nameIds, m);
//await m.react("✅");
 } catch { 
 try {
 const ss2 = `https://api.screenshotmachine.com/?key=c04d3a&url=${args[0]}&screenshotmachine.com&dimension=720x720`;
conn.sendMessage(m.chat, {image: {url: ss2}, caption: nameIds}, {quoted: m}); 
//await m.react("✅");
 } catch {
 try { 
 const ss3 =`https://api.lolhuman.xyz/api/SSWeb?apikey=${lolkeysapi}&url=${text}`; 
conn.sendMessage(m.chat, {image: {url: ss3}, caption: nameIds}, {quoted: m}); 
//await m.react("✅");
 } catch { 
 const ss4 = `https://api.lolhuman.xyz/api/SSWeb2?apikey=${lolkeysapi}&url=${text}`;
conn.sendMessage(m.chat, {image: {url: ss4}, caption: nameIds}, {quoted: m});
//await m.react("✅");
 }
}
 }
}; 
 
handler.command = ["ss"]; 
handler.tags = ["utiles"];
export default handler


