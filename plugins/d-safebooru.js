import * as cheerio from 'cheerio'
const _baileys = await import('@whiskeysockets/baileys')
const generateWAMessageFromContent = _baileys.generateWAMessageFromContent || _baileys.default?.generateWAMessageFromContent
const generateWAMessage = _baileys.generateWAMessage || _baileys.default?.generateWAMessage

const BASE_URL = 'https://safebooru.org'

class SafebooruScraper {
constructor() {
this.client = null
}

async init() {
const { gotScraping } = await import('got-scraping')
this.client = gotScraping.extend({
timeout: { request: 30000 },
retry: { limit: 3 }
})
}

async searchPosts(tags, limit = 100, page = 0) {
const url = `${BASE_URL}/index.php?page=dapi&s=post&q=index&tags=${encodeURIComponent(tags)}&limit=${limit}&pid=${page}`
const response = await this.client.get(url)
const $ = cheerio.load(response.body, { xmlMode: true })

const posts = []
$('post').each((i, el) => {
posts.push({
id: $(el).attr('id'),
file_url: $(el).attr('file_url'),
sample_url: $(el).attr('sample_url'),
preview_url: $(el).attr('preview_url'),
tags: $(el).attr('tags'),
width: parseInt($(el).attr('width')) || 0,
height: parseInt($(el).attr('height')) || 0,
score: parseInt($(el).attr('score')) || 0
})
})
return posts
}

async getImageBuffer(imageUrl) {
const response = await this.client.get(imageUrl, { responseType: 'buffer' })
return response.rawBody
}
}

async function sendAlbumMessage(conn, jid, medias, options = {}) {
if (medias.length < 2) throw new RangeError("Se necesitan al menos 2 imágenes para un álbum")

const caption = options.text || options.caption || ""
const delay = !isNaN(options.delay) ? options.delay : 500
const quoted = options.quoted || undefined
delete options.text
delete options.caption
delete options.delay
delete options.quoted

const album = generateWAMessageFromContent(
jid,
{ messageContextInfo: {}, albumMessage: { expectedImageCount: medias.length } },
{}
)

await conn.relayMessage(album.key.remoteJid, album.message, { messageId: album.key.id })

for (let i = 0; i < medias.length; i++) {
const { type, data } = medias[i]
const img = await generateWAMessage(
album.key.remoteJid,
{ [type]: data, ...(i === 0 ? { caption } : {}) },
{ upload: conn.waUploadToServer }
)
img.message.messageContextInfo = {
messageAssociation: { associationType: 1, parentMessageKey: album.key },
}
await conn.relayMessage(img.key.remoteJid, img.message, { messageId: img.key.id })
await new Promise(r => setTimeout(r, delay))
}
return album
}

let handler = async (m, { conn, args, text, usedPrefix, command }) => {

const query = text?.trim() || args?.join(' ')
if (!query) return conn.sendMessage(m.chat, { text: `${mess.example}\n*${usedPrefix + command}* nino nakano` }, { quoted: m })

await m.react('⏰')

let scraper
try {
scraper = new SafebooruScraper()
await scraper.init()
} catch (e) {
return conn.sendMessage(m.chat, { text: e.message }, { quoted: m })
}

try {
const posts = await scraper.searchPosts(query, 10)

if (!posts || posts.length === 0) {
return conn.sendMessage(m.chat, { text: `${mess.nosear}` }, { quoted: m })
}

const validPosts = posts.filter(p => p.file_url || p.sample_url).slice(0, 10)

const imageBuffers = []
for (const post of validPosts) {
try {
const imageUrl = post.sample_url || post.file_url
const buffer = await scraper.getImageBuffer(imageUrl)
imageBuffers.push(buffer)
} catch (imgError) {
await conn.sendMessage(m.chat, { text: `${emoji} No se pudo cargar imágenes...` }, { quoted: m })
}
}

if (imageBuffers.length === 0) {
return conn.sendMessage(m.chat, { text: `${emoji} No se pudo descargar imágenes...` }, { quoted: m })
}

const caption = `· ┄ · ⊸ 𔓕 *Safebooru :  Download*

> ${query} - Safebooru
⩩ *Imagenes* » *${imageBuffers.length}* imagenes
⩩ *Fuente* » Safebooru

> ${textbot}`

if (imageBuffers.length === 1) {
await conn.sendMessage(m.chat, { image: imageBuffers[0], caption }, { quoted: m })
} else {
const images = imageBuffers.map(buffer => ({ type: 'image', data: buffer }))
await sendAlbumMessage(conn, m.chat, images, { caption, quoted: m })
}

} catch (e) {
return conn.sendMessage(m.chat, { text: e.message }, { quoted: m })
}
}

handler.tags = ['descargas']
handler.command = ['safebooru', 'sfb']

export default handler

