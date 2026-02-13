import { gotScraping } from 'got-scraping';
import fs from 'fs';
import { createHash } from 'crypto';
import path from 'path';
import { fileTypeFromBuffer } from 'file-type';

const COOKIE_API = 'https://mfcookies.ryzecodes.xyz/cookies';
const BASE = 'https://www.mediafire.com';
const H = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  'Referer': 'https://app.mediafire.com/',
  'Origin': BASE, // Added Origin header globally
  'Accept': 'application/json',
};
let CK = '';

async function getCookies() {
    try {
        console.log('Fetching cookies from', COOKIE_API);
        const r = await gotScraping({ url: COOKIE_API, responseType: 'json', http2: false });
        if (!Array.isArray(r.body)) {
             throw new Error(`📍 ${JSON.stringify(r.body)}`);
        }
        const mf = r.body.filter(c => (c.domain || '').includes('mediafire.com'));
        if (mf.length === 0) {
             throw new Error('No MediaFire cookies found in API response');
        }
        CK = mf.map(c => `${c.name}=${c.value}`).join('; ');
        console.log(`Cookies updated successfully. Count: ${mf.length}`);
    } catch (e) {
        console.error('Error fetching cookies:', e.message);
        throw e; // Re-throw to Stop execution
    }
}

async function getToken() {
  if (!CK) {
      console.error('No cookies available for getToken');
      return null;
  }
  try {
      const r = await gotScraping({ 
          url: `${BASE}/application/get_session_token.php`, 
          method: 'POST', 
          headers: { ...H, Cookie: CK, 'Origin': BASE }, 
          responseType: 'json',
          http2: false // Force HTTP/1.1 to avoid potential HTTP/2 fingerprinting issues on server
      });
      return r.body?.response?.session_token;
  } catch (e) {
      console.error('Error fetching session token:', e.message);
      if (e.response) {
          console.error('Response body:', e.response.body);
      }
      return null;
  }
}

function multipart(fields) {
  const b = '----WKB' + Math.random().toString(36).slice(2);
  const body = Object.entries(fields).map(([k, v]) => `--${b}\r\nContent-Disposition: form-data; name="${k}"\r\n\r\n${v}`).join('\r\n') + `\r\n--${b}--\r\n`;
  return { body, ct: `multipart/form-data; boundary=${b}` };
}

async function uploadMediaFire(filePath, folder = 'myfiles') {
  const name = path.basename(filePath);
  const data = fs.readFileSync(filePath);
  const size = fs.statSync(filePath).size;
  const hash = createHash('sha256').update(data).digest('hex');
  
  if (!CK) await getCookies();
  
  let st = await getToken();
  if (!st) {
      console.log('First token attempt failed, retrying cookies...');
      await getCookies(); 
      st = await getToken();
      if (!st) throw new Error('No se pudo obtener el token de acceso.');
  }

  const m1 = multipart({ type: 'upload', lifespan: '1440', response_format: 'json', session_token: st });
  const r1 = await gotScraping({ url: `${BASE}/api/1.5/user/get_action_token.php`, method: 'POST', headers: { ...H, Cookie: CK, 'Content-Type': m1.ct }, body: m1.body, responseType: 'json', http2: false });
  if (!r1.body?.response?.action_token) throw new Error(`📍 ${JSON.stringify(r1.body)}`);

  const m2 = multipart({ uploads: JSON.stringify([{ filename: name, folder_key: folder, size, hash, resumable: 'yes', preemptive: 'yes' }]), response_format: 'json', session_token: st });
  const r2 = await gotScraping({ url: `${BASE}/api/1.5/upload/check.php`, method: 'POST', headers: { ...H, Cookie: CK, 'Content-Type': m2.ct }, body: m2.body, responseType: 'json', http2: false });
  if (!r2.body?.response) throw new Error('📍 Fallo del (Check)');

  const ul = r2.body.response?.resumable_upload?.upload_url || `https://ul.mediafireuserupload.com/api/upload/resumable.php?${new URLSearchParams({ response_format: 'json', session_token: st, action_on_duplicate: 'keep', folder_key: folder, source: '54' })}`;

  const r3 = await gotScraping({ url: ul, method: 'POST', headers: { ...H, Cookie: CK, 'Content-Type': 'application/octet-stream', 'x-filename': encodeURIComponent(name), 'x-filesize': String(size), 'x-filehash': hash }, body: data, responseType: 'json', timeout: { request: 300000 } });
  const key = r3.body?.response?.doupload?.key;
  if (!key) throw new Error('Falló la subida (Upload): ' + JSON.stringify(r3.body));

  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 2000));
    const m3 = multipart({ key, response_format: 'json', session_token: st });
    const r4 = await gotScraping({ url: `${BASE}/api/1.5/upload/poll_upload.php`, method: 'POST', headers: { ...H, Cookie: CK, 'Content-Type': m3.ct }, body: m3.body, responseType: 'json' });
    const s = parseInt(r4.body?.response?.doupload?.status || 0);
    if (s >= 99) {
      const qk = r4.body.response.doupload.quickkey;
      return `https://www.mediafire.com/file/${qk}/${encodeURIComponent(name)}/file`;
    }
  }
  throw new Error('📍 Tiempo de solicitud agotado...');
}

