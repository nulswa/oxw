import axios from 'axios';
import fetch from 'node-fetch';

const handler = async (m, { conn, text, args, usedPrefix, command }) => {
const toruYt = await fetch("https://files.catbox.moe/d9picr.jpg");
const thumb = Buffer.from(await toruYt.arrayBuffer());

// ═══════════════════════════════════════
// DIFERENTES ESTILOS DE FAKES
// ═══════════════════════════════════════

// 1. ESTILO DOCUMENTO (El que ya tienes)
const fakeDocument = { 
    key: { fromMe: false, participant: "0@s.whatsapp.net" }, 
    message: { 
        documentMessage: { 
            title: textbot, 
            fileName: "⧿ TORU ⧿", 
            jpegThumbnail: thumb 
        }
    }
};

// 2. ESTILO CONTACTO
const fakeContact = {
    key: { fromMe: false, participant: "0@s.whatsapp.net" },
    message: {
        contactMessage: {
            displayName: "⧿ TORU BOT ⧿",
            vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;TORU;;;\nFN:TORU BOT\nitem1.TEL;waid=123456789:+1 234 567 89\nitem1.X-ABLabel:Mobile\nEND:VCARD`
        }
    }
};

// 3. ESTILO PRODUCTO/CATÁLOGO (Business)
const fakeProduct = {
    key: { fromMe: false, participant: "0@s.whatsapp.net", remoteJid: "status@broadcast" },
    message: {
        productMessage: {
            product: {
                productImage: {
                    mimetype: "image/jpeg",
                    jpegThumbnail: thumb
                },
                title: "⧿ TORU BOT ⧿",
                description: "Bot Oficial",
                currencyCode: "USD",
                priceAmount1000: "1000",
                retailerId: "TORU",
                url: "https://github.com"
            },
            businessOwnerJid: "0@s.whatsapp.net"
        }
    }
};

// 4. ESTILO ORDEN/PEDIDO (Business Order)
const fakeOrder = {
    key: { fromMe: false, participant: "0@s.whatsapp.net" },
    message: {
        orderMessage: {
            orderId: "123456789",
            thumbnail: thumb,
            itemCount: 1,
            status: "INQUIRY",
            surface: "CATALOG",
            message: "⧿ TORU BOT ⧿",
            sellerJid: "0@s.whatsapp.net",
            token: "AR6z9PAvPk8Yo1"
        }
    }
};

// 5. ESTILO UBICACIÓN
const fakeLocation = {
    key: { fromMe: false, participant: "0@s.whatsapp.net" },
    message: {
        locationMessage: {
            degreesLatitude: 0,
            degreesLongitude: 0,
            name: "⧿ TORU BOT ⧿",
            address: "Servidor Oficial",
            jpegThumbnail: thumb
        }
    }
};

// 6. ESTILO LIVE LOCATION (Ubicación en vivo)
const fakeLiveLocation = {
    key: { fromMe: false, participant: "0@s.whatsapp.net" },
    message: {
        liveLocationMessage: {
            degreesLatitude: 0,
            degreesLongitude: 0,
            caption: "⧿ TORU BOT ⧿",
            sequenceNumber: 1,
            jpegThumbnail: thumb
        }
    }
};

// 7. ESTILO IMAGEN
const fakeImage = {
    key: { fromMe: false, participant: "0@s.whatsapp.net" },
    message: {
        imageMessage: {
            mimetype: "image/jpeg",
            caption: "⧿ TORU BOT ⧿",
            jpegThumbnail: thumb,
            viewOnce: false
        }
    }
};

// 8. ESTILO VIDEO
const fakeVideo = {
    key: { fromMe: false, participant: "0@s.whatsapp.net" },
    message: {
        videoMessage: {
            mimetype: "video/mp4",
            caption: "⧿ TORU BOT ⧿",
            jpegThumbnail: thumb,
            viewOnce: false
        }
    }
};

// 9. ESTILO STICKER
const fakeSticker = {
    key: { fromMe: false, participant: "0@s.whatsapp.net" },
    message: {
        stickerMessage: {
            mimetype: "image/webp",
            isAnimated: false
        }
    }
};

// 10. ESTILO AUDIO/NOTA DE VOZ
const fakeAudio = {
    key: { fromMe: false, participant: "0@s.whatsapp.net" },
    message: {
        audioMessage: {
            mimetype: "audio/ogg; codecs=opus",
            seconds: 60,
            ptt: true // true = nota de voz, false = audio normal
        }
    }
};

// 11. ESTILO GIF
const fakeGif = {
    key: { fromMe: false, participant: "0@s.whatsapp.net" },
    message: {
        videoMessage: {
            mimetype: "video/mp4",
            caption: "⧿ TORU BOT ⧿",
            jpegThumbnail: thumb,
            gifPlayback: true,
            viewOnce: false
        }
    }
};

// 12. ESTILO NEWSLETTER/CANAL (Nuevo)
const fakeNewsletter = {
    key: { fromMe: false, participant: "0@s.whatsapp.net", remoteJid: "status@broadcast" },
    message: {
        newsletterAdminInviteMessage: {
            newsletterJid: "123456789@newsletter",
            newsletterName: "⧿ TORU BOT ⧿",
            jpegThumbnail: thumb,
            caption: "Canal Oficial",
            inviteExpiration: Date.now() + 86400000
        }
    }
};

// 13. ESTILO PAYMENT/PAGO (Business)
const fakePayment = {
    key: { fromMe: false, participant: "0@s.whatsapp.net" },
    message: {
        requestPaymentMessage: {
            currencyCodeIso4217: "USD",
            amount1000: 1000,
            requestFrom: "0@s.whatsapp.net",
            noteMessage: {
                extendedTextMessage: {
                    text: "⧿ TORU BOT ⧿"
                }
            }
        }
    }
};

// 14. ESTILO POLL/ENCUESTA
const fakePoll = {
    key: { fromMe: false, participant: "0@s.whatsapp.net" },
    message: {
        pollCreationMessage: {
            name: "⧿ TORU BOT ⧿",
            options: [
                { optionName: "Opción 1" },
                { optionName: "Opción 2" }
            ],
            selectableOptionsCount: 1
        }
    }
};

// 15. ESTILO LLAMADA/CALL
const fakeCall = {
    key: { fromMe: false, participant: "0@s.whatsapp.net", remoteJid: "status@broadcast" },
    message: {
        callLogMesssage: {
            isVideo: false,
            callOutcome: "1",
            durationSecs: "0",
            callType: "REGULAR",
            participants: [{
                jid: "0@s.whatsapp.net",
                callOutcome: "1"
            }]
        }
    }
};

// ═══════════════════════════════════════
// EJEMPLO DE USO CON DIFERENTES ESTILOS
// ═══════════════════════════════════════

let xd = `Selecciona el estilo que quieres probar:

1. Documento
2. Contacto
3. Producto (Business)
4. Orden (Business)
5. Ubicación
6. Imagen
7. Video
8. Audio
9. Encuesta
10. Newsletter/Canal`;

// Puedes cambiar el fake según lo que necesites:
const estiloSeleccionado = fakeOrder; // Cambia este según el estilo que quieras

await conn.sendMessage(m.chat, { text: xd }, { quoted: estiloSeleccionado });

}
handler.command = ['fake', 'estilos'];
export default handler;

