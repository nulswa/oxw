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
            return await conn.reply(m.chat, `❌ No estás registrado en el sistema.\n\n_Usa *${usedPrefix}me* para registrarte primero_`, m);
        }

        const userTarget = targets[userIndex];

        // Si no hay argumentos, verificar si tiene código
        if (!text) {
            if (!userTarget.codigo || userTarget.codigo.length === 0) {
                let mensaje = `❌ *NO TIENES CÓDIGO DE CANJE* ❌\n\n`;
                mensaje += `Actualmente no tienes ningún código de canje asignado.\n\n`;
                mensaje += `💡 *¿Cómo obtener un código?*\n`;
                mensaje += `Los códigos son asignados por administradores o mediante eventos especiales.\n\n`;
                mensaje += `_Usa *${usedPrefix}target* para ver tu perfil_`;

                return await conn.reply(m.chat, mensaje, m);
            } else {
                let mensaje = `✅ *TIENES CÓDIGO DE CANJE* ✅\n\n`;
                mensaje += `📝 Tu código: \`${userTarget.codigo}\`\n`;
                mensaje += `🔐 Tu clave: \`${userTarget.clave}\`\n\n`;
                mensaje += `━━━━━━━━━━━━━━━━\n\n`;
                mensaje += `💡 *¿Cómo canjear?*\n`;
                mensaje += `Usa el siguiente formato:\n`;
                mensaje += `*${usedPrefix}${command} <código>, <clave>*\n\n`;
                mensaje += `*📌 Ejemplo:*\n`;
                mensaje += `${usedPrefix}${command} ${userTarget.codigo}, ${userTarget.clave}\n\n`;
                mensaje += `⚠️ Asegúrate de copiar correctamente tu código y clave.`;

                return await conn.reply(m.chat, mensaje, m);
            }
        }

        // Procesar argumentos: código, clave
        const args = text.split(',').map(arg => arg.trim());

        if (args.length < 2) {
            return await conn.reply(m.chat, `❌ Faltan argumentos.\n\n*Formato:*\n${usedPrefix}${command} <código>, <clave>\n\n*Ejemplo:*\n${usedPrefix}${command} toru_onix(23K)vd, tuClave123`, m);
        }

        const codigoProp = args[0];
        const claveProp = args[1];

        // Verificar que el usuario tenga código de canje
        if (!userTarget.codigo || userTarget.codigo.length === 0) {
            return await conn.reply(m.chat, `❌ No tienes ningún código de canje asignado.\n\n_Usa *${usedPrefix}${command}* para verificar tu estado_`, m);
        }

        // Verificar que la clave coincida
        if (userTarget.clave !== claveProp) {
            return await conn.reply(m.chat, `❌ *CLAVE INCORRECTA*\n\nLa clave que proporcionaste no coincide con tu clave registrada.\n\n⚠️ Solo puedes canjear tu propio código usando tu clave personal.`, m);
        }

        // Verificar que el código coincida
        if (userTarget.codigo !== codigoProp) {
            return await conn.reply(m.chat, `❌ *CÓDIGO INCORRECTO*\n\nEl código que proporcionaste no coincide con tu código de canje.\n\n📝 Tu código actual: \`${userTarget.codigo}\`\n\n_Copia el código exactamente como aparece_`, m);
        }

        // Calcular ToruCoins a otorgar
        const torucoinsGanados = calcularToruCoins(codigoProp);

        if (torucoinsGanados === null) {
            return await conn.reply(m.chat, `❌ Error al procesar el código. Formato inválido.\n\n_Contacta a un administrador_`, m);
        }

        // Guardar valores anteriores
        const puxAnterior = userTarget.pux;
        const torucoinsAnterior = user.torucoin || 0;

        // Agregar ToruCoins al usuario
        user.torucoin = torucoinsAnterior + torucoinsGanados;
        userTarget.pux = puxAnterior + torucoinsGanados;

        // Extraer el valor del código para mostrarlo
        const valorCodigo = codigoProp.match(/toru_onix\(([^)]+)\)vd/)[1];

        // Borrar el código del usuario
        userTarget.codigo = "";

        // Guardar cambios
        await saveTargets(targets);

        // Mensaje de canje exitoso
        let mensaje = `🎉 *CANJE EXITOSO* 🎉\n\n`;
        mensaje += `¡Has canjeado tu código correctamente!\n\n`;
        mensaje += `📝 *Código canjeado:* \`${codigoProp}\`\n`;
        mensaje += `💎 *Valor:* ${valorCodigo}\n\n`;
        mensaje += `━━━━━━━━━━━━━━━━\n\n`;
        mensaje += `💰 *RECOMPENSA OBTENIDA*\n`;
        mensaje += `➕ ToruCoins ganados: *${torucoinsGanados.toLocaleString()}*\n\n`;
        mensaje += `📊 *TUS SALDOS:*\n`;
        mensaje += `💳 ToruCoins anterior: ${torucoinsAnterior.toLocaleString()}\n`;
        mensaje += `💳 ToruCoins actual: *${user.torucoin.toLocaleString()}*\n\n`;
        mensaje += `📈 Pux anterior: ${puxAnterior.toLocaleString()}\n`;
        mensaje += `📈 Pux actual: *${userTarget.pux.toLocaleString()}*\n\n`;
        mensaje += `━━━━━━━━━━━━━━━━\n\n`;
        mensaje += `✅ El código ha sido eliminado de tu cuenta.\n`;
        mensaje += `🎊 ¡Disfruta tus recompensas!`;

        await conn.reply(m.chat, mensaje, m);

    } catch (error) {
        console.error('Error en comando canje:', error);
        await conn.reply(m.chat, `❌ Error al procesar el canje: ${error.message}`, m);
    }
};

handler.command = ['canje', 'redeem', 'canjear'];
handler.group = true;

export default handler;

