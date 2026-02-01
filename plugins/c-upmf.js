import axios from 'axios';
import fetch from 'node-fetch';
import FormData from 'form-data';
import crypto from 'crypto';

let handler = async (m, { conn, args, usedPrefix, command }) => {
let q = m.quoted ? m.quoted : m;
let mime = (q.msg || q).mimetype || '';
if (!mime) return conn.sendMessage(m.chat, { text: `ᗢ Responda a un archivo multimedia para subirlo en Mediafire.` }, { quoted: m });
await m.react("⏰");
let mediaFont = "Mediafire";
try {
let media = await q.download();

let filename = 'file';
if (q.msg && q.msg.fileName) {
filename = q.msg.fileName;
} else {
 let ext = mime.split('/')[1] || 'bin';
 filename = `toru_${Date.now()}.${ext}`;
}

const fileSize = media.length;
const fileHash = crypto.createHash('sha256').update(media).digest('hex');

const COOKIE_API_URL = 'https://cookies.ryzecodes.xyz/api/cookies';
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36';

const cookieResponse = await axios.get(COOKIE_API_URL);
if (!cookieResponse.data || !cookieResponse.data.cookies) {
throw new Error("📍  Invalid response from Cookie API");
}
const apiCookies = cookieResponse.data.cookies;
const cookieHeader = apiCookies.map(c => `${c.name}=${c.value}`).join('; ');

const baseHeaders = {
'User-Agent': USER_AGENT,
'Cookie': cookieHeader,
'Origin': 'https://app.mediafire.com',
'Referer': 'https://app.mediafire.com/'
};

// 2. Getting Session Token
const tokenResponse = await axios.post(
'https://www.mediafire.com/application/get_session_token.php', 
'response_format=json', 
{ headers: { ...baseHeaders, 'Content-Type': 'application/x-www-form-urlencoded' } }
);

const sessionData = tokenResponse.data;
let sessionToken = sessionData.response?.session_token;
if (!sessionToken) {
throw new Error(`📍  Failed to get session token: ${JSON.stringify(sessionData)}`);
}

const actionTokenResponse = await axios.post(
'https://www.mediafire.com/api/1.5/user/get_action_token.php',
`session_token=${sessionToken}&response_format=json&type=upload&lifespan=1440`,
{ headers: { ...baseHeaders, 'Content-Type': 'application/x-www-form-urlencoded' } }
);

if (actionTokenResponse.data.response.result !== 'Success') {
throw new Error(`📍  Failed to get action token: ${JSON.stringify(actionTokenResponse.data)}`);
}

const actionToken = actionTokenResponse.data.response.action_token;

const checkForm = new FormData();
const uploadDescriptor = [{
filename: filename,
folder_key: 'myfiles',
size: fileSize,
hash: fileHash,
resumable: 'yes',
preemptive: 'yes'
}];

checkForm.append('uploads', JSON.stringify(uploadDescriptor));
checkForm.append('session_token', sessionToken);
checkForm.append('response_format', 'json');

const checkResponse = await axios.post(
'https://www.mediafire.com/api/1.5/upload/check.php',
checkForm,
{ headers: { ...baseHeaders, ...checkForm.getHeaders() } }
);

const checkData = checkResponse.data.response;
if (checkData.result !== 'Success') {
 throw new Error(`📍  Check failed: ${JSON.stringify(checkData)}`);
}

let uploadUrl = 'https://www.mediafire.com/api/upload/resumable.php'; // Default fallback
if (checkData.upload_url && checkData.upload_url.resumable) {
 uploadUrl = checkData.upload_url.resumable;
}

let quickKey = null;

if (checkData.hash_exists === 'yes') {
conn.sendMessage(m.chat, { text: `📍  Este archivo ya existe en la cuenta de Mediafire...` }, { quoted: m });
 return;
}

const targetUrl = `${uploadUrl}?session_token=${sessionToken}&action_token=${actionToken}&response_format=json`;

const resumableHeaders = {
'User-Agent': USER_AGENT,
'x-file-hash': fileHash,
'x-file-size': fileSize.toString(),
'x-file-name': filename,
'x-filename': filename, // Alias
'x-filesize': fileSize.toString(), // Alias
'x-unit-id': '0',
'x-unit-size': fileSize.toString(),
'x-unit-hash': fileHash,
'Content-Type': 'application/octet-stream'
};

const resumableResponse = await axios.post(
targetUrl,
media,
{ 
headers: resumableHeaders,
maxBodyLength: Infinity 
}
);

if (resumableResponse.data && resumableResponse.data.response && resumableResponse.data.response.result === 'Success') {
 const uploadKey = resumableResponse.data.response.doupload.key;
 
 const pollUrl = 'https://www.mediafire.com/api/1.5/upload/poll_upload.php';
 let attempts = 0;
 while (!quickKey && attempts < 20) {
 attempts++;
 const pollData = new FormData();
 pollData.append('key', uploadKey);
 pollData.append('session_token', sessionToken);
 pollData.append('response_format', 'json');
 
 const pollRes = await axios.post(pollUrl, pollData, { headers: {...baseHeaders, ...pollData.getHeaders()} });
 const pollResult = pollRes.data.response;
 
 if (pollResult.doupload.result === '0' && pollResult.doupload.status === '99') {
 quickKey = pollResult.doupload.quickkey;
 } else if (pollResult.doupload.result !== '0') {
 throw new Error(`📍  Poll Error: ${JSON.stringify(pollResult)}`);
 } else {
 await new Promise(r => setTimeout(r, 2000));
 }
 }
}

if (quickKey) {
const link = `https://www.mediafire.com/file/${quickKey}/`;
let toruUpload = `· ┄ · ⊸ 𔓕 *Upload  :  Mediafire*

＃ *Nombre* : ${filename}
＃ *Peso* : ${toruBit(fileSize)}
＃ *Fuente* : ${mediaFont}
＃ *Enlace* : ${link}

> ${textbot}`
const thumbXd = Buffer.from(await (await fetch(`https://files.catbox.moe/uzje6f.jpg`)).arrayBuffer());
await conn.sendMessage(m.chat, { text: toruUpload, mentions: [m.sender], contextInfo: { externalAdReply: { title: "⧿ Upload : Mediafire ⧿", body: botname, thumbnail: thumbXd, sourceUrl: null, mediaType: 1, renderLargerThumbnail: false }}}, { quoted: m }); 
 //await conn.sendMessage(m.chat, { text: toruUpload }, { quoted: m });
} else {
 throw new Error("📍  El proceso de carga se agoto o no se pudo obtener la clave rapida...");
}

} catch (e) {
console.error(e);
conn.sendMessage(m.chat, { text: `${e.message}` }, { quoted: m });
}
}

handler.command = ["upmf"];
export default handler;

function toruBit(bytes) {
if (bytes === 0) return '0 B'
const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
const i = Math.floor(Math.log(bytes) / Math.log(1024))
return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`
}
