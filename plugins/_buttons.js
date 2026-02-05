import { promises as fs } from 'fs';

const ccFilePath = './scrapers/ows/cc.json';

async function loadColecs() {
    try {
        const data = await fs.readFile(ccFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

let handler = async (m, { conn, usedPrefix }) => {
    const userId = m.sender;

    try {
        // Cargar colecciones
        const colecciones = await loadColecs();

        // Buscar la colección del usuario
        const userColeccion = colecciones.find(c => c.userId === userId);

        // Verificar si el usuario tiene personajes
        if (!userColeccion || !userColeccion.personajes || userColeccion.personajes.length === 0) {
            let mensaje = '❌ *NO TIENES PERSONAJES*\n\n';
            mensaje += '📦 Tu colección está vacía.\n\n';
            mensaje += `💡 *¿Cómo conseguir personajes?*\n`;
            mensaje += `• Compra personajes con *${usedPrefix}cbuy*\n`;
            mensaje += `• Gana personajes en eventos del juego\n\n`;
            mensaje += `_Usa *${usedPrefix}cbuy* para ver personajes disponibles_`;
            
            return await conn.reply(m.chat, mensaje, m);
        }

        // Construir mensaje con los personajes del usuario
        let mensaje = `✨ *TU COLECCIÓN DE PERSONAJES* ✨\n\n`;
        mensaje += `👤 Total de personajes: *${userColeccion.personajes.length}*\n\n`;

        // Agrupar personajes por rareza
        const rarityOrder = { 'Golden': 1, 'Rare': 2, 'Common': 3 };
        const personajesOrdenados = userColeccion.personajes.sort((a, b) => {
            return (rarityOrder[a.rarity] || 999) - (rarityOrder[b.rarity] || 999);
        });

        personajesOrdenados.forEach((personaje, index) => {
            // Emoji según rareza
            let rarityEmoji = '';
            switch(personaje.rarity) {
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

            mensaje += `${rarityEmoji} *${index + 1}. ${personaje.name}*\n`;
            mensaje += `   📺 Anime: ${personaje.anime}\n`;
            mensaje += `   💎 Rareza: ${personaje.rarity}\n`;
            mensaje += `   ⚔️ Base: ${personaje.base}\n`;
            mensaje += `   ⚡ Poder: ${personaje.poder}\n`;
            mensaje += `   💪 Fuerza: ${personaje.fuerza}\n`;
            mensaje += `   ✨ Magia: ${personaje.magia}\n`;
            mensaje += `   💰 Valor: ${personaje.value} ToruCoins\n`;
            mensaje += `   🎯 Habilidades: ${personaje.habili}\n\n`;
        });

        // Calcular estadísticas totales
        const totalPoder = personajesOrdenados.reduce((sum, p) => sum + parseInt(p.poder || 0), 0);
        const totalFuerza = personajesOrdenados.reduce((sum, p) => sum + parseInt(p.fuerza || 0), 0);
        const totalMagia = personajesOrdenados.reduce((sum, p) => sum + parseInt(p.magia || 0), 0);
        const valorTotal = personajesOrdenados.reduce((sum, p) => sum + parseInt(p.value || 0), 0);

        mensaje += `📊 *ESTADÍSTICAS TOTALES:*\n`;
        mensaje += `⚡ Poder Total: ${totalPoder}\n`;
        mensaje += `💪 Fuerza Total: ${totalFuerza}\n`;
        mensaje += `✨ Magia Total: ${totalMagia}\n`;
        mensaje += `💰 Valor Total: ${valorTotal} ToruCoins\n\n`;

        // Contador por rareza
        const goldenCount = personajesOrdenados.filter(p => p.rarity === 'Golden').length;
        const rareCount = personajesOrdenados.filter(p => p.rarity === 'Rare').length;
        const commonCount = personajesOrdenados.filter(p => p.rarity === 'Common').length;

        if (goldenCount > 0 || rareCount > 0 || commonCount > 0) {
            mensaje += `🏆 *POR RAREZA:*\n`;
            if (goldenCount > 0) mensaje += `👑 Golden: ${goldenCount}\n`;
            if (rareCount > 0) mensaje += `💎 Rare: ${rareCount}\n`;
            if (commonCount > 0) mensaje += `⭐ Common: ${commonCount}\n`;
        }

        await conn.reply(m.chat, mensaje, m);

    } catch (error) {
        console.error(error);
        await conn.reply(m.chat, `❌ Error al cargar tu colección: ${error.message}`, m);
    }
};

handler.command = ['cs', 'coleccion', 'collection'];
handler.group = true;

export default handler;





