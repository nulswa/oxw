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

async function saveTargets(targets) {
try {
await fs.writeFile(targetFilePath, JSON.stringify(targets, null, 2), 'utf-8');
} catch (error) {
throw new Error('No se pudo guardar el archivo target.json.');
}
}

function calcularToruCoins(codigo) {
// Extraer el valor entre paréntesis: toru_onix(23K)vd -> 23K
const match = codigo.match(/toru_onix\(([^)]+)\)vd/);

if (!match) {
return null;
}

const valor = match[1]; // Por ejemplo: "23K", "500M", "123"

// Verificar si tiene letra K o M
if (valor.endsWith('K')) {
const numero = parseInt(valor.slice(0, -1));
return numero * 1000; // 23K = 23,000
} else if (valor.endsWith('M')) {
const numero = parseInt(valor.slice(0, -1));
return numero * 1000000; // 23M = 23,000,000
} else {
return parseInt(valor); // 123 = 123
}
}

let handler = async (m, { conn, usedPrefix, command, text }) => {
const userId = m.sender;
let user = global.db.data.users[userId];

try {
// Cargar targets
let targets = await loadTargets();

// Buscar si el usuario está registrado
const userIndex = targets.findIndex(t => t.usuario === userId);

if (userIndex === -1) {
return await conn.reply(m.chat, `📍  No estás registrado en el sistema.\n- Usa *${usedPrefix}me* para registrarte primero.`, m);
}

const userTarget = targets[userIndex];

// Si no hay argumentos, verificar si tiene código
if (!text) {
if (!userTarget.codigo || userTarget.codigo.length === 0) {
let mensaje = `📍  No tienes un codigo de canje.\n- Puedes conseguir uno en eventos o si se te asignan uno.`;
return await conn.reply(m.chat, mensaje, m);
} else {
let mensaje = `✅  ¡Codigo de canje disponible!
- Usa tu codigo de canje y clave de acceso.

${mess.example}
*${usedPrefix + command} toru_onix(***)vd, xFV******gaE`;

return await conn.reply(m.chat, mensaje, m);
}
}

// Procesar argumentos: código, clave
const args = text.split(',').map(arg => arg.trim());

if (args.length < 2) {
return await conn.reply(m.chat, `📍  Faltan argumentos validos.\n\n*Formato:*\n${usedPrefix}${command} <código>, <clave>\n\n${mess.example}\n${usedPrefix}${command} toru_onix(***)vd, tuClave123`, m);
}

const codigoProp = args[0];
const claveProp = args[1];

// Verificar que el usuario tenga código de canje
if (!userTarget.codigo || userTarget.codigo.length === 0) {
return await conn.reply(m.chat, `📍  No tienes ningún código de canje asignado.\n- _Usa *${usedPrefix}${command}* para verificar tu estado_`, m);
}

// Verificar que la clave coincida
if (userTarget.clave !== claveProp) {
return await conn.reply(m.chat, `📍  La clave que proporcionaste no coincide con tu clave registrada.\n- Solo puedes canjear tu propio código usando tu clave personal.`, m);
}

// Verificar que el código coincida
if (userTarget.codigo !== codigoProp) {
return await conn.reply(m.chat, `📍  El código que proporcionaste no coincide con tu código de canje.`, m);
}

// Calcular ToruCoins a otorgar
const torucoinsGanados = calcularToruCoins(codigoProp);

if (torucoinsGanados === null) {
return await conn.reply(m.chat, `📍 Error al procesar el código. Formato inválido.\n- Contacta a un administrador`, m);
}

// Guardar valores anteriores
const torucoinsAnterior = user.torucoin || 0;

// Agregar ToruCoins al usuario en la database global
user.torucoin = torucoinsAnterior + torucoinsGanados;

// Extraer el valor del código para mostrarlo
const valorCodigo = codigoProp.match(/toru_onix\(([^)]+)\)vd/)[1];

// Borrar el código del usuario
userTarget.codigo = "";

// Guardar cambios
await saveTargets(targets);

// Mensaje de canje exitoso
let mensaje = `✅ \`¡Codigo Canjeado!\`
- Has canjeado el codigo.

> *Obtenidos:*
- *ARS* : $${torucoinsGanados.toLocaleString()}

> *Detalles:*
- *Saldo anterior* : $${torucoinsAnterior.toLocaleString()}
- *Saldo actual* : $${user.torucoin.toLocaleString()}

> ¡Gracias por usar este nuevo proyecto!`;

await conn.reply(m.chat, mensaje, m);

} catch (error) {
console.error('Error en comando canje:', error);
await conn.reply(m.chat, `${error.message}`, m);
}
};

handler.command = ['canje', 'check', 'canjear'];
handler.group = true;

export default handler;


