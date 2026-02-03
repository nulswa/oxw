const torusList = [
{
id: 1,
nombrado: 'TORU',
foto: 'https://i.postimg.cc/Y28MD3LQ/819440c39a84a763f33ed0c83c9c15d3.jpg',
comer: 'https://i.postimg.cc/mZ97QPP7/c445c69dcae90bcb6848d29be2d9a9c0.jpg',
genero: 'Hombre',
rareza: 'Epico',
person: 'Jugueton'
},
{
id: 2,
nombrado: 'ONIX',
foto: 'https://i.postimg.cc/xTYNMtDn/a7b155f8ab809c785fa259d8d3aeb35b.jpg',
comer: 'https://i.postimg.cc/YCMN2tqg/060572a70858ae1f2c3ff6be0b7df14f.jpg',
genero: 'Hombre',
rareza: 'Epico',
person: 'Algo gruñón '
}
];

let adopsBots = {};

const handler = async (m, { conn, usedPrefix, command }) => {
try {
const sender = m.sender;
const groupId = m.chat;


if (!adopsBots[groupId]) {
adopsBots[groupId] = {};
}

const cmd = command.toLowerCase();


if (cmd === 'llevar') {
return adoptarBot(m, conn, groupId, sender, usedPrefix);
}

 
if (cmd === 'mibot') {
return verMiBot(m, conn, groupId, sender);
}


if (cmd === 'listbots') {
return grupoBots(m, conn, groupId);
}


if (cmd === 'adops') {
return verBotsDisponibles(m, conn, groupId, usedPrefix);
}


if (cmd === 'dar') {
return darComida(m, conn, groupId, sender, usedPrefix);
}


if (cmd === 'relacion') {
return usarBots(m, conn, groupId, sender, usedPrefix);
}


if (cmd === 'personalbot') {
return guiaMuestra(m, conn, usedPrefix);
}

} catch (error) {
console.error(error);
m.reply(error);
}
};


async function adoptarBot(m, conn, groupId, sender, usedPrefix) {
if (adopsBots[groupId][sender]) {
const utoru = adopsBots[groupId][sender];
return m.reply(`📍 Ya tienes un bot personal.\n- Usa *${usedPrefix}mibot* para ver tu bot personal.`);
}


const adoptadosBots = Object.values(adopsBots[groupId]);
const disponibles = torusList.filter(w => 
!adoptadosBots.some(aw => aw.id === w.id)
);

if (disponibles.length === 0) {
return m.reply('Los bots ya fueron llevados en este grupo.\n- Solo dispone de 2 bots por chat grupal.');
}

 
const utoru = disponibles[Math.floor(Math.random() * disponibles.length)];


adopsBots[groupId][sender] = {
...utoru,
fecha: new Date().toLocaleDateString(),
estomago: 50,
felices: 50,
nivel: 1,
relaciont: 0 
};


await conn.sendFile(m.chat, utoru.foto, 'utoru.jpg', `\t\t『 *¡LLEVADO!* 』\n- ¡Te llevaste a un bot personal!\n⚶ *Nombre* : ${utoru.nombrado}\n⚶ *Genero* : ${utoru.genero}\n⚶ *Rareza* : ${utoru.rareza}\n⚶ *Personalidad* : ${utoru.person}\n\n> 📍 Usa *#mibot* para ver sus estadísticas.`m);
}


async function verMiBot(m, conn, groupId, sender) {
if (!adopsBots[groupId][sender]) {
return m.reply('📍 No tienes un bot personal.\n- Usa *#llevar* para tener uno.');
}

const utoru = adopsBots[groupId][sender];

await conn.sendFile(m.chat, utoru.foto, 'utoru.jpg', `『 *Bot* : Personal* 』\n- Estadísticas de tu bot personal.\n\n⩩ *Nombre* : ${utoru.nombrado}\n⩩ *Genero* : ${utoru.genero}\n⩩ *Rareza* : ${utoru.rareza}\n\n> *Detalles:*\n⩩ *Nivel* : ${utoru.nivel}\n⩩ *Hambre* : ${utoru.estomago}/100\n⩩ *Felicidad* : ${utoru.felices}/100\n⩩ *Relacion* : ${utoru.relaciont}\n\n> 📌 Sube de nivel a nivel para lograr un logro.` m);
}


