import fetch from 'node-fetch'

let handler = async (m, { conn, command, usedPrefix }) => {
if (!global.db.data.chats[m.chat].fReaction && m.isGroup) {
return conn.sendMessage(m.chat, { text: `*[ ⽷ ]*   Los comandos de *reaccion* estan desactivados...` }, { quoted: m })
}

let mentionedJid = await m.mentionedJid
let userId = mentionedJid.length > 0 ? mentionedJid[0] : (m.quoted ? await m.quoted.sender : m.sender)
let from = await (async () => global.db.data.users[m.sender].name || (async () => { try { const n = await conn.getName(m.sender); return typeof n === 'string' && n.trim() ? n : m.sender.split('@')[0] } catch { return m.sender.split('@')[0] } })())()
let who = await (async () => global.db.data.users[userId].name || (async () => { try { const n = await conn.getName(userId); return typeof n === 'string' && n.trim() ? n : userId.split('@')[0] } catch { return userId.split('@')[0] } })())()
let str, query
switch (command) {
case 'angry': case 'enojado':
str = from === who ? `[ @${from.split(`@`)[0]} ]   está enojado/a!   ⽷` : `[ @${from.split(`@`)[0]} ]   está enojado/a con   [ @${who.split(`@`)[0]} ]!   ⽷`
query = 'anime angry'
break
case 'bath': case 'bañarse':
str = from === who ? `[ @${from.split(`@`)[0]} ]   se está bañando!   ⽷` : `[ @${from.split(`@`)[0]} ]   está bañando a   [ @${who.split(`@`)[0]} ]!   ⽷`
query = 'anime bath'
break
case 'bite': case 'morder':
str = from === who ? `[ @${from.split(`@`)[0]} ]   se mordió a sí mismo/a!   ⽷` : `[ @${from.split(`@`)[0]} ]   mordió a   [ @${who.split(`@`)[0]} ]!   ⽷`
query = 'anime bite'
break
case 'bleh': case 'lengua':
str = from === who ? `[ @${from.split(`@`)[0]} ]   saca la lengua!   ⽷` : `[ @${from.split(`@`)[0]} ]   le sacó la lengua a   [ @${who.split(`@`)[0]} ]!   ⽷`
query = 'anime bleh'
break
case 'blush': case 'sonrojarse':
str = from === who ? `[ @${from.split(`@`)[0]} ]   se sonrojó!   ⽷` : `[ @${from.split(`@`)[0]} ]   se sonrojó por   [ @${who.split(`@`)[0]} ]!   ⽷`
query = 'anime blush'
break
case 'bored': case 'aburrido':
str = from === who ? `[ @${from.split(`@`)[0]} ]   está aburrido/a!   ⽷` : `[ @${from.split(`@`)[0]} ]   está aburrido/a de   [ @${who.split(`@`)[0]} ]!   ⽷`
query = 'anime bored'
break
case 'clap': case 'aplaudir':
str = from === who ? `[ @${from.split(`@`)[0]} ]   está aplaudiendo!   ⽷` : `[ @${from.split(`@`)[0]} ]   está aplaudiendo por   [ @${who.split(`@`)[0]} ]!   ⽷`
query = 'anime clap'
break
case 'coffee': case 'cafe': case 'café':
str = from === who ? `[ @${from.split(`@`)[0]} ]   está tomando café!   ⽷` : `[ @${from.split(`@`)[0]} ]   está tomando café con   [ @${who.split(`@`)[0]} ]!   ⽷`
query = 'anime coffee'
break
case 'cry': case 'llorar':
str = from === who ? `[ @${from.split(`@`)[0]} ]   está llorando!   ⽷` : `[ @${from.split(`@`)[0]} ]   está llorando por   [ @${who.split(`@`)[0]} ]!   ⽷`
query = 'anime cry'
break
case 'cuddle': case 'acurrucarse':
str = from === who ? `[ @${from.split(`@`)[0]} ]   se acurrucó con sí mismo/a!   ⽷` : `[ @${from.split(`@`)[0]} ]   se acurrucó con   [ @${who.split(`@`)[0]} ]!   ⽷`
query = 'anime cuddle'
break
case 'dance': case 'bailar':
str = from === who ? `[ @${from.split(`@`)[0]} ]   está bailando!   ⽷` : `[ @${from.split(`@`)[0]} ]   está bailando con   [ @${who.split(`@`)[0]} ]!   ⽷`
query = 'anime dance'
break
case 'drunk': case 'borracho':
str = from === who ? `[ @${from.split(`@`)[0]} ]   está borracho!   ⽷` : `[ @${from.split(`@`)[0]} ]   está borracho con   [ @${who.split(`@`)[0]} ]!   ⽷`
query = 'anime drunk'
break
case 'eat': case 'comer':
str = from === who ? `[ @${from.split(`@`)[0]} ]   está comiendo!   ⽷` : `[ @${from.split(`@`)[0]} ]   está comiendo con   [ @${who.split(`@`)[0]} ]!   ⽷`
query = 'anime eat'
break
case 'facepalm': case 'palmada':
str = from === who ? `[ @${from.split(`@`)[0]} ]   se da una palmada en la cara!   ⽷` : `[ @${from.split(`@`)[0]} ]   se frustra y se da una palmada en la cara por   [ @${who.split(`@`)[0]} ]!   ⽷`
query = 'anime facepalm'
break
case 'happy': case 'feliz':
str = from === who ? `[ @${from.split(`@`)[0]} ]   está feliz!   ⽷` : `[ @${from.split(`@`)[0]} ]   está feliz por   [ @${who.split(`@`)[0]} ]!   ⽷`;
query = 'anime happy';
break
case 'hug': case 'abrazar':
str = from === who ? `[ @${from.split(`@`)[0]} ]   se abrazó a sí mismo/a!   ⽷` : `[ @${from.split(`@`)[0]} ]   abrazó a   [ @${who.split(`@`)[0]} ]!   ⽷`;
query = 'anime hug'
break
case 'kill': case 'matar':
str = from === who ? `[ @${from.split(`@`)[0]} ]   se mató a sí mismo/a!   ⽷` : `[ @${from.split(`@`)[0]} ]   mató a   [ @${who.split(`@`)[0]} ]!   ⽷`
query = 'anime kill'
break
case 'kiss': case 'muak':
str = from === who ? `[ @${from.split(`@`)[0]} ]   se besó a sí mismo/a!   ⽷` : `[ @${from.split(`@`)[0]} ]   besó a   [ @${who.split(`@`)[0]} ]!   ⽷`
query = 'anime kiss'
break
case 'laugh': case 'reirse':
str = from === who ? `[ @${from.split(`@`)[0]} ]   se ríe! (≧▽≦)` : `[ @${from.split(`@`)[0]} ]   se está riendo de   [ @${who.split(`@`)[0]} ]!   ⽷`
query = 'anime laugh'
break
case 'lick': case 'lamer':
str = from === who ? `[ @${from.split(`@`)[0]} ]   se lamió a sí mismo/a!   ⽷` : `[ @${from.split(`@`)[0]} ]   lamió a   [ @${who.split(`@`)[0]} ]!   ⽷`
query = 'anime lick'
break
case 'slap': case 'bofetada':
str = from === who ? `[ @${from.split(`@`)[0]} ]   se golpeó a sí mismo/a!   ⽷` : `[ @${from.split(`@`)[0]} ]   le dio una bofetada a   [ @${who.split(`@`)[0]} ]!   ⽷`
query = 'anime slap'
break
case 'sleep': case 'dormir':
str = from === who ? `[ @${from.split(`@`)[0]} ]   está durmiendo profundamente!   ⽷` : `[ @${from.split(`@`)[0]} ]   duerme junto a   [ @${who.split(`@`)[0]} ]!   ⽷`
query = 'anime sleep'
break
case 'smoke': case 'fumar':
str = from === who ? `[ @${from.split(`@`)[0]} ]   está fumando!   ⽷` : `[ @${from.split(`@`)[0]} ]   está fumando con   [ @${who.split(`@`)[0]} ]!   ⽷`
query = 'anime smoke'
break
case 'spit': case 'escupir':
str = from === who ? `[ @${from.split(`@`)[0]} ]   se escupió a sí mismo/a!   ⽷` : `[ @${from.split(`@`)[0]} ]   escupió a   [ @${who.split(`@`)[0]} ]!   ⽷`
query = 'anime spit'
break
case 'step': case 'pisar':
str = from === who ? `[ @${from.split(`@`)[0]} ]   se pisó a sí mismo/a!   ⽷` : `[ @${from.split(`@`)[0]} ]   pisó a   [ @${who.split(`@`)[0]} ]! sin piedad   ⽷`
query = 'anime step'
break
case 'think': case 'pensar':
str = from === who ? `[ @${from.split(`@`)[0]} ]   está pensando!   ⽷` : `[ @${from.split(`@`)[0]} ]   está pensando en   [ @${who.split(`@`)[0]} ]!   ⽷`
query = 'anime think'
break
case 'love': case 'enamorado': case 'enamorada':
str = from === who ? `[ @${from.split(`@`)[0]} ]   está enamorado/a de sí mismo/a!   ⽷` : `[ @${from.split(`@`)[0]} ]   está enamorado/a de   [ @${who.split(`@`)[0]} ]!   ⽷`
query = 'anime love'
break
case 'pat': case 'palmadita': case 'palmada':
str = from === who ? `[ @${from.split(`@`)[0]} ]   se da palmaditas de autoapoyo!   ⽷` : `[ @${from.split(`@`)[0]} ]   acaricia suavemente a   [ @${who.split(`@`)[0]} ]!   ⽷`
query = 'anime pat'
break
case 'poke': case 'picar':
str = from === who ? `[ @${from.split(`@`)[0]} ]   se da un toque curioso!   ⽷` : `[ @${from.split(`@`)[0]} ]   da un golpecito a   [ @${who.split(`@`)[0]} ]!   ⽷`
query = 'anime poke'
break
case 'pout': case 'pucheros':
str = from === who ? `[ @${from.split(`@`)[0]} ]   hace pucheros!   ⽷` : `[ @${from.split(`@`)[0]} ]   está haciendo pucheros por   [ @${who.split(`@`)[0]} ]!   ⽷`
query = 'anime pout'
break
case 'punch': case 'pegar': case 'golpear':
str = from === who ? `[ @${from.split(`@`)[0]} ]   se golpeó a sí mismo/a!   ⽷` : `[ @${from.split(`@`)[0]} ]   golpea a   [ @${who.split(`@`)[0]} ]! con todas sus fuerzas   ⽷`
query = 'anime punch'
break
case 'preg': case 'preñar': case 'embarazar':
str = from === who ? `[ @${from.split(`@`)[0]} ]   se embarazó solito/a... misterioso!   ⽷` : `[ @${from.split(`@`)[0]} ]   le regaló 9 meses de espera a   [ @${who.split(`@`)[0]} ]!   ⽷`
query = 'anime preg'
break
case 'sprint': case 'correr':
str = from === who ? `[ @${from.split(`@`)[0]} ]   está haciendo cardio... o eso dice!   ⽷` : `[ @${from.split(`@`)[0]} ]   sale disparado/a al ver a   [ @${who.split(`@`)[0]} ] acercarse!   ⽷`
query = 'anime run'
break
case 'sad': case 'triste':
str = from === who ? `[ @${from.split(`@`)[0]} ]   contempla la lluvia con expresión triste!   ⽷` : `[ @${from.split(`@`)[0]} ]   mira por la ventana y piensa en   [ @${who.split(`@`)[0]} ]!   ⽷`
query = 'anime sad'
break
case 'scared': case 'asustada': case 'asustado':
str = from === who ? `[ @${from.split(`@`)[0]} ]   se asusta!   ⽷` : `[ @${from.split(`@`)[0]} ]   está aterrorizado/a de   [ @${who.split(`@`)[0]} ]!   ⽷`
query = 'anime scared'
break
case 'seduce': case 'seducir':
str = from === who ? `[ @${from.split(`@`)[0]} ]   susurra versos de amor al aire!   ⽷` : `[ @${from.split(`@`)[0]} ]   lanza una mirada que derrite a   [ @${who.split(`@`)[0]} ]!   ⽷`
query = 'anime seduce'
break
case 'shy': case 'timido': case 'timida':
str = from === who ? `[ @${from.split(`@`)[0]} ]   no sabe cómo actuar... se pone rojo/a!   ⽷` : `[ @${from.split(`@`)[0]} ]   baja la mirada tímidamente frente a   [ @${who.split(`@`)[0]} ]!   ⽷`
query = 'anime shy'
break
case 'walk': case 'caminar':
str = from === who ? `[ @${from.split(`@`)[0]} ]   pasea!   ⽷` : `[ @${from.split(`@`)[0]} ]   está caminando con   [ @${who.split(`@`)[0]} ]!   ⽷`;
query = 'anime walk' 
break
case 'dramatic': case 'drama':
str = from === who ? `[ @${from.split(`@`)[0]} ]   está montando un show digno de un Oscar!   ⽷` : `[ @${from.split(`@`)[0]} ]   está actuando dramáticamente por   [ @${who.split(`@`)[0]} ]!   ⽷`
query = 'anime dramatic'
break
case 'kisscheek': case 'beso':
str = from === who ? `[ @${from.split(`@`)[0]} ]   se besó la mejilla con cariño!   ⽷` : `[ @${from.split(`@`)[0]} ]   besó la mejilla de   [ @${who.split(`@`)[0]} ] con ternura!   ⽷`
query = 'anime kisscheek'
break
case 'wink': case 'guiñar':
str = from === who ? `[ @${from.split(`@`)[0]} ]   se guiñó el ojo a sí mismo/a en el espejo!   ⽷` : `[ @${from.split(`@`)[0]} ]   le guiñó el ojo a   [ @${who.split(`@`)[0]} ]!   ⽷`
query = 'anime wink'
break
case 'cringe': case 'avergonzarse':
str = from === who ? `[ @${from.split(`@`)[0]} ]   siente cringe!   ⽷` : `[ @${from.split(`@`)[0]} ]   siente cringe por   [ @${who.split(`@`)[0]} ]!   ⽷`
query = 'anime cringe'
break
case 'smug': case 'presumir':
str = from === who ? `[ @${from.split(`@`)[0]} ]   está presumiendo mucho últimamente!   ⽷` : `[ @${from.split(`@`)[0]} ]   está presumiendo a   [ @${who.split(`@`)[0]} ]!   ⽷`
query = 'anime smug'
break
case 'smile': case 'sonreir':
str = from === who ? `[ @${from.split(`@`)[0]} ]   está sonriendo!   ⽷` : `[ @${from.split(`@`)[0]} ]   le sonrió a   [ @${who.split(`@`)[0]} ]!   ⽷`
query = 'anime smile'
break
case 'handhold': case 'mano':
str = from === who ? `[ @${from.split(`@`)[0]} ]   se dio la mano consigo mismo/a!   ⽷` : `[ @${from.split(`@`)[0]} ]   le agarró la mano a   [ @${who.split(`@`)[0]} ]!   ⽷`
query = 'anime handhold'
break
case 'bullying': case 'bully':
str = from === who ? `[ @${from.split(`@`)[0]} ]   se hace bullying solo… alguien abrácelo!   ⽷` : `[ @${from.split(`@`)[0]} ]   le está haciendo bullying a   [ @${who.split(`@`)[0]} ]!   ⽷`
query = 'anime bullying'
break
case 'wave': case 'hola': case 'ola':
str = from === who ? `[ @${from.split(`@`)[0]} ]   se saludó a sí mismo/a en el espejo!   ⽷` : `[ @${from.split(`@`)[0]} ]   está saludando a   [ @${who.split(`@`)[0]} ]!   ⽷`
query = 'anime wave'
break
}
if (m.isGroup) {
try {
const res = await fetch(`https://api.delirius.store/search/tenor?q=${query}`)
const json = await res.json()
const gifs = json.data
if (!gifs || gifs.length === 0) return conn.sendMessage(m.chat, { text: mess.nosear }, { quoted: m })
const randomGif = gifs[Math.floor(Math.random() * gifs.length)].mp4
conn.sendMessage(m.chat, { video: { url: randomGif }, gifPlayback: true, caption: str, mentions: [from, who] }, { quoted: m })
} catch (e) {
return conn.sendMessage(m.chat, { text: `${e.message}` }, { quoted: m })
}}}

