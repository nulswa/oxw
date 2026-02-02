import fetch from 'node-fetch'
const handler = async (m, { conn, command, args, usedPrefix, text }) => {
if (!global.db.data.chats[m.chat].fTienda && m.isGroup) {
return conn.sendMessage(m.chat, { text: `📍  Los comandos de *[ tienda ]* estan desactivados...` }, { quoted: m })
}
  
const user = global.db.data.users[m.sender] || {};
const name = await conn.getName(m.sender);
const thumb = Buffer.from(await (await fetch(`${global.toruImg}`)).arrayBuffer())
let basico = "523"
let estandar = "873"
let platino = "913"
let premio = "1,024 *(1k)*
let optima = "253"
if (!args[0]) {
let plan = `· ┄ · ⊸ 𔓕 *Plan  :  Server*

📍 "Para contrarar un plan para tener el *bot* en tu chat grupal junto con tus amigos, lo puedes seleccionar a tu preferencia."

\t＃ \`Plan 1\`
● *ARS* : $5,000
● *USD* : $5,00
📆 *Dias* : 25 dias
🌐 *Updates* : Activo
👥 *Grupos* : 1 max

\t＃ \`Plan 2\`
● *ARS* : $8,000
● *USD* : $8,00
📆 *Dias* : 45 dias
🌐 *Updates* : Activo
👤 *Owner* : 1 max
👥 *Grupos* : 1 max

\t＃ \`Plan 3\`
● *ARS* : $10,000
● *USD* : $10,00
📆 *Dias* : 65 dias
💾 *Servidor* : Incluído.
🌐 *Updates* : Activo.
🔑 *Editor* : Activo
👤 *Owner* : 2 max
👥 *Grupos* : 2 max

\t＃ \`Plan 4\`
● *ARS* : $15,000
● *USD* : $15,00
📆 *Dias* : 80 dias
💾 *Servidor* : Incluido.
🌐 *Updates* : Activo
🔑 *Editor* : Activo
🏆 *Premium* : Activo
👤 *Owner* : 3 max
👥 *Grupos* : 5 max

> 📍  Si al querer realizar una compra, consulta con un asistente o al mismo propietario para afirmar el proceso.`.trim();
await conn.sendMessage(m.chat, { text: plan, mentions: [m.sender], contextInfo: { externalAdReply: { title: botname, body: textbot, thumbnail: thumb, sourceUrl: null, mediaType: 1, renderLargerThumbnail: false }}}, { quoted: m });
} else if (args[0] === "1") {
let pland = `\t\t〩 *Plan : Basic* 〩

> *Precios*
▢ *ARS* : $5,000
▢ *USD* : $5,00

> *Detalles:*
📆 *Dias* : 25 dias
🌐 *Updates* : Activo
👥 *Grupos* : 1 max

📍  Usa *${usedPrefix}mp* o *${usedPrefix}pay* para realizar compras.`
return conn.sendMessage(m.chat, { text: pland }, { quoted: m })
} else if (args[0] === "2") {
let pland2 = `\t\t〩 *Plan : Standard* 〩

> *Precios*
▢ *ARS* : $8,000
▢ *USD* : $8,00

> *Detalles:*
📆 *Dias* : 45 dias
🌐 *Updates* : Activo
👤 *Owner* : 1 max
👥 *Grupos* : 1 max

📍  Usa *${usedPrefix}mp* o *${usedPrefix}pay* para realizar compras.`
return conn.sendMessage(m.chat, { text: pland2 }, { quoted: m })
} else if (args[0] === "3") {
let pland3 = `\t\t〩 *Plan : Platinum* 〩

> *Precios*
▢ *ARS* : $10,000
▢ *USD* : $10,00

> *Detalles:*
📆 *Dias* : 65 dias
💾 *Servidor* : Incluído.
🌐 *Updates* : Activo.
🔑 *Editor* : Activo
👤 *Owner* : 2 max
👥 *Grupos* : 2 max

📍  Usa *${usedPrefix}mp* o *${usedPrefix}pay* para realizar compras.`
return conn.sendMessage(m.chat, { text: pland3 }, { quoted: m })
} else if (args[0] === "4") {
let pland4 = `\t\t〩 *Plan : Premium* 〩

> *Precios*
▢ *ARS* : $15,000
▢ *USD* : $15,00

> *Detalles:*
📆 *Dias* : 80 dias
💾 *Servidor* : Incluido.
🌐 *Updates* : Activo
🔑 *Editor* : Activo
🏆 *Premium* : Activo
👤 *Owner* : 3 max
👥 *Grupos* : 5 max

📍  Usa *${usedPrefix}mp* o *${usedPrefix}pay* para realizar compras.`
return conn.sendMessage(m.chat, { text: pland4 }, { quoted: m })
} else if (args[0] === "5") {
let pland5 = `\t\t〩 *Plan : Optima* 〩

> *Precios*
▢ *ARS* : $20,000
▢ *USD* : $20,00

> *Detalles:*
📆 *Dias* : 170 dias
💾 *Servidor* : Incluido.
🌐 *Updates* : Activo
🔑 *Editor* : Activo
🏆 *Premium* : Activo
👤 *Owner* : 5 max
👥 *Grupos* : 5 max

> *Version exclusiva:*
📌 *Optima* : Activo
📌 *Botones* : Activo
📌 *Prefijos* : Personalizado

📍  Usa *${usedPrefix}mp* o *${usedPrefix}pay* para realizar compras.`
return conn.sendMessage(m.chat, { text: pland5 }, { quoted: m })
} else if (args[0] === "stats") {
let estados = `📍  Estadísticas segun las compras de este mes.

• \`Detalles de servidores\`
- Bots comprados segun la API de información:

> *Plan Basic* : ${basico}
> *Plan Standard* : ${estandar}
> *Plan Platinum* : ${platino}
> *Plan Premium* : ${premio}
> *Plan Optima* : ${optima}

> ${textbot}`
return conn.sendMessage(m.chat, { text: estados }, { quoted: m })
} else { 
let noXd = `No hay otra categoria para ver en este comando.`
return conn.sendMessage(m.chat, { text: noXd }, { quoted: m })
 } catch (e) {
conn.sendMessage(m.chat, { text: e.message }, { quoted: m })
 }
};

handler.command = ['plan'];
export default handler;


