import { promises as fs } from 'fs';

const charactersFilePath = './scrapers/personajes.json';

async function loadCharacters() {
try {
const data = await fs.readFile(charactersFilePath, 'utf-8');
return JSON.parse(data);
} catch (error) {
throw new Error(error.message);
}
}

async function saveCharacters(characters) {
try {
await fs.writeFile(charactersFilePath, JSON.stringify(characters, null, 2), 'utf-8');
} catch (error) {
throw new Error(error.message);
}
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
const userId = m.sender;

if (!text) {
return conn.sendMessage(m.chat, { text: `ᗢ Proporciona el nombre del personaje para eliminar.\n\n${mess.example}\n*${usedPrefix + command}* sukuna` }, { quoted: m });
}

try {
const characters = await loadCharacters();
const keyword = text.trim().toLowerCase();

const characterIndex = characters.findIndex(c => 
c.user === userId && 
c.name.toLowerCase().includes(keyword)
);

if (characterIndex === -1) {
return conn.sendMessage(m.chat, { text: `📍  No tienes este personaje reclamado...` }, { quoted: m });
}

const characterName = characters[characterIndex].name;

delete characters[characterIndex].user;
characters[characterIndex].status = 'Libre';

await saveCharacters(characters);
conn.sendMessage(m.chat, { text: `✅  El personaje ha sido eliminado en la lista de personajes con exito.` }, { quoted: m });

} catch (e) {
console.error(e);
conn.sendMessage(m.chat, { text: e.message}, { quoted: m });
}
};

handler.command = ['delc'];
handler.group = true;

export default handler;

