import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import FormData from "form-data";
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LIB_NAME = "OptiShield.js";
const LIB_PATH = path.join(__dirname, LIB_NAME);
const CONFIG_PATH = path.join(__dirname, "optishield.json");
const REMOTE_URL = "https://optishield.uk/OptiShield.js";

if (path.basename(__filename) !== LIB_NAME) {
  fs.renameSync(__filename, LIB_PATH);
  console.log("🔁 OptiShield renombrado a OptiShield.js");
  process.exit(0);
}

const sha256 = d =>
  crypto.createHash("sha256").update(d).digest("hex");

async function autoUpdate() {
  try {
    const local = fs.readFileSync(LIB_PATH, "utf8");
    const res = await fetch(REMOTE_URL);
    if (!res.ok) return;

    const remote = await res.text();
    if (sha256(local) !== sha256(remote)) {
      fs.writeFileSync(LIB_PATH, remote);
      console.log("⬆️ OptiShield actualizado");
      process.exit(0);
    }
  } catch {}
}
await autoUpdate();

function getConfig() {
  if (!fs.existsSync(CONFIG_PATH)) {
    fs.writeFileSync(
      CONFIG_PATH,
      JSON.stringify(
        { apikey: "ebe2e764b8a003d278472b711498aec7" },
        null,
        2
      )
    );
    throw new Error("Config creado, coloca tu APIKEY");
  }

  const cfg = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
  if (!cfg.apikey || cfg.apikey.includes("Favor")) {
    throw new Error("APIKEY inválida en optishield.json");
  }

  return cfg;
}

const MAX_RETRIES = 10;
const RETRY_DELAY = 200;

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

export async function callApi(type, params = {}) {
  const { apikey } = params.apikey ? params.apikey : await getConfig();

  let attempt = 0;
  let lastError;

  while (attempt < MAX_RETRIES) {
    try {
      attempt++;

      const { data } = await axios.get(
        "https://optishield.uk/api/",
        {
          params: {
            ...params,
            apikey,
            type
          },
          timeout: 15_000
        }
      );

      if (!data) {
        throw new Error("Respuesta vacía");
      }

      return data;

    } catch (err) {
      lastError = err;

      console.warn(
        `⚠️ OptiShield intento ${attempt}/${MAX_RETRIES} falló:`,
        err.message
      );

      if (attempt >= MAX_RETRIES) break;

      await sleep(RETRY_DELAY * attempt);
    }
  }
  return { error: `OptiShield falló tras ${MAX_RETRIES} intentos: ${lastError?.message}` }
}


export async function uploadFile(
  buffer,
  filename = "file.bin",
  mime = "application/octet-stream"
) {
  const { apikey } = getConfig();

  const form = new FormData();
  form.append("file", buffer, {
    filename,
    contentType: mime
  });

  const res = await fetch(
    "https://optishield.uk/api/upload",
    {
      method: "POST",
      headers: {
        "Authorization": apikey,
        ...form.getHeaders()
      },
      body: form
    }
  );

  return res.json();
}

/* =========================
   GLOBAL EXPORT
========================= */
global.OptiShield = {
  callApi,
  uploadFile
};
