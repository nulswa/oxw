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

async function saveTargets(targets) {
try {
await fs.writeFile(targetFilePath, JSON.stringify(targets, null, 2), 'utf-8');
} catch (error) {
throw new Error('No se pudo guardar el archivo target.json.');
}
}

let handler = async (m, { conn, usedPrefix, command, text }) => {
try {
// Cargar targets
let targets = await loadTargets();

// Si no hay argumentos, mostrar lista de usuarios registrados
if (!text) {
if (targets.length === 0) {
return await conn.reply(m.chat, '📍  No hay usuarios registrados en el sistema.', m);
}

let mensaje = '📍 Usuarios registrados en el sistema.\n';
mensaje += `- 📊 *Total* : *${targets.length}* usuarios\n\n`;

targets.forEach((target, index) => {
const phoneNumber = target.telefono;
const tieneCodigoIcon = target.codigo && target.codigo.length > 0 ? '✅' : '❌';
const codigoStatus = target.codigo && target.codigo.length > 0 ? target.codigo : 'Sin código';

// Obtener torumon de la database global
const userDb = global.db.data.users[target.usuario];
const torumon = userDb ? (userDb.toars || 0) : 0;

mensaje += `> *${index + 1}. [ ${target.alias} ]*\n`;
mensaje += `▢ *Teléfono* : ${phoneNumber}\n`;
mensaje += `▢ *Numeral* : ${target.numeral}\n`;
mensaje += `▢ *ARS* : ${torumon.toLocaleString()}\n`;
mensaje += `> ${tieneCodigoIcon} *Código* > ${codigoStatus}\n\n`;
});

mensaje += `📍 Usa el indice, valor y letra opcional para agregar un código de fondo.\n`;
mensaje += `- *${usedPrefix}${command}* <índice>, <número>, [letra]\n\n`;
mensaje += `${mess.example}\n*${usedPrefix + command}* 2, 3, K`;

return await conn.reply(m.chat, mensaje, m);
}

// Procesar argumentos
const args = text.split(',').map(arg => arg.trim());

if (args.length < 2) {
return await conn.reply(m.chat, `📍  Faltan valores importantes, deben coincidir para generar el codigo.\n- *${usedPrefix}${command}* <índice>, <número>, [letra]\n\n${mess.example}\n${usedPrefix}${command} 2, 123, K`, m);
}

const indice = parseInt(args[0]);
const numero = args[1];
const letra = args[2] ? args[2].toUpperCase().trim() : '';

// Validar índice
if (isNaN(indice) || indice < 1) {
return await conn.reply(m.chat, `📍  El índice debe ser un numero mayor al 0.\n- Usa *${usedPrefix}${command}* para ver la lista de usuarios.`, m);
}

// Validar que el índice existe
if (indice > targets.length) {
return await conn.reply(m.chat, `📍  El índice *[ ${indice} ]* no existe.\n- *Total de usuarios* : ${targets.length}\n\n- Usa *${usedPrefix}${command}* para ver la lista completa.`, m);
}

// Validar número (máximo 3 dígitos)
const numeroRegex = /^[0-9]{1,3}$/;
if (!numeroRegex.test(numero)) {
return await conn.reply(m.chat, `📍  El número debe contener solo dígitos y tener máximo 3 caracteres.\n- *Ejemplos válidos:* 1, 23, 500, 999`, m);
}

// Validar letra (solo K o M, o vacío)
if (letra && letra !== 'K' && letra !== 'M') {
return await conn.reply(m.chat, `📍  La letra debe ser K o M, o puedes omitirla.\n\n*Ejemplos válidos:*\n• ${usedPrefix}${command} 2, 123, K\n• ${usedPrefix}${command} 2, 123, M\n• ${usedPrefix}${command} 2, 123`, m);
}

// Obtener usuario del índice
const targetUser = targets[indice - 1];

// Verificar si ya tiene código
const yaTeníaCodigo = targetUser.codigo && targetUser.codigo.length > 0;
const codigoAnterior = yaTeníaCodigo ? targetUser.codigo : 'Ninguno';

// Generar código
const valorCodigo = letra ? `${numero}${letra}` : numero;
const codigoGenerado = `toru_onix(${valorCodigo})vd`;

// Asignar código al usuario
targetUser.codigo = codigoGenerado;

// Guardar cambios
await saveTargets(targets);

// Mensaje de confirmación
let mensaje = `✅ \`¡Codigo Generado!\`
- Se ha asignado un código de canje al usuario.

▢ *Indice* : ${indice}
▢ *Alias* : ${targetUser.alias}
▢ *Telefono* : ${targetUser.telefono}
▢ *CBU* : ${targetUser.numeral}\n\n`;

if (yaTeníaCodigo) {
mensaje += `🏷️ *Código actualizado:*\n`;
mensaje += `> Código anterior: \`${codigoAnterior}\`\n`;
} else {
mensaje += `🆕 *¡Código creado con exito!*\n`;
}

mensaje += `✅ Código nuevo: \`${codigoGenerado}\`\n`;
mensaje += `> 💡 El usuario puede usar *${usedPrefix}target* para ver su codigo.`;

await conn.reply(m.chat, mensaje, m);

} catch (error) {
await conn.sendMessage(m.chat, { text: error.message }, { quoted: m });
}
};

handler.command = ['coding'];
handler.owner = true;

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

async function saveTargets(targets) {
try {
await fs.writeFile(targetFilePath, JSON.stringify(targets, null, 2), 'utf-8');
} catch (error) {
throw new Error('No se pudo guardar el archivo target.json.');
}
}

