import { promises as fs } from 'fs';

const charactersFilePath = './scrapers/personajes.json';
const userFavFilePath = './scrapers/pfav.json';

async function loadCharacters() {
const data = await fs.readFile(charactersFilePath, 'utf-8');
return JSON.parse(data);
}

async function saveCharacters(characters) {
await fs.writeFile(charactersFilePath, JSON.stringify(characters, null, 2), 'utf-8');
}

async function loadUserFavs() {
try {
const data = await fs.readFile(userFavFilePath, 'utf-8');
return JSON.parse(data);
} catch {
return {};
}
}

async function saveUserFavs(favs) {
await fs.writeFile(userFavFilePath, JSON.stringify(favs, null, 2), 'utf-8');
}

let handler = async (m, { args, usedPrefix, command, conn }) => {
if (!args[0]) return conn.sendMessage(m.chat, { text: `${mess.example}\n*${usedPrefix + command}* sakura` }, { quoted: m });

let characters = await loadCharacters();
let favs = await loadUserFavs();

const characterName = args.join(' ').toLowerCase();
const userId = m.sender;

let character = characters.find(c => c.name.toLowerCase() === characterName);
if (!character) return conn.sendMessage(m.chat, { text: `📍  Personaje no encontrado o no existe...` }, { quoted: m });

if (favs[userId] && favs[userId] !== character.name) {
let prevChar = characters.find(c => c.name === favs[userId]);
if (prevChar && prevChar.favorites > 0) prevChar.favorites--;
}

character.favorites = (character.favorites || 0) + 1;
favs[userId] = character.name;

await saveCharacters(characters);
await saveUserFavs(favs);

await conn.sendMessage(m.chat, { text: `✅  El personaje *( ${character.name} )* ahora es tu favorito.` }, { quoted: m });
};

handler.command = ['fav+'];
handler.group = true;

export default handler;
