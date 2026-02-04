import { promises as fs } from 'fs';
const charactersFilePath = './scrapers/personajes.json';

async function loadCharacters() {
const data = await fs.readFile(charactersFilePath, 'utf-8');
return JSON.parse(data);
}

let handler = async (m) => {
const characters = await loadCharacters();
const top = characters
.filter(c => c.favorites)
.sort((a, b) => b.favorites - a.favorites)
.slice(0, 11);

if (top.length === 0) return conn.sendMessage(m.chat, { text: `📍  Aun no hay personajes favoritos...` }, { quoted: m });

let txt = `· ┄ · ⊸ 𔓕 *Personajes  :  Favoritos*\n- Lista de personajes favoritos.\n\n`;
top.forEach((c, i) => {
txt += `▢ *Nro* : ${i + 1}\n▢ *Nombre* : ${c.name}\n▢ *Favoritismo* : ${c.favorites} favoritos.\n\n\n`;
});
await conn.sendMessage(m.chat, { text: txt }, { quoted: m });
};


handler.command = ['favtop'];
handler.group = true;

export default handler;

