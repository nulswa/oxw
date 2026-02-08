import { promises as fs } from 'fs';

const targetFilePath = './scrapers/src/target.json';

async function loadTargets() {
try {
const data = await fs.readFile(targetFilePath, 'utf-8');
return JSON.parse(data);
} catch (error) {
return [];
}
}

let handler = async (m, { conn, usedPrefix, command, text }) => {
const userId = m.sender;
let user = global.db.data.users[userId];

try {
// Obtener torumon del usuario
const torumon = user.toars || 0;

// Si no hay argumentos, mostrar saldo y formas de gastar
if (!text) {
let mensaje = `📍 \`Saldo Disponible\`
- Proporciona la cantidad y tu clave de acceso.

▢ *ARS* : $${torumon.toLocaleString()}

${mess.example}
*${usedPrefix + command}* <cantidad>, <clave>`;

return await conn.reply(m.chat, mensaje, m);
}

// Cargar targets
const targets = await loadTargets();

// Buscar si el usuario está registrado
const userTarget = targets.find(t => t.usuario === userId);

if (!userTarget) {
return await conn.reply(m.chat, `📍  No estás registrado en el sistema.\n- Usa *${usedPrefix}me* para registrarte primero`, m);
}

// Procesar argumentos: cantidad, clave
const args = text.split(',').map(arg => arg.trim());

if (args.length < 2) {
return await conn.reply(m.chat, `📍  Faltan argumentos validos.\n\n*Formato:*\n${usedPrefix}${command} <cantidad>, <clave>\n\n${mess.example}\n${usedPrefix}${command} 5000, <clave>`, m);
}

const cantidad = parseInt(args[0]);
const claveProp = args[1];

// Validar cantidad
if (isNaN(cantidad) || cantidad <= 0) {
return await conn.reply(m.chat, `📍  La cantidad debe ser un número mayor a 0.\n\n${mess.example}\n${usedPrefix}${command} 5000, tuClave`, m);
}

// Verificar que la clave coincida
if (userTarget.clave !== claveProp) {
return await conn.reply(m.chat, `📍  La clave que proporcionaste no coincide con tu clave registrada.\n- Solo puedes gastar tus propios *ARS* usando tu clave personal.`, m);
}

// Verificar que tenga torumon
if (torumon === 0) {
return await conn.reply(m.chat, `📍  No tienes *[ ARS ]* para retirar...`, m);
}

// Verificar que tenga suficientes torumon
if (cantidad > torumon) {
return await conn.reply(m.chat, `📍  Solo tienes *[ ${torumon.toLocaleString()} ARS ]* en esta cuenta.`, m);
}

// Mensaje de carga (procesamiento)
await conn.reply(m.chat, `Solicitando el retiro con *[ ONIX ]*.\n- *Cantidad solicitada* : ${cantidad.toLocaleString()} ARS`, m);

// Simular delay de procesamiento (2 segundos)
await new Promise(resolve => setTimeout(resolve, 2000));

// Restar torumon
const saldoAnterior = torumon;
user.toars = torumon - cantidad;
const saldoNuevo = user.toars;

// Mensaje de éxito
let mensajeExito = `✅ \`¡Solicitud aceptada!\`
> ⏰ Espera 3-5 mientras se transfiere a tu CBU actual...

▢ *Cantidad retirada* : ${cantidad.toLocaleString()} ARS

📍  Si la cantidad no llega, contacte con soporte.`;

await conn.reply(m.chat, mensajeExito, m);

} catch (error) {
console.error('Error en comando gastar:', error);
await conn.reply(m.chat, `${error.message}`, m);
}
};

handler.command = ['gastar', 'retirar', 'withdraw'];
handler.group = true;

