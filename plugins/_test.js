import axios from 'axios'
import fetch from 'node-fetch'
let handler = async (m, { conn, usedPrefix, command, text }) => {

await conn.sendMessage(m.chat, {
text: "✨ hola",
footer: "Selecciona una opción:",
buttons: [
{
type: 4,
buttonId: "nativo",
buttonText: { displayText: "🧪 Abrir opciones" },
nativeFlowInfo: {
name: "single_select",
paramsJson: JSON.stringify({
title: "📋 Lista de opciones",
sections: [
{
title: "Acciones disponibles",
highlight_label: "Haz clic abajo",
rows: [
{
title: "🔁 Reiniciar Bot",
description: "tragar semen",
id: "#s"
},
{
title: "📊 Ver Estado",
description: "orgia masiva en la pinche esquina",
id: "#qc"
}
]
}
]
})
}
}
],
headerType: 1,
viewOnce: true
}, { quoted: m });

}

handler.command = ["test"]
export default handler
  
