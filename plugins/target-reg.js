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
                return await conn.reply(m.chat, `❌ Ya estás registrado en el sistema.\n\n💡 *¿Quieres eliminar tus datos?*\nUsa: *${usedPrefix}${command} <tu_clave>*\n\n_Después podrás registrarte nuevamente_`, m);
            } else {
                let mensaje = `📋 *REGISTRO DE DATOS* 📋\n\n`;
                mensaje += `Para registrarte, usa el siguiente formato:\n\n`;
                mensaje += `*${usedPrefix}${command} <teléfono>, <alias>, <numeral>*\n`;
                mensaje += `O con clave personalizada:\n`;
                mensaje += `*${usedPrefix}${command} <teléfono>, <alias>, <numeral>, <clave>*\n\n`;
                mensaje += `*📝 Reglas:*\n`;
                mensaje += `• *Teléfono:* Solo + y números (ej: +521234567890)\n`;
                mensaje += `• *Alias:* Texto, números, puntos (.) y guiones bajos (_)\n`;
                mensaje += `• *Numeral:* Solo números, máximo 22 dígitos\n`;
                mensaje += `• *Clave:* (Opcional) Si no la proporcionas, se generará automáticamente\n\n`;
                mensaje += `*📌 Ejemplos:*\n`;
                mensaje += `${usedPrefix}${command} +521234567890, Juan.Perez_123, 12345678901234567890\n`;
                mensaje += `${usedPrefix}${command} +529876543210, Mari_99, 98765, MiClave123`;
                
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

                let mensaje = `✅ *DATOS ELIMINADOS* ✅\n\n`;
                mensaje += `Tus datos han sido eliminados del sistema correctamente.\n\n`;
                mensaje += `💡 Ahora puedes registrarte nuevamente usando:\n`;
                mensaje += `*${usedPrefix}${command} <teléfono>, <alias>, <numeral>*`;

                return await conn.reply(m.chat, mensaje, m);
            } else {
                return await conn.reply(m.chat, `❌ Clave incorrecta.\n\n_Verifica tu clave e intenta nuevamente_`, m);
            }
        }

        // Si el usuario existe y envió múltiples argumentos (intenta registrarse de nuevo)
        if (userExists && text.includes(',')) {
            return await conn.reply(m.chat, `❌ Ya estás registrado en el sistema.\n\n💡 *¿Quieres eliminar tus datos y registrarte de nuevo?*\nPrimero usa: *${usedPrefix}${command} <tu_clave>*`, m);
        }

        // Procesar registro nuevo
        const args = text.split(',').map(arg => arg.trim());

        if (args.length < 3) {
            return await conn.reply(m.chat, `❌ Faltan datos.\n\n*Formato:*\n${usedPrefix}${command} <teléfono>, <alias>, <numeral>\n\n*Ejemplo:*\n${usedPrefix}${command} +521234567890, Juan.P_123, 12345`, m);
        }

        const telefono = args[0];
        const alias = args[1];
        const numeral = args[2];
        const clave = args[3] || generatePassword(12);

        // Validar teléfono (solo + y números)
        const telefonoRegex = /^\+[0-9]+$/;
        if (!telefonoRegex.test(telefono)) {
            return await conn.reply(m.chat, `❌ El teléfono debe contener solo + y números.\n\n*Ejemplo válido:* +521234567890`, m);
        }

        // Validar alias (texto, números, puntos y guiones bajos)
        const aliasRegex = /^[a-zA-Z0-9._]+$/;
        if (!aliasRegex.test(alias) || alias.length < 2) {
            return await conn.reply(m.chat, `❌ El alias debe tener al menos 2 caracteres y solo puede contener letras, números, puntos (.) y guiones bajos (_).\n\n*Ejemplos válidos:*\n• Juan.Perez\n• Mari_99\n• User.123_ABC`, m);
        }

        // Validar numeral (solo números, máximo 22 dígitos)
        const numeralRegex = /^[0-9]+$/;
        if (!numeralRegex.test(numeral)) {
            return await conn.reply(m.chat, `❌ El numeral debe contener solo números.\n\n*Ejemplo:* 12345678901234567890`, m);
        }

        if (numeral.length > 22) {
            return await conn.reply(m.chat, `❌ El numeral no puede tener más de 22 dígitos.\n\n*Dígitos actuales:* ${numeral.length}`, m);
        }

        // Obtener ToruCoins del usuario
        const pux = user.torucoin || 0;

        // Crear nuevo registro
        const nuevoRegistro = {
            usuario: userId,
            telefono: telefono,
            alias: alias,
            numeral: numeral,
            clave: clave,
            codigo: "",
            pux: pux
        };

        // Agregar a targets
        targets.push(nuevoRegistro);
        await saveTargets(targets);

        // Mensaje de confirmación
        const claveGenerada = args[3] ? false : true;

        let mensaje = `✅ *REGISTRO EXITOSO* ✅\n\n`;
        mensaje += `Tus datos han sido registrados correctamente.\n\n`;
        mensaje += `📋 *TUS DATOS:*\n`;
        mensaje += `📞 Teléfono: ${telefono}\n`;
        mensaje += `🏷️ Alias: ${alias}\n`;
        mensaje += `🔢 Numeral: ${numeral}\n`;
        mensaje += `🔐 Clave: ${clave}\n`;
        mensaje += `💰 Pux: ${pux} ToruCoins\n\n`;

        if (claveGenerada) {
            mensaje += `⚠️ *IMPORTANTE:* Tu clave fue generada automáticamente.\n`;
            mensaje += `*Guárdala en un lugar seguro.* La necesitarás para eliminar tus datos.\n\n`;
        }

        mensaje += `━━━━━━━━━━━━━━━━\n\n`;
        mensaje += `💡 *Comandos disponibles:*\n`;
        mensaje += `• *${usedPrefix}target* - Ver tus datos registrados\n`;
        mensaje += `• *${usedPrefix}${command} <clave>* - Eliminar tus datos`;

        await conn.reply(m.chat, mensaje, m);

    } catch (error) {
        console.error('Error en comando me:', error);
        await conn.reply(m.chat, `❌ Error al procesar el registro: ${error.message}`, m);
    }
};

handler.command = ['me', 'registro'];
handler.group = true;

export default handler;
