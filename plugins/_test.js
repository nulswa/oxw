
let handler = async (m, { conn }) => {
  let msg = m.quoted ? m.quoted : m
  let mime = (msg.msg || msg).mimetype || ''

  if (!mime) return conn.reply(m.chat, '❌ Responde a un archivo con *.cdn*', m)

  let esCompatible = /gif|video|image|audio/.test(mime)
  if (!esCompatible) return conn.reply(m.chat, '❌ Formato no compatible. Solo gif, foto, video o audio', m)

  let extension
  if (/gif/.test(mime)) extension = 'gif'
  else if (/mp4|video/.test(mime)) extension = 'mp4'
  else if (/jpeg|jpg/.test(mime)) extension = 'jpg'
  else if (/png/.test(mime)) extension = 'png'
  else if (/webp/.test(mime)) extension = 'webp'
  else if (/ogg|audio/.test(mime)) extension = 'ogg'
  else if (/mp3/.test(mime)) extension = 'mp3'
  else extension = 'bin'

  await conn.reply(m.chat, `⏳ Subiendo archivo *.${extension}*...`, m)

  try {
    let media = await msg.download()
    let nombreArchivo = `archivo_${Date.now()}.${extension}`

    let form = new FormData()
    form.append('files', new Blob([media], { type: mime }), nombreArchivo)
    form.append('expiresIn', 'never')

    let response = await fetch('https://causas-files.vercel.app/upload', {
      method: 'POST',
      body: form
    })

    let data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Error desconocido')

    let publicUrl = data.files[0].publicUrl

    conn.reply(m.chat, `✅ *Subido exitosamente!*\n\n📁 *Archivo:* ${nombreArchivo}\n📦 *Tipo:* ${mime}\n🔗 *URL:*\n${publicUrl}`, m)

  } catch (e) {
    conn.reply(m.chat, `❌ Error al subir: ${e.message}`, m)
  }
}

handler.tags = ['convertidor']
handler.command = ['cdn']

export default handler


