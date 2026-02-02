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
return conn.reply(m.chat, '📍  *Ya tienes un juego activo.* Termínalo primero o espera a que expire 5 minutos...', m)
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
{ id: 16, español: "Computadora", ingles: "computer", pista: "Para trabajar/jugar" },
{ id: 17, español: "Perro", ingles: "dog", pista: "Mejor amigo del hombre" },
{ id: 18, español: "Gato", ingles: "cat", pista: "Mascota felina" },
{ id: 19, español: "Feliz cumpleaños", ingles: "happy birthday", pista: "Celebración anual" },
{ id: 20, español: "¿Cómo estás?", ingles: "how are you", pista: "Pregunta sobre el estado" },
{ id: 21, español: "¿Dónde está el baño?", ingles: "where is the bathroom", pista: "Pregunta común en lugares públicos" },
{ id: 22, español: "¿Cuánto cuesta?", ingles: "how much is it", pista: "Pregunta sobre precio" },
{ id: 23, español: "No entiendo", ingles: "i don't understand", pista: "Cuando no comprendes algo" },
{ id: 24, español: "¿Hablas español?", ingles: "do you speak spanish", pista: "Pregunta sobre idioma" },
{ id: 25, español: "Mucho gusto", ingles: "nice to meet you", pista: "Al conocer a alguien" },
{ id: 26, español: "De nada", ingles: "you're welcome", pista: "Respuesta a 'gracias'" },
{ id: 27, español: "¿Qué hora es?", ingles: "what time is it", pista: "Pregunta sobre la hora" },
{ id: 28, español: "Tengo hambre", ingles: "i am hungry", pista: "Cuando necesitas comer" },
{ id: 29, español: "Tengo sed", ingles: "i am thirsty", pista: "Cuando necesitas beber" },
{ id: 30, español: "¿Dónde está el gato?", ingles: "where is the cat", pista: "Buscando a la mascota felina" },
{ id: 31, español: "Me gusta", ingles: "i like it", pista: "Expresión de agrado" },
{ id: 32, español: "No me gusta", ingles: "i don't like it", pista: "Expresión de desagrado" },
{ id: 33, español: "Hasta luego", ingles: "see you later", pista: "Despedida informal" },
{ id: 34, español: "¿Cómo te llamas?", ingles: "what is your name", pista: "Pregunta sobre el nombre" },
{ id: 35, español: "Me llamo", ingles: "my name is", pista: "Presentación personal" },
{ id: 36, español: "Buen viaje", ingles: "have a good trip", pista: "Deseo para viajeros" },
{ id: 37, español: "Buena suerte", ingles: "good luck", pista: "Deseo de fortuna" },
{ id: 38, español: "Con permiso", ingles: "excuse me", pista: "Para pedir paso" },
{ id: 39, español: "Salud", ingles: "bless you", pista: "Después de un estornudo" },
{ id: 40, español: "Felicidades", ingles: "congratulations", pista: "Por un logro" },
{ id: 41, español: "Sí, por supuesto", ingles: "yes of course", pista: "Afirmación enfática" },
{ id: 42, español: "No lo sé", ingles: "i don't know", pista: "Desconocimiento" },
{ id: 43, español: "Tal vez", ingles: "maybe", pista: "Posibilidad incierta" },
{ id: 44, español: "Espera un momento", ingles: "wait a moment", pista: "Pedir paciencia" },
{ id: 45, español: "Ven aquí", ingles: "come here", pista: "Llamar a alguien" },
{ id: 46, español: "Vete", ingles: "go away", pista: "Pedir que se vayan" },
{ id: 47, español: "Ayuda", ingles: "help", pista: "Pedir socorro" },
{ id: 48, español: "Cuidado", ingles: "be careful", pista: "Advertencia" },
{ id: 49, español: "Rápido", ingles: "hurry up", pista: "Pedir velocidad" },
{ id: 50, español: "Despacio", ingles: "slow down", pista: "Pedir calma" },
{ id: 51, español: "Te extraño", ingles: "i miss you", pista: "Sentimiento de ausencia" },
{ id: 52, español: "Estoy cansado", ingles: "i am tired", pista: "Falta de energía" },
{ id: 53, español: "Estoy feliz", ingles: "i am happy", pista: "Estado de ánimo positivo" },
{ id: 54, español: "Estoy triste", ingles: "i am sad", pista: "Estado de ánimo negativo" },
{ id: 55, español: "¿Qué pasa?", ingles: "what's up", pista: "Saludo informal" },
{ id: 56, español: "Nada especial", ingles: "nothing much", pista: "Respuesta casual" },
{ id: 57, español: "Está bien", ingles: "it's okay", pista: "Aceptación" },
{ id: 58, español: "No hay problema", ingles: "no problem", pista: "Sin inconvenientes" },
{ id: 59, español: "Claro que sí", ingles: "sure", pista: "Afirmación casual" },
{ id: 60, español: "Claro que no", ingles: "of course not", pista: "Negación enfática" },
{ id: 61, español: "¿En serio?", ingles: "really", pista: "Expresión de sorpresa" },
{ id: 62, español: "No te preocupes", ingles: "don't worry", pista: "Tranquilizar a alguien" },
{ id: 63, español: "Ten cuidado", ingles: "take care", pista: "Despedida con cariño" },
{ id: 64, español: "Buena idea", ingles: "good idea", pista: "Aprobación de sugerencia" },
{ id: 65, español: "Mala idea", ingles: "bad idea", pista: "Desaprobación" },
{ id: 66, español: "¿De verdad?", ingles: "are you sure", pista: "Confirmación de certeza" },
{ id: 67, español: "Estoy de acuerdo", ingles: "i agree", pista: "Conformidad" },
{ id: 68, español: "No estoy de acuerdo", ingles: "i disagree", pista: "Disconformidad" },
{ id: 69, español: "¿Puedes ayudarme?", ingles: "can you help me", pista: "Solicitud de ayuda" },
{ id: 70, español: "Con mucho gusto", ingles: "with pleasure", pista: "Aceptación amable" }
]

