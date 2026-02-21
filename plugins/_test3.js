import fetch from 'node-fetch' 

let handler = async (m, { conn }) => {
  await conn.reply(m.chat, '⏳ Iniciando subida de gifs...', m)

  const reacciones = [
    'angry', 'bite', 'blush', 'bored', 'cry', 'cuddle', 'dance', 'happy',
    'hug', 'highfive', 'kiss', 'laugh', 'pat', 'pout', 'punch', 'run',
    'sleep', 'slap', 'smile', 'think', 'wave', 'wink', 'smug', 'handhold',
    'bully', 'lick', 'kill', 'cringe', 'bleh', 'clap', 'love', 'sad', 'scared', 'shy'
  ]

  const CANTIDAD = 8
  const MAX_SIZE = 5 * 1024 * 1024
  let totalSubidos = 0

  for (let reaccion of reacciones) {
    conn.reply(m.chat, `🎭 Procesando: *${reaccion}*...`, m)

    for (let i = 1; i <= CANTIDAD; i++) {
      try {
        let gifResponse = await fetch(`https://nekos.best/api/v2/${reaccion}?amount=1`)
        let gifData = await gifResponse.json()
        let gifUrl = gifData.results[0].url

        // Convertir URL de gif a mp4
        let mp4Url = gifUrl.replace('.gif', '.mp4')

        let mediaResponse = await fetch(mp4Url)
        let buffer = await mediaResponse.buffer()

        if (buffer.length > MAX_SIZE) {
          conn.reply(m.chat, `⚠️ ${reaccion} #${i} muy grande (${(buffer.length / 1024 / 1024).toFixed(2)}MB), saltando...`, m)
          continue
        }

        let base64 = buffer.toString('base64')

        let uploadResponse = await fetch('https://adofiles.i11.eu/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: base64,
            filename: `${reaccion}_${i}.mp4`
          })
        })

        let text = await uploadResponse.text()
        let uploadData = JSON.parse(text)
        let publicUrl = uploadData.files[0].publicUrl
        totalSubidos++
        conn.reply(m.chat, `✅ ${reaccion} #${i}: ${publicUrl}`, m)

      } catch (e) {
        conn.reply(m.chat, `❌ Error en ${reaccion} #${i}: ${e.message}`, m)
      }

      await new Promise(r => setTimeout(r, 2000))
    }
  }

  conn.reply(m.chat, `✅ *Listo!*\n🎭 Reacciones: ${reacciones.length}\n🎞️ Videos totales subidos: ${totalSubidos}`, m)
}

//handler.help = ['subirgifs']
//handler.tags = ['owner']
handler.command = ['subirgifs']
//handler.rowner = true

export default handler


