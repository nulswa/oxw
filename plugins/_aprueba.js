
import axios from 'axios'
import fetch from 'node-fetch'

// Pollinations.ai - COMPLETAMENTE GRATUITO
async function editImagePollinations(imageBuffer, prompt) {
    try {
        // Convertir imagen a base64
        const base64Image = imageBuffer.toString('base64')
        const dataUri = `data:image/jpeg;base64,${base64Image}`
        
        // Pollinations acepta prompts directamente en la URL
        const enhancedPrompt = `${prompt}, high quality, detailed, professional edit`
        const encodedPrompt = encodeURIComponent(enhancedPrompt)
        
        // Generar imagen editada
        const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&enhance=true`
        
        const response = await axios.get(imageUrl, {
            responseType: 'arraybuffer',
            timeout: 60000
        })
        
        return response.data
        
    } catch (error) {
        console.error('Error en Pollinations:', error.message)
        throw error
    }
}

// Alternativa 2: Craiyon (anteriormente DALL-E mini) - GRATIS
async function editImageCraiyon(imageBuffer, prompt) {
    try {
        const response = await axios.post('https://api.craiyon.com/v3', {
            prompt: `Edit this image: ${prompt}`,
            negative_prompt: "blurry, low quality, distorted",
            model: "photo",
            token: null
        }, {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 120000 // 2 minutos
        })
        
        if (response.data && response.data.images && response.data.images.length > 0) {
            // Craiyon devuelve base64
            const base64Image = response.data.images[0]
            return Buffer.from(base64Image, 'base64')
        }
        
        throw new Error('No se recibió imagen de Craiyon')
        
    } catch (error) {
        console.error('Error en Craiyon:', error.message)
        throw error
    }
}

// Alternativa 3: Prodia (Stable Diffusion gratuito)
async function editImageProdia(imageBuffer, prompt) {
    try {
        // 1. Subir imagen
        const formData = new FormData()
        formData.append('image', imageBuffer, 'image.jpg')
        
        const uploadResponse = await axios.post('https://api.prodia.com/v1/upload', formData, {
            headers: {
                ...formData.getHeaders()
            }
        })
        
        const imageId = uploadResponse.data.id
        
        // 2. Crear job de edición
        const jobResponse = await axios.post('https://api.prodia.com/v1/sd/transform', {
            imageId: imageId,
            prompt: prompt,
            model: "revAnimated_v122.safetensors [3f4fefd9]",
            steps: 25,
            cfg_scale: 7,
            sampler: "DPM++ 2M Karras"
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        
        const jobId = jobResponse.data.job
        
        // 3. Esperar resultado
        let attempts = 0
        while (attempts < 60) {
            await new Promise(resolve => setTimeout(resolve, 2000))
            
            const statusResponse = await axios.get(`https://api.prodia.com/v1/job/${jobId}`)
            
            if (statusResponse.data.status === 'succeeded') {
                const imageUrl = statusResponse.data.imageUrl
                const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' })
                return imageResponse.data
            }
            
            if (statusResponse.data.status === 'failed') {
                throw new Error('Job failed')
            }
            
            attempts++
        }
        
        throw new Error('Timeout')
        
    } catch (error) {
        console.error('Error en Prodia:', error.message)
        throw error
    }
}

// Alternativa 4: Segmind (Totalmente gratis, sin límites)
async function editImageSegmind(imageBuffer, prompt) {
    try {
        const base64Image = imageBuffer.toString('base64')
        
        const response = await axios.post('https://api.segmind.com/v1/sd1.5-img2img', {
            prompt: prompt,
            negative_prompt: "blurry, bad quality, distorted, ugly",
            image: base64Image,
            samples: 1,
            scheduler: "UniPC",
            num_inference_steps: 25,
            guidance_scale: 7.5,
            strength: 0.7,
            seed: Math.floor(Math.random() * 1000000),
            img_width: 512,
            img_height: 512,
            base64: false
        }, {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': 'free' // Usar endpoint gratuito
            },
            timeout: 60000
        })
        
        if (response.data && response.data.image) {
            // Descargar imagen
            const imageUrl = response.data.image
            const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' })
            return imageResponse.data
        }
        
        throw new Error('No image returned')
        
    } catch (error) {
        console.error('Error en Segmind:', error.message)
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
                  `⚶ *Ejemplos:*\n` +
                  `*${usedPrefix + command}* Añade un fondo verdoso\n` +
                  `*${usedPrefix + command}* Cambia el cielo a atardecer\n` +
                  `*${usedPrefix + command}* Añade flores en el fondo\n` +
                  `*${usedPrefix + command}* Convierte en estilo anime\n` +
                  `*${usedPrefix + command}* Hazlo más colorido` 
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
        let imageBuffer = null
        let servicioUsado = ''

        // Intentar con Pollinations (el más rápido y confiable)
        try {
            console.log('Intentando con Pollinations...')
            imageBuffer = await editImagePollinations(img, prompt)
            servicioUsado = 'Pollinations.ai'
        } catch (pollinationsError) {
            console.log('Pollinations falló:', pollinationsError.message)
            
            // Si Pollinations falla, intentar con Craiyon
            try {
                console.log('Intentando con Craiyon...')
                imageBuffer = await editImageCraiyon(img, prompt)
                servicioUsado = 'Craiyon'
            } catch (craiyonError) {
                console.log('Craiyon falló:', craiyonError.message)
                
                // Si Craiyon falla, intentar con Prodia
                try {
                    console.log('Intentando con Prodia...')
                    imageBuffer = await editImageProdia(img, prompt)
                    servicioUsado = 'Prodia'
                } catch (prodiaError) {
                    console.log('Prodia falló:', prodiaError.message)
                    
                    // Último intento con Segmind
                    console.log('Intentando con Segmind...')
                    imageBuffer = await editImageSegmind(img, prompt)
                    servicioUsado = 'Segmind'
                }
            }
        }

        if (!imageBuffer) {
            throw new Error('Todos los servicios de edición están temporalmente no disponibles')
        }

        await conn.sendMessage(m.chat, { 
            image: imageBuffer, 
            caption: `✅ *Imagen editada con éxito*\n\n` +
                     `📝 *Prompt:* ${prompt}\n` +
                     `🤖 *Servicio:* ${servicioUsado}\n\n` +
                     `${botname}\n> ${textbot}` 
        }, { quoted: m })

        await m.react?.('✅')

    } catch (e) {
        console.error('Error en editai:', e)
        
        let errorMsg = '❌ *Error al editar la imagen*\n\n'
        errorMsg += `⚠️ ${e.message}\n\n`
        errorMsg += `💡 *Consejos:*\n`
        errorMsg += `• Intenta con un prompt más simple\n`
        errorMsg += `• Asegúrate de que la imagen sea clara\n`
        errorMsg += `• Inténtalo de nuevo en unos segundos\n\n`
        errorMsg += `> ${textbot}`
        
        await conn.sendMessage(m.chat, { text: errorMsg }, { quoted: m })
        await m.react?.('❌')
    }
}

handler.command = ["editai", "editimg", "aiimg"]
export default handler
