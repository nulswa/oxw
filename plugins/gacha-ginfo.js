import { promises as fs } from 'fs';

import { cooldowns as rwCooldowns } from './gacha-rollwaifu.js';
import { cooldowns as claimCooldowns } from './gacha-claim.js';
import { cooldowns as voteCooldowns, voteCooldownTime } from './gacha-vote.js';

const charactersFilePath = './scrapers/personajes.json';

function formatTime(ms) {
if (!ms || ms <= 0) return 'Ahora.';
const totalSeconds = Math.ceil(ms / 1000);
const minutes = Math.floor(totalSeconds / 60);
const seconds = totalSeconds % 60;
return `${minutes} minutos ${seconds} segundos`;
}

let handler = async (m, { conn }) => {
const userId = m.sender;
const now = Date.now();
let userName;

try {
userName = await conn.getName(userId);
} catch {
userName = userId;
}

try {
const rwExpiration = rwCooldowns?.[userId] || 0;
const rwRemaining = rwExpiration - now;
const rwStatus = formatTime(rwRemaining);

const claimExpiration = claimCooldowns?.[userId] || 0;
const claimRemaining = claimExpiration - now;
const claimStatus = formatTime(claimRemaining);

let voteStatus = 'Ahora.';
if (voteCooldowns && typeof voteCooldowns.get === 'function') {
const lastVoteTime = voteCooldowns.get(userId);
if (lastVoteTime) {
const voteExpiration = lastVoteTime + (voteCooldownTime || 0);
const voteRemaining = voteExpiration - now;
voteStatus = formatTime(voteRemaining);
}
}

let allCharacters = [];
try {
const data = await fs.readFile(charactersFilePath, 'utf-8');
allCharacters = JSON.parse(data);
} catch (e) {
console.error('error:', e.message);
return conn.sendMessage(m.chat, { text: e.message }, { quoted: m });
}

const userCharacters = allCharacters.filter(c => c.user === userId);
const claimedCount = userCharacters.length;
const totalCharacters = allCharacters.length;

const totalValue = userCharacters.reduce((sum, char) => {
return sum + (Number(char.value) || 0);
}, 0);

let response = `\t\t【 *Info : Gacha* 】

▢ *Usuario* : ${userName}
▢ *Personajes* : ${claimedCount} / ${totalCharacters}
▢ *Votaciones* : ${voteStatus}
▢ *Valores* : ${totalValue.toLocaleString('es-ES')}
▢ *Claim* : ${claimStatus}

> ${textbot}`;
await conn.sendMessage(m.chat, { text: response }, { quoted: m });

} catch (e) {
await conn.sendMessage(m.chat, { text: e.message }, { quoted: m });
}
};

handler.command = ['ginfo'];
handler.group = true;

export default handler;
