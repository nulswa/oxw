import fetch from 'node-fetch'

// Base de datos del juego de PREGUNTAS (diferente al de inglés)
const triviaGameData = {}

const handler = async (m, { conn, command, usedPrefix, text }) => {
let userId = m.sender
let user = global.db.data.users[userId]

// Inicializar usuario si no existe
if (!user.torucoin) user.torucoin = 0
if (!user.toruexp) user.toruexp = 0

// Verificar si ya hay un juego de TRIVIA activo en este chat
const juegoActivoEnChat = Object.values(triviaGameData).find(
    juego => juego.activo && juego.chat === m.chat
)

if (juegoActivoEnChat) {
    return conn.reply(m.chat, 
        `⏰  *Ya hay un juego de preguntas activo en este chat.*\n\n` +
        `📍  Completa el juego actual, espera a que expire o que alguien gane.\n\n` +
        `> Para participar, cita el mensaje del juego activo.`, 
    m)
}

// Lista de 50 preguntas aleatorias
const preguntas = [
    { id: 1, pregunta: "¿Cuál es la capital de Francia?", respuesta: "paris", pista: "Ciudad de la Torre Eiffel" },
    { id: 2, pregunta: "¿Cuántos continentes hay?", respuesta: "7", pista: "Un número impar" },
    { id: 3, pregunta: "¿Quién pintó la Mona Lisa?", respuesta: "leonardo da vinci", pista: "Artista italiano del Renacimiento" },
    { id: 4, pregunta: "¿Cuál es el planeta más grande del sistema solar?", respuesta: "jupiter", pista: "Gigante gaseoso" },
    { id: 5, pregunta: "¿En qué año llegó el hombre a la luna?", respuesta: "1969", pista: "Década de los 60" },
    { id: 6, pregunta: "¿Cuál es el océano más grande?", respuesta: "pacifico", pista: "Está entre América y Asia" },
    { id: 7, pregunta: "¿Cuántos días tiene un año bisiesto?", respuesta: "366", pista: "Uno más que 365" },
    { id: 8, pregunta: "¿Cuál es el animal terrestre más rápido?", respuesta: "guepardo", pista: "Felino africano" },
    { id: 9, pregunta: "¿Quién escribió Don Quijote?", respuesta: "cervantes", pista: "Escritor español" },
    { id: 10, pregunta: "¿Cuál es el metal más abundante en la Tierra?", respuesta: "aluminio", pista: "Empieza con A" },
    { id: 11, pregunta: "¿Cuántos huesos tiene el cuerpo humano adulto?", respuesta: "206", pista: "Más de 200" },
    { id: 12, pregunta: "¿Cuál es el río más largo del mundo?", respuesta: "amazonas", pista: "Está en Sudamérica" },
    { id: 13, pregunta: "¿En qué país se encuentra la Torre Eiffel?", respuesta: "francia", pista: "País europeo" },
    { id: 14, pregunta: "¿Cuál es el idioma más hablado del mundo?", respuesta: "chino", pista: "Idioma asiático" },
    { id: 15, pregunta: "¿Cuántos lados tiene un hexágono?", respuesta: "6", pista: "Menos de 10" },
    { id: 16, pregunta: "¿Quién fue el primer presidente de USA?", respuesta: "george washington", pista: "Su apellido es una ciudad" },
    { id: 17, pregunta: "¿Cuál es el animal más grande del mundo?", respuesta: "ballena azul", pista: "Vive en el océano" },
    { id: 18, pregunta: "¿En qué continente está Egipto?", respuesta: "africa", pista: "Tierra de las pirámides" },
    { id: 19, pregunta: "¿Cuántos minutos tiene una hora?", respuesta: "60", pista: "Número redondo" },
    { id: 20, pregunta: "¿Cuál es la montaña más alta del mundo?", respuesta: "everest", pista: "Está en el Himalaya" },
    { id: 21, pregunta: "¿Qué gas respiran las plantas?", respuesta: "dioxido de carbono", pista: "CO2" },
    { id: 22, pregunta: "¿Cuántas patas tiene una araña?", respuesta: "8", pista: "Menos de 10" },
    { id: 23, pregunta: "¿Cuál es la capital de España?", respuesta: "madrid", pista: "Ciudad del Real Madrid" },
    { id: 24, pregunta: "¿Quién inventó la bombilla?", respuesta: "thomas edison", pista: "Inventor estadounidense" },
    { id: 25, pregunta: "¿Cuál es el planeta más cercano al Sol?", respuesta: "mercurio", pista: "También es un metal líquido" },
    { id: 26, pregunta: "¿Cuántos jugadores tiene un equipo de fútbol?", respuesta: "11", pista: "Once" },
    { id: 27, pregunta: "¿En qué país se inventó el papel?", respuesta: "china", pista: "País asiático antiguo" },
    { id: 28, pregunta: "¿Cuál es el color que resulta de mezclar azul y amarillo?", respuesta: "verde", pista: "Color de la naturaleza" },
    { id: 29, pregunta: "¿Cuántos grados tiene un ángulo recto?", respuesta: "90", pista: "Noventa" },
    { id: 30, pregunta: "¿Cuál es la capital de Italia?", respuesta: "roma", pista: "Ciudad del Coliseo" },
    { id: 31, pregunta: "¿Qué órgano bombea la sangre?", respuesta: "corazon", pista: "Símbolo del amor" },
    { id: 32, pregunta: "¿Cuántas estaciones tiene el año?", respuesta: "4", pista: "Cuatro" },
    { id: 33, pregunta: "¿Quién descubrió América?", respuesta: "cristobal colon", pista: "Navegante genovés" },
    { id: 34, pregunta: "¿Cuál es el metal precioso más valioso?", respuesta: "oro", pista: "Amarillo brillante" },
    { id: 35, pregunta: "¿Cuántos segundos tiene un minuto?", respuesta: "60", pista: "Sesenta" },
    { id: 36, pregunta: "¿En qué país está la Gran Muralla?", respuesta: "china", pista: "País asiático" },
    { id: 37, pregunta: "¿Cuál es el deporte más popular del mundo?", respuesta: "futbol", pista: "Se juega con los pies" },
    { id: 38, pregunta: "¿Cuántos colores tiene el arcoíris?", respuesta: "7", pista: "Siete" },
    { id: 39, pregunta: "¿Cuál es la capital de Japón?", respuesta: "tokio", pista: "Ciudad del anime" },
    { id: 40, pregunta: "¿Qué animal es el rey de la selva?", respuesta: "leon", pista: "Felino con melena" },
    { id: 41, pregunta: "¿Cuántos meses tiene el año?", respuesta: "12", pista: "Doce" },
    { id: 42, pregunta: "¿Cuál es el país más grande del mundo?", respuesta: "rusia", pista: "Está en Europa y Asia" },
    { id: 43, pregunta: "¿Qué instrumento tiene 88 teclas?", respuesta: "piano", pista: "Instrumento de música clásica" },
    { id: 44, pregunta: "¿Cuál es la capital de México?", respuesta: "ciudad de mexico", pista: "CDMX" },
    { id: 45, pregunta: "¿Cuántos lados tiene un triángulo?", respuesta: "3", pista: "Tres" },
    { id: 46, pregunta: "¿Qué planeta es conocido como el planeta rojo?", respuesta: "marte", pista: "Cuarto planeta" },
    { id: 47, pregunta: "¿Cuántas letras tiene el alfabeto español?", respuesta: "27", pista: "Entre 20 y 30" },
    { id: 48, pregunta: "¿Cuál es el animal nacional de Australia?", respuesta: "canguro", pista: "Salta mucho" },
    { id: 49, pregunta: "¿En qué continente está Brasil?", respuesta: "america del sur", pista: "Sudamérica" },
    { id: 50, pregunta: "¿Cuál es la moneda de Estados Unidos?", respuesta: "dolar", pista: "USD $" }
]

// Seleccionar pregunta aleatoria
const preguntaSeleccionada = preguntas[Math.floor(Math.random() * preguntas.length)]

// Mensaje del juego
let mensaje = `🎯 \`PREGUNTAS\`
- ¡Llega a 10/10 de preguntas para ganar!


▢ ❓ *Pregunta:*
> ${preguntaSeleccionada.pregunta}

▢ ✏️ *Pista:*
> ${preguntaSeleccionada.pista}

⏰ *Tiempo* : 5 minutos

📍 Responde citando este mensaje.`

const mensajeEnviado = await conn.sendMessage(m.chat, { text: mensaje }, { quoted: m })

const messageId = mensajeEnviado.key.id

triviaGameData[messageId] = {
    pregunta: preguntaSeleccionada,
    activo: true,
    chat: m.chat,
    timestamp: Date.now(),
    participantes: {}, // userID: { racha, oportunidades }
    tipo: 'trivia' // Identificador del tipo de juego
}

// Timer de 5 minutos
setTimeout(() => {
    if (triviaGameData[messageId] && triviaGameData[messageId].activo) {
        let mensajeTimeout = `⏰  Se agotó el tiempo del juego.
- La respuesta era: *${triviaGameData[messageId].pregunta.respuesta}*

> ${textbot}`

        conn.sendMessage(m.chat, { text: mensajeTimeout })
        delete triviaGameData[messageId]
    }
}, 5 * 60 * 1000) // 5 minutos
}