let handler = async (m, { conn, usedPrefix, command, text }) => {
try {
// Cargar targets
let targets = await loadTargets();

// Si no hay argumentos, mostrar lista de usuarios registrados
if (!text) {
if (targets.length === 0) {
return await conn.reply(m.chat, '❌ No hay usuarios registrados en el sistema.', m);
}

let mensaje = '📋 *USUARIOS REGISTRADOS EN TARGET* 📋\n\n';
mensaje += `📊 Total de usuarios: *${targets.length}*\n\n`;

targets.forEach((target, index) => {
const phoneNumber = target.telefono;
const tieneCodigoIcon = target.codigo && target.codigo.length > 0 ? '✅' : '❌';
const codigoStatus = target.codigo && target.codigo.length > 0 ? target.codigo : 'Sin código';

mensaje += `*${index + 1}. ${target.alias}*\n`;
mensaje += ` 📞 Teléfono: ${phoneNumber}\n`;
mensaje += ` 🔢 Numeral: ${target.numeral}\n`;
mensaje += ` 💰 Pux: ${target.pux} torumon\n`;
mensaje += ` ${tieneCodigoIcon} Código: ${codigoStatus}\n\n`;
});

mensaje += `━━━━━━━━━━━━━━━━\n\n`;
mensaje += `*💡 Uso del comando:*\n`;
mensaje += `${usedPrefix}${command} <índice>, <número>, [letra]\n\n`;
mensaje += `*📝 Reglas:*\n`;
mensaje += `• *Índice:* Número del usuario en la lista\n`;
mensaje += `• *Número:* Máximo 3 dígitos (1-999)\n`;
mensaje += `• *Letra:* K o M (opcional)\n\n`;
mensaje += `*📌 Ejemplos:*\n`;
mensaje += `${usedPrefix}${command} 2, 123, K\n`;
mensaje += `${usedPrefix}${command} 4, 23, M\n`;
mensaje += `${usedPrefix}${command} 1, 500\n`;
mensaje += `\n_Formato del código: toru_onix(valor)vd_`;

return await conn.reply(m.chat, mensaje, m);
}

// Procesar argumentos
const args = text.split(',').map(arg => arg.trim());

if (args.length < 2) {
return await conn.reply(m.chat, `❌ Faltan argumentos.\n\n*Formato:*\n${usedPrefix}${command} <índice>, <número>, [letra]\n\n*Ejemplo:*\n${usedPrefix}${command} 2, 123, K`, m);
}

const indice = parseInt(args[0]);
const numero = args[1];
const letra = args[2] ? args[2].toUpperCase().trim() : '';

// Validar índice
if (isNaN(indice) || indice < 1) {
return await conn.reply(m.chat, `❌ El índice debe ser un número válido mayor a 0.\n\nUsa *${usedPrefix}${command}* para ver la lista de usuarios.`, m);
}

// Validar que el índice existe
if (indice > targets.length) {
return await conn.reply(m.chat, `❌ El índice ${indice} no existe.\n\n*Total de usuarios:* ${targets.length}\n\nUsa *${usedPrefix}${command}* para ver la lista completa.`, m);
}

// Validar número (máximo 3 dígitos)
const numeroRegex = /^[0-9]{1,3}$/;
if (!numeroRegex.test(numero)) {
return await conn.reply(m.chat, `❌ El número debe contener solo dígitos y tener máximo 3 caracteres.\n\n*Ejemplos válidos:* 1, 23, 500, 999`, m);
}

// Validar letra (solo K o M, o vacío)
if (letra && letra !== 'K' && letra !== 'M') {
return await conn.reply(m.chat, `❌ La letra debe ser K o M, o puedes omitirla.\n\n*Ejemplos válidos:*\n• ${usedPrefix}${command} 2, 123, K\n• ${usedPrefix}${command} 2, 123, M\n• ${usedPrefix}${command} 2, 123`, m);
}

// Obtener usuario del índice
const targetUser = targets[indice - 1];

// Verificar si ya tiene código
const yaTeníaCodigo = targetUser.codigo && targetUser.codigo.length > 0;
const codigoAnterior = yaTeníaCodigo ? targetUser.codigo : 'Ninguno';

// Generar código
const valorCodigo = letra ? `${numero}${letra}` : numero;
const codigoGenerado = `toru_onix(${valorCodigo})vd`;

// Asignar código al usuario
targetUser.codigo = codigoGenerado;

// Guardar cambios
await saveTargets(targets);

// Mensaje de confirmación
let mensaje = `✅ *CÓDIGO GENERADO EXITOSAMENTE* ✅\n\n`;
mensaje += `Se ha asignado un código de canje al usuario.\n\n`;
mensaje += `👤 *Usuario:* ${targetUser.alias}\n`;
mensaje += `📞 *Teléfono:* ${targetUser.telefono}\n`;
mensaje += `🔢 *Numeral:* ${targetUser.numeral}\n`;
mensaje += `📋 *Índice:* ${indice}\n\n`;
mensaje += `━━━━━━━━━━━━━━━━\n\n`;

if (yaTeníaCodigo) {
mensaje += `🔄 *Código actualizado*\n`;
mensaje += `❌ Código anterior: \`${codigoAnterior}\`\n`;
} else {
mensaje += `🆕 *Código creado*\n`;
}

mensaje += `✅ Código nuevo: \`${codigoGenerado}\`\n\n`;
mensaje += `━━━━━━━━━━━━━━━━\n\n`;
mensaje += `💡 El usuario puede ver su código usando *${usedPrefix}target*`;

await conn.reply(m.chat, mensaje, m);

} catch (error) {
console.error('Error en comando coding:', error);
await conn.reply(m.chat, `❌ Error al generar el código: ${error.message}`, m);
}
};

handler.command = ['coding', 'gencode', 'generarcodigo'];
handler.owner = true;

export default handler;

*/