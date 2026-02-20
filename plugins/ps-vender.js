import { promises as fs } from 'fs';

const personajePath = './scrapers/ows/personajes.json';
const ccFilePath = './scrapers/ows/cc.json';
const ventFilePath = './scrapers/ows/vent.json';

async function loadPersonaje() {
try {
const data = await fs.readFile(personajePath, 'utf-8');
return JSON.parse(data);
} catch (error) {
throw new Error(`${mess.fallo}\n- [ LoadPersonaje ]...`);
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
throw new Error(`${mess.fallo}\n- [ SaveColecs ]...`);
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
throw new Error(`${mess.fallo}\n- [ SaveVentas ]...`);
}
}

let handler = async (m, { conn, usedPrefix, command, text }) => {
if (!global.db.data.chats[m.chat].fCards && m.isGroup) {
return conn.sendMessage(m.chat, { text: `*[ ⽷ ]*  Los comandos de *cartas* estan desactivados...` }, { quoted: m })
}

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
let mensaje = '📍  No tienes personajes en venta.\n';
mensaje += `- Usa *${usedPrefix}cs* para ver tu colección.`;

return await conn.reply(m.chat, mensaje, m);
}

// Mostrar personajes en venta
let mensaje = '· ┄ · ⊸ 𔓕 *Venta  :  Personajes*\n';
mensaje += `- Personajes: *${personajesUsuarioEnVenta.length}* en venta.\n\n`;

personajesUsuarioEnVenta.forEach((venta, index) => {
const precioOriginal = parseInt(venta.precioOriginal);
const precioVenta = parseInt(venta.precioVenta);
const descuento = precioOriginal - precioVenta;

mensaje += `> *${index + 1}.* » ${venta.name} *(${venta.rarity})*\n`;
mensaje += `✦ *Anime* : ${venta.anime} *(${venta.estado})*\n`;
mensaje += `✦ *Precio* : ~${precioOriginal}~ » *${precioVenta}* 🧧\n`;
mensaje += `✦ Descuento: *-${descuento}* 🧧 (30%)\n\n`;
});

return await conn.reply(m.chat, mensaje, m);
}

// Buscar el personaje en la colección del usuario
const userColeccionIndex = colecciones.findIndex(c => c.userId === userId);

if (userColeccionIndex === -1 || !colecciones[userColeccionIndex].personajes || colecciones[userColeccionIndex].personajes.length === 0) {
return await conn.reply(m.chat, `📍 No tienes personajes en tu colección.\n- Usa *${usedPrefix}cbuy* para comprar personajes.`, m);
}

// Buscar el personaje por nombre
const nombreBuscado = text.trim().toLowerCase();
const personajeIndex = colecciones[userColeccionIndex].personajes.findIndex(
p => p.name.toLowerCase() === nombreBuscado
);

if (personajeIndex === -1) {
return await conn.reply(m.chat, `📍 No tienes a *[ ${text} ]* en tu colección.\n- Usa *${usedPrefix}cs* para ver tus personajes.`, m);
}

const personaje = colecciones[userColeccionIndex].personajes[personajeIndex];

// Verificar que el personaje esté disponible (según el archivo original)
const personajeOriginal = personajes.find(p => p.id === personaje.id);
if (!personajeOriginal || personajeOriginal.status !== 'Disponible') {
return await conn.reply(m.chat, `📍 No puedes vender a *[ ${personaje.name} ]* porque no está disponible en el sistema.`, m);
}

// Verificar que el personaje no esté ya en venta
const yaEnVenta = ventas.some(v => v.vendedorId === userId && v.personajeId === personaje.id && v.estado === 'En venta');
if (yaEnVenta) {
return await conn.reply(m.chat, `📍 Ya tienes a *[ ${personaje.name} ]* en venta.`, m);
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
let mensaje = `\t⽷ \`Personaje en venta.\`

> *Basico:*
⩩ *ID* » ${personaje.id}
⩩ *Nombre* » ${personaje.name} *(${personaje.rarity})*
⩩ *Genero* » ${personaje.gender}
⩩ *Anime* » ${personaje.anime}
⩩ *Valor org* » ${precioOriginal} Boletos 🧧

> *Detalles*
⩩ *Base* » ${personaje.base}
⩩ *Poder* » ${personaje.poder}
⩩ *Fuerza* » ${personaje.fuerza}
⩩ *Magia* » ${personaje.magia}

> ✅  *Se ha aplicado un *30%* de descuento. *(🧧 -${descuento} Boletos)*
- Ahora disponible en: *${usedPrefix}buy*`;

await conn.sendFile(m.chat, personaje.pfoto, 'toru.jpg', mensaje, m);
//conn.reply(m.chat, mensaje, m);

} catch (error) {
console.error(error);
await conn.sendMessage(m.chat, { text: `${error.message}` }, { quoted: m });
//conn.reply(m.chat, `${error.message}`, m);
}
};

handler.command = ['vender', 'sell'];
handler.tags = ["coleccion"];
handler.group = true;

export default handler;

const more = String.fromCharCode(8206);
const readMore = more.repeat(4001);

