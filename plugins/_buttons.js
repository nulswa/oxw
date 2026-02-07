import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
try {
// Si no hay argumentos, mostrar lista de usuarios registrados
if (!args || args.length === 0) {
const users = global.db.data.users;
const userEntries = Object.entries(users);

if (userEntries.length === 0) {
return await conn.reply(m.chat, '📍 No hay usuarios registrados en la base de datos.', m);
}

let mensaje = '📍 Usuarios registrados en la database.\n\n';
mensaje += `📊 Total : *${userEntries.length}* usuarios\n\n`;

userEntries.forEach(([jid, userData], index) => {
const userName = userData.name || 'Sin nombre';
const phoneNumber = jid.split('@')[0];
const toars = userData.toars || 0;
const tousd = userData.tousd || 0;

mensaje += `> *${index + 1}. [ ${userName} ]*\n`;
mensaje += `⩩ *Numero* : +${phoneNumber}\n`;
mensaje += `⩩ *ARS* : ${toars.toLocaleString()}\n`;
mensaje += `⩩ *USD* : ${tousd.toLocaleString()}\n\n`;
});

mensaje += `📍 Proporciona el valor y el numero del usuario.\n\n${mess.example}\n*${usedPrefix + command}* ars, 1000, 2\n*${usedPrefix + command}* ars, -1000, 2`;

return await conn.reply(m.chat, mensaje, m);
}

// Procesar argumentos: tipo, valor, índice
const fullArgs = args.join(' ').split(',').map(arg => arg.trim());

if (fullArgs.length < 3) {
return await conn.reply(m.chat, `📍  Formato incorrecto...\n\n- Referencia:\n*${usedPrefix + command}* <tipo>, <valor>, <índice>\n\n${mess.example}\n*${usedPrefix + command}* ars, 100, 2`, m);
}

const tipo = fullArgs[0].toLowerCase();
const valor = parseInt(fullArgs[1]);
const indice = parseInt(fullArgs[2]);

// Validar tipo
if (tipo !== 'ars' && tipo !== 'usd') {
return await conn.reply(m.chat, `📍  Tipo de moneda inválido...\n\n> *Tipos disponibles:*\n• ars - Pesos Argentinos\n• usd - Dolar Estadounidense`, m);
}

// Validar valor
if (isNaN(valor)) {
return await conn.reply(m.chat, `📍  El valor debe ser un número...\n\n${mess.example}\n*${usedPrefix + command}* coins, 100, 2`, m);
}

// Validar índice
if (isNaN(indice) || indice < 1) {
return await conn.reply(m.chat, `📍  El índice debe ser un número válido mayor a 0.\n- Usa *${usedPrefix + command}* para ver la lista de usuarios.`, m);
}

// Obtener lista de usuarios
const users = global.db.data.users;
const userEntries = Object.entries(users);

// Validar que el índice existe
if (indice > userEntries.length) {
return await conn.reply(m.chat, `📍  El índice *[ ${indice} ]* no existe.\n- *Total de usuarios:* ${userEntries.length}\n\n- Usa *${usedPrefix + command}* para ver la lista completa.`, m);
}

// Obtener usuario por índice (índice - 1 porque los arrays empiezan en 0)
const [targetJid, targetUser] = userEntries[indice - 1];
const targetName = targetUser.name || 'Anonimo';
const targetPhone = targetJid.split('@')[0];

// Inicializar propiedades si no existen
if (!targetUser.toars) targetUser.toars = 0;
if (!targetUser.tousd) targetUser.tousd = 0;

// Guardar valores anteriores
const valorAnterior = tipo === 'ars' ? targetUser.toars : targetUser.tousd;

// Aplicar cambios
if (tipo === 'ars') {
targetUser.toars += valor;
// Evitar valores negativos
if (targetUser.toars < 0) targetUser.toars = 0;
} else if (tipo === 'usd') {
targetUser.tousd += valor;
// Evitar valores negativos
if (targetUser.tousd < 0) targetUser.tousd = 0;
}

const valorNuevo = tipo === 'ars' ? targetUser.toars : targetUser.tousd;
const tipoNombre = tipo === 'ars' ? 'toars' : 'tousd';
const tipoEmoji = tipo === 'ars' ? '🇦🇷' : '🇺🇲';

// Mensaje de confirmación
let mensaje = `\t\t〤 \`Recursos Añadidos\`

⩩ *Usuario* : ${targetName} *(${indice})*
⩩ *Numero* : +${targetPhone}
🇦🇷 *ARS* : 
🇺🇲 *USD* :

> *Ahora tiene:*
🇦🇷 ${targetUser.toars} Pesos Argentinos.
🇺🇲 ${targetUser.tousd} Dolar Estadounidense.

> ${textbot}`;

await conn.reply(m.chat, mensaje, m);

} catch (error) {
console.error('Error en d- command:', error);
await conn.sendMessage(m.chat, { text: error.message }, { quoted: m });
}
}

handler.command = ['d-', 'dar']
handler.owner = true

export default handler