handler.command = ['angry', 'enojado', 'bath', 'bañarse', 'bite', 'morder', 'bleh', 'lengua', 'blush', 'sonrojarse', 'bored', 'aburrido', 'clap', 'aplaudir', 'coffee', 'cafe', 'café', 'cry', 'llorar', 'cuddle', 'acurrucarse', 'dance', 'bailar', 'drunk', 'borracho', 'eat', 'comer', 'facepalm', 'palmada', 'happy', 'feliz', 'hug', 'abrazar', 'kill', 'matar', 'kiss', 'muak', 'laugh', 'reirse', 'lick', 'lamer', 'slap', 'bofetada', 'sleep', 'dormir', 'smoke', 'fumar', 'spit', 'escupir', 'step', 'pisar', 'think', 'pensar', 'love', 'enamorado', 'enamorada', 'pat', 'palmadita', 'palmada', 'poke', 'picar', 'pout', 'pucheros', 'punch', 'pegar', 'golpear', 'preg', 'preñar', 'embarazar', 'sprint', 'correr', 'sad', 'triste', 'scared', 'asustada', 'asustado', 'seduce', 'seducir', 'shy', 'timido', 'timida', 'walk', 'caminar', 'dramatic', 'drama', 'kisscheek', 'beso', 'wink', 'guiñar', 'cringe', 'avergonzarse', 'smug', 'presumir', 'smile', 'sonreir', 'bully', 'bullying', 'mano', 'handhold', 'ola', 'wave', 'hola']
handler.tags = ["reaccion"]
handler.group = true

export default handler
