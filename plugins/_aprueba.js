import axios from 'axios';
import fetch from 'node-fetch';

const handler = async (m, { conn, text, args, usedPrefix, command }) => {
const toruYt = await fetch("https://files.catbox.moe/d9picr.jpg");
const thumb = Buffer.from(await toruYt.arrayBuffer());

// ═══════════════════════════════════════
// FAKES QUE SÍ MUESTRAN LA IMAGEN
// ═══════════════════════════════════════

// 1. ESTILO DOCUMENTO ✅ (FUNCIONA)
const fakeDocument = { 
    key: { fromMe: false, participant: "0@s.whatsapp.net", remoteJid: "status@broadcast" }, 
    message: { 
        documentMessage: { 
            url: "https://mmg.whatsapp.net/v/t62.7119-24/12345678_123456789012345_1234567890123456789_n.enc?ccb=11-4&oh=01_Q5AaABCDEFGHIJKLMNOPQRSTUVWXYZ&oe=67890ABC&_nc_sid=5e03e0&mms3=true",
            mimetype: "application/pdf",
            title: "⧿ TORU BOT ⧿", 
            pageCount: 1,
            fileName: "TORU.pdf", 
            jpegThumbnail: thumb 
        }
    }
};

// 2. ESTILO IMAGEN ✅ (FUNCIONA PERFECTAMENTE)
const fakeImage = {
    key: { fromMe: false, participant: "0@s.whatsapp.net", remoteJid: "status@broadcast" },
    message: {
        imageMessage: {
            url: "https://mmg.whatsapp.net/v/t62.7118-24/12345678_123456789012345_1234567890123456789_n.enc?ccb=11-4&oh=01_Q5AaABCDEFGHIJKLMNOPQRSTUVWXYZ&oe=67890ABC&_nc_sid=5e03e0&mms3=true",
            mimetype: "image/jpeg",
            caption: "⧿ TORU BOT ⧿",
            jpegThumbnail: thumb,
            fileLength: 99999999999
        }
    }
};

// 3. ESTILO VIDEO ✅ (FUNCIONA)
const fakeVideo = {
    key: { fromMe: false, participant: "0@s.whatsapp.net", remoteJid: "status@broadcast" },
    message: {
        videoMessage: {
            url: "https://mmg.whatsapp.net/v/t62.7161-24/12345678_123456789012345_1234567890123456789_n.enc?ccb=11-4&oh=01_Q5AaABCDEFGHIJKLMNOPQRSTUVWXYZ&oe=67890ABC&_nc_sid=5e03e0&mms3=true",
            mimetype: "video/mp4",
            caption: "⧿ TORU BOT ⧿",
            jpegThumbnail: thumb,
            fileLength: 99999999999,
            seconds: 60
        }
    }
};

// 4. ESTILO UBICACIÓN ✅ (FUNCIONA)
const fakeLocation = {
    key: { fromMe: false, participant: "0@s.whatsapp.net", remoteJid: "status@broadcast" },
    message: {
        locationMessage: {
            degreesLatitude: 24.121231,
            degreesLongitude: 55.1121221,
            name: "⧿ TORU BOT ⧿",
            address: "Servidor Oficial TORU",
            jpegThumbnail: thumb
        }
    }
};

// 5. ESTILO CONTACTO ✅ (FUNCIONA - pero sin imagen directa)
const fakeContact = {
    key: { fromMe: false, participant: "0@s.whatsapp.net", remoteJid: "status@broadcast" },
    message: {
        contactMessage: {
            displayName: "⧿ TORU BOT ⧿",
            vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;TORU BOT;;;\nFN:⧿ TORU BOT ⧿\nitem1.TEL;waid=5219999999999:+52 1 999 999 9999\nitem1.X-ABLabel:Móvil\nEND:VCARD`
        }
    }
};

// 6. ESTILO PRODUCTO/CATÁLOGO ✅ (BUSINESS - FUNCIONA)
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
                description: "Bot Oficial Premium",
                currencyCode: "USD",
                priceAmount1000: "50000",
                retailerId: "TORU Shop",
                url: "https://github.com"
            },
            businessOwnerJid: "0@s.whatsapp.net"
        }
    }
};

// 7. ESTILO ORDEN ✅ (BUSINESS - FUNCIONA)
const fakeOrder = {
    key: { fromMe: false, participant: "0@s.whatsapp.net", remoteJid: "status@broadcast" },
    message: {
        orderMessage: {
            orderId: "594071700156509",
            thumbnail: thumb,
            itemCount: 100,
            status: "INQUIRY",
            surface: "CATALOG",
            message: "⧿ ORDEN TORU BOT ⧿",
            orderTitle: "Pedido Premium",
            sellerJid: "0@s.whatsapp.net",
            token: "AR6z9PAvPk8Yo1eXsXCj6"
        }
    }
};

// 8. ESTILO GIF ✅ (FUNCIONA)
const fakeGif = {
    key: { fromMe: false, participant: "0@s.whatsapp.net", remoteJid: "status@broadcast" },
    message: {
        videoMessage: {
            url: "https://mmg.whatsapp.net/v/t62.7161-24/12345678_123456789012345_1234567890123456789_n.enc?ccb=11-4&oh=01_Q5AaABCDEFGHIJKLMNOPQRSTUVWXYZ&oe=67890ABC&_nc_sid=5e03e0&mms3=true",
            mimetype: "video/mp4",
            caption: "⧿ TORU GIF ⧿",
            jpegThumbnail: thumb,
            gifPlayback: true,
            fileLength: 99999999999
        }
    }
};

// 9. ESTILO STICKER ✅ (Muestra como sticker)
const fakeSticker = {
    key: { fromMe: false, participant: "0@s.whatsapp.net", remoteJid: "status@broadcast" },
    message: {
        stickerMessage: {
            url: "https://mmg.whatsapp.net/v/t62.15575-24/12345678_123456789012345_1234567890123456789_n.enc?ccb=11-4&oh=01_Q5AaABCDEFGHIJKLMNOPQRSTUVWXYZ&oe=67890ABC&_nc_sid=5e03e0&mms3=true",
            mimetype: "image/webp",
            height: 512,
            width: 512,
            directPath: "/v/t62.15575-24/12345678_123456789012345_1234567890123456789_n.enc?ccb=11-4&oh=01_Q5AaABCDEFGHIJKLMNOPQRSTUVWXYZ&oe=67890ABC&_nc_sid=5e03e0",
            fileEncSha256: thumb,
            isAnimated: false
        }
    }
};

// 10. ESTILO INVOICE/FACTURA ✅ (BUSINESS - FUNCIONA BIEN)
const fakeInvoice = {
    key: { fromMe: false, participant: "0@s.whatsapp.net", remoteJid: "status@broadcast" },
    message: {
        requestPaymentMessage: {
            currencyCodeIso4217: "USD",
            amount1000: 50000,
            requestFrom: "0@s.whatsapp.net",
            noteMessage: {
                extendedTextMessage: {
                    text: "⧿ FACTURA TORU BOT ⧿\n\nPago de servicios premium"
                }
            },
            expiryTimestamp: Date.now() + 86400000,
            amount: {
                value: 50000,
                offset: 1000,
                currencyCode: "USD"
            }
        }
    }
};

// ═══════════════════════════════════════
// USO DEL COMANDO
// ═══════════════════════════════════════

let xd = `╭━━━━━━━━━⬣
┃ 🎨 *ESTILOS DISPONIBLES*
┃
┃ ✅ Los que mejor muestran imagen:
┃ • fakeDocument
┃ • fakeImage 
┃ • fakeVideo
┃ • fakeProduct (Business)
┃ • fakeOrder (Business)
┃ • fakeLocation
┃ • fakeGif
╰━━━━━━━━━⬣`;

// CAMBIA ESTE para probar diferentes estilos
const estiloSeleccionado = fakeOrder; // ⬅️ CAMBIA AQUÍ

await conn.sendMessage(m.chat, { text: xd }, { quoted: estiloSeleccionado });

}
handler.command = ['fake', 'estilos'];
export default handler;
