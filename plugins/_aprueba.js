const handler = async (m, { conn }) => {  


  await conn.sendMessage(m.chat, {
    "https://files.catbox.moe/jkokln.mp4",
    gifPlayback: true,
    jpegThumbnail: toruMenu,
    caption: text,
    footer: '🧠 BLACK CLOVER SYSTEM ☘️',
    buttons: [
      { buttonId: `${usedPrefix}menurpg`, buttonText: { displayText: '🏛️ M E N U R P G' }, type: 1 },
      { buttonId: `${usedPrefix}code`, buttonText: { displayText: '🕹 ＳＥＲＢＯＴ' }, type: 1 }
    ],
    contextInfo: {
      externalAdReply: {
        title: botname || '𝕭𝖑𝖆𝖈𝖐 𝕮𝖑𝖔𝖛𝖊𝖗 | 𝕳𝖆𝖐 v777 🥷🏻',
        body: 'ִ┊࣪ ˖𝐃𝐞𝐯 • 𝐓𝐡𝐞 𝐂𝐚𝐫𝐥𝐨𝐬 ♱',
        thumbnail: global.toruImg,
        sourceUrl: 'https://github.com/thecarlos19/black-clover-MD',
        mediaType: 1,
        renderLargerThumbnail: false
      }
    }
  }, { quoted: m })


}  

handler.command = ['menulist',]  
handler.tags = ['grupos']  
handler.group = true  

export default handler
