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
let user = global.db.data.users[userId];

try {
// Cargar datos
const personajes = await loadPersonaje();
const colecciones = await loadColecs();
let ventas = await loadVentas();

// Si no hay argumentos, mostrar personajes en venta
if (!text) {
// Filtrar solo personajes en venta
const personajesEnVenta = ventas.filter(v => v.estado === 'En venta');

if (personajesEnVenta.length === 0) {
let mensaje = `📍  No hay personajes en venta actualmente.\n- Puedes usar *${usedPrefix}vender* para publicar tu personaje.`;

return await conn.reply(m.chat, mensaje, m);
}

// Agrupar por rareza
const rarityOrder = { 'Golden': 1, 'Rare': 2, 'Common': 3 };
const ventasOrdenadas = personajesEnVenta.sort((a, b) => {
return (rarityOrder[a.rarity] || 999) - (rarityOrder[b.rarity] || 999);
});

let mensaje = '· ┄ · ⊸ 𔓕 *Personajes  :  Venta*\n';
mensaje += `✦ *Personajes en venta* : *${ventasOrdenadas.length}* en total.\n\n`;
mensaje += `📍 Usa *${usedPrefix + command} <nombre>* para comprar un personaje`;
mensaje += `\n\n${mess.example}\n${usedPrefix + command} Endeavor\n\n\n`;

ventasOrdenadas.forEach((venta, index) => {
const precioOriginal = parseInt(venta.precioOriginal);
const precioVenta = parseInt(venta.precioVenta);
const descuento = Math.round(((precioOriginal - precioVenta) / precioOriginal) * 100);

// Emoji según rareza
/*let rarityEmoji = '';
switch(venta.rarity) {
case 'Golden':
rarityEmoji = '👑';
break;
case 'Rare':
rarityEmoji = '💎';
break;
case 'Common':
rarityEmoji = '⭐';
break;
default:
rarityEmoji = '🎴';
}*/

// Obtener nombre del vendedor (puede ser tag del usuario)
const vendedorTag = `@${venta.vendedorId.split('@')[0]}`;

mensaje += `> *${index + 1}.* » ${venta.name} *(${venta.rarity})*\n`;
mensaje += `⩩ *Anime* » ${venta.anime}\n`;
mensaje += `⩩ *Precio* » ${precioVenta} ${descuento}% OFF 🧧\n`;
mensaje += `⩩ *Vendedor* » ${vendedorTag}\n\n`;
});

return await conn.reply(m.chat, mensaje, m);
}

// Buscar el personaje en venta por nombre
const nombreBuscado = text.trim().toLowerCase();
const ventaIndex = ventas.findIndex(
v => v.name.toLowerCase() === nombreBuscado && v.estado === 'En venta'
);

if (ventaIndex === -1) {
return await conn.reply(m.chat, `📍  No se encontró a *[ ${text} ]* en venta.\n- Usa *${usedPrefix + command}* para ver personajes disponibles`, m);
}

const venta = ventas[ventaIndex];

// Verificar que el comprador no sea el vendedor
if (venta.vendedorId === userId) {
return await conn.reply(m.chat, `📍  No puedes comprar tu propio personaje.\n- Usa *${usedPrefix}vender* para ver tus personajes en venta`, m);
}

// Verificar que el personaje esté disponible en el sistema
const personajeOriginal = personajes.find(p => p.id === venta.personajeId);
if (!personajeOriginal || personajeOriginal.status !== 'Disponible') {
return await conn.reply(m.chat, `📍  No puedes comprar a *[ ${venta.name} ]* porque no está disponible en el sistema.`, m);
}

// Verificar que el comprador no tenga ya este personaje
const compradorColeccion = colecciones.find(c => c.userId === userId);
if (compradorColeccion && compradorColeccion.personajes) {
const yaLoTiene = compradorColeccion.personajes.some(p => p.id === venta.personajeId);
if (yaLoTiene) {
return await conn.reply(m.chat, `📍  Ya tienes a *[ ${venta.name} ]* en tu colección.\n- Usa *${usedPrefix}cs* para ver tus personajes`, m);
}
}

// Verificar que el comprador tenga suficientes boletoss
const precio = parseInt(venta.precioVenta);
if (!user.boletos || user.boletos < precio) {
return await conn.reply(m.chat, `Necesitas *[ 🧧 ${precio - (user.boletos || 0)} Boletos ]* para comprarlo.\n- Solo tienes 🧧 ${user.boletos || 0} Boletos en tu inventario.`, m);
}

// Realizar la compra
user.boletos -= precio;

// Agregar boletoss al vendedor
const vendedorId = venta.vendedorId;
if (!global.db.data.users[vendedorId]) {
global.db.data.users[vendedorId] = {
boletos: 0
};
}
global.db.data.users[vendedorId].boletos = (global.db.data.users[vendedorId].boletos || 0) + precio;

// Crear objeto del personaje para la colección del comprador
const personajeComprado = {
id: venta.personajeId,
name: venta.name,
gender: venta.gender,
pfoto: venta.pfoto,
dfoto: venta.dfoto,
base: venta.base,
poder: venta.poder,
fuerza: venta.fuerza,
magia: venta.magia,
value: venta.precioOriginal,
habili: venta.habili,
rarity: venta.rarity,
anime: venta.anime,
status: 'Disponible',
vote: personajeOriginal.vote || 0
};

// Agregar personaje a la colección del comprador
let compradorIndex = colecciones.findIndex(c => c.userId === userId);

if (compradorIndex === -1) {
// Crear nueva colección para el comprador
colecciones.push({
userId: userId,
personajes: [personajeComprado]
});
} else {
// Agregar personaje a colección existente
if (!colecciones[compradorIndex].personajes) {
colecciones[compradorIndex].personajes = [];
}
colecciones[compradorIndex].personajes.push(personajeComprado);
}

// Guardar colecciones actualizadas
await saveColecs(colecciones);

// Eliminar la venta del archivo vent.json
ventas.splice(ventaIndex, 1);
await saveVentas(ventas);

// Mensaje de confirmación
const vendedorTag = `@${vendedorId.split('@')[0]}`;

let mensaje = `· ┄ · ⊸ 𔓕 *¡Personaje  :  Comprado!*

⽷ *Personaje de* » ${vendedorTag}
⽷ *Precio* » ${precio} 🧧

> *Basico:*
⩩ *Nombre* » ${venta.name}
⩩ *Genero* » ${venta.gender}
⩩ *Anime* » ${venta.anime}
⩩ *Rareza* » ${venta.rarity}

> *Detalles:*
⩩ *Base* » ${venta.base}
⩩ *Poder* » ${venta.poder}
⩩ *Fuerza* » ${venta.fuerza}
⩩ *Magia* » ${venta.magia}

📍 *Hash : Comprado* ✅
> ${venta.habili}`;
await conn.sendMessage(m.chat, { image: { url: venta.pfoto }, caption: mensaje, mentions: [vendedorId] }, { quoted: m });
//conn.reply(m.chat, mensaje, m, { mentions: [vendedorId]} );

// Notificar al vendedor
try {
const compradorTag = `@${userId.split('@')[0]}`;
let notificacion = `\t\t〩 \`¡Comprado!\` 〩\n\n`;
notificacion += `📍  El usuario ${compradorTag} ha comprado tu personaje *[ ${venta.name} ]*\n\n`;
notificacion += `⩩ *Has recibido* » *${precio}* Boletos 🧧\n`;
notificacion += `⩩ *Tu saldo* » *${global.db.data.users[vendedorId].boletos}* Boletos 🧧\n\n`;
notificacion += `> 🥳  ¡Felicidades por tu venta!`;

await conn.reply(vendedorId, notificacion, null, { mentions: [userId] });
} catch (error) {
// Si falla la notificación al vendedor, no es crítico
console.log('No se pudo notificar al vendedor:', error);
conn.sendMessage(m.chat, { text: `${error.message}` }, { quoted: m });
}

} catch (error) {
console.error(error);
await conn.reply(m.chat, `${error.message}`, m);
}
};

handler.command = ['comprar', 'buy'];
handler.tags = ["coleccion"];
handler.group = true;

export default handler;

const more = String.fromCharCode(8206);
const readMore = more.repeat(4001);

