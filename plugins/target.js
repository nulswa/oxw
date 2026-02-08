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

let handler = async (m, { conn, usedPrefix, command }) => {
    const userId = m.sender;

    try {
        // Cargar datos de targets
        const targets = await loadTargets();

        // Buscar si el usuario está registrado
        const userTarget = targets.find(t => t.usuario === userId);

        // Si el usuario NO está registrado
        if (!userTarget) {
            let mensaje = `❌ *NO ESTÁS REGISTRADO* ❌\n\n`;
            mensaje += `No tienes datos registrados en el sistema.\n\n`;
            mensaje += `💡 *¿Cómo registrarte?*\n`;
            mensaje += `Usa el comando *${usedPrefix}me* para registrar tus datos.\n\n`;
            mensaje += `*Formato:*\n`;
            mensaje += `${usedPrefix}me <teléfono>, <alias>, <numeral>\n\n`;
            mensaje += `*Ejemplo:*\n`;
            mensaje += `${usedPrefix}me +521234567890, Juan.P_123, 12345`;

            return await conn.reply(m.chat, mensaje, m);
        }

        // Si el usuario ESTÁ registrado, mostrar sus datos
        let mensaje = `🎯 *TUS DATOS REGISTRADOS* 🎯\n\n`;
        mensaje += `📋 *INFORMACIÓN PERSONAL:*\n`;
        mensaje += `📞 Teléfono: ${userTarget.telefono}\n`;
        mensaje += `🏷️ Alias: ${userTarget.alias}\n`;
        mensaje += `🔢 Numeral: ${userTarget.numeral}\n`;
        mensaje += `🔐 Clave: ${userTarget.clave}\n`;
        mensaje += `💰 Pux: ${userTarget.pux} ToruCoins\n\n`;

        // Verificar si tiene código de canje
        mensaje += `━━━━━━━━━━━━━━━━\n\n`;
        mensaje += `🎁 *CÓDIGO DE CANJE:*\n`;
        
        if (userTarget.codigo && userTarget.codigo.length > 0) {
            mensaje += `✅ Tienes un código activo\n`;
            mensaje += `📝 Código: \`${userTarget.codigo}\`\n`;
            mensaje += `_Usa este código para canjearlo cuando esté disponible_`;
        } else {
            mensaje += `❌ No tienes código de canje\n`;
            mensaje += `_Espera a que se te asigne un código o participa en eventos para obtener uno_`;
        }

        mensaje += `\n\n━━━━━━━━━━━━━━━━\n\n`;
        mensaje += `💡 *Comandos útiles:*\n`;
        mensaje += `• *${usedPrefix}me <clave>* - Eliminar tus datos`;

        await conn.reply(m.chat, mensaje, m);

    } catch (error) {
        console.error('Error en comando target:', error);
        await conn.reply(m.chat, `❌ Error al obtener tus datos: ${error.message}`, m);
    }
};

handler.command = ['target', 'profile', 'perfil'];
handler.group = true;
export default handler;
