import axios from 'axios'
import cheerio from 'cheerio'
import FormData from 'form-data'
import fetch from 'node-fetch'

// Función para hacer scraping de DeepAI sin API key
async function editImageDeepAI(imageBuffer, prompt) {
    try {
        // 1. Obtener la página principal para obtener cookies y tokens
        const mainPage = await axios.get('https://deepai.org/machine-learning-model/image-editor', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
                'Referer': 'https://deepai.org/'
            }
        })

        const $ = cheerio.load(mainPage.data)
        
        // Buscar el token CSRF si existe
        const csrfToken = $('meta[name="csrf-token"]').attr('content') || 
                         $('input[name="_token"]').val() || 
                         ''

        // 2. Subir imagen
        const form = new FormData()
        form.append('image', imageBuffer, {
            filename: 'image.jpg',
            contentType: 'image/jpeg'
        })
        form.append('text', prompt)
        
        if (csrfToken) {
            form.append('_token', csrfToken)
        }

        // 3. Hacer la petición de edición
        const response = await axios.post('https://api.deepai.org/api/image-editor', form, {
            headers: {
                ...form.getHeaders(),
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Origin': 'https://deepai.org',
                'Referer': 'https://deepai.org/machine-learning-model/image-editor',
                'Accept': 'application/json'
            },
            validateStatus: () => true // Aceptar cualquier código de estado
        })

        if (response.status === 402 || response.status === 429) {
            throw new Error('DeepAI requiere pago o límite alcanzado. Intenta con otra herramienta.')
        }

        if (response.data && response.data.output_url) {
            return response.data.output_url
        }

        throw new Error('No se pudo obtener la imagen editada')

    } catch (error) {
        console.error('Error en DeepAI Scraper:', error.message)
        throw error
    }
}

// Alternativa: Usar Hugging Face (GRATUITO)
async function editImageHuggingFace(imageBuffer, prompt) {
    try {
        const form = new FormData()
        form.append('inputs', imageBuffer, {
            filename: 'image.jpg',
            contentType: 'image/jpeg'
        })

        const response = await fetch('https://api-inference.huggingface.co/models/timbrooks/instruct-pix2pix', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // Token público de Hugging Face
                ...form.getHeaders()
            },
            body: form
        })

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`)
        }

        const resultBuffer = await response.buffer()
        return resultBuffer

    } catch (error) {
        console.error('Error en HuggingFace:', error.message)
        throw error
    }
}

// Alternativa 2: Usar Replicate (requiere API pero tiene free tier)
async function editImageReplicate(imageBuffer, prompt) {
    try {
        const base64Image = imageBuffer.toString('base64')
        
        const response = await axios.post('https://api.replicate.com/v1/predictions', {
            version: "435061a1b5a4c1e26740464bf786efdfa9cb3a3ac488595a2de23e143fdb0117",
            input: {
                image: `data:image/jpeg;base64,${base64Image}`,
                prompt: prompt,
                num_inference_steps: 20
            }
        }, {
            headers: {
                'Authorization': 'Token r8_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // Token de Replicate
                'Content-Type': 'application/json'
            }
        })

        const predictionId = response.data.id
        
        // Esperar resultado
        let attempts = 0
        while (attempts < 30) {
            await new Promise(resolve => setTimeout(resolve, 2000))
            
            const statusResponse = await axios.get(`https://api.replicate.com/v1/predictions/${predictionId}`, {
                headers: {
                    'Authorization': 'Token r8_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
                }
            })

            if (statusResponse.data.status === 'succeeded') {
                return statusResponse.data.output[0]
            }
            
            if (statusResponse.data.status === 'failed') {
                throw new Error('Predicción falló')
            }
            
            attempts++
        }

        throw new Error('Timeout esperando resultado')

    } catch (error) {
        console.error('Error en Replicate:', error.message)
        throw error
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
                  `*${usedPrefix + command}* Añade un fondo verdoso` 
        }, { quoted: m })
    }

    await m.react?.('⏰')

    try {
        const img = await q.download()

        let outputUrl = null
        let imageBuffer = null

        // Intentar con DeepAI primero
        try {
            outputUrl = await editImageDeepAI(img, prompt)
            
            if (outputUrl) {
                const mediaResponse = await axios.get(outputUrl, { 
                    responseType: 'arraybuffer' 
                })
                imageBuffer = mediaResponse.data
            }
        } catch (deepAIError) {
            console.log('DeepAI falló, intentando alternativa:', deepAIError.message)
            
            // Si DeepAI falla, usar HuggingFace
            try {
                imageBuffer = await editImageHuggingFace(img, prompt)
            } catch (hfError) {
                console.log('HuggingFace falló:', hfError.message)
                throw new Error('Todos los servicios de edición están temporalmente no disponibles')
            }
        }

        if (!imageBuffer) {
            throw new Error('No se pudo generar la imagen editada')
        }

        await conn.sendMessage(m.chat, { 
            image: imageBuffer, 
            caption: `✅ *Imagen editada con éxito*\n\n` +
                     `📝 *Prompt:* ${prompt}\n\n` +
                     `${botname}\n> ${textbot}` 
        }, { quoted: m })

        await m.react?.('✅')

    } catch (e) {
        console.error('Error en editai:', e)
        
        let errorMsg = '❌ Error al editar la imagen.\n\n'
        errorMsg += `⚠️ ${e.message}\n\n`
        errorMsg += `> Intenta de nuevo en unos momentos.`
        
        await conn.sendMessage(m.chat, { text: errorMsg }, { quoted: m })
        await m.react?.('❌')
    }
}

handler.command = ["editai", "editimg", "aiimg"]
export default handler

