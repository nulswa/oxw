
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

function generatePassword(length = 12) {
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
let password = '';
for (let i = 0; i < length; i++) {
password += chars.charAt(Math.floor(Math.random() * chars.length));
}
return password;
}

let handler = async (m, { conn, usedPrefix, command, text }) => {
const userId = m.sender;
let user = global.db.data.users[userId];

try {
// Cargar datos de targets
let targets = await loadTargets();

// Buscar si el usuario ya está registrado
const userIndex = targets.findIndex(t => t.usuario === userId);
const userExists = userIndex !== -1;

// Si no hay argumentos
if (!text) {
if (userExists) {
return await conn.reply(m.chat, `📍  Ya estas registrado en el sistema.\n- ¿Quieres volver a registrarte?\n\n- Usa de nuevo el comando mas tu clave.\n\n${mess.example}\n*${usedPrefix + command}* <clave>\n\n- Despues vuelve a usar el comando con tu nueva configuración.`, m);
} else {
let mensaje = `Registra tus datos personales para guardarlos en el sistema.
- Recuerda que deben ser exactos para evitar errores despues.

📍 *Requisitos* : <telefono>, <alias>, <cbu>, <clave>
-  Si no usas una clave al final, se genera uno aleatoriamente.

${mess.example}
*${usedPrefix + command}* +5493333333, text_text.text, 0000342488888888, clave123`;

return await conn.reply(m.chat, mensaje, m);
}
}

// Si el usuario existe y solo envió un argumento (posiblemente la clave)
if (userExists && !text.includes(',')) {
const claveProp = text.trim();
const userTarget = targets[userIndex];

// Verificar si la clave coincide
if (userTarget.clave === claveProp) {
// Eliminar el registro
targets.splice(userIndex, 1);
await saveTargets(targets);

let mensaje = `✅  *Los datos fueron eliminados correctamente.*\n- Puede volver a usar el comando para registrar nuevos datos.`;
return await conn.reply(m.chat, mensaje, m);
} else {
return await conn.reply(m.chat, `📍  La clave es incorrecta para eliminar el registro.\n- Asegurate de copiarlo exactamente.`, m);
}
}

// Si el usuario existe y envió múltiples argumentos (intenta registrarse de nuevo)
if (userExists && text.includes(',')) {
return await conn.reply(m.chat, `📍  Ya estas registrado en el sistema.\n- ¿Quieres volver a registrarte?\n\n- Usa de nuevo el comando mas tu clave.\n\n${mess.example}\n*${usedPrefix + command}* <clave>\n\n- Despues vuelve a usar el comando con tu nueva configuración.`, m);
}

// Procesar registro nuevo
const args = text.split(',').map(arg => arg.trim());

if (args.length < 3) {
return await conn.reply(m.chat, `📍  Datos faltantes, asegurate de ponerlo todos.\n\n📍 *Requisitos* : <telefono>, <alias>, <cbu>, <clave>\n-  Si no usas una clave al final, se genera uno aleatoriamente.\n\n${mess.example}\n*${usedPrefix + command}* +5493333333, text_text.text, 0000342488888888, clave123`, m);
}

const telefono = args[0];
const alias = args[1];
const numeral = args[2];
const clave = args[3] || generatePassword(12);

// Validar teléfono (solo + y números)
const telefonoRegex = /^\+[0-9]+$/;
if (!telefonoRegex.test(telefono)) {
return await conn.reply(m.chat, `📍  El numero debe estar completo todo junto.\n- Por ejemplo: +54933333333`, m);
}

// Validar alias (texto, números, puntos y guiones bajos)
const aliasRegex = /^[a-zA-Z0-9._]+$/;
if (!aliasRegex.test(alias) || alias.length < 3) {
return await conn.reply(m.chat, `📍  El alias debe coincidir con tu cuenta.\n- Si el alias no coincide no pueden retirar fondos.\n- Si falla el alias y el cbu mal escrito, no se puede retirar fondos.`, m);
}

// Validar numeral (solo números, máximo 22 dígitos)
const numeralRegex = /^[0-9]+$/;
if (!numeralRegex.test(numeral)) {
return await conn.reply(m.chat, `📍 El *CBU* tiene al rededor de 22 dígitos.\n- Intentalo de nuevo y asegurate de que sea correcto.
❌ El numeral debe contener solo números.\n\n*Ejemplo:* 12345678901234567890`, m);
}

if (numeral.length > 22) {
return await conn.reply(m.chat, `📍 Tu *CBU* tiene *[ ${numeral.length} ]* digitos.\n- El numero solo es de 22 digitos, intenta de nuevo y asegúrate de que sea correcto.`, m);
}

// Crear nuevo registro (SIN pux)
const nuevoRegistro = {
usuario: userId,
telefono: telefono,
alias: alias,
numeral: numeral,
clave: clave,
codigo: ""
};

// Agregar a targets
targets.push(nuevoRegistro);
await saveTargets(targets);

// Obtener toarss actuales del usuario
const torucoins = user.toars || 0;

// Mensaje de confirmación
const claveGenerada = args[3] ? false : true;

let mensaje = `✅  \`¡REGISTRO CORRECTO!\`
- Ahora puedes tener una cuenta de respaldo.

> *Nuevo* ${toruName}
▢ *Telefono* : ${telefono}
▢ *Alias* : ${alias}
▢ *CBU* : ${numeral}`;

if (claveGenerada) {
mensaje += `\n\nComo no asignaste una clave, se genero uno automáticamente.\n`;
mensaje += `- Tu clave tiene una protección de actividad sospechosa adaptado a onix.`;
}

mensaje += `\n\n📍  Ahora puedes usar *${usedPrefix}target* para ver tu nuevo sistema.`;

await conn.reply(m.chat, mensaje, m);
//conn.reply(nuevoRegistro.usuario, `${clave}`, m);
} catch (error) {
console.error('Error en comando me:', error);
await conn.sendMessage(m.chat, { text: error.message }, { quoted: m });
//conn.reply(m.chat, `❌ Error al procesar el registro: ${error.message}`, m);
}
};

handler.command = ['me', 'registro'];
handler.group = true;

export default handler;

