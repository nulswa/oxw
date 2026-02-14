let linkRegex1 = /chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i
let linkRegex2 = /whatsapp\.com\/channel\/([0-9A-Za-z]{20,24})/i

// Almacenar advertencias de admins
const adminWarnings = {};

let handler = (m) => m
handler.before = async function (m, {conn, isAdmin, isBotAdmin, isOwner}) {
    // Verificaciones básicas
    if (!m.isGroup) return true
    if (!m.text) return true
    if (m.fromMe) return true
    
    let chat = global.db.data.chats[m.chat]
    if (!chat || !chat.fEnlaces) return true // Si antienlaces está desactivado, salir
    
    const sender = m.sender
    
    // Verificar si es owner del bot
    const isGlobalOwner = global.owner.some(([ownerNumber]) => {
        return sender === `${ownerNumber}@s.whatsapp.net` || sender.split('@')[0] === ownerNumber.toString()
    })
    
    if (isOwner || isGlobalOwner) return true // Owners pueden enviar enlaces
    
    // Detectar si hay enlaces
    const hasGroupLink = linkRegex1.test(m.text)
    const hasChannelLink = linkRegex2.test(m.text)
    
    if (hasGroupLink || hasChannelLink) {
        console.log('Enlace detectado de:', sender)
        
        // Obtener el enlace del grupo actual
        let linkThisGroup = ''
        try {
            const groupCode = await conn.groupInviteCode(m.chat)
            linkThisGroup = `https://chat.whatsapp.com/${groupCode}`
        } catch (e) {
            console.log('Error obteniendo código del grupo:', e)
        }
        
        // Si el enlace es del mismo grupo, permitirlo
        if (linkThisGroup && m.text.includes(linkThisGroup)) {
            console.log('Es enlace del mismo grupo, permitido')
            return true
        }
        
        // Si el bot no es admin, solo avisar
        if (!isBotAdmin) {
            await conn.reply(m.chat, `⚠️ *ANTI ENLACES ACTIVADO*\n\n❌ Detecté un enlace pero no puedo eliminarlo porque no soy administrador del grupo.\n\n💡 Hazme administrador para que pueda gestionar los enlaces.`, m)
            return true
        }
        
        // Si es ADMINISTRADOR del grupo
        if (isAdmin) {
            console.log('Usuario es admin, aplicando advertencia')
            
            // Inicializar advertencias si no existe
            if (!adminWarnings[m.chat]) {
                adminWarnings[m.chat] = {};
            }
            if (!adminWarnings[m.chat][sender]) {
                adminWarnings[m.chat][sender] = 0;
            }
            
            // Primera advertencia
            if (adminWarnings[m.chat][sender] === 0) {
                adminWarnings[m.chat][sender] = 1;
                
                await conn.sendMessage(m.chat, {
                    text: `⚠️ *ADVERTENCIA PARA ADMINISTRADOR*\n\n@${sender.split('@')[0]}, eres administrador pero está prohibido enviar enlaces.\n\n*Esta es tu primera advertencia.*\nSi vuelves a enviar un enlace, serás degradado y eliminado del grupo.`,
                    mentions: [sender]
                })
                
                // Eliminar el mensaje
                await conn.sendMessage(m.chat, {
                    delete: {
                        remoteJid: m.chat,
                        fromMe: false,
                        id: m.key.id,
                        participant: sender
                    }
                })
                
                return false
            }
            
            // Segunda vez - Degradar y eliminar
            if (adminWarnings[m.chat][sender] >= 1) {
                console.log('Admin reincidente, degradando y eliminando')
                
                await conn.sendMessage(m.chat, {
                    text: `🚫 *ADMINISTRADOR ELIMINADO*\n\n@${sender.split('@')[0]} ha sido degradado y eliminado por enviar enlaces repetidamente.`,
                    mentions: [sender]
                })
                
                // Eliminar el mensaje
                await conn.sendMessage(m.chat, {
                    delete: {
                        remoteJid: m.chat,
                        fromMe: false,
                        id: m.key.id,
                        participant: sender
                    }
                })
                
                // Degradar de admin
                await conn.groupParticipantsUpdate(m.chat, [sender], 'demote')
                
                // Esperar antes de eliminar
                await new Promise(resolve => setTimeout(resolve, 1000))
                
                // Eliminar del grupo
                await conn.groupParticipantsUpdate(m.chat, [sender], 'remove')
                
                // Resetear advertencias
                delete adminWarnings[m.chat][sender]
                
                return false
            }
        }
        
        // Si es USUARIO NORMAL (no admin, no owner)
        if (!isAdmin) {
            console.log('Usuario normal, eliminando')
            
            await conn.sendMessage(m.chat, {
                text: `🚫 *ENLACE DETECTADO*\n\n@${sender.split('@')[0]} ha sido eliminado por enviar enlaces.\n\n⚠️ Está prohibido enviar enlaces de grupos o canales de WhatsApp.`,
                mentions: [sender]
            })
            
            // Eliminar el mensaje
            await conn.sendMessage(m.chat, {
                delete: {
                    remoteJid: m.chat,
                    fromMe: false,
                    id: m.key.id,
                    participant: sender
                }
            })
            
            // Esperar antes de eliminar
            await new Promise(resolve => setTimeout(resolve, 500))
            
            // Eliminar del grupo
            await conn.groupParticipantsUpdate(m.chat, [sender], 'remove')
            
            return false
        }
    }
    
    return true
}

export default handler