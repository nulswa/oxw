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
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        businessMessageForwardInfo: {
            businessOwnerJid: "0@s.whatsapp.net"
        },
        forwardedNewsletterMessageInfo: {
            newsletterJid: "120363200000000000@newsletter",
            newsletterName: "⧿ TORU PREMIUM ⧿",
            serverMessageId: 1
        },
        externalAdReply: {
            showAdAttribution: true,
            title: "⧿ TORU PRO MAX ⧿",
            body: "Sistema Empresarial Avanzado",
            mediaType: 1,
            thumbnailUrl: thumbnailUrl,
            sourceUrl: "https://toru-bot.com",
            renderLargerThumbnail: true,
            containsAutoReply: true
        }
    }
}, { quoted: m });
};
handler.command = ['fake2', 'ads', 'estilos'];
export default handler;
