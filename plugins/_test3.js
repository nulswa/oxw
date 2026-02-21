let handler = async (m, { conn }) => {
  await conn.reply(m.chat, '⏳ Iniciando subida de videos...', m)

  const reacciones = [
    'angry', 'bite', 'blush', 'bored', 'cry', 'cuddle', 'dance', 'happy',
    'hug', 'highfive', 'kiss', 'laugh', 'pat', 'pout', 'punch', 'run',
    'sleep', 'slap', 'smile', 'think', 'wave', 'wink', 'smug', 'handhold',
    'bully', 'lick', 'kill', 'cringe', 'bleh', 'clap', 'love', 'sad', 'scared', 'shy'
  ]

  // APIs disponibles por reaccion
  const apis = [
    async (reaccion) => {
      let r = await fetch(`https://nekos.best/api/v2/${reaccion}?amount=1`)
      let d = await r.json()
      if (!d.results || !d.results[0]) return null
      return d.results[0].url.replace('.gif', '.mp4')
    },
    async (reaccion) => {
      let r = await fetch(`https://api.otakugifs.xyz/gif?reaction=${reaccion}`)
      let d = await r.json()
      if (!d.url) return null
      return d.url.replace('.gif', '.mp4')
    },
    async (reaccion) => {
      let r = await fetch(`https://purrbot.site/api/img/sfw/${reaccion}/gif`)
      let d = await r.json()
      if (!d.link) return null
      return d.link.replace('.gif', '.mp4')
    }
  ]

  const CANTIDAD = 8
  const MAX_SIZE = 5 * 1024 * 1024
  let totalSubidos = 0

  for (let reaccion of reacciones) {
    conn.reply(m.chat, `🎭 Procesando: *${reaccion}*...`, m)
    let subidos = 0

    for (let i = 1; i <= CANTIDAD; i++) {
      let mp4Url = null

      // Intentar cada api hasta obtener una url válida
      for (let api of apis) {
        try {
          mp4Url = await api(reaccion)
          if (mp4Url) break
        } catch (e) {}
      }

      if (!mp4Url) continue

      try {
        let mediaResponse = await fetch(mp4Url)
        let buffer = await mediaResponse.buffer()

        if (buffer.length > MAX_SIZE) continue

        let base64 = buffer.toString('base64')

        let uploadResponse = await fetch('https://adofiles.i11.eu/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: base64,
            filename: `${reaccion}_${i}.mp4`
          })
        })

        let uploadData = JSON.parse(await uploadResponse.text())
        let publicUrl = uploadData.files[0].publicUrl
        totalSubidos++
        subidos++
        conn.reply(m.chat, `✅ ${reaccion} #${i}: ${publicUrl}`, m)

      } catch (e) {}

      await new Promise(r => setTimeout(r, 2000))
    }

    if (subidos === 0) {
      conn.reply(m.chat, `⚠️ No se pudo subir ningún video de *${reaccion}*`, m)
    }
  }

  conn.reply(m.chat, `✅ *Listo!*\n🎭 Reacciones: ${reacciones.length}\n🎞️ Videos totales subidos: ${totalSubidos}`, m)
}

//handler.help = ['subirgifs']
//handler.tags = ['owner']
handler.command = ['subirgifs']
//handler.rowner = true

export default handler


