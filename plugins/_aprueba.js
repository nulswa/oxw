import axios from 'axios';
import fetch from 'node-fetch';

const handler = async (m, { conn, text, args, usedPrefix, command }) => {
const toruYt = await fetch("https://files.catbox.moe/d9picr.jpg");
const thumb = Buffer.from(await toruYt.arrayBuffer());
const thumbnailUrl = "https://files.catbox.moe/d9picr.jpg"; // URL de la imagen

// ═══════════════════════════════════════
// FAKES CON contextInfo (Los más completos)
// ═══════════════════════════════════════

// 1. EXTERNAL AD REPLY - Anuncio/Enlace Fake ✅ (EL MÁS USADO)
const fakeAdReply = {
    text: "Este es un mensaje con anuncio fake",
    contextInfo: {
        forwardingScore: 999,
        isForwarded: false,
        externalAdReply: {
            showAdAttribution: true,
            title: "⧿ TORU BOT ⧿",
            body: "Bot Oficial Premium",
            description: "Descripción del bot",
            mediaType: 1, // 1 = imagen, 2 = video
            thumbnailUrl: thumb,
            sourceUrl: "https://github.com/tuusuario",
            renderLargerThumbnail: true,
            containsAutoReply: true
        }
    }
};

// 2. EXTERNAL AD REPLY CON VIDEO ✅
const fakeAdReplyVideo = {
    text: "Mensaje con video fake",
    contextInfo: {
        externalAdReply: {
            showAdAttribution: true,
            title: "⧿ VIDEO TORU ⧿",
            body: "Reproducir video",
            mediaType: 2, // 2 = Video
            thumbnailUrl: thumbnailUrl,
            sourceUrl: "https://youtube.com/watch?v=ejemplo",
            renderLargerThumbnail: true
        }
    }
};

// 3. QUOTED MESSAGE CON IMAGEN ✅
const fakeQuotedImage = {
    text: "Mensaje citando imagen",
    contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        quotedMessage: {
            imageMessage: {
                caption: "⧿ TORU BOT ⧿",
                jpegThumbnail: thumb
            }
        }
    }
};

// 4. BUSINESS MESSAGE - Mensaje de Negocio ✅
const fakeBusinessMessage = {
    text: "Mensaje de negocio",
    contextInfo: {
        businessMessageForwardInfo: {
            businessOwnerJid: "0@s.whatsapp.net"
        },
        externalAdReply: {
            showAdAttribution: true,
            title: "⧿ TORU BUSINESS ⧿",
            body: "Tienda Oficial",
            mediaType: 1,
            thumbnailUrl: thumb,
            sourceUrl: "https://tu-tienda.com",
            renderLargerThumbnail: true
        }
    }
};

// 5. FORWARDED MESSAGE - Mensaje Reenviado ✅
const fakeForwarded = {
    text: "Mensaje reenviado múltiples veces",
    contextInfo: {
        forwardingScore: 9999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: "120363375817704336@newsletter",
            newsletterName: "⧿ CANAL TORU ⧿",
            serverMessageId: 1
        },
        externalAdReply: {
            title: "⧿ TORU CHANNEL ⧿",
            body: "Canal Verificado",
            mediaType: 1,
            thumbnailUrl: thumbnailUrl,
            sourceUrl: "https://whatsapp.com/channel/ejemplo"
        }
    }
};

// 6. PAYMENT/INVOICE MESSAGE - Mensaje de Pago ✅
const fakePaymentMessage = {
    text: "Factura pendiente",
    contextInfo: {
        externalAdReply: {
            showAdAttribution: true,
            title: "💰 Pago Pendiente",
            body: "$50.00 USD",
            mediaType: 1,
            thumbnailUrl: thumb,
            sourceUrl: "https://payment.example.com",
            renderLargerThumbnail: false
        }
    }
};

// 7. CONTACT CARD CON AD ✅
const fakeContactAd = {
    text: "Contacto con anuncio",
    contextInfo: {
        externalAdReply: {
            showAdAttribution: true,
            title: "📱 Agregar Contacto",
            body: "TORU Bot Oficial",
            mediaType: 1,
            thumbnailUrl: thumbnailUrl,
            sourceUrl: "https://wa.me/5219999999999",
            renderLargerThumbnail: true
        }
    }
};

// 8. NEWSLETTER/CHANNEL MESSAGE ✅
const fakeNewsletter = {
    text: "Mensaje desde canal",
    contextInfo: {
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: "120363200000000000@newsletter",
            newsletterName: "⧿ TORU NOTICIAS ⧿",
            serverMessageId: 100
        },
        externalAdReply: {
            title: "📢 Nuevo en el canal",
            body: "Actualización importante",
            mediaType: 1,
            thumbnailUrl: thumbnailUrl,
            renderLargerThumbnail: true
        }
    }
};

