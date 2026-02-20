const handler = async (m, {conn, isROwner, text}) => {
const datas = global

if (!process.send) return conn.sendMessage(m.chat, { text: 'Dont: node main.js\nDo: node index.js' }, { quoted: m })
const {key} = await conn.sendMessage(m.chat, {text: `${mess.succs}\n- Restart....`}, {quoted: m})
await delay(1000 * 2)
await conn.sendMessage(m.chat, {text: '✅  Delete cache\n🔄  Delete ../process/socket.php...\n🔄  Delete ../sockets/metadata.php...\n🔄  Delete ../whatsapp/conection.py...', edit: key})
await delay(1000 * 2)
await conn.sendMessage(m.chat, {text: '✅  Delete cache\n✅  Delete ../process/socket.php\n🔄  Delete ../sockets/metadata.php...\n🔄  Delete ../whatsapp/conection.py...', edit: key})
await delay(1000 * 4)
await conn.sendMessage(m.chat, {text: '✅  Delete cache\n✅  Delete ../process/socket.php\n✅  Delete ../sockets/metadata.php🔄  Delete ../whatsapp/conection.py...', edit: key})
await delay(1000 * 2)
await conn.sendMessage(m.chat, {text: '✅  Delete cache\n✅  Delete ../process/socket.php\n✅  Delete ../sockets/metadata.php\n✅  Delete ../whatsapp/conection.py', edit: key})
await conn.sendMessage(m.chat, {text: `${mess.succs}\n- Otras carpetas *(temporales)* y archivos innecesarios fueron eliminados...`, edit: key})
//process.send('reset')
process.exit(0)
}

handler.tags = ['propietario']
handler.command = ['restart', 'reiniciar']
handler.owner = true
export default handler

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

