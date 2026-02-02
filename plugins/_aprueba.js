import fetch from 'node-fetch'

// Base de datos temporal del juego
const gameData = {}

const handler = async (m, { conn, command, usedPrefix, text }) => {
    let userId = m.sender
    let user = global.db.data.users[userId]
    
    // Inicializar usuario si no existe
    if (!user.torucoin) user.torucoin = 0
    if (!user.toruexp) user.toruexp = 0
    
    // Verificar si ya tiene un juego activo
    if (gameData[userId] && gameData[userId].activo) {
        return conn.reply(m.chat, '⚠️ *Ya tienes un juego activo.* Termínalo primero o espera a que expire.', m)
    }
    
    // Lista de palabras/frases para adivinar
    const palabras = [
        { id: 1, español: "Hola", ingles: "hello", pista: "Saludo común" },
        { id: 2, español: "Adiós", ingles: "goodbye", pista: "Despedida" },
        { id: 3, español: "Gracias", ingles: "thank you", pista: "Expresión de gratitud" },
        { id: 4, español: "Buenos días", ingles: "good morning", pista: "Saludo matutino" },
        { id: 5, español: "Buenas noches", ingles: "good night", pista: "Despedida nocturna" },
        { id: 6, español: "Por favor", ingles: "please", pista: "Forma cortés de pedir algo" },
        { id: 7, español: "Lo siento", ingles: "sorry", pista: "Disculpa" },
        { id: 8, español: "Te amo", ingles: "i love you", pista: "Expresión de amor" },
        { id: 9, español: "Agua", ingles: "water", pista: "Líquido vital" },
        { id: 10, español: "Comida", ingles: "food", pista: "Lo que comes" },
        { id: 11, español: "Casa", ingles: "house", pista: "Donde vives" },
        { id: 12, español: "Amigo", ingles: "friend", pista: "Compañero cercano" },
        { id: 13, español: "Familia", ingles: "family", pista: "Parientes" },
        { id: 14, español: "Libro", ingles: "book", pista: "Para leer" },
        { id: 15, español: "Teléfono", ingles: "phone", pista: "Para llamar" },
        { id: 16, española: "Computadora", ingles: "computer", pista: "Para trabajar/jugar" },
        { id: 17, español: "Perro", ingles: "dog", pista: "Mejor amigo del hombre" },
        { id: 18, español: "Gato", ingles: "cat", pista: "Mascota felina" },
        { id: 19, español: "Feliz cumpleaños", ingles: "happy birthday", pista: "Celebración anual" },
        { id: 20, español: "¿Cómo estás?", ingles: "how are you", pista: "Pregunta sobre el estado" }
    ]
    
    // Seleccionar palabra aleatoria
    const palabraSeleccionada = palabras[Math.floor(Math.random() * palabras.length)]
    
    // Mensaje del juego
    let mensaje = `╭━━━━━━━━━⬣
┃ 🎮 *ADIVINA LA PALABRA*
┃
┃ 🆔 *ID:* *${palabraSeleccionada.id}*
┃ 📝 *Palabra en Español:*
┃ ${palabraSeleccionada.español}
┃
┃ 💡 *Pista:* ${palabraSeleccionada.pista}
┃
┃ ❤️ *Intentos restantes:* 3
┃ ⏱️ *Tiempo límite:* 5 minutos
┃
┃ 📌 *Instrucciones:*
┃ Responde citando este mensaje
┃ con la palabra en inglés
┃
┃ 🏆 *Premio:* +10 coins y +10 exp
┃ 💀 *Penalización:* -5 coins
╰━━━━━━━━━⬣`
    
    const mensajeEnviado = await conn.sendMessage(m.chat, { text: mensaje }, { quoted: m })
    
    // Guardar el juego activo
    gameData[userId] = {
        palabra: palabraSeleccionada,
        intentos: 3,
        activo: true,
        messageId: mensajeEnviado.key.id,
        chat: m.chat,
        timestamp: Date.now()
    }
    
    // Timer de 5 minutos
    setTimeout(() => {
        if (gameData[userId] && gameData[userId].activo && gameData[userId].messageId === mensajeEnviado.key.id) {
            user.torucoin -= 5
            if (user.torucoin < 0) user.torucoin = 0
            
            let mensajeTimeout = `╭━━━━━━━━━⬣
┃ ⏰ *TIEMPO AGOTADO*
┃
┃ ❌ Se acabó el tiempo
┃ 
┃ ✅ La respuesta era: *${gameData[userId].palabra.ingles}*
┃
┃ 💸 *Penalización:*
┃ • -5 Coins 🪙
┃
┃ 💰 *Total Coins:* ${user.torucoin}
┃ ⭐ *Total EXP:* ${user.toruexp}
╰━━━━━━━━━⬣`
            
            conn.sendMessage(m.chat, { text: mensajeTimeout })
            delete gameData[userId]
        }
    }, 5 * 60 * 1000) // 5 minutos
}

