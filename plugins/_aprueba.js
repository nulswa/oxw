import { promises as fs } from 'fs';

const personajePath = './scrapers/ows/personajes.json';
const ccFilePath = './scrapers/ows/cc.json';

const cooldowns = {};

async function loadPersonaje() {
try {
const data = await fs.readFile(personajePath, 'utf-8');
return JSON.parse(data);
} catch (error) {
throw new Error('No se pudo cargar el archivo characters.json.');
}
}

async function savePersonaje(personaje) {
try {
await fs.writeFile(personajePath, JSON.stringify(personaje, null, 2), 'utf-8');
} catch (error) {
throw new Error('No se pudo guardar el archivo characters.json.');
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

let handler = async (m, { conn, usedPrefix, command, text }) => {
const userId = m.sender;
let user = global.db.data.users[userId];
const now = Date.now();

// Verificar cooldown
if (cooldowns[userId] && now < cooldowns[userId]) {
const remainingTime = Math.ceil((cooldowns[userId] - now) / 1000);
const minutes = Math.floor(remainingTime / 60);
const seconds = remainingTime % 60;
return await conn.reply(m.chat, `📍  Debes esperar *${minutes} minutos y ${seconds} segundos* para comprar de nuevo.`, m);
}

try {
// Cargar personajes y colecciones
const personajes = await loadPersonaje();
const colecciones = await loadColecs();

// Si no hay texto, mostrar lista de personajes disponibles
if (!text) {
let mensaje = '· ┄ · ⊸ 𔓕 *Personajes  :  Compras*\n- ¡Compra personajes y sube tu estatus!\n\n';

const personajesDisponibles = personajes.filter(p => p.status === 'Disponible');

if (personajesDisponibles.length === 0) {
return await conn.reply(m.chat, '📍 No hay personajes disponibles en este momento.', m);
}

personajesDisponibles.forEach((personaje, index) => {
mensaje += `> ${index + 1}. *${personaje.name}*\n`;
mensaje += `▢ *Rareza* : ${personaje.rarity}\n`;
mensaje += `▢ *Precio* : ${personaje.value.toLocaleString()}K ${toem}\n`;
mensaje += `▢ *Poder* : ${personaje.poder}\n\n\n`;
});

mensaje += `\n📍  Use *${usedPrefix + command} <nombre>* para comprar un personaje`;
mensaje += `\n\n${mess.example}\n${usedPrefix + command} Endeavor`;

return await conn.sendMessage(m.chat, { text: mensaje, contextInfo: { forwardingScore: 1, isForwarded: false, externalAdReply: { showAdAttribution: false, renderLargerThumbnail: true, title: "Personajes Disponibles", body: textbot, containsAutoReply: true, mediaType: 1, thumbnailUrl: "https://i.postimg.cc/TP8KzfW4/adn3jv.jpg", sourceUrl: null }}}, { quoted: m })
//conn.reply(m.chat, mensaje, m);
}

// Buscar el personaje por nombre (case insensitive)
const nombreBuscado = text.trim().toLowerCase();
const personaje = personajes.find(p => p.name.toLowerCase() === nombreBuscado);

if (!personaje) {
return await conn.reply(m.chat, `📍 No se encontró ningún personaje con el nombre "*${text}*".\n\n- Usa *${usedPrefix}cbuy* para ver la lista de personajes disponibles.`, m);
}

// Verificar si el personaje está disponible
if (personaje.status !== 'Disponible') {
return await conn.reply(m.chat, `📍  El personaje *[ ${personaje.name} ]* no está disponible en este momento.`, m);
}

// Verificar si el usuario ya tiene este personaje
const userColeccion = colecciones.find(c => c.userId === userId);
if (userColeccion && userColeccion.personajes) {
const yaLoTiene = userColeccion.personajes.some(p => p.id === personaje.id);
if (yaLoTiene) {
return await conn.reply(m.chat, `📍  Ya tienes el personaje *[ ${personaje.name} ]* en tu colección. No puedes comprar el mismo personaje dos veces.`, m);
}
}

// Verificar si el usuario tiene suficientes ToruCoins
const precio = parseInt(personaje.value);
if (!user.torucoin || user.torucoin < precio) {
return await conn.reply(m.chat, `Necesitas *[ ${toem} ${precio - (user.torucoin || 0)} ${currency} ]* para comprarlo.\n- Solo tienes ${toem} ${user.torucoin} en tu inventario.`, m);
}

// Realizar la compra
user.torucoin -= precio;

// Agregar personaje a la colección del usuario
let coleccionIndex = colecciones.findIndex(c => c.userId === userId);

if (coleccionIndex === -1) {
// Crear nueva colección para el usuario
colecciones.push({
userId: userId,
personajes: [personaje]
});
} else {
// Agregar personaje a colección existente :v
if (!colecciones[coleccionIndex].personajes) {
colecciones[coleccionIndex].personajes = [];
}
colecciones[coleccionIndex].personajes.push(personaje);
}

// Guardar colecciones :v
await saveColecs(colecciones);

// Establecer cooldown de 1 minuto :v (cambialo si quieres)
cooldowns[userId] = now + 60000;

// Mensaje de confirmación ._.
let mensajeCompra = `
〩 *¡Personaje Comprado!* 〩
- ${personaje.base}

> *Basico*
▢ *ID* : ${personaje.id}
▢ *Nombre* : ${personaje.name}
▢ *Genero* : ${personaje.gender}
▢ *Anime* : ${personaje.anime}
▢ *Rareza* : ${personaje.rarity}

> *Detalles* : 
▢ *Poder* : ${personaje.poder}
▢ *Fuerza* : ${personaje.fuerza}
▢ *Magia* : ${personaje.magia}
▢ *Valor* : ${personaje.value} ${toem}

📍 *Hash* : Comprado ✅
> ${personaje.habili}`;

await conn.sendFile(m.chat, personaje.pfoto, 'toru.jpg', mensajeCompra, m);
//conn.reply(m.chat, mensajeCompra, m); 
// Carezco de diseños.... :v

} catch (error) {
console.error(error);
await conn.sendMessage(m.chat, { text: `${error.message}` }, { quoted: m });
}
};

handler.command = ['cbuy'];
handler.group = true;

export default handler;


