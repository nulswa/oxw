import fs from 'fs';

const charactersFilePath = './scrapers/personajes.json';
const ventaFilePath = './scrapers/ventas.json';

async function loadCharacters() {
return JSON.parse(fs.readFileSync(charactersFilePath, 'utf-8'));
}

async function saveCharacters(characters) {
fs.writeFileSync(charactersFilePath, JSON.stringify(characters, null, 2), 'utf-8');
}

async function loadVentas() {
return JSON.parse(fs.readFileSync(ventaFilePath, 'utf-8'));
}

async function saveVentas(data) {
fs.writeFileSync(ventaFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
const userId = m.sender;
const user = global.db.data.users[userId];

if (!args[0]) return conn.sendMessage(m.chat, { text: mess.example + `\n*${usedPrefix + command}* <sakura>` }, { quoted: m });

const nombre = args.join(' ').trim().toLowerCase();

const ventas = await loadVentas();
const characters = await loadCharacters();

const venta = ventas.find(w => w.name.toLowerCase() === nombre);
if (!venta) return conn.sendMessage(m.chat, { text: `📍  El personaje no existe...` }, { quoted: m });

if (venta.vendedor === userId) return conn.sendMessage(m.chat, { text: `📍  No puedes comprar tu propio personaje...` }, { quoted: m });

const precio = parseInt(venta.precio);

if (user.torucoin < precio) {
return conn.sendMessage(m.chat, { text: `Necesitas *[ ${toem} $${precio.toLocaleString()} ${currency} ]* para comprar este personaje...` }, { quoted: m });
}

const waifu = characters.find(c => c.name.toLowerCase() === nombre);
if (!waifu) return conn.sendMessage(m.chat, { text: `❔  No se ha encontrado el personaje...` }, { quoted: m });

user.torucoin -= precio;
const vendedorId = venta.vendedor;
global.db.data.users[vendedorId].torucoin += precio;

waifu.user = userId;
waifu.status = "Reclamado";

const nuevasVentas = ventas.filter(w => w.name.toLowerCase() !== nombre);
await saveVentas(nuevasVentas);
await saveCharacters(characters);

let nombreComprador = await conn.getName(userId);
let textoPrivado = `✅  Tu personaje *( ${waifu.name} )* fue comprado por [ ${nombreComprador} ].\n\n> *Ganancias:\n${toem} +${precio.toLocaleString()} ${currency}\n\n> ${textbot}`;
await conn.sendMessage(vendedorId, { text: textoPrivado }, { quoted: m });
conn.sendMessage(m.chat, { text: `✅  Compraste el personaje *( ${waifu.name} )* con exito.\n- Gastaste *[ ${toem} -${precio.toLocaleString()} ${currency}` }, { quoted: m });
};


handler.command = ['buyc'];
handler.group = true;

export default handler;