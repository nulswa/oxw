let handler = async (m, { conn, usedPrefix, args, command }) => {
    try {
        const botJid = conn.user.jid
        let settings = global.db.data.settings[botJid]
        
        // Obtener configuración personalizada o usar valores por defecto
        const botName = settings?.nameBot || global.botname
        const botDesc = settings?.descBot || global.textbot
        const botImg = settings?.imgBot || global.toruImg
        const botMenu = settings?.menuBot || global.toruMenu
        
        // Tu código del menú aquí...
let menu = `╭─────────────────────
│ 🤖 *${botName}*
│ ${botDesc}
╰─────────────────────`
        
        // ... resto del menú
        
        // Enviar con imagen personalizada
        await conn.sendFile(m.chat, botImg || botMenu, 'menu.jpg', menu, m)
        
    } catch (error) {
        console.error('Error en menú:', error)
        await conn.reply(m.chat, '❌ Error al generar el menú.', m)
    }
}

handler.command = ['utest']
export default handler
