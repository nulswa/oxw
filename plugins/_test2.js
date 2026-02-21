let handler = async (m, { conn, usedPrefix, command }) => {

    try {
        m.reply('⚽️ Reiniciando el sistema virtual de Isagi... ✨\n\n🔥 ¡El partido continuará en un momento! 💫')
        setTimeout(() => {
            process.exit(0)
        }, 3000) 
      await conn.reply(m.chat, mess.succs, m)
    } catch (error) {
        console.log(error)
        conn.reply(m.chat, `${error}`, m)
    }
}

//handler.help = ['restart']
//handler.tags = ['owner']
handler.command = ['restart', 'reiniciar'] 
//handler.rowner = true

export default handler
