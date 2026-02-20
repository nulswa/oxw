import { gotScraping } from 'got-scraping'
import { randomUUID } from 'crypto'

const SEGMENT_API = 'https://sdk.photoroom.com/v1/segment'
const PHOTOROOM_PAGE = 'https://www.photoroom.com/tools/background-remover'
const SEGMENT_API_KEY = '10148f33e3f8d09a9b9aa6b775372a4ebf18b938'
const TURNSTILE_SITEKEY = '0x4AAAAAAAApeO5gC2AwBbrW'

const SOLVER_URL = 'https://bypasscf.ryzecodes.xyz/api/bypass/cf-turnstile'

const sleep = ms => new Promise(r => setTimeout(r, ms))

const BROWSER_HEADERS = {
'accept': '*/*',
'accept-language': 'en-US,en;q=0.9',
'sec-ch-ua': '"Not(A:Brand";v="8", "Chromium";v="144", "Google Chrome";v="144"',
'sec-ch-ua-mobile': '?0',
'sec-ch-ua-platform': '"Windows"',
'sec-fetch-dest': 'empty',
'sec-fetch-mode': 'cors',
'sec-fetch-site': 'cross-site',
'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36',
}



function buildMultipartBody(imageBuffer, filename, mime) {
const boundary = '----WebKitFormBoundary' + randomUUID().replace(/-/g, '').slice(0, 16)
const parts = []
parts.push(Buffer.from(
`--${boundary}\r\nContent-Disposition: form-data; name="image_file"; filename="${filename}"\r\nContent-Type: ${mime}\r\n\r\n`
))
parts.push(imageBuffer)
parts.push(Buffer.from(`\r\n--${boundary}--\r\n`))
return { body: Buffer.concat(parts), boundary }
}

function detectarMime(msg) {
const mime = msg.mimetype || msg.msg?.mimetype || ''
if (mime.includes('png')) return { mime: 'image/png', ext: 'png' }
if (mime.includes('webp')) return { mime: 'image/webp', ext: 'webp' }
if (mime.includes('gif')) return { mime: 'image/gif', ext: 'gif' }
return { mime: 'image/jpeg', ext: 'jpg' }
}


async function solveTurnstile(retries = 3) {
for (let i = 0; i < retries; i++) {
try {
const resp = await gotScraping({
url: SOLVER_URL,
method: 'POST',
json: { siteKey: TURNSTILE_SITEKEY, url: PHOTOROOM_PAGE },
headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
timeout: { request: 60000 },
throwHttpErrors: false,
})

let data
try { data = JSON.parse(resp.body) } catch { data = {} }

const token = data.token || data.data?.token || data.result?.token || data.solution?.token
if (token) return token

const taskId = data.taskId || data.id || data.task_id
if (taskId) {
const polled = await pollSolverResult(taskId)
if (polled) return polled
}
} catch {}

if (i < retries - 1) await sleep(3000)
}
return null
}

async function pollSolverResult(taskId, maxPolls = 30) {
for (let i = 0; i < maxPolls; i++) {
await sleep(2000)
try {
const resp = await gotScraping({
url: `${SOLVER_URL}/result/${taskId}`,
method: 'GET',
headers: { 'Accept': 'application/json' },
timeout: { request: 15000 },
throwHttpErrors: false,
})
let data
try { data = JSON.parse(resp.body) } catch { data = {} }

const token = data.token || data.data?.token || data.result?.token || data.solution?.token
if (token) return token
if (data.status === 'failed' || data.error) return null
} catch {}
}
return null
}


async function segmentar(imageBuffer, filename, mime) {
const { body, boundary } = buildMultipartBody(imageBuffer, filename, mime)

const resp = await gotScraping({
url: SEGMENT_API,
method: 'POST',
headers: {
...BROWSER_HEADERS,
'content-type': `multipart/form-data; boundary=${boundary}`,
'origin': 'https://www.photoroom.com',
'referer': PHOTOROOM_PAGE,
'x-api-key': SEGMENT_API_KEY,
'x-captcha': `CLOUDFLARE_${await solveTurnstile()}`,
},
body,
http2: true,
responseType: 'buffer',
timeout: { request: 120000 },
throwHttpErrors: false,
})

return resp
}

async function eliminarFondo(imageBuffer, filename = 'image.png', mime = 'image/png') {
const resp = await segmentar(imageBuffer, filename, mime)

if (resp.statusCode === 200 && resp.headers['content-type']?.includes('image')) {
return resp.body
}

const errText = resp.body.toString('utf-8').slice(0, 200)
throw new Error(`${resp.statusCode}: ${errText}`)
}

let handler = async (m, { conn, usedPrefix, command }) => {
try {
const quoted = m.quoted || m
const isImage = /image\/(png|jpe?g|webp|gif)/.test(quoted.mimetype || quoted.msg?.mimetype || '')

if (!isImage) {
return conn.sendMessage(m.chat, { text: `${emoji} Responda a una imagen para quitar su fondo.` }, { quoted: m })
}

await m.react("⏰")

const imageBuffer = await quoted.download()

if (!imageBuffer || imageBuffer.length < 100) {
return conn.sendMessage(m.chat, { text: `${emoji} No se pudo descargar la imagen...` }, { quoted: m })
}

const { mime, ext } = detectarMime(quoted)
const filename = `image_${Date.now()}.${ext}`
const sizeKB = (imageBuffer.length / 1024).toFixed(1)

const resultado = await eliminarFondo(imageBuffer, filename, mime)

if (!resultado || resultado.length < 50) {
return conn.sendMessage(m.chat, { text: `${mess.fallo}` }, { quoted: m })
}

const resultSizeKB = (resultado.length / 1024).toFixed(1)

let toruWa = `· ┄ · ⊸ 𔓕 *Remove  :  BG*

⩩ *Peso org* : ${sizeKB}KB
⩩ *Resultado* : ${resultSizeKB}KB
⩩ *Formato* : PNG

> ${textbot}`

await conn.sendMessage(m.chat, { image: resultado, toruWa, mimetype: 'image/png' }, { quoted: m })

} catch (error) {
conn.sendMessage(m.chat, { text: `${error.message}` }, { quoted: m })
}
}

handler.tags = ['convertidor']
handler.command = ["removebg", "rbg"]

export default handler

