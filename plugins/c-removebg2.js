import { gotScraping } from 'got-scraping'
import { randomUUID } from 'crypto'

const PUBLIC_JWT = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIiLCJhdWQiOiIiLCJpYXQiOjE1MjMzNjQ4MjQsIm5iZiI6MTUyMzM2NDgyNCwianRpIjoicHJvamVjdF9wdWJsaWNfYzkwNWRkMWMwMWU5ZmQ3NzY5ODNjYTQwZDBhOWQyZjNfT1Vzd2EwODA0MGI4ZDJjN2NhM2NjZGE2MGQ2MTBhMmRkY2U3NyJ9.qvHSXgCJgqpC4gd6-paUlDLFmg0o2DsOvb1EUYPYx_E'
const TOOL = 'removebackgroundimage'
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36'

const HEADERS = {
'accept': 'application/json',
'sec-ch-ua': '"Not(A:Brand";v="8", "Chromium";v="144", "Google Chrome";v="144"',
'sec-ch-ua-mobile': '?0',
'sec-ch-ua-platform': '"Windows"',
'user-agent': UA,
'referer': 'https://www.iloveimg.com/',
'origin': 'https://www.iloveimg.com',
}

function multipart(fields, fileField) {
const boundary = '----WebKitFormBoundary' + randomUUID().replace(/-/g, '').slice(0, 16)
const parts = []
for (const [name, val] of Object.entries(fields)) {
parts.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n${val}\r\n`))
}
if (fileField) {
parts.push(Buffer.from(
`--${boundary}\r\nContent-Disposition: form-data; name="${fileField.name}"; filename="${fileField.filename}"\r\nContent-Type: ${fileField.mime}\r\n\r\n`
))
parts.push(fileField.buffer)
parts.push(Buffer.from('\r\n'))
}
parts.push(Buffer.from(`--${boundary}--\r\n`))
return { body: Buffer.concat(parts), contentType: `multipart/form-data; boundary=${boundary}` }
}

function detectMime(msg) {
const mime = msg.mimetype || msg.msg?.mimetype || ''
if (mime.includes('png')) return { mime: 'image/png', ext: 'png' }
if (mime.includes('webp')) return { mime: 'image/webp', ext: 'webp' }
return { mime: 'image/jpeg', ext: 'jpg' }
}

async function eliminarFondo(imageBuffer, filename = 'image.png', mime = 'image/png') {
const startResp = await gotScraping({
url: 'https://api.iloveimg.com/v1/start/removebackgroundimage',
method: 'GET',
headers: { ...HEADERS, 'authorization': `Bearer ${PUBLIC_JWT}` },
timeout: { request: 30000 }, throwHttpErrors: false,
})
if (startResp.statusCode !== 200) throw new Error(`start falló ${startResp.statusCode}`)
const { server, task } = JSON.parse(startResp.body)

const up = multipart({ task }, { name: 'file', filename, mime, buffer: imageBuffer })
const upResp = await gotScraping({
url: `https://${server}/v1/upload`, method: 'POST',
headers: { ...HEADERS, 'authorization': `Bearer ${PUBLIC_JWT}`, 'content-type': up.contentType },
body: up.body, timeout: { request: 120000 }, throwHttpErrors: false,
})
if (upResp.statusCode !== 200) throw new Error(`upload falló ${upResp.statusCode}`)
const { server_filename } = JSON.parse(upResp.body)

const rb = multipart({ task, server_filename })
await gotScraping({
url: `https://${server}/v1/removebackground`, method: 'POST',
headers: { ...HEADERS, 'Authorization': `Bearer ${PUBLIC_JWT}`, 'Content-Type': rb.contentType },
body: rb.body, responseType: 'buffer',
timeout: { request: 120000 }, throwHttpErrors: false,
})

const pr = multipart({
'packaged_filename': 'iloveimg-background-removed',
'task': task, 'tool': TOOL,
'files[0][server_filename]': server_filename,
'files[0][filename]': filename,
})
const prResp = await gotScraping({
url: `https://${server}/v1/process`, method: 'POST',
headers: { ...HEADERS, 'Authorization': `Bearer ${PUBLIC_JWT}`, 'Content-Type': pr.contentType },
body: pr.body, timeout: { request: 120000 }, throwHttpErrors: false,
})
if (prResp.statusCode !== 200) throw new Error(`process falló ${prResp.statusCode}`)

const dlResp = await gotScraping({
url: `https://${server}/v1/download/${task}`, method: 'GET',
headers: { 'user-agent': UA, 'referer': 'https://www.iloveimg.com/' },
responseType: 'buffer', timeout: { request: 120000 }, throwHttpErrors: false,
})
if (dlResp.statusCode !== 200) throw new Error(`download falló ${dlResp.statusCode}`)
return dlResp.body
}

let handler = async (m, { conn, usedPrefix, command }) => {
try {
const quoted = m.quoted || m
const isImage = /image\/(png|jpe?g|webp)/.test(quoted.mimetype || quoted.msg?.mimetype || '')

if (!isImage) {
return conn.sendMessage(m.chat, { text: `${emoji} Responda a una imagen para remover el fondo.` }, { quoted: m })
}

await m.react("⏰")
//m.reply('> ⏳ *Eliminando fondo de la imagen...*')

const imageBuffer = await quoted.download()
if (!imageBuffer || imageBuffer.length < 100) {
return conn.sendMessage(m.chat, { text: `${emoji} No se pudo descargar la imagen...` }, { quoted: m })
}

const { mime, ext } = detectMime(quoted)
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
await conn.sendMessage(m.chat, { image: resultado, caption: toruWa, mimetype: 'image/png', }, { quoted: m })

} catch (error) {
conn.sendMessage(m.chat, { text: `${error.message}` }, { quoted: m })
}
}

handler.tags = ['convertidor']
handler.command = ["rbg2", "removebg2"]

export default handler
