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

let handler = async (m, { conn, usedPrefix, command, participants }) => {
    const attackerId = m.sender;
    let attacker = global.db.data.users[attackerId];

    try {
        // Obtener el objetivo (usuario mencionado o citado)
        let targetId;
        
        // Verificar si es una respuesta a un mensaje
        if (m.quoted && m.quoted.sender) {
            targetId = m.quoted.sender;
        }
        // Verificar si hay una mención
        else if (m.mentionedJid && m.mentionedJid.length > 0) {
            targetId = m.mentionedJid[0];
        }
        else {
            return await conn.reply(m.chat, `❌ Debes mencionar o responder al usuario que deseas desafiar.\n\n_Ejemplo: ${usedPrefix}kill @usuario_\n_O responde a un mensaje con ${usedPrefix}kill_`, m);
        }

        // Verificar que no se desafíe a sí mismo
        if (targetId === attackerId) {
            return await conn.reply(m.chat, `❌ No puedes desafiarte a ti mismo.\n\n_Menciona o responde a otro usuario para iniciar una batalla_`, m);
        }

        let target = global.db.data.users[targetId];
        if (!target) {
            target = global.db.data.users[targetId] = {
                torucoin: 0
            };
        }

        // Cargar colecciones
        const colecciones = await loadColecs();

        // Obtener colecciones de ambos usuarios
        const attackerColeccion = colecciones.find(c => c.userId === attackerId);
        const targetColeccion = colecciones.find(c => c.userId === targetId);

        // Verificar que el atacante tenga personajes
        if (!attackerColeccion || !attackerColeccion.personajes || attackerColeccion.personajes.length === 0) {
            return await conn.reply(m.chat, `❌ No tienes personajes para batallar.\n\n_Usa *${usedPrefix}cbuy* para comprar personajes_`, m);
        }

        // Verificar que el objetivo tenga personajes
        if (!targetColeccion || !targetColeccion.personajes || targetColeccion.personajes.length === 0) {
            const targetTag = `@${targetId.split('@')[0]}`;
            return await conn.reply(m.chat, `❌ ${targetTag} no tiene personajes para batallar.`, m, {
                mentions: [targetId]
            });
        }

        // Calcular estadísticas totales del atacante
        const attackerStats = {
            totalPoder: attackerColeccion.personajes.reduce((sum, p) => sum + parseInt(p.poder || 0), 0),
            totalFuerza: attackerColeccion.personajes.reduce((sum, p) => sum + parseInt(p.fuerza || 0), 0),
            totalMagia: attackerColeccion.personajes.reduce((sum, p) => sum + parseInt(p.magia || 0), 0),
            cantidadPersonajes: attackerColeccion.personajes.length,
            personajes: attackerColeccion.personajes
        };

        // Calcular estadísticas totales del objetivo
        const targetStats = {
            totalPoder: targetColeccion.personajes.reduce((sum, p) => sum + parseInt(p.poder || 0), 0),
            totalFuerza: targetColeccion.personajes.reduce((sum, p) => sum + parseInt(p.fuerza || 0), 0),
            totalMagia: targetColeccion.personajes.reduce((sum, p) => sum + parseInt(p.magia || 0), 0),
            cantidadPersonajes: targetColeccion.personajes.length,
            personajes: targetColeccion.personajes
        };

        // Calcular poder total combinado (poder + fuerza + magia)
        const attackerPowerTotal = attackerStats.totalPoder + attackerStats.totalFuerza + attackerStats.totalMagia;
        const targetPowerTotal = targetStats.totalPoder + targetStats.totalFuerza + targetStats.totalMagia;

        // Obtener personaje más fuerte de cada usuario para mostrar
        const attackerBestChar = attackerStats.personajes.reduce((best, current) => {
            const currentPower = parseInt(current.poder || 0) + parseInt(current.fuerza || 0) + parseInt(current.magia || 0);
            const bestPower = parseInt(best.poder || 0) + parseInt(best.fuerza || 0) + parseInt(best.magia || 0);
            return currentPower > bestPower ? current : best;
        });

        const targetBestChar = targetStats.personajes.reduce((best, current) => {
            const currentPower = parseInt(current.poder || 0) + parseInt(current.fuerza || 0) + parseInt(current.magia || 0);
            const bestPower = parseInt(best.poder || 0) + parseInt(best.fuerza || 0) + parseInt(best.magia || 0);
            return currentPower > bestPower ? current : best;
        });

        // Tags de los usuarios
        const attackerTag = `@${attackerId.split('@')[0]}`;
        const targetTag = `@${targetId.split('@')[0]}`;

        // Mensaje de inicio de batalla
        let battleMsg = `⚔️ *BATALLA INICIADA* ⚔️\n\n`;
        battleMsg += `${attackerTag} 🆚 ${targetTag}\n\n`;
        
        battleMsg += `👤 *${attackerTag}*\n`;
        battleMsg += `🎴 Personajes: ${attackerStats.cantidadPersonajes}\n`;
        battleMsg += `🏆 Mejor personaje: ${attackerBestChar.name}\n`;
        battleMsg += `   💎 Rareza: ${attackerBestChar.rarity}\n`;
        battleMsg += `   ⚡ Poder: ${attackerBestChar.poder}\n`;
        battleMsg += `   💪 Fuerza: ${attackerBestChar.fuerza}\n`;
        battleMsg += `   ✨ Magia: ${attackerBestChar.magia}\n`;
        battleMsg += `📊 Poder total: ${attackerPowerTotal}\n\n`;

        battleMsg += `👤 *${targetTag}*\n`;
        battleMsg += `🎴 Personajes: ${targetStats.cantidadPersonajes}\n`;
        battleMsg += `🏆 Mejor personaje: ${targetBestChar.name}\n`;
        battleMsg += `   💎 Rareza: ${targetBestChar.rarity}\n`;
        battleMsg += `   ⚡ Poder: ${targetBestChar.poder}\n`;
        battleMsg += `   💪 Fuerza: ${targetBestChar.fuerza}\n`;
        battleMsg += `   ✨ Magia: ${targetBestChar.magia}\n`;
        battleMsg += `📊 Poder total: ${targetPowerTotal}\n\n`;

        battleMsg += `━━━━━━━━━━━━━━━━\n\n`;

        // Determinar ganador
        let winner, loser, winnerId, loserId, winnerTag, loserTag;
        
        if (attackerPowerTotal > targetPowerTotal) {
            winner = attacker;
            loser = target;
            winnerId = attackerId;
            loserId = targetId;
            winnerTag = attackerTag;
            loserTag = targetTag;
        } else if (targetPowerTotal > attackerPowerTotal) {
            winner = target;
            loser = attacker;
            winnerId = targetId;
            loserId = attackerId;
            winnerTag = targetTag;
            loserTag = attackerTag;
        } else {
            // Empate - gana el que tiene más personajes
            if (attackerStats.cantidadPersonajes > targetStats.cantidadPersonajes) {
                winner = attacker;
                loser = target;
                winnerId = attackerId;
                loserId = targetId;
                winnerTag = attackerTag;
                loserTag = targetTag;
            } else if (targetStats.cantidadPersonajes > attackerStats.cantidadPersonajes) {
                winner = target;
                loser = attacker;
                winnerId = targetId;
                loserId = attackerId;
                winnerTag = targetTag;
                loserTag = attackerTag;
            } else {
                // Empate total - gana el atacante
                winner = attacker;
                loser = target;
                winnerId = attackerId;
                loserId = targetId;
                winnerTag = attackerTag;
                loserTag = targetTag;
            }
        }

        // Calcular recompensa (mitad de las ToruCoins del perdedor)
        const loserCoins = loser.torucoin || 0;
        const reward = Math.floor(loserCoins / 2);

        // Transferir ToruCoins
        if (reward > 0) {
            winner.torucoin = (winner.torucoin || 0) + reward;
            loser.torucoin = loserCoins - reward;
        }

        // Mensaje de resultado
        battleMsg += `🏆 *GANADOR: ${winnerTag}*\n\n`;
        
        if (reward > 0) {
            battleMsg += `💰 Recompensa obtenida: ${reward} ToruCoins\n`;
            battleMsg += `💳 Saldo de ${winnerTag}: ${winner.torucoin} ToruCoins\n\n`;
            battleMsg += `💸 ${loserTag} perdió: ${reward} ToruCoins\n`;
            battleMsg += `💳 Saldo de ${loserTag}: ${loser.torucoin} ToruCoins\n\n`;
        } else {
            battleMsg += `💰 ${loserTag} no tenía ToruCoins para perder\n\n`;
        }

        // Razón de victoria
        if (attackerPowerTotal > targetPowerTotal || targetPowerTotal > attackerPowerTotal) {
            battleMsg += `⚡ Victoria por mayor poder total\n`;
        } else if (attackerStats.cantidadPersonajes !== targetStats.cantidadPersonajes) {
            battleMsg += `🎴 Victoria por mayor cantidad de personajes\n`;
        } else {
            battleMsg += `🎯 Victoria por iniciativa de combate\n`;
        }

        battleMsg += `\n━━━━━━━━━━━━━━━━\n`;
        battleMsg += `_¡Batalla finalizada!_`;

        await conn.reply(m.chat, battleMsg, m, {
            mentions: [attackerId, targetId]
        });

    } catch (error) {
        console.error('Error en batalla:', error);
        await conn.reply(m.chat, `❌ Error en la batalla: ${error.message}`, m);
    }
};

handler.command = ['kill', 'battle', 'fight'];
handler.group = true;

export default handler;

