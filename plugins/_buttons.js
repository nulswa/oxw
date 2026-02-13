
import { gotScraping } from 'got-scraping';
import { randomUUID } from 'crypto';

const _0x = ['Y2hhdC53cm1ncHQuY29t', 'X19Ib3N0LWF1dGhqcy5jc3JmLXRva2Vu', 'MTE0ODkyNTYwOTE0OWQ1OTQ0M2NjZjVkZjE2ZGY2MTliOTFkZDcxYmM1ZjA3ZWQxNWRmNjhhYzQ3OTYwZjhjMSU3QzNhMGUzMWYwN2IzZTRjYzBhZDY5OWFiYzczYTA5ZjUzOTdjMDgyZTMxNzVhMzlmZDM3MDQ3ZWUzYmE0MjFmMDc=', 'X19TZWN1cmUtYXV0aGpzLmNhbGxiYWNrLXVybA==', 'aHR0cHMlM0ElMkYlMkZjaGF0LndybWdwdC5jb20lMkY=', 'X19TZWN1cmUtYXV0aGpzLnNlc3Npb24tdG9rZW4=', 'ZXlKaGJHY2lPaUprYVhJaUxDSmxibU1pT2lKQk1qVTJRMEpETFVoVE5URXlJaXdpYTJsa0lqb2lSbmxFU2pRMVVYRlFlRFZSU1Zob2FWTlNRazV1TkZCSGNGQkZWblF6YmpCWlRWaFJWR2xFWjNoTmVTMUthRVpDTlRKUU9XeDZkMGx2TlRSSU9EVTFYM0pOVnpoV1RIRTBVVVZEVUV4VFdGOWFMVGgyYVhjaWZRLi5XalluOVd6N1c2U2J1cEx2ZmtIMFJnLnZsNkNuRFZTeVNpMXZDZUtoRFpBSkFleGM0NjdJbjY4ZzIyc2NNVnNVUHVldUtRdTZ0Qmp0ZllJbFp5Q1FmMUx0ejRwOFFqd3lNWGREanUtb3VuOTFRaWxnN3RHR25qcW5SRDU0MG45RUFILWZiLXpsWTZwOExDdC1rbW5NQkRZSGdaQWs4cDF4SVFfaVlWMHp5V0huenh4Q1lqS2x4alBpR2tQUm9XQnJUdi1NSko0YlN4WFVBeWtidHZmSGdCZmRNVmY1UGVfaXdFU2xjUE1uN0ZiMW5oMkhyaERoUWlkV1UzaHAwd1ZSWnpPNE9GVE10Q1ZXY1pOcXFSRkJpMFBMcjNZTzNzdkJVTEo1MldWVDRILWtZb1I4VEJ4Z1lVSGw1MzBzS25NRHNnQnliRWtJYS1yejdfVkdBTHpQVzRpbHctemRkZG1nMUNsbzQ3QjI5SUZ5dWQzNTJGREV2d2lXazQ3b0ZiSElHaXlOWWJnS1ozbGlJTHI3Y1JJNjJNTVQxZ0VhNF9uMGpGNjNmUTBjNXgxalNzMVdTSGVGalozTjBYR0Y1eGJlY2ZZV0VYMk5nUGh4WDRuQ19zQ0R3cXRBT3RMbTd6R0tEWDVqLXh3VGtwSlpRLnFYZ1hmLUhVbWdjV0FPS1NmUXJuRjZhSm5ZYWtrMm5iWnJWZ0J3bWNpTms='];
const _d = s => Buffer.from(s, 'base64').toString();
const _h = _0x.map(_d);
const _ck = `${_h[1]}=${_h[2]}; ${_h[3]}=${_h[4]}; ${_h[5]}=${_h[6]}`;
const B = 'https://' + _h[0];
const H = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36',
  'sec-ch-ua': '"Not(A:Brand";v="8", "Chromium";v="144", "Google Chrome";v="144"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Windows"',
  'DNT': '1',
  'Origin': B,
  'Cookie': _ck
};

async function wormGpt(msg) {
  const id = randomUUID();
  try {
    const r = await gotScraping({
      url: `${B}/api/chat`,
      method: 'POST',
      headers: { ...H,
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream, */*',
        'Referer': `${B}/chat/${id}`,
        'x-request-ts': Date.now().toString()
      },
      body: JSON.stringify({
        id,
        message: {
          role: 'user',
          parts: [{
            type: 'text',
            text: msg
          }]
        },
        selectedChatModel: 'wormgpt-v6.5',
        selectedVisibilityType: 'private',
        searchEnabled: false,
        memoryLength: 8
      }),
      throwHttpErrors: false,
      responseType: 'text',
      timeout: {
        request: 60000
      }
    });

    if (r.statusCode === 200) {
      let t = '';
      for (const l of r.body.split('\n')) {
        const s = l.trim();
        if (s.startsWith('data: ') && s !== 'data: [DONE]') {
          try {
            const d = JSON.parse(s.slice(6));
            if (d.type === 'text-delta' && d.delta) t += d.delta
          } catch {}
        }
      }
      return t || r.body.slice(0, 3000)
    } else {
      throw new Error(`Error ${r.statusCode}: ${r.body?.slice(0, 200)}`)
    }
  } catch (e) {
    throw e;
  }
}

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply("✨ Ingresa una consulta para WormGPT.");
  
  await m.react?.('✨')
  
  try {
    const respuesta = await wormGpt(text);
    if (!respuesta) throw new Error("Sin respuesta");
    
    await m.react?.('🌟');
    await conn.sendMessage(m.chat, {
        text: respuesta
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    await m.react?.('❌');
    m.reply(`❌ Error: ${e.message}`);
  }
}

handler.help = ['wormgpt', 'wrm']
handler.tags = ['ai']
handler.command = ["worm"]

export default handler


