let handler = async (m, { conn, isAdmin }) => {
    if (!m.isGroup) return conn.reply(m.chat, '❌ Este comando solo funciona en grupos.', m)
    if (!isAdmin) return conn.reply(m.chat, '❌ Solo los administradores pueden usar este comando.', m)
    
    let chat = global.db.data.chats[m.chat]
    
    chat.fEnlaces = !chat.fEnlaces
    
    await conn.reply(m.chat, `✅ Anti enlaces ${chat.fEnlaces ? 'activado' : 'desactivado'} correctamente.`, m)
}

handler.command = ['antienlace', 'antilink', 'antilinkwa']
handler.admin = true
handler.group = true

export default handler