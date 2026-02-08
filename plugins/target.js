import { promises as fs } from 'fs';

const targetFilePath = './src/target.json';

async function loadTargets() {
try {
const data = await fs.readFile(targetFilePath, 'utf-8');
return JSON.parse(data);
} catch (error) {
return [];
}
}

let handler = async (m, { conn, args, usedPrefix, command }) => {
const nameWa = await conn.getName(m.sender)
const userId = m.sender;
let user = global.db.data.users[userId];

try {
// Cargar datos de targets
const targets = await loadTargets();

// Buscar si el usuario está registrado
const userTarget = targets.find(t => t.usuario === userId);

// Si el usuario NO está registrado
if (!userTarget) {
let mensaje = `📍  No tienes una cuenta registrada en *@T O R U*\n- Usa *${usedPrefix}me* para registrar tus datos.`;
return await conn.sendMessage(m.chat, { text: mensaje }, { quoted: m });
}

// Obtener ToruCoins de la database global
const totalArs = user.toars;

if (!args[0]) {
// Si el usuario ESTÁ registrado, mostrar sus datos
let mensaje = `📍 \`TARJETA : PERFI\`
- Puedes usar *[ ${usedPrefix + command} clave ]*

> *Fondos reservados:*
💵 *ARS* : ${totalArs.toLocaleString()}

👤 *Usuario* : ${nameWa}
📞 *Teléfono* : ${userTarget.telefono}
🏷️ *Alias* : ${userTarget.alias}
🔢 *CVU* : ${userTarget.numeral}\n`;

if (userTarget.codigo && userTarget.codigo.length > 0) {
mensaje += `🎟️ *Código* : \`${userTarget.codigo}\`\n`;
mensaje += `\n 📍 Usa *#check* para abrir el código.`;
} else {
mensaje += `🎟️ *Código* : Vacio\n`;
mensaje += `\n📍 Los codigos se consiguen mediante eventos realizados.`;
}

await conn.reply(m.chat, mensaje, m);

} else if (args[0] === "code" || args[0] === "clave") {
let claveToru = `${userTarget.clave}`;
return await conn.sendMessage(m.chat, { text: claveToru }, { quoted: m });
 } 
} catch (error) {
console.error('Error en comando target:', error);
await conn.reply(m.chat, `${error.message}`, m);
}
};

handler.command = ['target', 'datos', 'perfil'];
handler.group = true;

export default handler;


/*
import { promises as fs } from 'fs';

const targetFilePath = './scrapers/ows/target.json';

async function loadTargets() {
try {
const data = await fs.readFile(targetFilePath, 'utf-8');
return JSON.parse(data);
} catch (error) {
return [];
}
}

let handler = async (m, { conn, usedPrefix, args, command }) => {
const userId = m.sender;
const nameWa = await conn.getName(m.sender)

try {
const targets = await loadTargets();
const userTarget = targets.find(t => t.usuario === userId);

if (!userTarget) {
let mensaje = `📍No tienes una cuenta registrada en *@T O R U*\n- Usa *${usedPrefix}me* para registrar tus datos.`;
return await conn.sendMessage(m.chat, { text: mensaje }, { quoted: m });
}

if (!args[0]) {
let mensaje = `📍 \`TARJETA : PERFI\`

> Puedes usar *[ ${usedPrefix + command} clave ]*

- 👤 *Usuario* : ${nameWa}
📞 *Teléfono* : ${userTarget.telefono}
🏷️ *Alias* : ${userTarget.alias}
🔢 *CVU* : ${userTarget.numeral}
💰 *ARS* : ${userTarget.pux}\n`;
if (userTarget.codigo && userTarget.codigo.length > 0) {
mensaje += `🎟️ *Código* : \`${userTarget.codigo}\`\n`;
mensaje += `\n 📍 Usa *#check* para abrir el código.`;
} else {
mensaje += `🎟️ *Código* : Vacio\n`;
mensaje += `\n📍 Los codigos se consiguen mediante eventos realizados.`;
}

await conn.reply(m.chat, mensaje, m);

} else if (args[0] === "code" || args[0] === "clave") {
let claveToru = `${userTarget.clave}`;
return await conn.sendMessage(m.chat, { text: claveToru }, { quoted: m });
 } 
} catch (error) {
console.error('Error en comando target:', error);
await conn.reply(m.chat, `❌ Error al obtener tus datos: ${error.message}`, m);
}
};

handler.command = ['target', 'datos'];
handler.group = true;
export default handler;
*/
