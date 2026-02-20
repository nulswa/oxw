import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, usedPrefix, command, text, args }) => {
    // Verificar que sea un sub-bot
/*    if (conn.user.jid === global.conn.user.jid) {
        return m.reply('❌ Este comando solo funciona para sub-bots.\n\nUsa *#code* o *#serbot* para crear tu sub-bot.')
    }*/
    
    const botJid = conn.user.jid
    let settings = global.db.data.settings[botJid]
    
    if (!settings) {
        settings = global.db.data.settings[botJid] = {
            menuBot: global.toruMenu,
            imgBot: global.toruImg,
            nameBot: global.botname,
            descBot: global.textbot,
            prefix: '.'
        }
    }
    
    // Si no hay argumentos, mostrar configuración actual
    if (!args[0]) {
        let menu = `╭─────────────────────\n`
        menu += `│ ⚙️ *CONFIGURACIÓN DE TU SUB-BOT*\n`
        menu += `╰─────────────────────\n\n`
        menu += `*📋 Configuración actual:*\n\n`
        menu += `🤖 *Nombre:* ${settings.nameBot || global.botname}\n`
        menu += `📝 *Descripción:* ${settings.descBot || global.textbot}\n`
        menu += `🖼️ *Imagen:* ${settings.imgBot ? 'Configurada ✅' : 'Por defecto'}\n`
        menu += `📱 *Menú:* ${settings.menuBot ? 'Personalizado ✅' : 'Por defecto'}\n`
        menu += `⚡ *Prefijo:* ${settings.prefix}\n\n`
        menu += `━━━━━━━━━━━━━━━━━━━\n\n`
        menu += `*💡 Comandos disponibles:*\n\n`
        menu += `• ${usedPrefix}editbot nombre <texto>\n`
        menu += `• ${usedPrefix}editbot desc <texto>\n`
        menu += `• ${usedPrefix}editbot img <url>\n`
        menu += `• ${usedPrefix}editbot menu <url>\n`
        menu += `• ${usedPrefix}editbot prefix <símbolo>\n`
        menu += `• ${usedPrefix}editbot reset\n\n`
        menu += `*📌 Ejemplos:*\n`
        menu += `${usedPrefix}editbot nombre Mi Bot Personal\n`
        menu += `${usedPrefix}editbot desc El mejor bot del grupo\n`
        menu += `${usedPrefix}editbot img https://i.imgur.com/abc123.jpg\n`
        menu += `${usedPrefix}editbot prefix #`
        
        return m.reply(menu)
    }
    
    const option = args[0].toLowerCase()
    const value = args.slice(1).join(' ')
    
    switch(option) {
        case 'nombre':
        case 'name':
            if (!value) return m.reply(`❌ Debes proporcionar un nombre.\n\n*Ejemplo:* ${usedPrefix}${command} nombre Mi Bot`)
            settings.nameBot = value
            await m.reply(`✅ Nombre del bot actualizado a: *${value}*`)
            break
            
        case 'desc':
        case 'descripcion':
            if (!value) return m.reply(`❌ Debes proporcionar una descripción.\n\n*Ejemplo:* ${usedPrefix}${command} desc Bot personalizado`)
            settings.descBot = value
            await m.reply(`✅ Descripción actualizada a: *${value}*`)
            break
            
        case 'img':
        case 'imagen':
        case 'icon':
            if (!value) return m.reply(`❌ Debes proporcionar una URL de imagen.\n\n*Ejemplo:* ${usedPrefix}${command} img https://i.imgur.com/abc123.jpg`)
            
            // Validar URL
            const urlRegex = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i
            if (!urlRegex.test(value)) {
                return m.reply('❌ URL inválida. Debe ser una imagen (jpg, png, gif, webp)')
            }
            
            settings.imgBot = value
            await m.reply(`✅ Imagen del bot actualizada.\n\nVista previa:`)
            
            try {
                await conn.sendFile(m.chat, value, 'icon.jpg', 'Nueva imagen del bot', m)
            } catch (e) {
                await m.reply('⚠️ La URL se guardó pero no pude cargar la vista previa. Verifica que la URL sea correcta.')
            }
            break
            
        case 'menu':
            if (!value) return m.reply(`❌ Debes proporcionar una URL de imagen para el menú.\n\n*Ejemplo:* ${usedPrefix}${command} menu https://i.imgur.com/menu.jpg`)
            
            const menuUrlRegex = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i
            if (!menuUrlRegex.test(value)) {
                return m.reply('❌ URL inválida. Debe ser una imagen (jpg, png, gif, webp)')
            }
            
            settings.menuBot = value
            await m.reply(`✅ Imagen del menú actualizada.`)
            break
            
        case 'prefix':
        case 'prefijo':
            if (!value || value.length > 3) return m.reply(`❌ El prefijo debe tener máximo 3 caracteres.\n\n*Ejemplos:* # . ! /`)
            settings.prefix = value
            await m.reply(`✅ Prefijo actualizado a: *${value}*\n\nAhora usa: ${value}menu`)
            break
            
        case 'reset':
        case 'resetear':
        case 'restaurar':
            settings.nameBot = global.botname
            settings.descBot = global.textbot
            settings.imgBot = global.toruImg
            settings.menuBot = global.toruMenu
            settings.prefix = '.'
            await m.reply('✅ Configuración restaurada a los valores por defecto.')
            break
            
        default:
            return m.reply(`❌ Opción no válida.\n\nUsa *${usedPrefix}${command}* para ver las opciones disponibles.`)
    }
}

handler.command = ['wte']
handler.owner = false // Cualquier usuario con sub-bot puede usarlo

export default handler
