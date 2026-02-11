
import { randomBytes } from "crypto"
import axios from "axios"

let handler = async (m, { conn, text, usedPrefix, command }) => {
if (!text) return conn.sendMessage(m.chat, { text: `${mess.example}\n*${usedPrefix + command}* Hola` }, { quoted: m });
try {
await m.react("💬");
let data = await chatGpt(text);
await conn.sendMessage(m.chat, { text: data }, { quoted: m });
} catch (err) {
await conn.sendMessage(m.chat, { text: `${err.message}` }, { quoted: m });
}
}

handler.command = ['demo'];

export default handler;
async function chatGpt(query) {
try {
const { id_ } = (await axios.post("https://chat.chatgptdemo.net/new_chat", { user_id: "crqryjoto2h3nlzsg" }, { headers: { "Content-Type": "application/json" } })).data;

const json = { "question": query, "chat_id": id_, "timestamp": new Date().getTime() };

const { data } = await axios.post("https://chat.chatgptdemo.net/chat_api_stream", json, { headers: { "Content-Type": "application/json" } });
const cek = data.split("data: ");

let res = [];

for (let i = 1; i < cek.length; i++) {
if (cek[i].trim().length > 0) {
res.push(JSON.parse(cek[i].trim()));
}
}

return res.map((a) => a.choices[0].delta.content).join("");

} catch (error) {
console.error("Error parsing JSON:", error);
return 404;
}
}




/*import axios from 'axios'
import fetch from 'node-fetch'
let handler = async (m, { conn, usedPrefix, command, text }) => {
if (!global.db.data.chats[m.chat].fAis && m.isGroup) {
return conn.sendMessage(m.chat, { text: `📍  Los comandos de *[ inteligencia artificial ]* estan desactivados...` }, { quoted: m })
}

if (!text) return conn.sendMessage(m.chat, { text: `${mess.example}\n*${usedPrefix + command}* Hola` }, { quoted: m })
try {
let data = await fetch(`https://api.soymaycol.icu/ai-pukamind?q=${text}&apikey=soymaycol%3C3`)
let toru = await data.json()
if (!toru?.status || !toru?.result) return conn.sendMessage(m.chat, { text: mssg.apino }, { quoted: m })
await conn.sendMessage(m.chat, { text: toru.result }, { quoted: m })
} catch (error) {
conn.sendMessage(m.chat, { text: `${error.message}` }, { quoted: m })
}}

handler.command = ["toru"]
export default handler
 */
 
