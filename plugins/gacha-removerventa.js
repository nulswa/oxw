import fs from 'fs';

const ventaFilePath = './src/database/waifusVenta.json';

async function loadVentas() {
return JSON.parse(fs.readFileSync(ventaFilePath, 'utf-8'));
}

async function saveVentas(data) {
fs.writeFileSync(ventaFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

let handler = async (m, { conn, args, usedPrefix, command, participants }) => {
let userId = m.sender;
if (userId.endsWith('@lid') && m.isGroup) {
const pInfo = participants.find(p => p.lid === userId);
if (pInfo && pInfo.id) userId = pInfo.id;
}

if (!args[0]) {
return conn.sendMessage(m.chat, { text: `${mess.example}\n*${usedPrefix + command}* sakura` }, { quoted: m });
}

const nombre = args.join(' ').trim().toLowerCase();

const ventas = await loadVentas();
const venta = ventas.find(v => v.name.toLowerCase() === nombre);

if (!venta) {
return conn.sendMessage(m.chat, { text: `📍  El personaje no esta en venta...` }, { quoted: m })
}

if (venta.vendedor !== userId) {
return conn.sendMessage(m.chat, { text: `📍  No puedes quitar la venta lo que no es tuyo...` }, { quoted: m });
}

const nuevasVentas = ventas.filter(v => v.name.toLowerCase() !== nombre);
await saveVentas(nuevasVentas);
conn.sendMessage(m.chat, { text: `✅  El personaje *( ${venta.name} )* ya no esta en venta.` }, { quoted: m });
};

handler.command = ['vend-', 'vender-'];
handler.group = true;

export default handler;
