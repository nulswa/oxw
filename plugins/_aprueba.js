
import axios from 'axios'
import FormData from 'form-data'

const DEEPAI_API_KEY = '09710739-0dc1-45b7-8b0e-8e899092b08c'
const DEEPAI_API_URL = 'https://api.deepai.org/api/image-editor'

async function editImageWithDeepAI(imageBuffer, prompt) {
    try {
        const form = new FormData()
        form.append('image', imageBuffer, { 
            filename: 'image.jpg', 
            contentType: 'image/jpeg' 
        })
        form.append('text', prompt)

        const response = await axios.post(DEEPAI_API_URL, form, {
            headers: {
                ...form.getHeaders(),
                'api-key': DEEPAI_API_KEY
            }
        })

        if (response.data && response.data.output_url) {
            return response.data.output_url
        }

        throw new Error('No se obtuvo URL de salida de DeepAI')
    } catch (error) {
        console.error('Error en DeepAI:', error.response?.data || error.message)
        throw new Error(error.response?.data?.err || error.message || 'Error al editar imagen')
    }
}

const handler = async (m, { conn, text, args, usedPrefix, command }) => {
    if (!global.db.data.chats[m.chat].fPremium && m.isGroup) {
        return conn.sendMessage(m.chat, { 
            text: `📍 Este comando es exclusivo para el plan *[ Premium ]*\n- Usa *#plan* para ver los planes disponibles.` 
        }, { quoted: m })
    }

    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''

    // Verificar que sea una imagen
    if (!/image\/(jpe?g|png|webp)/.test(mime)) {
        return conn.sendMessage(m.chat, { 
            text: `📍 Responda a una imagen y proporciona un texto para editarla.\n\n` +
                  `⚶ *Ejemplo:*\n` +
                  `*${usedPrefix + command}* Añade un fondo verdoso\n` +
                  `*${usedPrefix + command}* Cambia el cielo a atardecer\n` +
                  `*${usedPrefix + command}* Añade flores en el fondo` 
        }, { quoted: m })
    }

    const prompt = text.trim()
    if (!prompt) {
        return conn.sendMessage(m.chat, { 
            text: `📍 Proporciona un texto para editar la imagen.\n\n` +
                  `⚶ *Ejemplo:*\n` +
                  `*${usedPrefix + command}* Añade un fondo verdoso\n` +
                  `*${usedPrefix + command}* Cambia el color a vintage\n` +
                  `*${usedPrefix + command}* Añade efectos de luz` 
        }, { quoted: m })
    }

    await m.react?.('⏰')

    try {
        // Descargar la imagen
        const img = await q.download()

        // Editar imagen con DeepAI
        const outputUrl = await editImageWithDeepAI(img, prompt)

        // Descargar imagen editada
        const mediaResponse = await axios.get(outputUrl, { 
            responseType: 'arraybuffer' 
        })

        // Enviar imagen editada
        await conn.sendMessage(m.chat, { 
            image: mediaResponse.data, 
            caption: `✅ *Imagen editada con éxito*\n\n` +
                     `📝 *Prompt:* ${prompt}\n\n` +
                     `${botname}\n> ${textbot}` 
        }, { quoted: m })

        await m.react?.('✅')

    } catch (e) {
        console.error('Error en editai:', e)
        
        let errorMsg = '❌ Error al editar la imagen.\n\n'
        
        if (e.message.includes('credits')) {
            errorMsg += '⚠️ Sin créditos disponibles en la API.\n'
        } else if (e.message.includes('Invalid')) {
            errorMsg += '⚠️ Imagen o prompt inválido.\n'
        } else {
            errorMsg += `⚠️ ${e.message}\n`
        }
        
        errorMsg += `\n> Intenta de nuevo o contacta al soporte.`
        
        await conn.sendMessage(m.chat, { text: errorMsg }, { quoted: m })
        await m.react?.('❌')
    }
}

handler.command = ["editai", "editimg", "aiimg"]
export default handler
