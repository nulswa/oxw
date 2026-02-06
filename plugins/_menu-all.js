import fetch from 'node-fetch'
import { xpRange } from '../lib/levelling.js'
import fs from 'fs'
import moment from 'moment-timezone'
import PhoneNumber from 'awesome-phonenumber'
let handler = async (m, { conn, usedPrefix, args, command, __dirname, participants }) => {
try {
let listaPrincipal = `\`\`\`⧡ menu » all       [0]
⧡ menu » info      [1]
⧡ menu » dls       [2]
⧡ menu » conv      [3]
⧡ menu » search    [4]
⧡ menu » group     [5]
⧡ menu » shop      [6]
⧡ menu » rpg       [7]
⧡ menu » utils     [8]
⧡ menu » stickers  [9]
⧡ menu » logos     [10]
⧡ menu » cc     [11]
⧡ menu » random    [12]
⧡ menu » reac      [13]
⧡ menu » ai        [14]
⧡ menu » editor    [15]
⧡ menu » premium   [16]
⧡ menu » juegos    [17]
⧡ menu » owner     [own]\`\`\``
let menuInfo = `│⧡ *${usedPrefix}anuncios*\n│⧡ *${usedPrefix}ping*\n│⧡ *${usedPrefix}plan*\n│⧡ *${usedPrefix}prems!*\n│⧡ *${usedPrefix}mods!*\n│⧡ *${usedPrefix}admins!*\n│⧡ *${usedPrefix}run*
│⧡ *${usedPrefix}stat*
│⧡ *${usedPrefix}info*
│⧡ *${usedPrefix}creador*
│⧡ *${usedPrefix}canal*
│⧡ *${usedPrefix}donar*
│⧡ *${usedPrefix}mp*
│⧡ *${usedPrefix}bk*
│⧡ *${usedPrefix}pay*
│⧡ *${usedPrefix}speed*
│⧡ *${usedPrefix}support*   [text]
╰────────────────•`
let menuDesc = `│⧡ *${usedPrefix}ytmp3*   [link]
│⧡ *${usedPrefix}ytmp4*   [link]
│⧡ *${usedPrefix}play*   [link/text]
│⧡ *${usedPrefix}facebook*   [link]
│⧡ *${usedPrefix}instagram*   [link]
│⧡ *${usedPrefix}twitter*   [link]
│⧡ *${usedPrefix}tiktok*   [link]
│⧡ *${usedPrefix}spotify*   [link]
│⧡ *${usedPrefix}mediafire*   [link]
│⧡ *${usedPrefix}pinterest*   [link]
│⧡ *${usedPrefix}github*   [link]
│⧡ *${usedPrefix}drive*   [link]
│⧡ *${usedPrefix}sly*   [link]
╰────────────────•`
let menuConv = `│⧡ *${usedPrefix}upload*
│⧡ *${usedPrefix}hd*
│⧡ *${usedPrefix}upmf*   [reply]
│⧡ *${usedPrefix}turl*   [query]
│⧡ *${usedPrefix}timg*   [reply]
│⧡ *${usedPrefix}togif*   [reply]
│⧡ *${usedPrefix}catbox*   [query]
╰────────────────•`
let menuSearch = `│⧡ *${usedPrefix}imagen*   [text]
│⧡ *${usedPrefix}fdroids*   [text]
│⧡ *${usedPrefix}apk*   [text]
│⧡ *${usedPrefix}apples*   [text]
│⧡ *${usedPrefix}yts*   [text]
│⧡ *${usedPrefix}slys*   [text]
│⧡ *${usedPrefix}pinimg*   [text]
│⧡ *${usedPrefix}tenor*   [text]
│⧡ *${usedPrefix}spotifys*   [text]
│⧡ *${usedPrefix}google*   [text]
╰────────────────•`
let menuGroup = `│⧡ *${usedPrefix}enlace*
│⧡ *${usedPrefix}revok*
│⧡ *${usedPrefix}inum*
│⧡ *${usedPrefix}dnum*
│⧡ *${usedPrefix}linea*
│⧡ *${usedPrefix}add*   [nro]
│⧡ *${usedPrefix}kick*   [reply]
│⧡ *${usedPrefix}admin+*   [mention]
│⧡ *${usedPrefix}admin-*   [mention]
│⧡ *${usedPrefix}warn+*   [mention]
│⧡ *${usedPrefix}warn-*   [mention]
│⧡ *${usedPrefix}mute+*   [mention]
│⧡ *${usedPrefix}mute-*   [mention]
│⧡ *${usedPrefix}g-name*   [text]
│⧡ *${usedPrefix}g-desc*   [text]
│⧡ *${usedPrefix}g-img*   [reply]
│⧡ *${usedPrefix}tags*   [text]
╰────────────────•`
let menuShop = `│⧡ *${usedPrefix}plan*
│⧡ *${usedPrefix}plan 1*
│⧡ *${usedPrefix}plan 2*
│⧡ *${usedPrefix}plan 3*
│⧡ *${usedPrefix}plan 4*
│⧡ *${usedPrefix}plan stats*
╰────────────────•`
let menuRpg = `│⧡ *${usedPrefix}aventura*
│⧡ *${usedPrefix}minar*
│⧡ *${usedPrefix}pescar*
│⧡ *${usedPrefix}cofre*
│⧡ *${usedPrefix}curar*
│⧡ *${usedPrefix}nivel*
│⧡ *${usedPrefix}revelar*
│⧡ *${usedPrefix}mercader*
│⧡ *${usedPrefix}work*
│⧡ *${usedPrefix}coins*
│⧡ *${usedPrefix}regalo*
│⧡ *${usedPrefix}cazar*
│⧡ *${usedPrefix}talar*
│⧡ *${usedPrefix}robar*   [reply]
│⧡ *${usedPrefix}pico*   [improve]
│⧡ *${usedPrefix}espada*   [improve]
│⧡ *${usedPrefix}hacha*   [improve]
│⧡ *${usedPrefix}inv*   [reply]
│⧡ *${usedPrefix}rpg*   [query]
│⧡ *${usedPrefix}dep/dep2*   [query]
│⧡ *${usedPrefix}ret/ret2*   [query]
│⧡ *${usedPrefix}shop*   [query]
│⧡ *${usedPrefix}stats*   [reply]
╰────────────────•`
let menuUtils = `│⧡ *${usedPrefix}lid*
│⧡ *${usedPrefix}lids*
│⧡ *${usedPrefix}cid*   [link]
│⧡ *${usedPrefix}fetch*   [link]
│⧡ *${usedPrefix}getpic*   [mention]
│⧡ *${usedPrefix}pais*   [country]
│⧡ *${usedPrefix}hweb*   [link]
╰────────────────•`
let menuStick = `│⧡ *${usedPrefix}exif-*
│⧡ *${usedPrefix}exif+*   [text|text]
│⧡ *${usedPrefix}sticker*   [reply]
│⧡ *${usedPrefix}emojix*   [emoji+emoji]
│⧡ *${usedPrefix}brat*   [text]
│⧡ *${usedPrefix}qc*   [text]
╰────────────────•`
let menuLogos = `│⧡ *${usedPrefix}logo1*   [text]
│⧡ *${usedPrefix}logo2*   [text]
│⧡ *${usedPrefix}logo3*   [text]
│⧡ *${usedPrefix}logo4*   [text]
│⧡ *${usedPrefix}logo5*   [text]
│⧡ *${usedPrefix}logo6*   [text]
│⧡ *${usedPrefix}logo7*   [text]
│⧡ *${usedPrefix}logo8*   [text]
│⧡ *${usedPrefix}logo9*   [text]
│⧡ *${usedPrefix}logo10*   [text]
│⧡ *${usedPrefix}logo11*   [text]
│⧡ *${usedPrefix}logo12*   [text]
│⧡ *${usedPrefix}logo13*   [text]
│⧡ *${usedPrefix}logo14*   [text]
│⧡ *${usedPrefix}logo15*   [text]
│⧡ *${usedPrefix}logo16*   [text]
│⧡ *${usedPrefix}logo17*   [text]
│⧡ *${usedPrefix}logo18*   [text]
│⧡ *${usedPrefix}logo19*   [text]
│⧡ *${usedPrefix}logo20*   [text]
│⧡ *${usedPrefix}logo21*   [text]
│⧡ *${usedPrefix}logo22*   [text]
│⧡ *${usedPrefix}logo23*   [text]
│⧡ *${usedPrefix}logo24*   [text]
│⧡ *${usedPrefix}logo25*   [text]
│⧡ *${usedPrefix}logo26*   [text]
│⧡ *${usedPrefix}logo27*   [text]
│⧡ *${usedPrefix}logo28*   [text]
│⧡ *${usedPrefix}logo29*   [text]
│⧡ *${usedPrefix}logo30*   [text]
│⧡ *${usedPrefix}logo31*   [text]
│⧡ *${usedPrefix}logo32*   [text]
│⧡ *${usedPrefix}logo33*   [text]
│⧡ *${usedPrefix}logo34*   [text]
│⧡ *${usedPrefix}logo35*   [text]
│⧡ *${usedPrefix}logo36*   [text]
│⧡ *${usedPrefix}logo37*   [text]
╰────────────────•`
let menuColec = `│⧡ *${usedPrefix}cs*
│⧡ *${usedPrefix}cpay*   [name]
│⧡ *${usedPrefix}dinfo*   [name/id]
│⧡ *${usedPrefix}vender*   [name]
│⧡ *${usedPrefix}comprar*   [name]
╰────────────────•`
let menuRandom = `│⧡ *${usedPrefix}wallp*
│⧡ *${usedPrefix}rd messi*
│⧡ *${usedPrefix}rd cr7*
│⧡ *${usedPrefix}rd bts*
│⧡ *${usedPrefix}rd navidad*
│⧡ *${usedPrefix}rd hallowen*
│⧡ *${usedPrefix}rd itzy*
│⧡ *${usedPrefix}rd universo*
╰────────────────•`
let menuReac = `│⧡ *${usedPrefix}angry*   [mention]
│⧡ *${usedPrefix}bath*   [mention]
│⧡ *${usedPrefix}bite*   [mention]
│⧡ *${usedPrefix}bleh*   [mention]
│⧡ *${usedPrefix}blush*   [mention]
│⧡ *${usedPrefix}boted*   [mention]
│⧡ *${usedPrefix}clap*   [mention]
│⧡ *${usedPrefix}coffee*   [mention]
│⧡ *${usedPrefix}cry*   [mention]
│⧡ *${usedPrefix}cuddle*   [mention]
│⧡ *${usedPrefix}dance*   [mention]
│⧡ *${usedPrefix}drunk*   [mention]
│⧡ *${usedPrefix}eat*   [mention]
│⧡ *${usedPrefix}facepalm*   [mention]
│⧡ *${usedPrefix}hug*   [mention]
│⧡ *${usedPrefix}kill*   [mention]
│⧡ *${usedPrefix}kiss*   [mention]
│⧡ *${usedPrefix}laugh*   [mention]
│⧡ *${usedPrefix}lick*   [mention]
│⧡ *${usedPrefix}slap*   [mention]
│⧡ *${usedPrefix}sleep*   [mention]
│⧡ *${usedPrefix}smoke*   [mention]
│⧡ *${usedPrefix}spit*   [mention]
│⧡ *${usedPrefix}step*   [mention]
│⧡ *${usedPrefix}think*   [mention]
│⧡ *${usedPrefix}love*   [mention]
│⧡ *${usedPrefix}pat*   [mention]
│⧡ *${usedPrefix}poke*   [mention]
│⧡ *${usedPrefix}pout*   [mention]
│⧡ *${usedPrefix}punch*   [mention]
│⧡ *${usedPrefix}preg*   [mention]
│⧡ *${usedPrefix}sprint*   [mention]
│⧡ *${usedPrefix}sad*   [mention]
│⧡ *${usedPrefix}scared*   [mention]
│⧡ *${usedPrefix}seduce*   [mention]
│⧡ *${usedPrefix}shu*   [mention]
│⧡ *${usedPrefix}walk*   [mention]
│⧡ *${usedPrefix}dramatic*   [mention]
│⧡ *${usedPrefix}kisscheek*   [mention]
│⧡ *${usedPrefix}wink*   [mention]
│⧡ *${usedPrefix}cringe*   [mention]
│⧡ *${usedPrefix}smug*   [mention]
│⧡ *${usedPrefix}smile*   [mention]
│⧡ *${usedPrefix}mano*   [mention]
│⧡ *${usedPrefix}bullying*   [mention]
│⧡ *${usedPrefix}wave*   [mention]
╰────────────────•`
let menuAi = `│⧡ *${usedPrefix}toru*   [text]
│⧡ *${usedPrefix}codex*   [text]
│⧡ *${usedPrefix}venice*   [text]
│⧡ *${usedPrefix}imagina*   [text]
╰────────────────•`
let menuEdit = `│⧡ *${usedPrefix}new-name*   [text]
│⧡ *${usedPrefix}new-desc*   [text]
│⧡ *${usedPrefix}new-ch*   [link]
│⧡ *${usedPrefix}new-group*   [link]
│⧡ *${usedPrefix}new-icon*   [reply]
│⧡ *${usedPrefix}new-menu*   [reply]
╰────────────────•`
let menuPrem = `│⧡ *${usedPrefix}temblor*
│⧡ *${usedPrefix}rv*   [reply]
│⧡ *${usedPrefix}aivid*   [text]
│⧡ *${usedPrefix}aivid2*   [text]
│⧡ *${usedPrefix}txtimg*   [text]
│⧡ *${usedPrefix}editai*   [reply]
│⧡ *${usedPrefix}clima*   [query]
╰────────────────•`
let menuJuegos = `│⧡ *${usedPrefix}wix*
╰────────────────•`
let menuOwn = `│⧡ *${usedPrefix}fix*
│⧡ *${usedPrefix}err*
│⧡ *${usedPrefix}xbot*
│⧡ *${usedPrefix}++admin*
│⧡ *${usedPrefix}wx-*   [query]
│⧡ *${usedPrefix}-prem*   [mention]
│⧡ *${usedPrefix}-mod*   [mention]
│⧡ *${usedPrefix}-admin*   [mention]
│⧡ *${usedPrefix}gplug*   [query]
│⧡ *${usedPrefix}file+*   [query]
│⧡ *${usedPrefix}file-*   [query]
│⧡ *${usedPrefix}ban+*   [mention]
│⧡ *${usedPrefix}ban-*   [mention]
│⧡ *${usedPrefix}block+*   [mention]
│⧡ *${usedPrefix}block-*   [mention]
│⧡ *${usedPrefix}bot-name*   [text]
│⧡ *${usedPrefix}bot-img*   [reply]
│⧡ *${usedPrefix}bot-desc*   [text]
╰────────────────•`

const user = global.db.data.users[m.sender] || {}
const name = await conn.getName(m.sender)
const thumbBot = Buffer.from(await (await fetch(`${global.toruMenu}`)).arrayBuffer())
const thumbBot2 = Buffer.from(await (await fetch(`${global.toruImg}`)).arrayBuffer())
const premium = user.premium ? '✓' : '✘'
const torucoin = user.torucoin || 0
const totalreg = Object.keys(global.db.data.users).length
const groupUserCount = m.isGroup ? participants.length : '-'
const groupsCount = Object.values(conn.chats).filter(v => v.id.endsWith('@g.us')).length
const uptime = clockString(process.uptime() * 1000)
const dFormato = new Date(new Date + 3600000)
const fecha = new Date(Date.now())
const locale = 'es-AR'
const dia = fecha.toLocaleDateString(locale, { weekday: 'long' })
const fechaTxt = fecha.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
const hora = `${moment.tz('America/Buenos_Aires').format('HH:mm:ss')}`
const totalCommands = Object.keys(global.plugins).length
const userId = m.sender.split('@')[0]
const phone = PhoneNumber('+' + userId)
const pais = phone.getRegionCode() || 'Desconocido'
const perfil = await conn.profilePictureUrl(conn.user.jid, 'image').catch(() => `${ifoto}`)

await m.react("📍")
if (!args[0]) {
let menu = `> ${hora}, ${dia} ${fechaTxt}

〝👋🏻  Bot automático via *(WhatsApp/Business)*, puede obtener información/datos o otras ventajas para proporcionar un uso util para todo usuario.〞

⧨ Modo : *Privado*
🜲 Usuario : @${name}
＃ Prefix : *(/ ! # - .)*
✦ Version : *${vs}*
⎋ URL : ${botweb}
${readMore}
\t〩 \`Categorias:\`
${listaPrincipal}

\t⚶ Por ejemplo:
*#menu info*`
return conn.sendMessage(m.chat, { text: menu, contextInfo: { forwardingScore: 1, isForwarded: false, externalAdReply: { showAdAttribution: false, renderLargerThumbnail: false, title: botname, body: textbot, containsAutoReply: true, mediaType: 1, thumbnailUrl: global.toruImg, sourceUrl: botweb }}}, { quoted: m })
} else if (args[0] === 'info' || args[0] === '1') {
let categoInfo = `> ${hora}, ${dia} ${fechaTxt}

⧨ Modo : *Privado*
🜲 Usuario : @${name}
＃ Prefix : *(/ ! # - .)*
✦ Version : *${vs}*
${readMore}
╭•[ 𔒝 ] ⧿ \`Informacion\`
${menuInfo}

> ${textbot}`
return conn.sendMessage(m.chat, { text: categoInfo, mentions: [m.sender], contextInfo: { externalAdReply: { title: botname, body: textbot, thumbnail: thumbBot, sourceUrl: null, mediaType: 1, renderLargerThumbnail: true }}}, { quoted: m })
} else if (args[0] === 'dls' || args[0] === '2') {
let categoDesc = `> ${hora}, ${dia} ${fechaTxt}

⧨ Modo : *Privado*
🜲 Usuario : @${name}
＃ Prefix : *(/ ! # - .)*
✦ Version : *${vs}*
${readMore}
╭•[ 𔒝 ] ⧿ \`Descargadores\`
${menuDesc}

> ${textbot}`
return conn.sendMessage(m.chat, { text: categoDesc, mentions: [m.sender], contextInfo: { externalAdReply: { title: botname, body: textbot, thumbnail: thumbBot, sourceUrl: null, mediaType: 1, renderLargerThumbnail: true }}}, { quoted: m })
} else if (args[0] === 'conv' || args[0] === '3') {
let categoConv = `> ${hora}, ${dia} ${fechaTxt}

⧨ Modo : *Privado*
🜲 Usuario : @${name}
＃ Prefix : *(/ ! # - .)*
✦ Version : *${vs}*
${readMore}
╭•[ 𔒝 ] ⧿ \`Convertidor\`
${menuConv}

> ${textbot}`
return conn.sendMessage(m.chat, { text: categoConv, mentions: [m.sender], contextInfo: { externalAdReply: { title: botname, body: textbot, thumbnail: thumbBot, sourceUrl: null, mediaType: 1, renderLargerThumbnail: true }}}, { quoted: m })
} else if (args[0] === 'search' || args[0] === '4') {
let categoSearch = `> ${hora}, ${dia} ${fechaTxt}

⧨ Modo : *Privado*
🜲 Usuario : @${name}
＃ Prefix : *(/ ! # - .)*
✦ Version : *${vs}*
${readMore}
╭•[ 𔒝 ] ⧿ \`Buscador\`
${menuSearch}

> ${textbot}`
return conn.sendMessage(m.chat, { text: categoSearch, mentions: [m.sender], contextInfo: { externalAdReply: { title: botname, body: textbot, thumbnail: thumbBot, sourceUrl: null, mediaType: 1, renderLargerThumbnail: true }}}, { quoted: m })
} else if (args[0] === 'group' || args[0] === '5') {
let categoGroup = `> ${hora}, ${dia} ${fechaTxt}

⧨ Modo : *Privado*
🜲 Usuario : @${name}
＃ Prefix : *(/ ! # - .)*
✦ Version : *${vs}*
${readMore}
╭•[ 𔒝 ] ⧿ \`Grupos\`
${menuGroup}

> ${textbot}`
return conn.sendMessage(m.chat, { text: categoGroup, mentions: [m.sender], contextInfo: { externalAdReply: { title: botname, body: textbot, thumbnail: thumbBot, sourceUrl: null, mediaType: 1, renderLargerThumbnail: true }}}, { quoted: m })
} else if (args[0] === 'shop' || args[0] === '6') {
let categoShop = `> ${hora}, ${dia} ${fechaTxt}

⧨ Modo : *Privado*
🜲 Usuario : @${name}
＃ Prefix : *(/ ! # - .)*
✦ Version : *${vs}*
${readMore}
╭•[ 𔒝 ] ⧿ \`Beneficios\`
${menuShop}

> ${textbot}`
return conn.sendMessage(m.chat, { text: categoShop, mentions: [m.sender], contextInfo: { externalAdReply: { title: botname, body: textbot, thumbnail: thumbBot, sourceUrl: null, mediaType: 1, renderLargerThumbnail: true }}}, { quoted: m })
} else if (args[0] === 'rpg' || args[0] === '7') {
let categoRpg = `> ${hora}, ${dia} ${fechaTxt}

⧨ Modo : *Privado*
🜲 Usuario : @${name}
＃ Prefix : *(/ ! # - .)*
✦ Version : *${vs}*
${readMore}
╭•[ 𔒝 ] ⧿ \`Juegos RPG\`
${menuRpg}

> ${textbot}`
return conn.sendMessage(m.chat, { text: categoRpg, mentions: [m.sender], contextInfo: { externalAdReply: { title: botname, body: textbot, thumbnail: thumbBot, sourceUrl: null, mediaType: 1, renderLargerThumbnail: true }}}, { quoted: m })
} else if (args[0] === 'utils' || args[0] === '8') {
let categoUtils = `> ${hora}, ${dia} ${fechaTxt}

⧨ Modo : *Privado*
🜲 Usuario : @${name}
＃ Prefix : *(/ ! # - .)*
✦ Version : *${vs}*
${readMore}
╭•[ 𔒝 ] ⧿ \`Ajustes\`
${menuUtils}

> ${textbot}`
return conn.sendMessage(m.chat, { text: categoUtils, mentions: [m.sender], contextInfo: { externalAdReply: { title: botname, body: textbot, thumbnail: thumbBot, sourceUrl: null, mediaType: 1, renderLargerThumbnail: true }}}, { quoted: m })
} else if (args[0] === 'stickers' || args[0] === '9') {
let categoStick = `> ${hora}, ${dia} ${fechaTxt}

⧨ Modo : *Privado*
🜲 Usuario : @${name}
＃ Prefix : *(/ ! # - .)*
✦ Version : *${vs}*
${readMore}
╭•[ 𔒝 ] ⧿ \`Stickers\`
${menuStick}

> ${textbot}`
return conn.sendMessage(m.chat, { text: categoStick, mentions: [m.sender], contextInfo: { externalAdReply: { title: botname, body: textbot, thumbnail: thumbBot, sourceUrl: null, mediaType: 1, renderLargerThumbnail: true }}}, { quoted: m })
} else if (args[0] === 'logos' || args[0] === '10') {
let categoLogos = `> ${hora}, ${dia} ${fechaTxt}

⧨ Modo : *Privado*
🜲 Usuario : @${name}
＃ Prefix : *(/ ! # - .)*
✦ Version : *${vs}*
${readMore}
╭•[ 𔒝 ] ⧿ \`Logos\`
${menuLogos}

> ${textbot}`
return conn.sendMessage(m.chat, { text: categoLogos, mentions: [m.sender], contextInfo: { externalAdReply: { title: botname, body: textbot, thumbnail: thumbBot, sourceUrl: null, mediaType: 1, renderLargerThumbnail: true }}}, { quoted: m })
} else if (args[0] === 'cc' || args[0] === '11') {
let categoCol = `> ${hora}, ${dia} ${fechaTxt}

⧨ Modo : *Privado*
🜲 Usuario : @${name}
＃ Prefix : *(/ ! # - .)*
✦ Version : *${vs}*
${readMore}
╭•[ 𔒝 ] ⧿ \`Coleccion\`
${menuColec}

> ${textbot}`
return conn.sendMessage(m.chat, { text: categoCol, mentions: [m.sender], contextInfo: { externalAdReply: { title: botname, body: textbot, thumbnail: thumbBot, sourceUrl: null, mediaType: 1, renderLargerThumbnail: true }}}, { quoted: m })
} else if (args[0] === 'random' || args[0] === '12') {
let categoRandom = `> ${hora}, ${dia} ${fechaTxt}

⧨ Modo : *Privado*
🜲 Usuario : @${name}
＃ Prefix : *(/ ! # - .)*
✦ Version : *${vs}*
${readMore}
╭•[ 𔒝 ] ⧿ \`Random\`
${menuRandom}

> ${textbot}`
return conn.sendMessage(m.chat, { text: categoRandom, mentions: [m.sender], contextInfo: { externalAdReply: { title: botname, body: textbot, thumbnail: thumbBot, sourceUrl: null, mediaType: 1, renderLargerThumbnail: true }}}, { quoted: m })
} else if (args[0] === 'reac' || args[0] === '13') {
let categoReac = `> ${hora}, ${dia} ${fechaTxt}

⧨ Modo : *Privado*
🜲 Usuario : @${name}
＃ Prefix : *(/ ! # - .)*
✦ Version : *${vs}*
${readMore}
╭•[ 𔒝 ] ⧿ \`Reaccion\`
${menuReac}

> ${textbot}`
return conn.sendMessage(m.chat, { text: categoReac, mentions: [m.sender], contextInfo: { externalAdReply: { title: botname, body: textbot, thumbnail: thumbBot, sourceUrl: null, mediaType: 1, renderLargerThumbnail: true }}}, { quoted: m })
} else if (args[0] === 'ai' || args[0] === '14') {
let categoAi = `> ${hora}, ${dia} ${fechaTxt}

⧨ Modo : *Privado*
🜲 Usuario : @${name}
＃ Prefix : *(/ ! # - .)*
✦ Version : *${vs}*
${readMore}
╭•[ 𔒝 ] ⧿ \`Inteligencia\`
${menuAi}

> ${textbot}`
return conn.sendMessage(m.chat, { text: categoAi, mentions: [m.sender], contextInfo: { externalAdReply: { title: botname, body: textbot, thumbnail: thumbBot, sourceUrl: null, mediaType: 1, renderLargerThumbnail: true }}}, { quoted: m })
} else if (args[0] === 'editor' || args[0] === '15') {
let categoEdit = `> ${hora}, ${dia} ${fechaTxt}

⧨ Modo : *Privado*
🜲 Usuario : @${name}
＃ Prefix : *(/ ! # - .)*
✦ Version : *${vs}*
${readMore}
╭•[ 𔒝 ] ⧿ \`Editor\`
${menuEdit}

> ${textbot}`
return conn.sendMessage(m.chat, { text: categoEdit, mentions: [m.sender], contextInfo: { externalAdReply: { title: botname, body: textbot, thumbnail: thumbBot, sourceUrl: null, mediaType: 1, renderLargerThumbnail: true }}}, { quoted: m })
} else if (args[0] === 'premium' || args[0] === '16') {
let categoPrem = `> ${hora}, ${dia} ${fechaTxt}

⧨ Modo : *Privado*
🜲 Usuario : @${name}
＃ Prefix : *(/ ! # - .)*
✦ Version : *${vs}*
${readMore}
╭•[ 𔒝 ] ⧿ \`Premium\`
${menuPrem}

> ${textbot}`
return conn.sendMessage(m.chat, { text: categoPrem, mentions: [m.sender], contextInfo: { externalAdReply: { title: botname, body: textbot, thumbnail: thumbBot, sourceUrl: null, mediaType: 1, renderLargerThumbnail: true }}}, { quoted: m })
} else if (args[0] === 'juegos' || args[0] === '17') {
let categoPrem = `> ${hora}, ${dia} ${fechaTxt}

⧨ Modo : *Privado*
🜲 Usuario : @${name}
＃ Prefix : *(/ ! # - .)*
✦ Version : *${vs}*
${readMore}
╭•[ 𔒝 ] ⧿ \`Premium\`
${menuPrem}

> ${textbot}`
return conn.sendMessage(m.chat, { text: categoPrem, mentions: [m.sender], contextInfo: { externalAdReply: { title: botname, body: textbot, thumbnail: thumbBot, sourceUrl: null, mediaType: 1, renderLargerThumbnail: true }}}, { quoted: m })
} else if (args[0] === 'owner' || args[0] === 'own') {
let categoOwn = `> ${hora}, ${dia} ${fechaTxt}

⧨ Modo : *Privado*
🜲 Usuario : @${name}
＃ Prefix : *(/ ! # - .)*
✦ Version : *${vs}*
${readMore}
╭•[ 𔒝 ] ⧿ \`Propietario\`
${menuOwn}

> ${textbot}`
return conn.sendMessage(m.chat, { text: categoOwn, mentions: [m.sender], contextInfo: { externalAdReply: { title: botname, body: textbot, thumbnail: thumbBot, sourceUrl: null, mediaType: 1, renderLargerThumbnail: true }}}, { quoted: m })
} else if (args[0] === 'all' || args[0] === '0') {
let categoAll = `> ${hora}, ${dia} ${fechaTxt}

〝👋🏻  Bot automático via *(WhatsApp/Business)*, puede obtener información/datos o otras ventajas para proporcionar un uso util para todo usuario.〞

⧨ Modo : *Privado*
🜲 Usuario : @${name}
＃ Prefix : *(/ ! # - .)*
✦ Version : *${vs}*
${readMore}
╭•[ 𔒝 ] ⧿ \`Informacion\`
${menuInfo}


╭•[ 𔒝 ] ⧿ \`Descargas\`
${menuDesc}


╭•[ 𔒝 ] ⧿ \`Convertidor\`
${menuConv}


╭•[ 𔒝 ] ⧿ \`Buscador\`
${menuSearch}


╭•[ 𔒝 ] ⧿ \`Grupos\`
${menuGroup}


╭•[ 𔒝 ] ⧿ \`Tienda\`
${menuShop}


╭•[ 𔒝 ] ⧿ \`Juegos RPG\`
${menuRpg}


╭•[ 𔒝 ] ⧿ \`Ajustes\`
${menuUtils}


╭•[ 𔒝 ] ⧿ \`Stickers\`
${menuStick}


╭•[ 𔒝 ] ⧿ \`Logos\`
${menuLogos}


╭•[ 𔒝 ] ⧿ \`Gacha\`
${menuGacha}


╭•[ 𔒝 ] ⧿ \`Random\`
${menuRandom}


╭•[ 𔒝 ] ⧿ \`Reaccion\`
${menuReac}


╭•[ 𔒝 ] ⧿ \`Inteligencia\`
${menuAi}


╭•[ 𔒝 ] ⧿ \`Editor\`
${menuEdit}


╭•[ 𔒝 ] ⧿ \`Premium\`
${menuPrem}


╭•[ 𔒝 ] ⧿ \`Juegos\`
${menuJuegos}


╭•[ 𔒝 ] ⧿ \`Propietario\`
${menuOwn}

> ${textbot}`
return conn.sendMessage(m.chat, { text: categoAll, mentions: [m.sender], contextInfo: { externalAdReply: { title: botname, body: textbot, thumbnail: thumbBot, sourceUrl: null, mediaType: 1, renderLargerThumbnail: true }}}, { quoted: m })
} else {
let pruebaXd = `📍  El menu *( ${args[0]} )* no existe.\n- Use *${usedPrefix + command}* para ver las categorías.`
return conn.sendMessage(m.chat, { text: pruebaXd }, { quoted: m })
 } 
} catch (e) {
console.error(e)
await conn.sendMessage(m.chat, { text: `${e.message}` }, { quoted: m })
}
}

handler.command = ['menu', 'help', 'menú']

export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

 function clockString(ms) {
const h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
const m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
const s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
  }
