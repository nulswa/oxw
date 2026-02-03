let handler = async (m, { args, text, usedPrefix, command }) => {
let user = global.db.data.users[m.sender]
let noXd, datos
const bossWa = `\t\t【 *Boss : RPG* 】
- Elije el tipo de jefe segun tu estadística.

\`\`\`1.  Gorgoth : (lvl_6)
2.  Drakon  : (lvl_14)
3.  Xarath  : (lvl_19)
4.  Thorgrim: (lvl_26)
5.  Lirael  : (lvl_33)
6.  Kraxus  : (lvl_42)
7.  Arachne : (lvl_50)
8.  Zarith  : (lvl_63)
9.  Valthor : (lvl_85)
10. Malakai : (lvl_100)\`\`\`

${mess.example}
*${usedPrefix + command}* 1`

if (!args[0]) {
conn.sendMessage(m.chat, { text: bossWa }, { quoted: m });
} else if (args[0] === "1" || args[0] === "gorgoth") {
if (user.nivele >= 6 ) {
datos = `Batalla finalizada`
return conn.sendMessage(m.chat, { text: datos }, { quoted: m })
} else {
noXd = `No tienes el nivel suficiente.`
return conn.reply(m.chat, noXd, m)
 }
} else {
noXd = `📍 No hay un jefe con esa categoría.`
return conn.sendMessage(m.chat, { text: noXd }, { quoted: m })
 }
}

handler.command = ['boss', 'jefe'];
handler.group = true;
export default handler;

