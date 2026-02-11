import axios from "axios";

let handler = async (m, { conn, text, usedPrefix, command }) => {
if (!text) return conn.sendMessage(m.chat, { text: `${mess.example}\n*${usedPrefix + command}* Imagina un gato con sombrero.` }, { quoted: m });
try {
await m.react("💬");
const result = await fluximg.create(text);
if (result && result.imageLink) {

await conn.sendMessage(m.chat, { image: { url: result.imageLink },
caption: `${botname}\n> ${textbot}` }, { quoted: m });
} else {
throw new Error(`${mess.fallo}`);
}
} catch (error) {
console.error(error);
conn.sendMessage(m.chat, { text: `${error.message}` }, { quoted: m });
}
};

handler.command = ["flux"];

export default handler;

const fluximg = {
defaultRatio: "2:3", 

create: async (query) => {
const config = {
headers: {
accept: "*/*",
authority: "1yjs1yldj7.execute-api.us-east-1.amazonaws.com",
"user-agent": "Postify/1.0.0",
},
};

try {
const response = await axios.get(
`https://1yjs1yldj7.execute-api.us-east-1.amazonaws.com/default/ai_image?prompt=${encodeURIComponent(
query
)}&aspect_ratio=${fluximg.defaultRatio}`,
config
);
return {
imageLink: response.data.image_link,
};
} catch (error) {
console.error(error);
throw error;
}
},
};




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
 
