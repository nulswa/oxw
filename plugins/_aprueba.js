 
import { promises as fs } from 'fs';

const personajePath = './scrapers/ows/personajes.json';
const ccFilePath = './scrapers/ows/cc.json';

const cooldowns = {};

async function loadPersonaje() {
    try {
        const data = await fs.readFile(personajePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        throw new Error('No se pudo cargar el archivo characters.json.');
    }
}

async function savePersonaje(personaje) {
    try {
        await fs.writeFile(personajePath, JSON.stringify(personaje, null, 2), 'utf-8');
    } catch (error) {
        throw new Error('No se pudo guardar el archivo characters.json.');
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

let handler = async (m, { conn, usedPrefix, command, text }) => {
    const userId = m.sender;
    let user = global.db.data.users[userId];
    const now = Date.now();

    // Verificar cooldown
    if (cooldowns[userId] && now < cooldowns[userId]) {
        const remainingTime = Math.ceil((cooldowns[userId] - now) / 1000);
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        return await conn.reply(m.chat, `Debes esperar *${minutes} minutos y ${seconds} segundos* para comprar de nuevo.`, m);
    }

    try {
        // Cargar personajes y colecciones
        const personajes = await loadPersonaje();
        const colecciones = await loadColecs();

        // Si no hay texto, mostrar lista de personajes disponibles
        if (!text) {
            let mensaje = '*🛒 PERSONAJES DISPONIBLES PARA COMPRAR*\n\n';
            
            const personajesDisponibles = personajes.filter(p => p.status === 'Disponible');
            
            if (personajesDisponibles.length === 0) {
                return await conn.reply(m.chat, '❌ No hay personajes disponibles en este momento.', m);
            }

            personajesDisponibles.forEach((personaje, index) => {
                mensaje += `*${index + 1}. ${personaje.name}*\n`;
                mensaje += `   💎 Rareza: ${personaje.rarity}\n`;
                mensaje += `   💰 Precio: ${personaje.value} ToruCoins\n`;
                mensaje += `   📺 Anime: ${personaje.anime}\n`;
                mensaje += `   ⚡ Poder: ${personaje.poder}\n`;
                mensaje += `   💪 Fuerza: ${personaje.fuerza}\n`;
                mensaje += `   ✨ Magia: ${personaje.magia}\n\n`;
            });

            mensaje += `\n_Usa *${usedPrefix}cbuy <nombre>* para comprar un personaje_`;
            mensaje += `\n_Ejemplo: ${usedPrefix}cbuy Endeavor_`;
            
            return await conn.reply(m.chat, mensaje, m);
        }

        // Buscar el personaje por nombre (case insensitive)
        const nombreBuscado = text.trim().toLowerCase();
        const personaje = personajes.find(p => p.name.toLowerCase() === nombreBuscado);

        if (!personaje) {
            return await conn.reply(m.chat, `❌ No se encontró ningún personaje con el nombre "*${text}*".\n\nUsa *${usedPrefix}cbuy* para ver la lista de personajes disponibles.`, m);
        }

        // Verificar si el personaje está disponible
        if (personaje.status !== 'Disponible') {
            return await conn.reply(m.chat, `❌ El personaje *${personaje.name}* no está disponible en este momento.`, m);
        }

        // Verificar si el usuario ya tiene este personaje
        const userColeccion = colecciones.find(c => c.userId === userId);
        if (userColeccion && userColeccion.personajes) {
            const yaLoTiene = userColeccion.personajes.some(p => p.id === personaje.id);
            if (yaLoTiene) {
                return await conn.reply(m.chat, `❌ Ya tienes a *${personaje.name}* en tu colección. No puedes comprar el mismo personaje dos veces.`, m);
            }
        }

        // Verificar si el usuario tiene suficientes ToruCoins
        const precio = parseInt(personaje.value);
        if (!user.torucoin || user.torucoin < precio) {
            return await conn.reply(m.chat, `❌ No tienes suficientes ToruCoins.\n\n💰 Precio: ${precio} ToruCoins\n💳 Tu saldo: ${user.torucoin || 0} ToruCoins\n❌ Te faltan: ${precio - (user.torucoin || 0)} ToruCoins`, m);
        }

        // Realizar la compra
        user.torucoin -= precio;

        // Agregar personaje a la colección del usuario
        let coleccionIndex = colecciones.findIndex(c => c.userId === userId);
        
        if (coleccionIndex === -1) {
            // Crear nueva colección para el usuario
            colecciones.push({
                userId: userId,
                personajes: [personaje]
            });
        } else {
            // Agregar personaje a colección existente
            if (!colecciones[coleccionIndex].personajes) {
                colecciones[coleccionIndex].personajes = [];
            }
            colecciones[coleccionIndex].personajes.push(personaje);
        }

        // Guardar colecciones
        await saveColecs(colecciones);

        // Establecer cooldown de 1 minuto
        cooldowns[userId] = now + 60000;

        // Mensaje de confirmación
        let mensajeCompra = `✅ *COMPRA EXITOSA*\n\n`;
        mensajeCompra += `Has adquirido a *${personaje.name}*\n\n`;
        mensajeCompra += `📋 *DETALLES DEL PERSONAJE:*\n`;
        mensajeCompra += `💎 Rareza: ${personaje.rarity}\n`;
        mensajeCompra += `📺 Anime: ${personaje.anime}\n`;
        mensajeCompra += `⚔️ Base: ${personaje.base}\n`;
        mensajeCompra += `⚡ Poder: ${personaje.poder}\n`;
        mensajeCompra += `💪 Fuerza: ${personaje.fuerza}\n`;
        mensajeCompra += `✨ Magia: ${personaje.magia}\n`;
        mensajeCompra += `🎯 Habilidades: ${personaje.habili}\n\n`;
        mensajeCompra += `💰 Precio pagado: ${precio} ToruCoins\n`;
        mensajeCompra += `💳 Saldo restante: ${user.torucoin} ToruCoins`;

        await conn.reply(m.chat, mensajeCompra, m);

    } catch (error) {
        console.error(error);
        await conn.reply(m.chat, `❌ Error: ${error.message}`, m);
    }
};

handler.command = ['cbuy'];
handler.group = true;

export default handler;

