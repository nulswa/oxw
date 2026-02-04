import { promises as fs } from 'fs';

const charactersFile = './src/database/characters.json';
const waifusEnVentaFile = './src/database/waifusVenta.json';

async function loadCharacters() {
const data = await fs.readFile(charactersFile, 'utf-8');
return JSON.parse(data);
}
async function saveCharacters(characters) {
await fs.writeFile(charactersFile, JSON.stringify(characters, null, 2));
}
async function loadVentas() {
try {
const data = await fs.readFile(waifusEnVentaFile, 'utf-8');
return JSON.parse(data);
} catch {
return [];
}
}
async function saveVentas(ventas) {
await fs.writeFile(waifusEnVentaFile, JSON.stringify(ventas, null, 2));
}

let handler = async (m, { args, conn, usedPrefix, command, participants }) => {
let userId = m.sender;
if (userId.endsWith('@lid') && m.isGroup) {
const pInfo = participants.find(p => p.lid === userId);
if (pInfo && pInfo.id) userId = pInfo.id;
}

const texto = args.join(' ').trim();

let personaje = null;
let precio = null;

if (m.quoted?.text) {
const idMatch = m.quoted.text.match(/ID:\s*\*([^\*]+)\*/i);
if (!idMatch) return conn.sendMessage(m.chat, { text: `📍  No se ha podido encontrar el ID del personaje...` }, { quoted: m })
const id = idMatch[1].trim();
const characters = await loadCharacters();
personaje = characters.find(c => c.id === id);
precio = parseInt(args[0]);
} else {
const precioDetectado = args.find(a => !isNaN(a));
if (!precioDetectado) {
return conn.sendMessage(m.chat, { text: `${mess.example}\n*${usedPrefix + command}* sakura 2000` }, { quoted: m });
}

precio = parseInt(precioDetectado);
if (isNaN(precio) || precio < 1) {
return conn.sendMessage(m.chat, { text: `📍  El precio debe establecerse en numeros justos.\n\n${mess.example}\n*${usedPrefix + command}* ${args[0]} 2000` }, { quoted: m });
}

const nombre = args.filter(a => a !== precioDetectado).join(' ').toLowerCase();
const characters = await loadCharacters();
personaje = characters.find(c => c.name.toLowerCase() === nombre);

if (!personaje) return conn.sendMessage(m.chat, { text: `📍  El personaje *( ${nombre} )* no se ha encontrado o no existe...` }, { quoted: m });
}

if (personaje.user !== userId) return conn.sendMessage(m.chat, { text: `📍  El personaje no es tuyo...` }, { quoted: m });

const ventas = await loadVentas();

const ventaExistente = ventas.find(v => v.id === personaje.id);

const chars = await loadCharacters();
const i = chars.findIndex(x => x.id === personaje.id);

if (i === -1) return conn.sendMessage(m.chat, { text: `📍  Personaje no encontrado en el archivo *[personajes.json]*` }, { quoted: m });

chars[i].enVenta = true;
chars[i].precioVenta = precio;

if (ventaExistente) {
ventas.forEach(v => {
if (v.id === personaje.id) v.precio = precio;
});

await saveCharacters(chars);
await saveVentas(ventas);

return conn.sendMessage(m.chat, { text: `📍  El personaje ya esta en venta.\n- *Precio actualizado:* $${precio.toLocaleString()} ${currency}` }, { quoted: m });
}

ventas.push({
id: personaje.id,
name: personaje.name,
precio: precio,
vendedor: userId,
fecha: Date.now()
});

await saveCharacters(chars);
await saveVentas(ventas);
conn.sendMessage(m.chat, { text: `✅  El personaje *( ${personaje.name} )* ahora esta en venta por *$${precio.toLocaleString()} ${currency}*.` }, { quoted: m });
};

handler.command = ['vend+', 'vender+'];
handler.group = true;

export default handler;