// 9. GROUP INVITE FAKE ✅
const fakeGroupInvite = {
    text: "Invitación a grupo",
    contextInfo: {
        externalAdReply: {
            showAdAttribution: false,
            title: "👥 Únete al Grupo",
            body: "Grupo Oficial TORU",
            mediaType: 1,
            thumbnailUrl: thumbnailUrl,
            sourceUrl: "https://chat.whatsapp.com/invitelink",
            renderLargerThumbnail: true
        }
    }
};

// 10. POLL/ENCUESTA CON AD ✅
const fakePollAd = {
    text: "Encuesta con anuncio",
    contextInfo: {
        externalAdReply: {
            showAdAttribution: true,
            title: "📊 Vota Ahora",
            body: "¿Cuál prefieres?",
            mediaType: 1,
            thumbnailUrl: thumbnailUrl,
            renderLargerThumbnail: false
        }
    }
};

// 11. PRODUCT CATALOG CON AD ✅ (BUSINESS)
const fakeProductCatalog = {
    text: "Catálogo de productos",
    contextInfo: {
        businessMessageForwardInfo: {
            businessOwnerJid: "0@s.whatsapp.net"
        },
        externalAdReply: {
            showAdAttribution: true,
            title: "🛍️ Ver Catálogo",
            body: "Productos Disponibles",
            mediaType: 1,
            thumbnailUrl: thumbnailUrl,
            sourceUrl: "https://tu-catalogo.com",
            renderLargerThumbnail: true
        }
    }
};

// 12. STATUS/ESTADO FAKE ✅
const fakeStatus = {
    text: "Mensaje de estado",
    contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        externalAdReply: {
            showAdAttribution: false,
            title: "📸 Estado de TORU",
            body: "Hace 5 minutos",
            mediaType: 1,
            thumbnailUrl: thumbnailUrl,
            renderLargerThumbnail: true
        }
    }
};

// 13. BROADCAST MESSAGE ✅
const fakeBroadcast = {
    text: "Lista de difusión",
    contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        externalAdReply: {
            showAdAttribution: true,
            title: "📣 Difusión TORU",
            body: "Mensaje importante",
            mediaType: 1,
            thumbnailUrl: thumbnailUrl,
            renderLargerThumbnail: false
        }
    }
};

// 14. LIVE LOCATION CON AD ✅
const fakeLiveLocationAd = {
    text: "Ubicación en vivo",
    contextInfo: {
        externalAdReply: {
            showAdAttribution: true,
            title: "📍 Ubicación Actual",
            body: "Ver en mapa",
            mediaType: 1,
            thumbnailUrl: thumbnailUrl,
            sourceUrl: "https://maps.google.com",
            renderLargerThumbnail: true
        }
    }
};

// 15. DOCUMENT CON AD ✅
const fakeDocumentAd = {
    text: "Documento adjunto",
    contextInfo: {
        externalAdReply: {
            showAdAttribution: true,
            title: "📄 Descargar PDF",
            body: "Documento.pdf - 2.5MB",
            mediaType: 1,
            thumbnailUrl: thumbnailUrl,
            sourceUrl: "https://example.com/documento.pdf",
            renderLargerThumbnail: false
        }
    }
};

// 16. COMBO: QUOTED + AD REPLY ✅ (MUY PROFESIONAL)
const fakeCombo = {
    text: "Mensaje combo profesional",
    contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: false,
        externalAdReply: {
            showAdAttribution: true,
            title: "⧿ TORU PRO ⧿",
            body: "Sistema Avanzado",
            mediaType: 1,
            thumbnailUrl: thumbnailUrl,
            sourceUrl: "https://github.com",
            renderLargerThumbnail: true,
            containsAutoReply: true
        },
        quotedMessage: {
            documentMessage: {
                title: "TORU.pdf",
                jpegThumbnail: thumb
            }
        }
    }
};

// ═══════════════════════════════════════
// EJEMPLO DE USO
// ═══════════════════════════════════════

let mensaje = `╭━━━━━━━━━⬣
┃ 🎨 *FAKES DISPONIBLES*
┃
┃ 📱 *Tipo contextInfo:*
┃ • fakeAdReply (Anuncio)
┃ • fakeBusinessMessage
┃ • fakeNewsletter (Canal)
┃ • fakeProductCatalog
┃ • fakePaymentMessage
┃ • fakeCombo (Profesional)
┃
┃ ✅ Todos muestran imagen
╰━━━━━━━━━⬣`;

// PRUEBA DIFERENTES ESTILOS AQUÍ:
await conn.sendMessage(m.chat, fakeCombo, { quoted: m });

}
handler.command = ['fake2', 'ads'];
export default handler;
