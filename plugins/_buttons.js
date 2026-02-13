import { gotScraping } from 'got-scraping';

const BASE_URL = 'https://cue.cuevana3.nu';
const HEADERS = {
    'referer': `${BASE_URL}/`,
    'x-requested-with': 'XMLHttpRequest',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
};

async function cuevanaSearch(query) {
    const urls = [
        `${BASE_URL}/wp-json/cuevana/v1/search?q=${encodeURIComponent(query)}`,
        `${BASE_URL}/wp-json/cuevana/v1/search-title?q=${encodeURIComponent(query)}`
    ];

    for (const url of urls) {
        try {
            const response = await gotScraping({ url, headers: HEADERS });
            const data = JSON.parse(response.body);

            let items = null;
            if (Array.isArray(data) && data.length > 0) items = data;
            else if (data?.items?.length) items = data.items;
            else if (data?.data?.length) items = data.data;

            if (items) return items;
        } catch (e) { }
    }
    return [];
}

let handler = async (m, { conn, args, usedPrefix, command }) => {
    const text = args.length >= 1 ? args.join(" ") : null;
    if (!text) return m.reply(`*⚠️ Ingrese el nombre de una película o serie.*\nEjemplo: ${usedPrefix + command} naruto`);

    try {
        await m.react('⏳');
        const results = await cuevanaSearch(text);

        if (!results || results.length === 0) {
            return m.reply('❌ No se encontraron resultados.');
        }

        let msg = `🎬 *Resultados para:* _${text}_\n\n`;

        results.slice(0, 10).forEach((item, i) => {
            const title = item.title || item.name || 'Sin título';
            let url = item.url || item.permalink || item.link || '';
            if (url.startsWith('/')) url = BASE_URL + url;
            const year = item.release || item.year || item.release_year || '';
            const type = item.type || 'Película';

            msg += `*${i + 1}.* ${title}`;
            if (year) msg += ` _(${year})_`;
            msg += `\n📌 ${type}`;
            if (url) msg += `\n🔗 ${url}`;
            msg += `\n\n`;
        });

        if (results.length > 10) msg += `_...y ${results.length - 10} resultados más_`;

        await conn.sendMessage(m.chat, { text: msg.trim() }, { quoted: m });
        await m.react('✅');

    } catch (e) {
        console.error(e);
        m.reply(`❌ Error: ${e.message || 'Ocurrió un error inesperado.'}`);
    }
}

handler.help = ['cuevana <nombre>']
handler.tags = ['search']
handler.command = ['cuevana', 'pelicula', 'movie']

export default handler;

