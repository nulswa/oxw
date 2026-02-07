import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    try {
        // Si no hay argumentos, mostrar lista de usuarios registrados
        if (!args || args.length === 0) {
            const users = global.db.data.users;
            const userEntries = Object.entries(users);

            if (userEntries.length === 0) {
                return await conn.reply(m.chat, '❌ No hay usuarios registrados en la base de datos.', m);
            }

            let mensaje = '👥 *USUARIOS REGISTRADOS* 👥\n\n';
            mensaje += `📊 Total de usuarios: *${userEntries.length}*\n\n`;

            userEntries.forEach(([jid, userData], index) => {
                const userName = userData.name || 'Sin nombre';
                const phoneNumber = jid.split('@')[0];
                const torucoin = userData.torucoin || 0;
                const toruexp = userData.toruexp || 0;

                mensaje += `*${index + 1}. ${userName}*\n`;
                mensaje += `   📞 Número: +${phoneNumber}\n`;
                mensaje += `   💰 ToruCoins: ${torucoin}\n`;
                mensaje += `   ⭐ ToruExp: ${toruexp}\n\n`;
            });

            mensaje += `━━━━━━━━━━━━━━━━\n\n`;
            mensaje += `*💡 Uso del comando:*\n`;
            mensaje += `${usedPrefix}${command} <tipo>, <valor>, <índice>\n\n`;
            mensaje += `*📝 Tipos disponibles:*\n`;
            mensaje += `• coins - ToruCoins\n`;
            mensaje += `• exp - ToruExp\n\n`;
            mensaje += `*📌 Ejemplos:*\n`;
            mensaje += `${usedPrefix}${command} coins, 100, 2\n`;
            mensaje += `${usedPrefix}${command} exp, 500, 1\n`;
            mensaje += `${usedPrefix}${command} coins, -50, 3 _(restar)_`;

            return await conn.reply(m.chat, mensaje, m);
        }

        // Procesar argumentos: tipo, valor, índice
        const fullArgs = args.join(' ').split(',').map(arg => arg.trim());

        if (fullArgs.length < 3) {
            return await conn.reply(m.chat, `❌ Formato incorrecto.\n\n*Uso:*\n${usedPrefix}${command} <tipo>, <valor>, <índice>\n\n*Ejemplo:*\n${usedPrefix}${command} coins, 100, 2`, m);
        }

        const tipo = fullArgs[0].toLowerCase();
        const valor = parseInt(fullArgs[1]);
        const indice = parseInt(fullArgs[2]);

        // Validar tipo
        if (tipo !== 'coins' && tipo !== 'exp') {
            return await conn.reply(m.chat, `❌ Tipo inválido.\n\n*Tipos disponibles:*\n• coins - ToruCoins\n• exp - ToruExp`, m);
        }

        // Validar valor
        if (isNaN(valor)) {
            return await conn.reply(m.chat, `❌ El valor debe ser un número.\n\n*Ejemplo:* ${usedPrefix}${command} coins, 100, 2`, m);
        }

        // Validar índice
        if (isNaN(indice) || indice < 1) {
            return await conn.reply(m.chat, `❌ El índice debe ser un número válido mayor a 0.\n\nUsa *${usedPrefix}${command}* para ver la lista de usuarios.`, m);
        }

        // Obtener lista de usuarios
        const users = global.db.data.users;
        const userEntries = Object.entries(users);

        // Validar que el índice existe
        if (indice > userEntries.length) {
            return await conn.reply(m.chat, `❌ El índice ${indice} no existe.\n\n*Total de usuarios:* ${userEntries.length}\n\nUsa *${usedPrefix}${command}* para ver la lista completa.`, m);
        }

        // Obtener usuario por índice (índice - 1 porque los arrays empiezan en 0)
        const [targetJid, targetUser] = userEntries[indice - 1];
        const targetName = targetUser.name || 'Anonimo';
        const targetPhone = targetJid.split('@')[0];

        // Inicializar propiedades si no existen
        if (!targetUser.torucoin) targetUser.torucoin = 0;
        if (!targetUser.toruexp) targetUser.toruexp = 0;

        // Guardar valores anteriores
        const valorAnterior = tipo === 'coins' ? targetUser.torucoin : targetUser.toruexp;

        // Aplicar cambios
        if (tipo === 'coins') {
            targetUser.torucoin += valor;
            // Evitar valores negativos
            if (targetUser.torucoin < 0) targetUser.torucoin = 0;
        } else if (tipo === 'exp') {
            targetUser.toruexp += valor;
            // Evitar valores negativos
            if (targetUser.toruexp < 0) targetUser.toruexp = 0;
        }

        const valorNuevo = tipo === 'coins' ? targetUser.torucoin : targetUser.toruexp;
        const tipoNombre = tipo === 'coins' ? 'ToruCoins' : 'ToruExp';
        const tipoEmoji = tipo === 'coins' ? '💰' : '⭐';

        // Mensaje de confirmación
        let mensaje = `✅ *RECURSO ACTUALIZADO* ✅\n\n`;
        mensaje += `👤 *Usuario:* ${targetName}\n`;
        mensaje += `📞 *Número:* +${targetPhone}\n`;
        mensaje += `📋 *Índice:* ${indice}\n\n`;
        mensaje += `${tipoEmoji} *${tipoNombre}*\n`;
        mensaje += `📊 Valor anterior: ${valorAnterior}\n`;
        mensaje += `${valor >= 0 ? '➕' : '➖'} Cambio: ${valor >= 0 ? '+' : ''}${valor}\n`;
        mensaje += `📊 Valor nuevo: ${valorNuevo}\n\n`;

        // Mostrar todos los recursos actuales del usuario
        mensaje += `━━━━━━━━━━━━━━━━\n`;
        mensaje += `*📈 Recursos totales del usuario:*\n`;
        mensaje += `💰 ToruCoins: ${targetUser.torucoin}\n`;
        mensaje += `⭐ ToruExp: ${targetUser.toruexp}`;

        await conn.reply(m.chat, mensaje, m);

    } catch (error) {
        console.error('Error en d- command:', error);
        await conn.reply(m.chat, `❌ Error al procesar el comando: ${error.message}`, m);
    }
}

handler.command = ['d-', 'dar']
handler.owner = true

export default handler


