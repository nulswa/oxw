import { promises as fs } from 'fs';

const personajePath = './scrapers/ows/personajes.json';
const ccFilePath = './scrapers/ows/cc.json';
const ventFilePath = './scrapers/ows/vent.json';

async function loadPersonaje() {
try {
const data = await fs.readFile(personajePath, 'utf-8');
return JSON.parse(data);
} catch (error) {
throw new Error('No se pudo cargar el archivo personajes.json.');
}
}

async function loadColecs() {
try {
const data = await fs.readFile(ccFilePath, 'utf-8');
return JSON.parse(data);
} catch (error) {
return [];
}
}

async function saveColecs(coleccs) {
try {
await fs.writeFile(ccFilePath, JSON.stringify(coleccs, null, 2), 'utf-8');
} catch (error) {
throw new Error('No se pudo guardar el archivo cc.json.');
}
}

async function loadVentas() {
try {
const data = await fs.readFile(ventFilePath, 'utf-8');
return JSON.parse(data);
} catch (error) {
return [];
}
}

async function saveVentas(ventas) {
try {
await fs.writeFile(ventFilePath, JSON.stringify(ventas, null, 2), 'utf-8');
} catch (error) {
throw new Error('No se pudo guardar el archivo vent.json.');
}
}

let handler = async (m, { conn, usedPrefix, command, text }) => {
const userId = m.sender;

try {
// Cargar datos
const personajes = await loadPersonaje();
const colecciones = await loadColecs();
const ventas = await loadVentas();

// Si no hay argumentos, mostrar personajes en venta del usuario
if (!text) {
// Buscar personajes del usuario en venta
const personajesUsuarioEnVenta = ventas.filter(v => v.vendedorId === userId);

if (personajesUsuarioEnVenta.length === 0) {
let mensaje = '📦 *NO TIENES PERSONAJES EN VENTA*\n\n';
mensaje += '❌ No has puesto ningún personaje en venta.\n\n';
mensaje += `💡 *¿Cómo vender personajes?*\n`;
mensaje += `• Usa *${usedPrefix}vender <nombre>* para poner en venta un personaje\n`;
mensaje += `• Ejemplo: *${usedPrefix}vender Endeavor*\n\n`;
mensaje += `_Usa *${usedPrefix}cs* para ver tu colección_`;

return await conn.reply(m.chat, mensaje, m);
}

// Mostrar personajes en venta
let mensaje = '🏪 *TUS PERSONAJES EN VENTA* 🏪\n\n';
mensaje += `📊 Total en venta: *${personajesUsuarioEnVenta.length}*\n\n`;

personajesUsuarioEnVenta.forEach((venta, index) => {
const precioOriginal = parseInt(venta.precioOriginal);
const precioVenta = parseInt(venta.precioVenta);
const descuento = precioOriginal - precioVenta;

mensaje += `🛒 *${index + 1}. ${venta.name}*\n`;
mensaje += ` 📺 Anime: ${venta.anime}\n`;
mensaje += ` 💎 Rareza: ${venta.rarity}\n`;
mensaje += ` 💰 Precio original: ${precioOriginal} ToruCoins\n`;
mensaje += ` 💸 Precio de venta: ${precioVenta} ToruCoins\n`;
mensaje += ` 📉 Descuento: -${descuento} ToruCoins (30%)\n`;
mensaje += ` 📅 Publicado: ${venta.fechaPublicacion}\n`;
mensaje += ` 🔖 Estado: ${venta.estado}\n\n`;
});

return await conn.reply(m.chat, mensaje, m);
}

// Buscar el personaje en la colección del usuario
const userColeccionIndex = colecciones.findIndex(c => c.userId === userId);

if (userColeccionIndex === -1 || !colecciones[userColeccionIndex].personajes || colecciones[userColeccionIndex].personajes.length === 0) {
return await conn.reply(m.chat, `❌ No tienes personajes en tu colección.\n\n_Usa *${usedPrefix}cbuy* para comprar personajes_`, m);
}

// Buscar el personaje por nombre
const nombreBuscado = text.trim().toLowerCase();
const personajeIndex = colecciones[userColeccionIndex].personajes.findIndex(
p => p.name.toLowerCase() === nombreBuscado
);

if (personajeIndex === -1) {
return await conn.reply(m.chat, `❌ No tienes a *${text}* en tu colección.\n\n_Usa *${usedPrefix}cs* para ver tus personajes_`, m);
}

const personaje = colecciones[userColeccionIndex].personajes[personajeIndex];

// Verificar que el personaje esté disponible (según el archivo original)
const personajeOriginal = personajes.find(p => p.id === personaje.id);
if (!personajeOriginal || personajeOriginal.status !== 'Disponible') {
return await conn.reply(m.chat, `❌ No puedes vender a *${personaje.name}* porque no está disponible en el sistema.`, m);
}

// Verificar que el personaje no esté ya en venta
const yaEnVenta = ventas.some(v => v.vendedorId === userId && v.personajeId === personaje.id && v.estado === 'En venta');
if (yaEnVenta) {
return await conn.reply(m.chat, `❌ Ya tienes a *${personaje.name}* en venta.`, m);
}

// Calcular precio de venta (70% del precio original)
const precioOriginal = parseInt(personaje.value);
const precioVenta = Math.floor(precioOriginal * 0.70);
const descuento = precioOriginal - precioVenta;

// Remover personaje de la colección del usuario
colecciones[userColeccionIndex].personajes.splice(personajeIndex, 1);

// Guardar colecciones actualizadas
await saveColecs(colecciones);

// Crear objeto de venta
const nuevaVenta = {
ventaId: `VENTA_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
vendedorId: userId,
personajeId: personaje.id,
name: personaje.name,
gender: personaje.gender,
pfoto: personaje.pfoto,
dfoto: personaje.dfoto,
base: personaje.base,
poder: personaje.poder,
fuerza: personaje.fuerza,
magia: personaje.magia,
habili: personaje.habili,
rarity: personaje.rarity,
anime: personaje.anime,
precioOriginal: precioOriginal,
precioVenta: precioVenta,
fechaPublicacion: new Date().toLocaleString('es-ES', { timeZone: 'America/Buenos_Aires' }),
estado: 'En venta'
};

// Agregar a ventas
ventas.push(nuevaVenta);

// Guardar ventas
await saveVentas(ventas);

// Mensaje de confirmación
let mensaje = `✅ *PERSONAJE PUESTO EN VENTA* ✅

> *Basico:*
▢ *Nombre* : ${personaje.nombre}
▢ *Genero* : ${personaje.genero}
▢ *Anime* : ${personaje.anime}
▢ *Rareza* : ${personaje.rarity}
▢ *Valor org* : ${precioOriginal} ${currency} ${toem}

> *Detalles*
▢ *Base* : ${personaje.base}
▢ *Poder* : ${personaje.poder}
▢ *Fuerza* : ${personaje.fuerza}
▢ *Magia* : ${personaje.magia}

> ✅  *Se ha aplicado un *30%* de descuento. *(${toem} -${descuento} ${currency})*
- Ahora disponible en: *${usedPrefix}buy*`;

await conn.sendFile(m.chat, personaje.dfoto, 'toru.jpg', mensaje, m);
//conn.reply(m.chat, mensaje, m);

} catch (error) {
console.error(error);
await conn.sendMessage(m.chat, { text: `${error.message}` }, { quoted: m });
//conn.reply(m.chat, `${error.message}`, m);
}
};

handler.command = ['vender', 'sell'];
handler.group = true;

export default handler;

