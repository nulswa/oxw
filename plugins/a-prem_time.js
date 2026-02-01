const handler = (m) => m
export async function all(m) {
for (const user of Object.values(global.db.data.users)) {
if (user.premiumTime != 0 && user.premium) {
if (new Date() * 1 >= user.premiumTime) {
user.premiumTime = 0
user.premium = false
let premXd = `👋🏻  Hola usuario @${usuarioJid}.

- Se ha agotado tu tiempo como usuario premium, por ende, las funciones premium fueron desactivadas para ti.

📍  Puedes realizar una compra para volver a usar comandos exclusivos.`
const JID = Object.keys(global.db.data.users).find((key) => global.db.data.users[key] === user)
const usuarioJid = JID.split`@`[0]
await this.sendMessage(JID, {text: premXd, mentions: [JID]}, {quoted: m })
}}}}
