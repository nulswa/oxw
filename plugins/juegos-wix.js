import fetch from 'node-fetch'

// Base de datos temporal del juego - AHORA POR MENSAJE, NO POR USUARIO
const gameData = {}

const handler = async (m, { conn, command, usedPrefix, text }) => {
if (!global.db.data.chats[m.chat].fJuegos && m.isGroup) {
return conn.sendMessage(m.chat, { text: `📍  Los comandos de *[ juegos ]* estan desactivados...` }, { quoted: m })
}

let userId = m.sender
let user = global.db.data.users[userId]

// Inicializar usuario si no existe
if (!user.torucoin) user.torucoin = 0
if (!user.toruexp) user.toruexp = 0

// NUEVO: Verificar si ya hay un juego activo en este chat
const juegoActivoEnChat = Object.values(gameData).find(
    juego => juego.activo && juego.chat === m.chat
)

if (juegoActivoEnChat) {
const tiempoRestante = Math.ceil((300000 - (Date.now() - juegoActivoEnChat.timestamp)) / 1000 / 60)
return conn.reply(m.chat, 
`⏰  *Ya hay un juego activo en este chat.*\n\n` +
`📍  Espera a que:\n` +
`• Alguien responda correctamente\n` +
`• Todos pierdan sus intentos\n` +
`• Expire el tiempo (~${tiempoRestante} min restantes)\n\n` +
`> Para participar, cita el mensaje del juego activo.`, m)
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
{ id: 70, español: "Con mucho gusto", ingles: "with pleasure", pista: "Aceptación amable" },
{ id: 71, español: "Hoy quiero comer", ingles: "today i want to eat", pista: "Deseo del día" },
{ id: 72, español: "Hoy iré al gym", ingles: "today i will go to the gym", pista: "Plan de ejercicio" },
{ id: 73, español: "Iré de paseo", ingles: "i will go for a walk", pista: "Plan de salir" },
{ id: 74, español: "Voy a dormir", ingles: "i am going to sleep", pista: "Hora de descansar" },
{ id: 75, español: "Necesito ayuda", ingles: "i need help", pista: "Solicitud urgente" },
{ id: 76, español: "Estoy ocupado", ingles: "i am busy", pista: "Sin tiempo libre" },
{ id: 77, español: "Tengo frío", ingles: "i am cold", pista: "Baja temperatura" },
{ id: 78, español: "Tengo calor", ingles: "i am hot", pista: "Alta temperatura" },
{ id: 79, español: "Está lloviendo", ingles: "it is raining", pista: "Clima húmedo" },
{ id: 80, español: "Hace sol", ingles: "it is sunny", pista: "Clima despejado" },
{ id: 81, español: "Quiero ir al cine", ingles: "i want to go to the movies", pista: "Plan de entretenimiento" },
{ id: 82, español: "Voy a estudiar", ingles: "i am going to study", pista: "Actividad académica" },
{ id: 83, español: "Necesito trabajar", ingles: "i need to work", pista: "Obligación laboral" },
{ id: 84, español: "Estoy aburrido", ingles: "i am bored", pista: "Falta de actividad" },
{ id: 85, español: "Me duele la cabeza", ingles: "my head hurts", pista: "Dolor físico" },
{ id: 86, español: "Estoy enfermo", ingles: "i am sick", pista: "Mala salud" },
{ id: 87, español: "Me siento bien", ingles: "i feel good", pista: "Buen estado" },
{ id: 88, español: "¿Dónde vives?", ingles: "where do you live", pista: "Pregunta de ubicación" },
{ id: 89, español: "Vivo aquí", ingles: "i live here", pista: "Respuesta de ubicación" },
{ id: 90, español: "¿Qué haces?", ingles: "what are you doing", pista: "Pregunta de actividad" },
{ id: 91, español: "Nada importante", ingles: "nothing important", pista: "Respuesta casual" },
{ id: 92, español: "Voy al trabajo", ingles: "i am going to work", pista: "Camino al empleo" },
{ id: 93, español: "Voy a la escuela", ingles: "i am going to school", pista: "Camino a estudiar" },
{ id: 94, español: "Llegué tarde", ingles: "i arrived late", pista: "Retraso" },
{ id: 95, español: "Llegué temprano", ingles: "i arrived early", pista: "Puntualidad" },
{ id: 96, español: "Estoy perdido", ingles: "i am lost", pista: "Desorientación" },
{ id: 97, español: "¿Me puedes ayudar?", ingles: "can you help me", pista: "Petición de asistencia" },
{ id: 98, español: "No tengo tiempo", ingles: "i don't have time", pista: "Falta de disponibilidad" },
{ id: 99, español: "Tengo mucho tiempo", ingles: "i have a lot of time", pista: "Disponibilidad amplia" },
{ id: 100, español: "Estoy estudiando", ingles: "i am studying", pista: "Actividad en progreso" },
{ id: 101, español: "Estoy trabajando", ingles: "i am working", pista: "Labor en curso" },
{ id: 102, español: "Estoy comiendo", ingles: "i am eating", pista: "En la comida" },
{ id: 103, español: "Estoy bebiendo", ingles: "i am drinking", pista: "Tomando líquido" },
{ id: 104, español: "Voy al parque", ingles: "i am going to the park", pista: "Salida recreativa" },
{ id: 105, español: "Voy a la playa", ingles: "i am going to the beach", pista: "Destino costero" },
{ id: 106, español: "Quiero descansar", ingles: "i want to rest", pista: "Necesidad de pausa" },
{ id: 107, español: "Necesito dormir", ingles: "i need to sleep", pista: "Urgencia de sueño" },
{ id: 108, español: "Estoy despierto", ingles: "i am awake", pista: "Estado consciente" },
{ id: 109, español: "Estoy durmiendo", ingles: "i am sleeping", pista: "Estado de sueño" },
{ id: 110, español: "Buenos tardes", ingles: "good afternoon", pista: "Saludo vespertino" },
{ id: 111, español: "Hasta mañana", ingles: "see you tomorrow", pista: "Despedida diaria" },
{ id: 112, español: "Nos vemos pronto", ingles: "see you soon", pista: "Despedida cercana" },
{ id: 113, español: "Regreso pronto", ingles: "i will be back soon", pista: "Retorno próximo" },
{ id: 114, español: "Ya regresé", ingles: "i am back", pista: "Anuncio de vuelta" },
{ id: 115, español: "Me voy", ingles: "i am leaving", pista: "Partida" },
{ id: 116, español: "Ya me voy", ingles: "i am leaving now", pista: "Partida inmediata" },
{ id: 117, español: "Espérame", ingles: "wait for me", pista: "Solicitud de paciencia" },
{ id: 118, español: "Te espero", ingles: "i will wait for you", pista: "Ofrecimiento de espera" },
{ id: 119, español: "No puedo esperar", ingles: "i can't wait", pista: "Impaciencia" },
{ id: 120, español: "Tengo prisa", ingles: "i am in a hurry", pista: "Urgencia de tiempo" },
{ id: 121, español: "Sin prisa", ingles: "no rush", pista: "Tranquilidad temporal" },
{ id: 122, español: "¿Tienes tiempo?", ingles: "do you have time", pista: "Consulta de disponibilidad" },
{ id: 123, español: "Dame un minuto", ingles: "give me a minute", pista: "Breve espera" },
{ id: 124, español: "Ya terminé", ingles: "i am done", pista: "Finalización" },
{ id: 125, español: "Aún no termino", ingles: "i am not done yet", pista: "En proceso" },
{ id: 126, español: "Estoy listo", ingles: "i am ready", pista: "Preparado" },
{ id: 127, español: "No estoy listo", ingles: "i am not ready", pista: "Sin preparación" },
{ id: 128, español: "Vamos", ingles: "let's go", pista: "Invitación a partir" },
{ id: 129, español: "Vámonos", ingles: "let's leave", pista: "Propuesta de salida" },
{ id: 130, español: "Quédate aquí", ingles: "stay here", pista: "Petición de permanencia" },
{ id: 131, español: "Siéntate", ingles: "sit down", pista: "Invitación a sentarse" },
{ id: 132, español: "Levántate", ingles: "stand up", pista: "Orden de ponerse de pie" },
{ id: 133, español: "Entra", ingles: "come in", pista: "Invitación a pasar" },
{ id: 134, español: "Sal", ingles: "go out", pista: "Orden de salir" },
{ id: 135, español: "Cállate", ingles: "be quiet", pista: "Petición de silencio" },
{ id: 136, español: "Habla más fuerte", ingles: "speak louder", pista: "Petición de volumen" },
{ id: 137, español: "No escucho", ingles: "i can't hear", pista: "Problema auditivo" },
{ id: 138, español: "Te escucho", ingles: "i hear you", pista: "Confirmación auditiva" },
{ id: 139, español: "¿Me oyes?", ingles: "can you hear me", pista: "Verificación de audio" },
{ id: 140, español: "Repite por favor", ingles: "repeat please", pista: "Solicitud de repetición" },
{ id: 141, español: "Más despacio", ingles: "slower please", pista: "Petición de ritmo" },
{ id: 142, español: "Está delicioso", ingles: "it is delicious", pista: "Aprobación de sabor" },
{ id: 143, español: "No me gusta esto", ingles: "i don't like this", pista: "Desagrado específico" },
{ id: 144, español: "Quiero más", ingles: "i want more", pista: "Solicitud de cantidad" },
{ id: 145, español: "Es suficiente", ingles: "it is enough", pista: "Satisfacción de cantidad" },
{ id: 146, español: "Tengo miedo", ingles: "i am scared", pista: "Estado de temor" },
{ id: 147, español: "No tengas miedo", ingles: "don't be afraid", pista: "Tranquilización" },
{ id: 148, español: "Estoy emocionado", ingles: "i am excited", pista: "Estado de entusiasmo" },
{ id: 149, español: "Estoy nervioso", ingles: "i am nervous", pista: "Estado de ansiedad" },
{ id: 150, español: "Todo está bien", ingles: "everything is fine", pista: "Confirmación positiva" }
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

> 🔑 *Intentos* : 3 intentos por usuario.
> ⏰ *Tiempo:* 5 minutos.

📍 Responda a este mensaje con su respuesta en inglés.`

const mensajeEnviado = await conn.sendMessage(m.chat, { text: mensaje }, { quoted: m })

// CAMBIO IMPORTANTE: Guardar por messageId en lugar de userId
const messageId = mensajeEnviado.key.id

gameData[messageId] = {
palabra: palabraSeleccionada,
activo: true,
chat: m.chat,
timestamp: Date.now(),
participantes: {} // Guardar intentos por cada usuario
}

// Timer de 5 minutos
setTimeout(() => {
if (gameData[messageId] && gameData[messageId].activo) {
let mensajeTimeout = `⏰  Se agotó el tiempo del juego.
- La respuesta era: *${gameData[messageId].palabra.ingles}*

> ${textbot}`

conn.sendMessage(m.chat, { text: mensajeTimeout })
delete gameData[messageId]
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

// Verificar que esté citando un mensaje del bot
if (!m.quoted.fromMe) return false

// Buscar si el mensaje citado corresponde a un juego activo
const messageId = m.quoted.id
if (!gameData[messageId] || !gameData[messageId].activo) return false

const juegoActual = gameData[messageId]

// Inicializar intentos del usuario si es la primera vez que participa
if (!juegoActual.participantes[userId]) {
juegoActual.participantes[userId] = 3 // 3 intentos por usuario
}

// Verificar si el usuario ya agotó sus intentos
if (juegoActual.participantes[userId] <= 0) {
await this.sendMessage(m.chat, { 
text: `📍  Ya agotaste tus 3 intentos en este juego. Espera a que alguien más lo resuelva o que termine el tiempo.` 
}, { quoted: m })
return true
}

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

// Eliminar el juego (alguien ya ganó)
delete gameData[messageId]

} else {
// Respuesta incorrecta
juegoActual.participantes[userId]--

if (juegoActual.participantes[userId] <= 0) {
// ESTE USUARIO AGOTÓ SUS INTENTOS
user.torucoin -= 5
if (user.torucoin < 0) user.torucoin = 0

let mensajeDerrota = `📍  Perdiste, agotaste tus 3 intentos.

⎔ *Penalización:*
- ${toem} -5 *${currency}*

💡 La palabra era: *${juegoActual.palabra.ingles}*

> ${textbot}`

await this.sendMessage(m.chat, { text: mensajeDerrota }, { quoted: m })

} else {
// INTENTO FALLIDO PERO AÚN HAY OPORTUNIDADES PARA ESTE USUARIO
let mensajeIntento = `❔  La respuesta *( ${respuestaUsuario} )* es incorrecta.
- Te quedan *${juegoActual.participantes[userId]}* intentos...

- 💡 *Accion:* ${juegoActual.palabra.pista}

> 📍  Responde al mensaje principal del juego para otra respuesta.`

await this.sendMessage(m.chat, { text: mensajeIntento }, { quoted: m })
}
}

return true
}

handler.command = ["wix", "adivinaingles", "english"]
export default handler