function grupoBots(m, conn, groupId) {
if (!adopsBots[groupId] || Object.keys(adopsBots[groupId]).length === 0) {
return m.reply('No hay bots llevados en este grupo.\n- Usa *#llevar* para tener uno.');
}

let lista = '✦ ¡Lista de bots personales! ✦\n- Lista de bots obtenidos.\n\n';
let i = 1;

for (const [userId, utoru] of Object.entries(adopsBots[groupId])) {
const user = userId.split('@')[0];
lista += `> ${i}. *${utoru.nombrado}*\n`;
lista += `⩩ *Dueño/a* : ${user}\n`;
lista += `⩩ *Genero* : ${utoru.genero}\n`;
lista += `⩩ *Rareza* : ${utoru.rareza}\n`;
lista += `⩩ *Nivel* : ${utoru.nivel}\n`;
lista += `⧿⧿⧿⧿⧿⧿⧿⧿⧿\n`;
i++;
}

lista += `\nTotal: ${i-1} bots personales obtenidos.`;
m.reply(lista);
}


function verBotsDisponibles(m, conn, groupId, usedPrefix) {
const adoptadosBots = Object.values(adopsBots[groupId] || {});
const disponibles = torusList.filter(w => 
!adoptadosBots.some(aw => aw.id === w.id)
);

if (disponibles.length === 0) {
return m.reply('No hay bots personales disponibles.');
}

let lista = '✦ ¡Bots Disponibles! ✦\n- Lista de bots personales disponibles.\n\n';

disponibles.forEach((utoru, index) => {
lista += `> ${index+1}. *${utoru.nombrado}*\n`;
lista += `⩩ *Genero* : ${utoru.genero}\n`;
lista += `⩩ *Rareza* : ${utoru.rareza}\n`;
lista += `⧿⧿⧿⧿⧿⧿⧿⧿⧿\n`;
});

lista += `\nUsa *${usedPrefix}llevar* para tener uno.`;
m.reply(lista);
}


function darComida(m, conn, groupId, sender, usedPrefix) {
if (!adopsBots[groupId][sender]) {
return m.reply(`No tienes un bot personal para ti.\n- Usa *${usedPrefix}llevar* para tener uno.`);
}

const utoru = adopsBots[groupId][sender];


utoru.estomago = Math.min(100, utoru.estomago + 20);
utoru.felices = Math.min(100, utoru.felices + 15);


if (utoru.estomago >= 100 && utoru.nivel < 20) {
utoru.nivel++;
utoru.estomago = 50; 
m.reply(`🎉 *[ ${utoru.nombrado} ]* ¡subio a nivel ${utoru.nivel}!`);
}


conn.sendFile(m.chat, utoru.comer, 'comer.jpg', `✦ ¡Alimentado! ✦\n- Has invitado a tu bot personal a comer.\n\n⟤ *Hambre* : ${utoru.estomago}/100\n⟤ *Felicidad* : ${utoru.felices}/100\n⟤ *Nivel* : ${utoru.nivel}\n🍔 Tu bot personal esta contento.\n`, m )
/*m.reply(`🍽️ *${utoru.nombrado}* ha sido alimentada\n\n` +
`📊 *Nuevas estadísticas:*\n` +
`• estomago: ${utoru.estomago}/100 (+20)\n` +
`• felices: ${utoru.felices}/100 (+15)\n` +
`• Nivel: ${utoru.nivel}\n\n` +
`💖 ¡${utoru.nombrado} está muy feliz!`);*/
}


async function usarBots(m, conn, groupId, sender, usedPrefix) {
if (!adopsBots[groupId][sender]) {
return m.reply(`No tienes un bot personal.\n- Use *${usedPrefix}llevar* para tener uno.`);
}

const utoru = adopsBots[groupId][sender];


if (utoru.nivel < 20) {
return m.reply(`Tu bot debe tener el nivel 20 para que puedar usarlo de otra forma.\n- El nivel actual de tu bot es: *${utoru.nivel}`);
}


if (utoru.estomago < 30) {
return m.reply(`Tu bot personal tiene hambre, invitalo a comer.`);
}

if (utoru.felices < 40) {
return m.reply(`Tu bot personal no esta muy bien que digamos.`);
}


utoru.relaciont++;
utoru.estomago = Math.max(0, utoru.estomago - 15);
utoru.felices = Math.min(100, utoru.felices + 10);


const mensajesRelaciones = [
`Comenzaste a usar tu bot de otra forma.`,
`Te pusiste a usar tu bot personal ilegalmente.`,
`¡Una noche inolvidable!`
];


const mensaje = mensajesRelaciones[Math.floor(Math.random() * mensajesRelaciones.length)];


await conn.sendFile(m.chat, utoru.foto, 'utoru.jpg', mensaje, m);
}


function guiaMuestra(m, conn, usedPrefix) {
const ayuda = `Usa los siguientes comandos:

• *#llevar* - Llevate a un bot personal.
• *#mibot* - Mira los detalles.`;

m.reply(ayuda);
}



handler.command = ['llevar', 'mibot', 'listbots', 'adops', 'dar', 'comer', 'utorusl'];
handler.group = true;

export default handler;