handler.before = async function (m) {
    // Verificar si es un mensaje válido
    if (!m.text) return false
    if (m.isBaileys) return false
    if (!m.quoted) return false
    
    let userId = m.sender
    
    // Verificar si el usuario existe en la base de datos
    if (!global.db.data.users[userId]) return false
    
    let user = global.db.data.users[userId]
    
    // Verificar si el usuario tiene un juego activo
    if (!gameData[userId] || !gameData[userId].activo) return false
    
    // Verificar que esté citando un mensaje del bot
    if (!m.quoted.fromMe) return false
    
    // Verificar que esté citando el mensaje correcto del juego
    if (m.quoted.id !== gameData[userId].messageId) return false
    
    const juegoActual = gameData[userId]
    
    // Obtener la respuesta del usuario (normalizada)
    let respuestaUsuario = m.text.toLowerCase().trim()
    let respuestaCorrecta = juegoActual.palabra.ingles.toLowerCase()
    
    // Verificar la respuesta
    if (respuestaUsuario === respuestaCorrecta) {
        // ¡GANÓ!
        user.torucoin += 10
        user.toruexp += 10
        
        let mensajeVictoria = `╭━━━━━━━━━⬣
┃ 🎉 *¡CORRECTO!*
┃
┃ ✅ La respuesta era: *${juegoActual.palabra.ingles}*
┃
┃ 🏆 *Recompensas:*
┃ • +10 Coins 🪙
┃ • +10 EXP ⭐
┃
┃ 💰 *Total Coins:* ${user.torucoin}
┃ ⭐ *Total EXP:* ${user.toruexp}
╰━━━━━━━━━⬣`
        
        await this.sendMessage(m.chat, { text: mensajeVictoria }, { quoted: m })
        
        // Eliminar el juego
        delete gameData[userId]
        
    } else {
        // Respuesta incorrecta
        juegoActual.intentos--
        
        if (juegoActual.intentos <= 0) {
            // SE ACABARON LOS INTENTOS
            user.torucoin -= 5
            if (user.torucoin < 0) user.torucoin = 0
            
            let mensajeDerrota = `╭━━━━━━━━━⬣
┃ 💀 *GAME OVER*
┃
┃ ❌ Se acabaron tus intentos
┃ 
┃ ✅ La respuesta era: *${juegoActual.palabra.ingles}*
┃
┃ 💸 *Penalización:*
┃ • -5 Coins 🪙
┃
┃ 💰 *Total Coins:* ${user.torucoin}
┃ ⭐ *Total EXP:* ${user.toruexp}
╰━━━━━━━━━⬣`
            
            await this.sendMessage(m.chat, { text: mensajeDerrota }, { quoted: m })
            
            // Eliminar el juego
            delete gameData[userId]
            
        } else {
            // INTENTO FALLIDO PERO AÚN HAY OPORTUNIDADES
            let mensajeIntento = `╭━━━━━━━━━⬣
┃ ❌ *INCORRECTO*
┃
┃ 💭 *Tu respuesta:* ${respuestaUsuario}
┃ ❤️ *Intentos restantes:* ${juegoActual.intentos}
┃
┃ 💡 *Pista:* ${juegoActual.palabra.pista}
┃
┃ 🔄 Intenta de nuevo citando
┃ el mensaje original
╰━━━━━━━━━⬣`
            
            await this.sendMessage(m.chat, { text: mensajeIntento }, { quoted: m })
        }
    }
    
    return true
}

handler.command = ["wix", "adivinaingles", "english"]
export default handler