handler.before = async function (m) {
    if (!m.text) return false
    if (m.isBaileys) return false
    if (!m.quoted) return false

    let userId = m.sender

    if (!global.db.data.users[userId]) return false

    let user = global.db.data.users[userId]

    if (!m.quoted.fromMe) return false

    const messageId = m.quoted.id
    
    // Verificar que sea un juego de TRIVIA (no de inglés)
    if (!triviaGameData[messageId] || !triviaGameData[messageId].activo) return false

    const juegoActual = triviaGameData[messageId]

    // Inicializar jugador si es primera vez
    if (!juegoActual.participantes[userId]) {
        juegoActual.participantes[userId] = {
            racha: 0,
            oportunidades: 1 // 1 error permitido por pregunta
        }
    }

    const jugador = juegoActual.participantes[userId]

    // Obtener respuesta
    let respuestaUsuario = m.text.toLowerCase().trim()
    let respuestaCorrecta = juegoActual.pregunta.respuesta.toLowerCase()

    // Verificar respuesta
    if (respuestaUsuario === respuestaCorrecta || respuestaUsuario.includes(respuestaCorrecta)) {
        // ¡CORRECTO!
        jugador.racha++
        jugador.oportunidades = 1 // Resetear oportunidades

        if (jugador.racha >= 10) {
            // ¡GANÓ EL JUEGO!
            user.torucoin += 100
            user.toruexp += 100

            let mensajeVictoria = `🎉  ¡Felicidades, completaste las preguntas!

> *Recompensas:*
${toem} *${currency}* : +100
${toem2} *${currency2}* : +100

> ${textbot}`

            await this.sendMessage(m.chat, { text: mensajeVictoria }, { quoted: m })
            delete triviaGameData[messageId]

        } else {
            // Siguiente pregunta
            const preguntas = [
                { id: 1, pregunta: "¿Cuál es la capital de Francia?", respuesta: "paris", pista: "Ciudad de la Torre Eiffel" },
                { id: 2, pregunta: "¿Cuántos continentes hay?", respuesta: "7", pista: "Un número impar" },
                { id: 3, pregunta: "¿Quién pintó la Mona Lisa?", respuesta: "leonardo da vinci", pista: "Artista italiano del Renacimiento" },
                { id: 4, pregunta: "¿Cuál es el planeta más grande del sistema solar?", respuesta: "jupiter", pista: "Gigante gaseoso" },
                { id: 5, pregunta: "¿En qué año llegó el hombre a la luna?", respuesta: "1969", pista: "Década de los 60" },
                { id: 6, pregunta: "¿Cuál es el océano más grande?", respuesta: "pacifico", pista: "Está entre América y Asia" },
                { id: 7, pregunta: "¿Cuántos días tiene un año bisiesto?", respuesta: "366", pista: "Uno más que 365" },
                { id: 8, pregunta: "¿Cuál es el animal terrestre más rápido?", respuesta: "guepardo", pista: "Felino africano" },
                { id: 9, pregunta: "¿Quién escribió Don Quijote?", respuesta: "cervantes", pista: "Escritor español" },
                { id: 10, pregunta: "¿Cuál es el metal más abundante en la Tierra?", respuesta: "aluminio", pista: "Empieza con A" },
                { id: 11, pregunta: "¿Cuántos huesos tiene el cuerpo humano adulto?", respuesta: "206", pista: "Más de 200" },
                { id: 12, pregunta: "¿Cuál es el río más largo del mundo?", respuesta: "amazonas", pista: "Está en Sudamérica" },
                { id: 13, pregunta: "¿En qué país se encuentra la Torre Eiffel?", respuesta: "francia", pista: "País europeo" },
                { id: 14, pregunta: "¿Cuál es el idioma más hablado del mundo?", respuesta: "chino", pista: "Idioma asiático" },
                { id: 15, pregunta: "¿Cuántos lados tiene un hexágono?", respuesta: "6", pista: "Menos de 10" },
                { id: 16, pregunta: "¿Quién fue el primer presidente de USA?", respuesta: "george washington", pista: "Su apellido es una ciudad" },
                { id: 17, pregunta: "¿Cuál es el animal más grande del mundo?", respuesta: "ballena azul", pista: "Vive en el océano" },
                { id: 18, pregunta: "¿En qué continente está Egipto?", respuesta: "africa", pista: "Tierra de las pirámides" },
                { id: 19, pregunta: "¿Cuántos minutos tiene una hora?", respuesta: "60", pista: "Número redondo" },
                { id: 20, pregunta: "¿Cuál es la montaña más alta del mundo?", respuesta: "everest", pista: "Está en el Himalaya" },
                { id: 21, pregunta: "¿Qué gas respiran las plantas?", respuesta: "dioxido de carbono", pista: "CO2" },
                { id: 22, pregunta: "¿Cuántas patas tiene una araña?", respuesta: "8", pista: "Menos de 10" },
                { id: 23, pregunta: "¿Cuál es la capital de España?", respuesta: "madrid", pista: "Ciudad del Real Madrid" },
                { id: 24, pregunta: "¿Quién inventó la bombilla?", respuesta: "thomas edison", pista: "Inventor estadounidense" },
                { id: 25, pregunta: "¿Cuál es el planeta más cercano al Sol?", respuesta: "mercurio", pista: "También es un metal líquido" },
                { id: 26, pregunta: "¿Cuántos jugadores tiene un equipo de fútbol?", respuesta: "11", pista: "Once" },
                { id: 27, pregunta: "¿En qué país se inventó el papel?", respuesta: "china", pista: "País asiático antiguo" },
                { id: 28, pregunta: "¿Cuál es el color que resulta de mezclar azul y amarillo?", respuesta: "verde", pista: "Color de la naturaleza" },
                { id: 29, pregunta: "¿Cuántos grados tiene un ángulo recto?", respuesta: "90", pista: "Noventa" },
                { id: 30, pregunta: "¿Cuál es la capital de Italia?", respuesta: "roma", pista: "Ciudad del Coliseo" },
                { id: 31, pregunta: "¿Qué órgano bombea la sangre?", respuesta: "corazon", pista: "Símbolo del amor" },
                { id: 32, pregunta: "¿Cuántas estaciones tiene el año?", respuesta: "4", pista: "Cuatro" },
                { id: 33, pregunta: "¿Quién descubrió América?", respuesta: "cristobal colon", pista: "Navegante genovés" },
                { id: 34, pregunta: "¿Cuál es el metal precioso más valioso?", respuesta: "oro", pista: "Amarillo brillante" },
                { id: 35, pregunta: "¿Cuántos segundos tiene un minuto?", respuesta: "60", pista: "Sesenta" },
                { id: 36, pregunta: "¿En qué país está la Gran Muralla?", respuesta: "china", pista: "País asiático" },
                { id: 37, pregunta: "¿Cuál es el deporte más popular del mundo?", respuesta: "futbol", pista: "Se juega con los pies" },
                { id: 38, pregunta: "¿Cuántos colores tiene el arcoíris?", respuesta: "7", pista: "Siete" },
                { id: 39, pregunta: "¿Cuál es la capital de Japón?", respuesta: "tokio", pista: "Ciudad del anime" },
                { id: 40, pregunta: "¿Qué animal es el rey de la selva?", respuesta: "leon", pista: "Felino con melena" },
                { id: 41, pregunta: "¿Cuántos meses tiene el año?", respuesta: "12", pista: "Doce" },
                { id: 42, pregunta: "¿Cuál es el país más grande del mundo?", respuesta: "rusia", pista: "Está en Europa y Asia" },
                { id: 43, pregunta: "¿Qué instrumento tiene 88 teclas?", respuesta: "piano", pista: "Instrumento de música clásica" },
                { id: 44, pregunta: "¿Cuál es la capital de México?", respuesta: "ciudad de mexico", pista: "CDMX" },
                { id: 45, pregunta: "¿Cuántos lados tiene un triángulo?", respuesta: "3", pista: "Tres" },
                { id: 46, pregunta: "¿Qué planeta es conocido como el planeta rojo?", respuesta: "marte", pista: "Cuarto planeta" },
                { id: 47, pregunta: "¿Cuántas letras tiene el alfabeto español?", respuesta: "27", pista: "Entre 20 y 30" },
                { id: 48, pregunta: "¿Cuál es el animal nacional de Australia?", respuesta: "canguro", pista: "Salta mucho" },
                { id: 49, pregunta: "¿En qué continente está Brasil?", respuesta: "america del sur", pista: "Sudamérica" },
                { id: 50, pregunta: "¿Cuál es la moneda de Estados Unidos?", respuesta: "dolar", pista: "USD $" }
            ]

            const nuevaPregunta = preguntas[Math.floor(Math.random() * preguntas.length)]
            juegoActual.pregunta = nuevaPregunta

            let mensajeSiguiente = `✅  ¡Correcto! subiste en *${jugador.racha}/10* y con *${jugador.oportunidades}* oportunidad.

▢ ❓ *Siguiente Pregunta:*
> ${nuevaPregunta.pregunta}

▢ ✏️ *Pista:*
> ${nuevaPregunta.pista}

📍 \`\`\`Responda este mensaje...\`\`\``

            await this.sendMessage(m.chat, { text: mensajeSiguiente }, { quoted: m })
        }

    } else {
        // INCORRECTO
        jugador.oportunidades--

        if (jugador.oportunidades <= 0) {
            // PERDIÓ LA RACHA
            user.torucoin -= 10
            if (user.torucoin < 0) user.torucoin = 0

            let mensajeDerrota = `📍  *Perdiste en ${jugador.racha}/10*
- La respuesta era: *${juegoActual.pregunta.respuesta}*

⎔ *Penalización:*
${toem} -10 *${currency}*

> ${textbot}`

            await this.sendMessage(m.chat, { text: mensajeDerrota }, { quoted: m })
            delete juegoActual.participantes[userId]

        } else {
            // SEGUNDA OPORTUNIDAD
            let mensajeOportunidad = `❌  La respuesta es incorrecta.
- *Pista asignada:* ${juegoActual.pregunta.pista}

🔑  Ultima oportunidad, si fallas pierdes tu racha.

📍 \`\`\`Responda a este mensaje.\`\`\``

            await this.sendMessage(m.chat, { text: mensajeOportunidad }, { quoted: m })
        }
    }

    return true
}

handler.command = ["racha", "preguntas", "trivia"]
export default handler

