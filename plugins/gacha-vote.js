import { promises as fs } from 'fs';

const charactersFilePath = './scrapers/personajes.json';
const haremFilePath = './scrapers/harem.json';

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
await fs.writeFile(charactersFilePath, JSON.stringify(characters, null, 2));
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
await fs.writeFile(haremFilePath, JSON.stringify(harem, null, 2));
} catch (error) {
throw new Error(error.message);
}
}

export let cooldowns = new Map();
export const voteCooldownTime = 1 * 60 * 60 * 1000; // 1 hora

let characterVotes = new Map();

let handler = async (m, { conn, args }) => {
try {
const userId = m.sender;

if (cooldowns.has(userId)) {
const expirationTime = cooldowns.get(userId) + voteCooldownTime;
const now = Date.now();
if (now < expirationTime) {
const timeLeft = expirationTime - now;
const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
const seconds = Math.floor((timeLeft / 1000) % 60);
await conn.sendMessage(m.chat, { text: `📍  Debes esperar *${Math.floor(minutes)} minutos* y *${seconds} segundos* para volver a usar el comando.` }, { quoted: m });
return;
}
}

const characters = await loadCharacters();
const characterName = args.join(' ');

if (!characterName) {
await conn.sendMessage(m.chat, { text: `${mess.example}\n*${usedPrefix + command}* sakura` }, { quoted: m });
return;
}

const originalCharacterName = characterName;
const character = characters.find(c => c.name.toLowerCase() === originalCharacterName.toLowerCase());

if (!character) {
await conn.sendMessage(m.chat, { text: `📍  Personaje mal escrito o no existe...` }, { quoted: m });
return;
}

if (characterVotes.has(originalCharacterName) && Date.now() < characterVotes.get(originalCharacterName)) {
const expirationTime = characterVotes.get(originalCharacterName);
const timeLeft = expirationTime - Date.now();
const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
const seconds = Math.floor((timeLeft / 1000) % 60);
await conn.sendMessage(m.chat, { text: `📍  El personaje ya fue votado recientemente...` }, { quoted: m });
return;
}

const incrementValue = Math.floor(Math.random() * 10) + 1;
character.value = String(Number(character.value) + incrementValue);
character.votes = (character.votes || 0) + 1;
await saveCharacters(characters);

const harem = await loadHarem();
const userEntry = harem.find(entry => entry.userId === userId && entry.characterId === character.id);

if (!userEntry) {
harem.push({
userId: userId,
characterId: character.id,
lastVoteTime: Date.now(),
voteCooldown: Date.now() + voteCooldownTime
});
} else {
userEntry.lastVoteTime = Date.now();
userEntry.voteCooldown = Date.now() + voteCooldownTime;
}
await saveHarem(harem);

cooldowns.set(userId, Date.now());
characterVotes.set(originalCharacterName, Date.now() + voteCooldownTime);

await conn.sendMessage(m.chat, { text: `✅  Has votado por el personaje *( ${originalCharacterName} )* correctamente.` }, { quoted: m })
} catch (e) {
await conn.sendMessage(m.chat, { text: e.message }, { quoted: m });
}
};


handler.command = ['vote', 'votar'];
handler.group = true;

export default handler;
