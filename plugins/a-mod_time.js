const handler = (m) => m
export async function all(m) {
for (const user of Object.values(global.db.data.users)) {
if (user.moderadorTime != 0 && user.moderador) {
if (new Date() * 1 >= user.moderadorTime) {
user.moderadorTime = 0
user.moderador = false
let modXd = `👋🏻  Hola usuario @${usuarioJid}.

- Se ha agotado tu tiempo como usuario moderador, por ende, las funciones de moderador fueron desactivadas para ti.

📍  Puedes realizar una compra para volver a usar comandos exclusivos.`
const JID = Object.keys(global.db.data.users).find((key) => global.db.data.users[key] === user)
const usuarioJid = JID.split`@`[0]
await this.sendMessage(JID, {text: modXd, mentions: [JID]}, {quoted: m })
}}}}
