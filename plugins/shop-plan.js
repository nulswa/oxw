import fetch from 'node-fetch'
const handler = async (m, { conn, command, args, usedPrefix, text }) => {
if (!global.db.data.chats[m.chat].fTienda && m.isGroup) {
return conn.sendMessage(m.chat, { text: `*[ ⽷ ]*  Los comandos de *tienda* estan desactivados...` }, { quoted: m })
}
  
const user = global.db.data.users[m.sender] || {};
const name = await conn.getName(m.sender);
const thumb = Buffer.from(await (await fetch(`${global.toruImg}`)).arrayBuffer())
let basicoA = "48"
let estandarB = "16"
let platinoC = "14"
let premioD = "25"
let optimaE = "3"
if (!args[0]) {
let plan = `· ┄ · ⊸ 𔓕 *Plan  :  Server*

📍 "Para contrarar un plan para tener el *bot* en tu chat grupal junto con tus amigos, lo puedes seleccionar a tu preferencia."

\t＃ \`Plan 1\`
*ARS* » $5,000
*USD* » $5,00
*Dias* » 25 dias
*Updates* » Activo
*Grupos* » 1 max


\t＃ \`Plan 2\`
*ARS* » $8,000
*USD* » $8,00
*Dias* » 45 dias
*Owner* » 1 max
*Grupos* » 1 max


\t＃ \`Plan 3\`
*ARS* » $10,000
*USD* » $10,00
*Dias* » 75 dias
*Updates* » Activo.
*Editor* » Activo
*Owner* » 2 max
*Grupos* » 2 max


\t＃ \`Plan 4\`
*ARS* » $15,000
*USD* » $15,00
*Dias* » 95 dias
*Updates* » Activo
*Editor* » Activo
*Premium* » Activo
*Owner* » 3 max
*Grupos* » 5 max


> 📍  Si al querer realizar una compra, consulta con un asistente o al mismo propietario para afirmar el proceso.`.trim();
await conn.sendMessage(m.chat, { text: plan, mentions: [m.sender], contextInfo: { externalAdReply: { title: botname, body: textbot, thumbnail: thumb, sourceUrl: null, mediaType: 1, renderLargerThumbnail: false }}}, { quoted: m });
} else if (args[0] === "1") {
let pland = `✦ *¡Plan Basico!*
- *Comprados* » ${basicoA}

> *Precios*
*ARS* » $5,000
*USD* » $5,00

> *Detalles:*
*Dias* » 25 dias
*Updates* » Activo
*Grupos* » 1 max

📍  Usa *${usedPrefix}mp* o *${usedPrefix}pay* para realizar compras.`
return conn.sendMessage(m.chat, { text: pland }, { quoted: m })
} else if (args[0] === "2") {
let plandA = `✦ *¡Plan Standard!*
- *Comprados* » ${estandarB}

> *Precios*
*ARS* » $8,000
*USD* » $8,00

> *Detalles:*
*Dias* » 45 dias
*Updates* » Activo
*Owner* » 1 max
*Grupos* » 1 max

📍  Usa *${usedPrefix}mp* o *${usedPrefix}pay* para realizar compras.`
return conn.sendMessage(m.chat, { text: plandA }, { quoted: m })
} else if (args[0] === "3") {
let plandB = `✦ *¡Plan Platinum!*
- *Comprados* » ${platinoC}

> *Precios*
*ARS* » $10,000
*USD* » $10,00

> *Detalles:*
*Dias* » 65 dias
*Updates* » Activo.
*Editor* » Activo
*Owner* » 2 max
*Grupos* » 2 max

📍  Usa *${usedPrefix}mp* o *${usedPrefix}pay* para realizar compras.`
return conn.sendMessage(m.chat, { text: plandB }, { quoted: m })
} else if (args[0] === "4") {
let plandC = `✦ *¡Plan Premium!*
- *Comprados* » ${premioD}

> *Precios*
*ARS* : $15,000
*USD* : $15,00

> *Detalles:*
*Dias* » 90 dias
*Updates* » Activo
*Editor* » Activo
*Premium* » Activo
*Owner* » 3 max
*Grupos* » 5 max

📍  Usa *${usedPrefix}mp* o *${usedPrefix}pay* para realizar compras.`
return conn.sendMessage(m.chat, { text: plandC }, { quoted: m })
} else if (args[0] === "5") {
let plandD = `✦ *¡Plan Optima!*
- *Comprados* » ${optimaE}

> *Precios*
*ARS* » $20,000
*USD* » $20,00

> *Detalles:*
*Dias* » 170 dias
*Updates* » Activo
*Editor* » Activo
*Premium* » Activo
*Owner* » 5 max
*Grupos* » 5 max

> *Version exclusiva:*
*Optima* » Activo
*Prefijos* » Personalizado
*Sub-Bots* » Activo

📍  Usa *${usedPrefix}mp* o *${usedPrefix}pay* para realizar compras.`
return conn.sendMessage(m.chat, { text: plandD }, { quoted: m })
} else if (args[0] === "stats") {
let estadosX = `📍  Estadísticas segun las compras realizadas hasta el momento.

• \`Detalles de servidores\`
- Bots comprados segun la API de información:

> *Plan Basic* : ${basicoA}
> *Plan Standard* : ${estandarB}
> *Plan Platinum* : ${platinoC}
> *Plan Premium* : ${premioD}
> *Plan Optima* : ${optimaE}

> ${textbot}`
return conn.sendMessage(m.chat, { text: estadosX }, { quoted: m })
} else { 
let noXd = `No hay otra categoria para ver en este comando.`
return conn.sendMessage(m.chat, { text: noXd }, { quoted: m })
 } 
};

handler.command = ['plan'];
handler.tags = ["tienda"];
export default handler;