let handler = async (m, { conn, usedPrefix, command }) => {
if (!global.db.data.chats[m.chat].fConvert && m.isGroup) {
return conn.sendMessage(m.chat, { text: `📍  Los comandos de *[ convertidor ]* estan desactivados...` }, { quoted: m })
}

  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || '';
  if (!mime) return conn.sendMessage(m.chat, { text: `ᗢ Responda a una extensión para subirla en Mediafire.` }, { quoted: m });
  let mediaFont = "Mediafire"
  try {
    let media = await q.download();
    if (!media) throw new Error(`${mess.fallo}`);

    let type = await fileTypeFromBuffer(media).catch(() => null);
    let ext = type ? type.ext : mime.split('/')[1] || 'bin';
    
    let originalName = q.msg?.fileName || q.fileName || '';
    let filename = originalName 
        ? originalName.replace(/\s+/g, '_') 
        : `toru-mediafire_${Date.now()}.${ext}`;
    
    if (originalName && !path.extname(filename)) {
        filename += `.${ext}`;
    }

    let filepath = path.join('./tmp', filename);
    if (!fs.existsSync('./tmp')) fs.mkdirSync('./tmp');
    
    await m.react("⏰");
    
    fs.writeFileSync(filepath, media);

    let link = await uploadMediaFire(filepath);
let toruUpload = `· ┄ · ⊸ 𔓕 *Mediafire  :  Upload*

＃ *Nombre* : ${filename}
＃ *Fuente* : ${mediaFont}
＃ *Enlace* : ${link}

> ${textbot}`
const toruFire = Buffer.from(await (await fetch(`https://raw.githubusercontent.com/nulswa/files/main/icons/icon-mediafire.jpg`)).arrayBuffer());
    await conn.sendMessage(m.chat, { text: toruUpload, mentions: [m.sender], contextInfo: { externalAdReply: { title: "⧿ Mediafire : Upload ⧿", body: botname, thumbnail: toruFire, sourceUrl: null, mediaType: 1, renderLargerThumbnail: false }}}, { quoted: m });
    if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
  } catch (e) {
    console.error(e);
    await conn.sendMessage(m.chat, { text: `${e.message}` }, { quoted: m });
  }
}

handler.command = ["upmf"];

export default handler;





/*import axios from 'axios';
import fetch from 'node-fetch';
import FormData from 'form-data';
import crypto from 'crypto';

let handler = async (m, { conn, args, usedPrefix, command }) => {
if (!global.db.data.chats[m.chat].fConvert && m.isGroup) {
return conn.sendMessage(m.chat, { text: `📍  Los comandos de *[ convertidor ]* estan desactivados...` }, { quoted: m })
}

let q = m.quoted ? m.quoted : m;
let mime = (q.msg || q).mimetype || '';
if (!mime) return conn.sendMessage(m.chat, { text: `ᗢ Responda a una extención para subirlo en Mediafire.` }, { quoted: m });
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
throw new Error(`${JSON.stringify(sessionData)}`);
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
 throw new Error(`${JSON.stringify(checkData)}`);
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
 throw new Error(`${JSON.stringify(pollResult)}`);
 } else {
 await new Promise(r => setTimeout(r, 2000));
 }
 }
}

if (quickKey) {
const link = `https://www.mediafire.com/file/${quickKey}/`;
let toruUpload = `· ┄ · ⊸ 𔓕 *Mediafire  :  Upload*

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
*/
