import { promises as fs } from 'fs';

const personajePath = './scrapers/ows/personajes.json'; //Cambialo segun el json.
const ccFilePath = './scrapers/ows/cc.json'; //Cambialo segun el json.

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

let handler = async (m, { conn, usedPrefix, command, text }) => {
if (!global.db.data.chats[m.chat].fCards && m.isGroup) {
return conn.sendMessage(m.chat, { text: `*[ ⽷ ]*  Los comandos de *cartas* estan desactivados...` }, { quoted: m })
}

const userId = m.sender;

// Verificar que se haya proporcionado un nombre o ID :v
//Elimina el ${mess.example} ya que no existe.
if (!text) {
return await conn.reply(m.chat, `${mess.example}\n*${usedPrefix + command}* Endeavor\n*${usedPrefix + command}* RW5kZWF2b3I=\n\n> 📍 Usa el nombre o ID...`, m);
}

try {
// Cargar personajes y colecciones :v
const personajes = await loadPersonaje();
const colecciones = await loadColecs();

// Buscar el personaje por nombre o ID (case insensitive), es decir, da igual si esta en mayúscula o minúscula :v 
const busqueda = text.trim().toLowerCase();
const personaje = personajes.find(p => 
p.name.toLowerCase() === busqueda || 
p.id.toLowerCase() === busqueda
);

if (!personaje) {
return await conn.reply(m.chat, `📍  No se encontró ningún personaje con el nombre o ID *[ ${text} ]*.\n- Usa *${usedPrefix}cbuy* para ver la lista de personajes disponibles`, m);
}

// Verificar si el usuario tiene este personaje ._.
const userColeccion = colecciones.find(c => c.userId === userId);
let loTiene = false;

if (userColeccion && userColeccion.personajes) {
loTiene = userColeccion.personajes.some(p => p.id === personaje.id);
}

// Construir mensaje con los detalles del personaje ._.
let mensaje = `\t\t〤 \`Personaje : Info\`
> ${personaje.base} • ${personaje.habili}

\t⽷ \`Basico\`
⩩ *ID* » ${personaje.id}
⩩ *Nombre* » ${personaje.name}
⩩ *Género* » ${personaje.gender}
⩩ *Anime* » ${personaje.anime}
⩩ *Rareza* » ${personaje.rarity}

\t⽷ \`Detalles\`
⩩ *Estado* » ${personaje.status}
⩩ *Poder* » ${personaje.poder}
⩩ *Fuerza* » ${personaje.fuerza}
⩩ *Magia* » ${personaje.magia}
⩩ *Votos* » ${personaje.vote}
⩩ *Valor* » *${personaje.value}* Boletos 🧧`;

// Indicar si el usuario tiene o no el personaje :b
if (loTiene) {
mensaje += `\n\n✅  *¡Ya tienes este personaje en tu colección!*`;
} else {
mensaje += `\n\n📍  *No tienes este personaje*\n`;
if (personaje.status === 'Disponible') {
mensaje += `- _Puedes comprarlo con *${usedPrefix}cpay ${personaje.name}*_`;
} else {
mensaje += `- _Este personaje no está disponible actualmente_`;
}
}

// Enviar imagen con los detalles :3
//Si falla, enviara otra imagen si la otra no se cargo.
const imagenUrl = personaje.dfoto || personaje.pfoto;

if (imagenUrl) {
await conn.sendMessage(m.chat, { text: mensaje, contextInfo: { forwardingScore: 1, isForwarded: false, externalAdReply: { showAdAttribution: false, renderLargerThumbnail: true, title: `${personaje.name} : ${personaje.status}`, body: personaje.anime, containsAutoReply: true, mediaType: 1, thumbnailUrl: personaje.dfoto, sourceUrl: null }}}, { quoted: m })
//conn.sendFile(m.chat, personaje.dfoto, 'toru.jpg', mensaje, m); // :b
} else {
await conn.reply(m.chat, mensaje, m); //Si falla na mas envia mensaje sin imagen. :b
}

} catch (error) {
console.error(error);
await conn.reply(m.chat, `${error.message}`, m);
}
};

handler.command = ['dinfo'];
handler.tags = ["coleccion"];
handler.group = true;

export default handler;

const more = String.fromCharCode(8206);
const readMore = more.repeat(4001);

//en fin código tuyo. :b
/*
mensaje += `> 📍 ${personaje.habili}\n\n`;
mensaje += `\t\t〤 \`Basico\`\n`;
mensaje += `▢ *ID* : ${personaje.id}\n`;
mensaje += `▢ *Nombre* : ${personaje.name}\n`;
mensaje += `▢ *Género* : ${personaje.gender}\n`;
mensaje += `▢ *Anime* : ${personaje.anime}\n`;
mensaje += `▢ *Rareza* : ${personaje.rarity}\n`;
mensaje += `▢ *Estado* : ${personaje.status}\n\n`;
mensaje += `\t\t〤 \`Detalles\`\n`;
mensaje += `▢ *Poder* : ${personaje.poder}\n`;
mensaje += `▢ *Fuerza* : ${personaje.fuerza}\n`;
mensaje += `▢ *Magia* : ${personaje.magia}\n`;
mensaje += `▢ *Base* : ${personaje.base}\n`;
mensaje += `▢ *Valor* : ${personaje.value} ${toem} ${currency}\n`;
mensaje += `▢ *Votos* : ${personaje.vote}\n\n`;
*/