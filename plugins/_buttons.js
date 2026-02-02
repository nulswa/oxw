import fetch from 'node-fetch'

const handler = async (m, { conn, command, usedPrefix, text }) => {
  
  // URL de la imagen que aparecerá en la lista
  const imageUrl = 'https://i.postimg.cc/QtVfF3Zq/Picsart-26-01-17-02-46-49-331.jpg' // Cambia por tu imagen
  
  // Descargar la imagen
  let imgBuffer;
  try {
    const response = await fetch(imageUrl);
    imgBuffer = await response.buffer();
  } catch (e) {
    conn.sendMessage(m.chat, { text: e.message }, { quoted: m })
    console.error('Error descargando imagen:', e);
  }

  // Definir las secciones de la lista
  const sections = [
    {
      title: "📋 Comandos Principales",
      highlight_label: "Populares",
      rows: [
        {
          header: "Comando de Prueba",
          title: "Ejecutar Test",
          description: "Ejecuta un comando de prueba del sistema",
          id: `${usedPrefix}test`
        },
        {
          header: "Ayuda General",
          title: "Menú de Ayuda",
          description: "Muestra todos los comandos disponibles",
          id: `${usedPrefix}help`
        }
      ]
    },
    {
      title: "🔧 Opciones Avanzadas",
      rows: [
        {
          header: "Lista Secundaria",
          title: "Ver Más Opciones",
          description: "Abre un submenú con más comandos",
          id: `${usedPrefix}submenu`
        },
        {
          header: "Información",
          title: "Acerca del Bot",
          description: "Información detallada del sistema",
          id: `${usedPrefix}info`
        }
      ]
    },
    {
      title: "🌐 Enlaces Externos",
      rows: [
        {
          header: "Página Web",
          title: "Visitar Sitio",
          description: "Abre nuestra página web oficial",
          id: "url:https://ejemplo.com" // Formato especial para URLs
        },
        {
          header: "GitHub",
          title: "Repositorio",
          description: "Ver el código fuente en GitHub",
          id: "url:https://github.com/usuario/repo"
        }
      ]
    }
  ];

  // Enviar la lista interactiva
  await conn.sendInteractiveList(
    m.chat,
    "🤖 *Panel de Control*", // Título del header
    "Selecciona una opción del menú para continuar.\n\nEste es un mensaje de demostración de lista interactiva con botones personalizados.", // Texto del body
    "Ver Opciones 📱", // Texto del botón
    sections,
    imgBuffer, // Imagen
    m
  );
}

handler.command = ["button", "lista", "menu"]
export default handler

