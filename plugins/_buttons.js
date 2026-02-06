import { promises as fs } from 'fs';

const personajePath = './scrapers/oxw/personajes.json';
const ccFilePath = './scrapers/oxw/cc.json';
const ventFilePath = './scrapers/oxw/vent.json';

async function loadPersonaje() {
    try {
        const data = await fs.readFile(personajePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        throw new Error('No se pudo cargar el archivo personajes.json.');
    }
}

async function loadColecs() {
    try {
        const data = await fs.readFile(ccFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

async function saveColecs(coleccs) {
    try {
        await fs.writeFile(ccFilePath, JSON.stringify(coleccs, null, 2), 'utf-8');
    } catch (error) {
        throw new Error('No se pudo guardar el archivo cc.json.');
    }
}

async function loadVentas() {
    try {
        const data = await fs.readFile(ventFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

async function saveVentas(ventas) {
    try {
        await fs.writeFile(ventFilePath, JSON.stringify(ventas, null, 2), 'utf-8');
    } catch (error) {
        throw new Error('No se pudo guardar el archivo vent.json.');
    }
}

let handler = async (m, { conn, usedPrefix, command, text }) => {
    const userId = m.sender;
    let user = global.db.data.users[userId];

    try {
        // Cargar datos
        const personajes = await loadPersonaje();
        const colecciones = await loadColecs();
        let ventas = await loadVentas();

        // Si no hay argumentos, mostrar personajes en venta
        if (!text) {
            // Filtrar solo personajes en venta
            const personajesEnVenta = ventas.filter(v => v.estado === 'En venta');

            if (personajesEnVenta.length === 0) {
                let mensaje = '🏪 *MERCADO DE PERSONAJES* 🏪\n\n';
                mensaje += '❌ No hay personajes en venta actualmente.\n\n';
                mensaje += `💡 Los usuarios pueden vender sus personajes usando *${usedPrefix}vender <nombre>*`;
                
                return await conn.reply(m.chat, mensaje, m);
            }

            // Agrupar por rareza
            const rarityOrder = { 'Golden': 1, 'Rare': 2, 'Common': 3 };
            const ventasOrdenadas = personajesEnVenta.sort((a, b) => {
                return (rarityOrder[a.rarity] || 999) - (rarityOrder[b.rarity] || 999);
            });

            let mensaje = '🏪 *MERCADO DE PERSONAJES* 🏪\n\n';
            mensaje += `📊 Personajes disponibles: *${ventasOrdenadas.length}*\n\n`;

            ventasOrdenadas.forEach((venta, index) => {
                const precioOriginal = parseInt(venta.precioOriginal);
                const precioVenta = parseInt(venta.precioVenta);
                const descuento = Math.round(((precioOriginal - precioVenta) / precioOriginal) * 100);

                // Emoji según rareza
                let rarityEmoji = '';
                switch(venta.rarity) {
                    case 'Golden':
                        rarityEmoji = '👑';
                        break;
                    case 'Rare':
                        rarityEmoji = '💎';
                        break;
                    case 'Common':
                        rarityEmoji = '⭐';
                        break;
                    default:
                        rarityEmoji = '🎴';
                }

                // Obtener nombre del vendedor (puede ser tag del usuario)
                const vendedorTag = `@${venta.vendedorId.split('@')[0]}`;

                mensaje += `${rarityEmoji} *${index + 1}. ${venta.name}*\n`;
                mensaje += `   📺 Anime: ${venta.anime}\n`;
                mensaje += `   💎 Rareza: ${venta.rarity}\n`;
                mensaje += `   ⚡ Poder: ${venta.poder}\n`;
                mensaje += `   💰 Precio: ${precioVenta} ToruCoins\n`;
                mensaje += `   📉 Descuento: ${descuento}% OFF\n`;
                mensaje += `   👤 Vendedor: ${vendedorTag}\n\n`;
            });

            mensaje += `\n_Usa *${usedPrefix}comprar <nombre>* para comprar un personaje_`;
            mensaje += `\n_Ejemplo: ${usedPrefix}comprar Endeavor_`;

            return await conn.reply(m.chat, mensaje, m);
        }

        // Buscar el personaje en venta por nombre
        const nombreBuscado = text.trim().toLowerCase();
        const ventaIndex = ventas.findIndex(
            v => v.name.toLowerCase() === nombreBuscado && v.estado === 'En venta'
        );

        if (ventaIndex === -1) {
            return await conn.reply(m.chat, `❌ No se encontró a *${text}* en venta.\n\n_Usa *${usedPrefix}comprar* para ver personajes disponibles_`, m);
        }

        const venta = ventas[ventaIndex];

        // Verificar que el comprador no sea el vendedor
        if (venta.vendedorId === userId) {
            return await conn.reply(m.chat, `❌ No puedes comprar tu propio personaje.\n\n_Usa *${usedPrefix}vender* para ver tus personajes en venta_`, m);
        }

        // Verificar que el personaje esté disponible en el sistema
        const personajeOriginal = personajes.find(p => p.id === venta.personajeId);
        if (!personajeOriginal || personajeOriginal.status !== 'Disponible') {
            return await conn.reply(m.chat, `❌ No puedes comprar a *${venta.name}* porque no está disponible en el sistema.`, m);
        }

        // Verificar que el comprador no tenga ya este personaje
        const compradorColeccion = colecciones.find(c => c.userId === userId);
        if (compradorColeccion && compradorColeccion.personajes) {
            const yaLoTiene = compradorColeccion.personajes.some(p => p.id === venta.personajeId);
            if (yaLoTiene) {
                return await conn.reply(m.chat, `❌ Ya tienes a *${venta.name}* en tu colección.\n\n_Usa *${usedPrefix}cs* para ver tus personajes_`, m);
            }
        }

        // Verificar que el comprador tenga suficientes ToruCoins
        const precio = parseInt(venta.precioVenta);
        if (!user.torucoin || user.torucoin < precio) {
            return await conn.reply(m.chat, `❌ No tienes suficientes ToruCoins.\n\n💰 Precio: ${precio} ToruCoins\n💳 Tu saldo: ${user.torucoin || 0} ToruCoins\n❌ Te faltan: ${precio - (user.torucoin || 0)} ToruCoins`, m);
        }

        // Realizar la compra
        user.torucoin -= precio;

        // Agregar ToruCoins al vendedor
        const vendedorId = venta.vendedorId;
        if (!global.db.data.users[vendedorId]) {
            global.db.data.users[vendedorId] = {
                torucoin: 0
            };
        }
        global.db.data.users[vendedorId].torucoin = (global.db.data.users[vendedorId].torucoin || 0) + precio;

        // Crear objeto del personaje para la colección del comprador
        const personajeComprado = {
            id: venta.personajeId,
            name: venta.name,
            gender: venta.gender,
            pfoto: venta.pfoto,
            dfoto: venta.dfoto,
            base: venta.base,
            poder: venta.poder,
            fuerza: venta.fuerza,
            magia: venta.magia,
            value: venta.precioOriginal,
            habili: venta.habili,
            rarity: venta.rarity,
            anime: venta.anime,
            status: 'Disponible',
            vote: personajeOriginal.vote || 0
        };

        // Agregar personaje a la colección del comprador
        let compradorIndex = colecciones.findIndex(c => c.userId === userId);
        
        if (compradorIndex === -1) {
            // Crear nueva colección para el comprador
            colecciones.push({
                userId: userId,
                personajes: [personajeComprado]
            });
        } else {
            // Agregar personaje a colección existente
            if (!colecciones[compradorIndex].personajes) {
                colecciones[compradorIndex].personajes = [];
            }
            colecciones[compradorIndex].personajes.push(personajeComprado);
        }

        // Guardar colecciones actualizadas
        await saveColecs(colecciones);

        // Eliminar la venta del archivo vent.json
        ventas.splice(ventaIndex, 1);
        await saveVentas(ventas);

        // Mensaje de confirmación
        const vendedorTag = `@${vendedorId.split('@')[0]}`;
        
        let mensaje = `✅ *COMPRA EXITOSA* ✅\n\n`;
        mensaje += `Has comprado a *${venta.name}* de ${vendedorTag}\n\n`;
        mensaje += `📋 *DETALLES DEL PERSONAJE:*\n`;
        mensaje += `💎 Rareza: ${venta.rarity}\n`;
        mensaje += `📺 Anime: ${venta.anime}\n`;
        mensaje += `⚔️ Base: ${venta.base}\n`;
        mensaje += `⚡ Poder: ${venta.poder}\n`;
        mensaje += `💪 Fuerza: ${venta.fuerza}\n`;
        mensaje += `✨ Magia: ${venta.magia}\n`;
        mensaje += `🎯 Habilidades: ${venta.habili}\n\n`;
        mensaje += `💰 Precio pagado: ${precio} ToruCoins\n`;
        mensaje += `💳 Tu saldo: ${user.torucoin} ToruCoins\n\n`;
        mensaje += `👤 El vendedor ${vendedorTag} ha recibido ${precio} ToruCoins`;

        await conn.reply(m.chat, mensaje, m, {
            mentions: [vendedorId]
        });

        // Notificar al vendedor
        try {
            const compradorTag = `@${userId.split('@')[0]}`;
            let notificacion = `🔔 *VENTA REALIZADA* 🔔\n\n`;
            notificacion += `${compradorTag} ha comprado tu personaje *${venta.name}*\n\n`;
            notificacion += `💰 Has recibido: ${precio} ToruCoins\n`;
            notificacion += `💳 Tu saldo: ${global.db.data.users[vendedorId].torucoin} ToruCoins\n\n`;
            notificacion += `¡Felicidades por tu venta!`;

            await conn.reply(vendedorId, notificacion, null, {
                mentions: [userId]
            });
        } catch (error) {
            // Si falla la notificación al vendedor, no es crítico
            console.log('No se pudo notificar al vendedor:', error);
            conn.sendMessage(m.chat, { text: `${error.message}` }, { quoted: m });
        }

    } catch (error) {
        console.error(error);
        await conn.reply(m.chat, `❌ Error al comprar el personaje: ${error.message}`, m);
    }
};

handler.command = ['comprar', 'buy'];
handler.group = true;

export default handler;