// Seleccionar palabra aleatoria
const palabraSeleccionada = palabras[Math.floor(Math.random() * palabras.length)]

// Mensaje del juego
let mensaje = `
❔ \`ADIVINA LA PALABRA\`
- ¡Gana *+50* ${currency} y *+50* ${currency2}

┌───────────────
│● 💡 *Accion* 
> ${palabraSeleccionada.pista}
│
│● 📝 *Palabra:*
> ${palabraSeleccionada.español}
└───────────────

> 🔑 *Intentos* : 3 intentos.
> ⏰ *Tiempo:* 5 minutos.

📍 Responda a este mensaje con su respuesta en ingles.`

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

let mensajeTimeout = `⏰  Se agoto tu tiempo de respuesta.
- La respuesta era: *${gameData[userId].palabra.ingles}*

⎔ *Penalización:*
• ${toem} -5 *${currency}*

> ${textbot}`

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
user.torucoin += 50
user.toruexp += 50

let mensajeVictoria = `✅  ¡La palabra *( ${juegoActual.palabra.ingles} )* es correcta!

> *Ganancias:*
${toem} *${currency}* : +50
${toem2} *${currency2}* : +50

> ${textbot}`

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

let mensajeDerrota = `📍  Perdiste, la palabra correcta era *( ${juegoActual.palabra.ingles} )*

⎔ *Penalización:*
• ${toem} -5 *${currency}*

> ${textbot}`

await this.sendMessage(m.chat, { text: mensajeDerrota }, { quoted: m })

// Eliminar el juego
delete gameData[userId]

} else {
// INTENTO FALLIDO PERO AÚN HAY OPORTUNIDADES
let mensajeIntento = `❔  La respuesta *( ${respuestaUsuario} )* es incorrecta.
- Te quedan *${juegoActual.intentos}* intentos...

• 💡 *Accion:* ${juegoActual.palabra.pista}

> 📍  Responda al mensaje principal del juego para otra respuesta.`

await this.sendMessage(m.chat, { text: mensajeIntento }, { quoted: m })
}
}

return true
}

handler.command = ["wix", "adivinaingles", "english"]
export default handler
    
