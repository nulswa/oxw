function getTiempoEnMs(numero, tipo) {
    switch(tipo) {
        case 'h': // Hora
            return numero * 3600000; // 1 hora = 3,600,000 ms
        case 'd': // Día
            return numero * 86400000; // 1 día = 86,400,000 ms
        case 's': // Semana
            return numero * 604800000; // 1 semana = 604,800,000 ms
        case 'm': // Mes
            return numero * 2592000000; // 1 mes = 2,592,000,000 ms (30 días)
        default:
            return null;
    }
}

function getTipoNombre(tipo) {
    switch(tipo) {
        case 'h': return 'hora(s)';
        case 'd': return 'día(s)';
        case 's': return 'semana(s)';
        case 'm': return 'mes(es)';
        default: return '';
    }
}

function getRolNombre(rol) {
    switch(rol) {
        case 'premium': return 'Premium';
        case 'moderador': return 'Moderador';
        case 'administ': return 'Administrador';
        default: return '';
    }
}

function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString('es-ES', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

let handler = async (m, { conn, usedPrefix, command, text }) => {
    try {
        const users = global.db.data.users;
        const userEntries = Object.entries(users);

        // Si no hay argumentos, mostrar lista de usuarios
        if (!text) {
            if (userEntries.length === 0) {
                return await conn.reply(m.chat, '❌ No hay usuarios registrados en la base de datos.', m);
            }

            let mensaje = '👥 *USUARIOS EN LA DATABASE* 👥\n\n';
            mensaje += `📊 Total de usuarios: *${userEntries.length}*\n\n`;

            userEntries.forEach(([jid, userData], index) => {
                const userName = userData.name || 'Sin nombre';
                const phoneNumber = jid.split('@')[0];
                
                // Verificar roles activos
                let rolesActivos = [];
                const now = Date.now();
                
                if (userData.premium && userData.premiumTime > now) {
                    rolesActivos.push('👑 Premium');
                }
                if (userData.moderador && userData.moderadorTime > now) {
                    rolesActivos.push('🛡️ Moderador');
                }
                if (userData.administ && userData.administTime > now) {
                    rolesActivos.push('⚜️ Administrador');
                }

                const rolesTexto = rolesActivos.length > 0 ? rolesActivos.join(', ') : '👤 Usuario';

                mensaje += `*${index + 1}. ${userName}*\n`;
                mensaje += `   📞 +${phoneNumber}\n`;
                mensaje += `   🎭 ${rolesTexto}\n\n`;
            });

            mensaje += `━━━━━━━━━━━━━━━━\n\n`;
            mensaje += `*💡 Uso del comando:*\n`;
            mensaje += `${usedPrefix}${command} <índice>, <rol>, <número>, <tipo>\n\n`;
            mensaje += `*📝 Roles disponibles:*\n`;
            mensaje += `• premium - Usuario Premium 👑\n`;
            mensaje += `• moderador - Moderador 🛡️\n`;
            mensaje += `• administ - Administrador ⚜️\n\n`;
            mensaje += `*⏰ Tipos de duración:*\n`;
            mensaje += `• h - Hora(s)\n`;
            mensaje += `• d - Día(s)\n`;
            mensaje += `• s - Semana(s)\n`;
            mensaje += `• m - Mes(es)\n\n`;
            mensaje += `*📌 Ejemplos:*\n`;
            mensaje += `${usedPrefix}${command} 2, premium, 3, h\n`;
            mensaje += `${usedPrefix}${command} 5, moderador, 7, d\n`;
            mensaje += `${usedPrefix}${command} 1, administ, 2, s`;

            return await conn.reply(m.chat, mensaje, m);
        }

        // Procesar argumentos
        const args = text.split(',').map(arg => arg.trim());

        if (args.length < 4) {
            return await conn.reply(m.chat, `❌ Faltan argumentos.\n\n*Formato:*\n${usedPrefix}${command} <índice>, <rol>, <número>, <tipo>\n\n*Ejemplo:*\n${usedPrefix}${command} 2, premium, 3, h`, m);
        }

        const indice = parseInt(args[0]);
        const rol = args[1].toLowerCase();
        const numero = parseInt(args[2]);
        const tipo = args[3].toLowerCase();

        // Validar índice
        if (isNaN(indice) || indice < 1) {
            return await conn.reply(m.chat, `❌ El índice debe ser un número válido mayor a 0.\n\nUsa *${usedPrefix}${command}* para ver la lista de usuarios.`, m);
        }

        // Validar que el índice existe
        if (indice > userEntries.length) {
            return await conn.reply(m.chat, `❌ El índice ${indice} no existe.\n\n*Total de usuarios:* ${userEntries.length}\n\nUsa *${usedPrefix}${command}* para ver la lista completa.`, m);
        }

        // Validar rol
        if (rol !== 'premium' && rol !== 'moderador' && rol !== 'administ') {
            return await conn.reply(m.chat, `❌ Rol inválido.\n\n*Roles disponibles:*\n• premium\n• moderador\n• administ`, m);
        }

        // Validar número
        if (isNaN(numero) || numero <= 0) {
            return await conn.reply(m.chat, `❌ El número debe ser mayor a 0.\n\n*Ejemplo:* ${usedPrefix}${command} 2, premium, 3, h`, m);
        }

        // Validar tipo
        if (tipo !== 'h' && tipo !== 'd' && tipo !== 's' && tipo !== 'm') {
            return await conn.reply(m.chat, `❌ Tipo de duración inválido.\n\n*Tipos disponibles:*\n• h - Hora(s)\n• d - Día(s)\n• s - Semana(s)\n• m - Mes(es)`, m);
        }

        // Obtener usuario del índice
        const [targetJid, targetUser] = userEntries[indice - 1];
        const targetName = targetUser.name || 'Sin nombre';
        const targetPhone = targetJid.split('@')[0];

        // Verificar si ya tiene algún rol activo
        const now = Date.now();
        let rolesActivos = [];

        if (targetUser.premium && targetUser.premiumTime > now) {
            rolesActivos.push({ nombre: 'Premium', expira: targetUser.premiumTime });
        }
        if (targetUser.moderador && targetUser.moderadorTime > now) {
            rolesActivos.push({ nombre: 'Moderador', expira: targetUser.moderadorTime });
        }
        if (targetUser.administ && targetUser.administTime > now) {
            rolesActivos.push({ nombre: 'Administrador', expira: targetUser.administTime });
        }

        if (rolesActivos.length > 0) {
            let mensajeRoles = `❌ *EL USUARIO YA TIENE UN ROL ACTIVO*\n\n`;
            mensajeRoles += `👤 Usuario: ${targetName}\n`;
            mensajeRoles += `📞 Número: +${targetPhone}\n\n`;
            mensajeRoles += `*Roles activos:*\n`;
            
            rolesActivos.forEach(r => {
                mensajeRoles += `• ${r.nombre} - Expira: ${formatDate(r.expira)}\n`;
            });

            mensajeRoles += `\n⚠️ Debe esperar a que expire su rol actual antes de asignar uno nuevo.`;

            return await conn.reply(m.chat, mensajeRoles, m);
        }

        // Calcular tiempo
        const tiempoMs = getTiempoEnMs(numero, tipo);
        const tiempoExpiracion = now + tiempoMs;

        // Asignar rol
        if (rol === 'premium') {
            targetUser.premium = true;
            targetUser.premiumTime = tiempoExpiracion;
        } else if (rol === 'moderador') {
            targetUser.moderador = true;
            targetUser.moderadorTime = tiempoExpiracion;
        } else if (rol === 'administ') {
            targetUser.administ = true;
            targetUser.administTime = tiempoExpiracion;
        }

        // Mensaje de confirmación
        const rolNombre = getRolNombre(rol);
        const tipoNombre = getTipoNombre(tipo);
        const fechaExpiracion = formatDate(tiempoExpiracion);

        let mensaje = `✅ *ROL ASIGNADO EXITOSAMENTE* ✅\n\n`;
        mensaje += `Se ha asignado un nuevo rol al usuario.\n\n`;
        mensaje += `👤 *Usuario:* ${targetName}\n`;
        mensaje += `📞 *Número:* +${targetPhone}\n`;
        mensaje += `📋 *Índice:* ${indice}\n\n`;
        mensaje += `━━━━━━━━━━━━━━━━\n\n`;
        mensaje += `🎭 *Rol asignado:* ${rolNombre}\n`;
        mensaje += `⏰ *Duración:* ${numero} ${tipoNombre}\n`;
        mensaje += `📅 *Expira el:* ${fechaExpiracion}\n\n`;
        
        // Emojis según el rol
        let emojiRol = '';
        if (rol === 'premium') emojiRol = '👑';
        else if (rol === 'moderador') emojiRol = '🛡️';
        else if (rol === 'administ') emojiRol = '⚜️';

        mensaje += `${emojiRol} El usuario ahora tiene privilegios de *${rolNombre}*`;

        await conn.reply(m.chat, mensaje, m);

        // Notificar al usuario
        try {
            let notificacion = `🎉 *¡FELICIDADES!* 🎉\n\n`;
            notificacion += `Has recibido el rol de *${rolNombre}*\n\n`;
            notificacion += `⏰ Duración: ${numero} ${tipoNombre}\n`;
            notificacion += `📅 Expira el: ${fechaExpiracion}\n\n`;
            notificacion += `${emojiRol} ¡Disfruta de tus nuevos privilegios!`;

            await conn.reply(targetJid, notificacion, null);
        } catch (error) {
            console.log('No se pudo notificar al usuario:', error);
        }

    } catch (error) {
        console.error('Error en comando who:', error);
        await conn.reply(m.chat, `❌ Error al asignar el rol: ${error.message}`, m);
    }
};

handler.command = ['who'];
handler.owner = true;

export default handler;


