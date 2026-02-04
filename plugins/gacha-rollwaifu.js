import { promises as fs } from 'fs';

const charactersFilePath = './scrapers/personajes.json';
const haremFilePath = './scrapers/harem.json';

export const cooldowns = {};

global.activeRolls = global.activeRolls || {};

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

async function loadHarem() {
try {
const data = await fs.readFile(haremFilePath, 'utf-8');
return JSON.parse(data);
} catch (error) {
return [];
}
}

async function saveHarem(harem) {
try {
await fs.writeFile(haremFilePath, JSON.stringify(harem, null, 2), 'utf-8');
} catch (error) {
throw new Error(error.message);
}
}

let handler = async (m, { conn, usedPrefix, command }) => {
const userId = m.sender;
const now = Date.now();

if (cooldowns[userId] && now < cooldowns[userId]) {
const remainingTime = Math.ceil((cooldowns[userId] - now) / 1000);
const minutes = Math.floor(remainingTime / 60);
const seconds = remainingTime % 60;
return await conn.sendMessage(m.chat, { text: `📍  Debes esperar *${minutes} minutos* y *${seconds} segundos* para volver a usar el comando.` }, { quoted: m });
}

try {
const characters = await loadCharacters();
const randomCharacter = characters[Math.floor(Math.random() * characters.length)];
const randomImage = randomCharacter.img[Math.floor(Math.random() * randomCharacter.img.length)];

const harem = await loadHarem();
const userEntry = harem.find(entry => entry.characterId === randomCharacter.id);
const statusMessage = randomCharacter.user ? `*Estado* : claim by (@${randomCharacter.user.split('@')[0]})` : '*Estado* : Libre';

if (!randomCharacter.user) {
global.activeRolls[randomCharacter.id] = {
user: userId,
time: Date.now()
};
}

const message = `· ┄ · ⊸ 𔓕 *Gacha  :  Roll*

▢ *ID* : ${randomCharacter.id}
▢ *Nombre* : ${randomCharacter.name}
▢ *Genero* : ${randomCharacter.gender}
▢ *Valor* : ${randomCharacter.value}
▢ *Fuente* : ${randomCharacter.source}
▢ ${statusMessage}

> 📍 Reclama con *#c*`;

const mentions = statusMessage.includes('@') ? [randomCharacter.user] : [];
await conn.sendFile(m.chat, randomImage, `${randomCharacter.name}.jpg`, message, m, { mentions });

cooldowns[userId] = now + 15 * 60 * 1000;

} catch (error) {
await conn.sendMessage(m.chat, { text: error.message }, { quoted: m });
}
};


handler.command = ['rw', 'gacha'];
handler.group = true;

export default handler;