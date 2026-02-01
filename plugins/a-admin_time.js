const handler = (m) => m
export async function all(m) {
for (const user of Object.values(global.db.data.users)) {
if (user.administTime != 0 && user.administ) {
if (new Date() * 1 >= user.administTime) {
user.administTime = 0
user.administ = false
let adminXd = `👋🏻  Hola usuario @${usuarioJid}.

- Se ha agotado tu tiempo como usuario administrador del bot, por ende, las funciones de administración fueron desactivadas para ti.

📍  Puedes realizar una compra para volver a usar comandos exclusivos.`
const JID = Object.keys(global.db.data.users).find((key) => global.db.data.users[key] === user)
const usuarioJid = JID.split`@`[0]
await this.sendMessage(JID, {text: adminXd, mentions: [JID]}, {quoted: m })
}}}}