export default handler;
 
 
 
 /*import { promises as fs } from 'fs';

const targetFilePath = './scrapers/ows/target.json';
const cooldowns = {};

async function loadTargets() {
try {
const data = await fs.readFile(targetFilePath, 'utf-8');
return JSON.parse(data);
} catch (error) {
return [];
}
}

function formatTime(ms) {
const minutes = Math.floor(ms / 60000);
const seconds = Math.floor((ms % 60000) / 1000);
return `${minutes} minuto${minutes !== 1 ? 's' : ''} y ${seconds} segundo${seconds !== 1 ? 's' : ''}`;
}

let handler = async (m, { conn, usedPrefix, command, text }) => {
const userId = m.sender;
let user = global.db.data.users[userId];
const now = Date.now();

try {
// Verificar cooldown
if (cooldowns[userId] && now < cooldowns[userId]) {
const remainingTime = cooldowns[userId] - now;
const timeFormatted = formatTime(remainingTime);
return await conn.reply(m.chat, `📍  Para evitar saturación repentina del sistema, debe esperar *${timeFormatted}* para volver a realizar un retiro.`, m);
}

// Obtener torumon del usuario
const torumon = user.toars || 0;

// Si no hay argumentos, mostrar saldo y formas de gastar
if (!text) {
let mensaje = `📍 \`Saldo Disponible\`
- Proporciona la cantidad y tu clave de acceso.

▢ *ARS* : $${torumon.toLocaleString()}

${mess.example}
*${usedPrefix + command}* 2000, oqW*******zG3a`;

return await conn.reply(m.chat, mensaje, m);
}

// Cargar targets
const targets = await loadTargets();

// Buscar si el usuario está registrado
const userTarget = targets.find(t => t.usuario === userId);

if (!userTarget) {
return await conn.reply(m.chat, `📍  No estás registrado en el sistema.\n- Usa *${usedPrefix}me* para registrarte primero`, m);
}

// Procesar argumentos: cantidad, clave
const args = text.split(',').map(arg => arg.trim());

if (args.length < 2) {
return await conn.reply(m.chat, `📍Faltan argumentos validos.\n\n*Formato:*\n${usedPrefix}${command} <cantidad>, <clave>\n\n${mess.example}\n${usedPrefix}${command} 5000, ${userTarget.clave}`, m);
}

const cantidad = parseInt(args[0]);
const claveProp = args[1];

// Validar cantidad
if (isNaN(cantidad) || cantidad <= 0) {
return await conn.reply(m.chat, `📍La cantidad debe ser un número mayor a 0.\n\n${mess.example}\n${usedPrefix}${command} 5000, tuClave`, m);
}

// Verificar que la clave coincida
if (userTarget.clave !== claveProp) {
return await conn.reply(m.chat, `📍La clave que proporcionaste no coincide con tu clave registrada.\n- Solo puedes gastar tus propios recursos usando tu clave personal.`, m);
}

// Verificar que tenga torumon
if (torumon === 0) {
return await conn.reply(m.chat, `📍No tienes saldo en esta cuenta.`, m);
}

// Verificar que tenga suficientes torumon
if (cantidad > torumon) {
return await conn.reply(m.chat, `📍  Solo tienes *[ ${torumon.toLocaleString()} ARS ]* en esta cuenta.`, m);
}

// Mensaje de carga (simulando procesamiento)
const loadingMsg = await conn.reply(m.chat, `Enviando solicitud a *[ ONIX ]* para retirar *[ ${cantidad.toLocaleString()} ARS ]*...`, m);

// Simular delay de procesamiento (2 segundos)
await new Promise(resolve => setTimeout(resolve, 2000));

// Restar torumon
const saldoAnterior = torumon;
user.torucoin = torumon - cantidad;
const saldoNuevo = user.torucoin;

// Establecer cooldown de 10 minutos
cooldowns[userId] = now + 600000; // 10 minutos = 600,000 ms

// Editar el mensaje de carga con el resultado exitoso
let mensajeExito = `✅ \`¡Solicitud aceptada!\`
> ⏰ Espera 3-5 minutos mientras se envía el retiro.

▢ *Cantidad retirada* : ${cantidad.toLocaleString()} ARS`;

await conn.sendMessage(m.chat, { text: mensajeExito, edit: loadingMsg.key });

} catch (error) {
console.error('Error en comando gastar:', error);
await conn.reply(m.chat, `${error.message}`, m);
}
};

handler.command = ['gastar', 'retirar', 'withdraw'];
handler.group = true;

export default handler;

*/
