const waifusList = [
{
id: 1,
name: 'TORU',
image: 'https://i.postimg.cc/Y28MD3LQ/819440c39a84a763f33ed0c83c9c15d3.jpg',
image2: 'https://i.postimg.cc/mZ97QPP7/c445c69dcae90bcb6848d29be2d9a9c0.jpg',
anime: 'Jugueton',
rarity: 'Hombre'
},
{
id: 2,
name: 'ONIX',
image: 'https://i.postimg.cc/xTYNMtDn/a7b155f8ab809c785fa259d8d3aeb35b.jpg',
image2: 'https://i.postimg.cc/YCMN2tqg/060572a70858ae1f2c3ff6be0b7df14f.jpg',
anime: 'Algo gruñón',
rarity: 'Hombre'
}
];

let adoptedWaifus = {};

const handler = async (m, { conn, usedPrefix, command }) => {
try {
const sender = m.sender;
const groupId = m.chat;


if (!adoptedWaifus[groupId]) {
adoptedWaifus[groupId] = {};
}

const cmd = command.toLowerCase();


if (cmd === 'llevar') {
return adoptarWaifu(m, conn, groupId, sender, usedPrefix);
}

 
if (cmd === 'mibot') {
return verMiWaifu(m, conn, groupId, sender);
}


if (cmd === 'doplist') {
return listarWaifusGrupo(m, groupId);
}


if (cmd === 'listbots') {
return verWaifusDisponibles(m, groupId, usedPrefix);
}


if (cmd === 'alimentar') {
return alimentarWaifu(m, groupId, sender, usedPrefix);
}


if (cmd === 'usar') {
return tenerRelaciones(m, conn, groupId, sender, usedPrefix);
}


if (cmd === 'adopcion') {
return mostrarAyuda(m, usedPrefix);
}

} catch (error) {
console.error(error);
await conn.reply(m.chat, error.message, m);
}
};


async function adoptarWaifu(m, conn, groupId, sender, usedPrefix) {
if (adoptedWaifus[groupId][sender]) {
const waifu = adoptedWaifus[groupId][sender];
return conn.reply(m.chat, `Ya tienes a un bot personal en tu posición.\n- *Nombre* : ${waifu.name}\n\n- Cuidalo para subir de nivel.`, m);
}


const waifusAdoptadas = Object.values(adoptedWaifus[groupId]);
const disponibles = waifusList.filter(w => 
!waifusAdoptadas.some(aw => aw.id === w.id)
);

if (disponibles.length === 0) {
return conn.reply(m.chat, `Los bots ya fueron llevados en este grupo.\n- Cada grupo dispone de dos bots.`, m);
}

 
const waifu = disponibles[Math.floor(Math.random() * disponibles.length)];


adoptedWaifus[groupId][sender] = {
...waifu,
fecha: new Date().toLocaleDateString(),
hambre: 50,
felicidad: 50,
nivel: 1,
relaciones: 0 
};


await conn.sendFile(m.chat, waifu.image, 'imagen.jpg', `🝐 を *Bot : Adopción*\n- ¡Has adoptado a un bot personal de la comunidad!\n\n•≻ *Nombre* : ${waifu.name}\n•≻ *Personalidad* : ${waifu.anime}\n•≻ *Genero* : ${waifu.rarity}\n\n> 📆 *Fecha de adopción:* ${new Date().toLocaleDateString()}`m);
}


async function verMiWaifu(m, conn, groupId, sender) {
if (!adoptedWaifus[groupId][sender]) {
return conn.reply(m.chat, `No tienes un bot adoptado y personal.\n- Usa *#llevar* para obtener un bot de la comunidad.`, m);
}

const waifu = adoptedWaifus[groupId][sender];

await conn.sendFile(m.chat, waifu.image, 'waifu.jpg', 
`\t\t【 *Bot : Personal 】
- Mira las estadísticas de tu bot personal.

▢ *Nombre* : @${waifu.name}
▢ *Genero* : ${waifu.rarity}
▢ *Personalidad* : ${waifu.anime}

> *Detalles:*
▢ *Hambre* : ${waifu.hambre}/100
▢ *Felicidad* : ${waifu.felicidad}/100
▢ *Relaciones* : ${waifu.relaciones} veces
▢ *Nivel* : ${waifu.nivel}

> ❔ Aumenta el nivel de tu bot personal para otros logros.`m);
}


function listarWaifusGrupo(m, groupId) {
if (!adoptedWaifus[groupId] || Object.keys(adoptedWaifus[groupId]).length === 0) {
return conn.reply(m.chat, `No hay bots llevados en este grupo.`, m);
}

let lista = '\t\t【 *Bots : Adopción* 】\n\n';
let i = 1;

for (const [userId, waifu] of Object.entries(adoptedWaifus[groupId])) {
const user = `${userId.split`@`[0]}`;
lista += `> #${i}. *${waifu.name}*\n`;
lista += `▢ *Dueño/a* : @${user}\n`;
lista += `▢ *Genero* : ${waifu.rsrity}\n`;
lista += `▢ *Personalidad* : ${waifu.anime}\n`;
lista += `▢ Nivel: ${waifu.nivel}\n\n`;
lista += `۰──────────۰\n\n`;
i++;
}

lista += `\n> Total: ${i-1} bots personales.`;
conn.reply(m.chat, lista, m);
}


