import axios from 'axios';
import fetch from 'node-fetch';

const handler = async (m, { conn, text, args, usedPrefix, command }) => {
const toruYt = await fetch("https://files.catbox.moe/d9picr.jpg");
const thumb = Buffer.from(await toruYt.arrayBuffer());
const thumbnailUrl = "https://files.catbox.moe/d9picr.jpg";

let mensaje = `╭━━━━━━━━━⬣
┃ 🎨 *FAKE STYLES*
┃ 
┃ Prueba de estilos fake
┃ que todos pueden ver
╰━━━━━━━━━⬣`;

// ═══════════════════════════════════════
// 1. EXTERNAL AD REPLY - Anuncio/Enlace ✅
// ═══════════════════════════════════════
await conn.sendMessage(m.chat, { 
    text: mensaje,
    contextInfo: {
        businessMessageForwardInfo: {
            businessOwnerJid: "0@s.whatsapp.net"
        },
        externalAdReply: {
            showAdAttribution: false,
            title: "🛍️ VER CATÁLOGO",
            body: "100+ Productos Disponibles",
            mediaType: 1,
            thumbnailUrl: thumbnailUrl,
            sourceUrl: "https://catalogo.example.com",
            renderLargerThumbnail: true
        }
    }
}, { quoted: m });
};
handler.command = ['fake2', 'ads', 'estilos'];
export default handler;

