import axios from 'axios'
let handler = async (m, { conn, args, command, usedPrefix, text }) => {
let no = "📍  Este comando solo existe en la version *[ óptima, premium ]* de *@T O R U*"

if (command === "new-name") {
return conn.reply(m.chat, no, m)
}

if (command === "new-ch") {
return conn.reply(m.chat, no, m)
}

if (command === "new-menu") {
return conn.reply(m.chat, no, m)
}

if (command === "new-icon") {
return conn.reply(m.chat, no, m)
}

if (command === "new-group") {
return conn.reply(m.chat, no, m)
}

if (command === "new-link") {
return conn.reply(m.chat, no, m)
}

if (command === "") {
return conn.reply(m.chat, no, m)
}

}
handler.command = [
"",
"",
"",
"",
"",
""
]
export default handler