function verWaifusDisponibles(m, groupId, usedPrefix) {
const waifusAdoptadas = Object.values(adoptedWaifus[groupId] || {});
const disponibles = waifusList.filter(w => 
!waifusAdoptadas.some(aw => aw.id === w.id)
);

if (disponibles.length === 0) {
return conn.reply(m.chat, `No hay bots personales disponibles para llevar.`, m);
}

let lista = '\t\t【 Bots : Disponibles 】\n- Lista de bots disponibles.\n\n';

disponibles.forEach((waifu, index) => {
lista += `> #${index+1}. *${waifu.name}*\n`;
lista += `▢ *Genero* : ${waifu.rarity}\n`;
lista += `▢ *Personalidad* : ${waifu.anime}\n\n`;
lista += `۰────────────۰\n\n`;
});

lista += `\nUsa *${usedPrefix}llevar* para tener uno.`;
conn.reply(m.chat, lista, m);
}


function alimentarWaifu(m, groupId, sender, usedPrefix) {
if (!adoptedWaifus[groupId][sender]) {
return conn.reply(m.chat, `No tienes un bot adoptivo y personal.\n- Usa el comando *#llevar* para tener uno.`, m);
}

const waifu = adoptedWaifus[groupId][sender];


waifu.hambre = Math.min(100, waifu.hambre + 20);
waifu.felicidad = Math.min(100, waifu.felicidad + 15);


if (waifu.hambre >= 100 && waifu.nivel < 20) {
waifu.nivel++;
waifu.hambre = 50; 
conn.reply(m.chat, `[ 🥳 ]  ¡Tu bot *( @${waifu.name} )* ha subido de nivel ${waifu.nivel}!\n- Sigue cuidando para subir mas de nivel.`, m);
}

await conn.sendFile(m.chat, waifu.image2, 'bots.jpg', `✎ \`Alimentación\` ❤️\n- ¡Haz llevado de comer a tu bot!¡\n\n▢ *Hambre* : ${waifu.hambre}/100\n▢ *Felicidad* : ${waifu.felicidad}/100\n▢ *Nivel* : ${waifu.nivel}\n\n❤️ *@${waifu.name}* esta contento por que lo llevaste.\n\n> 🍔 Tu bot recupero *+20* de hambre y *+15* de felicidad.`, m );
}


async function tenerRelaciones(m, conn, groupId, sender, usedPrefix) {
if (!adoptedWaifus[groupId][sender]) {
return conn.reply(m.chat, `No tienes un bot personal.\n- Usa el comando *#llevar* para tener uno.`, m);
}

const waifu = adoptedWaifus[groupId][sender];


if (waifu.nivel < 15) {
return conn.reply(m.chat, `Tu bot personal debe tener el nivel 15 para usarlo a tu favor.\n- El nivel actual de tu bot es: *${waifu.nivel}*`, m);
}


if (waifu.hambre < 15) {
return conn.reply(m.chat, `Tu bot tiene mucha hambre.\n- *Hambre* : ${waifu.hambre}/100\n\n🍔 Alimentalo primero.`, m);
}

if (waifu.felicidad < 40) {
return conn.reply(m.chat, `Tu bot no esta contento con la idea.\n- Mensaje: *${pickRandom(['Me siento incomodo. jsjs', 'Vamos a comer mejor.', 'Me surgen dudas', 'Me surgen dudas aun.', '¿Por que hay que hacer esto?', 'Que raro el gusto.', 'Ta raro, no pense que ser personal fuese asi ._.', '._.', 'No jsjs :b'])}`, m);
}


waifu.relaciones++;
waifu.hambre = Math.max(0, waifu.hambre - 15);
waifu.felicidad = Math.min(100, waifu.felicidad + 10);


const mensajesRelaciones = [
"Haz tenido relaciones con tu bot personal.",
"Empezaste a usar tu bot personal de otra manera.",
"Empezaste a invitar tu bot personal a dormir contigo.",
"Usaste a tu bot personal de otra manera íntima."
];


const mensaje = mensajesRelaciones[Math.floor(Math.random() * mensajesRelaciones.length)];


await conn.reply(m.chat, mensaje, m);
//conn.sendFile(m.chat, waifu.image, 'waifu.jpg', mensaje, m);
}


function mostrarAyuda(m, usedPrefix) {
const ayuda = `> *Comandos*
*#llevar* - Llevar un bot personal.
*#mibot* - Ver detalles de tu bot.
*#usar* - Usar el bot personal de otra manera.
*#listbots* - Bots personales disponibles.
`;

conn.reply(m.chat, ayuda, m);
}


handler.help = ['adoptar', 'miwaifu', 'listawaifus', 'waifusdisponibles', 'alimentar', 'relaciones', 'waifus'];
handler.tags = ['waifu', 'juegos'];
handler.command = ['llevar', 'mibot', 'usar', 'listbots', 'alimentar', 'adopcion', 'doplist'];
handler.group = true;

export default handler;