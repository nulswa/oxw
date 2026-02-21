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

const INITIAL_REQUEST_TIMEOUT = 30000;
const POLL_TIMEOUT = 10000;
const MAX_WAIT_TIME = 72_000_000;
const POLL_INTERVAL = 2000;

if (path.basename(__filename) !== LIB_NAME) {
  try {
    fs.renameSync(__filename, LIB_PATH);
    console.log("🔁 OptiShield renombrado a OptiShield.js");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error al renombrar:", err.message);
  }
}

const sha256 = d =>
  crypto.createHash("sha256").update(d).digest("hex");

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function autoUpdate() {
  try {
    if (!fs.existsSync(LIB_PATH)) return;
    
    const local = fs.readFileSync(LIB_PATH, "utf8");
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    
    const res = await fetch(REMOTE_URL, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (!res.ok) return;

    const remote = await res.text();
    if (sha256(local) !== sha256(remote)) {
      const backupPath = LIB_PATH + ".backup";
      fs.copyFileSync(LIB_PATH, backupPath);
      fs.writeFileSync(LIB_PATH, remote);
      console.log("⬆️ OptiShield actualizado");
      if (fs.existsSync(backupPath)) fs.unlinkSync(backupPath);
      process.exit(0);
    }
  } catch (err) {
    console.warn("⚠️ Error en auto-actualización:", err.message);
  }
}

await autoUpdate();

function getConfig() {
  try {
    if (!fs.existsSync(CONFIG_PATH)) {
      const defaultConfig = {
        apikey: "ebe2e764b8a003d278472b711498aec7",
        _created: new Date().toISOString()
      };
      fs.writeFileSync(CONFIG_PATH, JSON.stringify(defaultConfig, null, 2));
      throw new Error("⚙️ Config creado en optishield.json - Por favor configura tu APIKEY");
    }

    const configContent = fs.readFileSync(CONFIG_PATH, "utf8");
    if (!configContent.trim()) {
      throw new Error("❌ Archivo optishield.json está vacío");
    }

    const cfg = JSON.parse(configContent);

    if (!cfg.apikey || typeof cfg.apikey !== "string" || cfg.apikey.includes("Favor")) {
      throw new Error("❌ APIKEY inválida en optishield.json");
    }

    return cfg;
  } catch (err) {
    if (err instanceof SyntaxError) {
      throw new Error("❌ Formato JSON inválido en optishield.json");
    }
    throw err;
  }
}

export async function callApi(type, params = {}) {
  if (!type || typeof type !== "string") {
    return { error: "Tipo de API inválido" };
  }

  let apikey;
  try {
    if (params.apikey) {
      apikey = params.apikey;
    } else {
      const config = getConfig();
      apikey = config.apikey;
    }
  } catch (err) {
    return { error: err.message };
  }

  const requestParams = {
    ...params,
    apikey,
    type
  };

  try {
    console.log(`📤 Enviando solicitud: ${type}`);
    
    const { data: initialResponse } = await axios.get(
      "https://optishield.uk/api/",
      {
        params: requestParams,
        timeout: INITIAL_REQUEST_TIMEOUT,
        headers: {
          "User-Agent": "OptiShield/2.0",
          "Accept": "application/json"
        }
      }
    );

    if (initialResponse.error) {
      console.error(`❌ Error de API: ${initialResponse.error}`);
      return initialResponse;
    }

    if (initialResponse.free === true || 
        (initialResponse.status === "ok" && initialResponse.processed === true)) {
      console.log(`✅ Respuesta inmediata recibida para ${type}`);
      return initialResponse;
    }

    if (initialResponse.status === "processing" && initialResponse.timestamp) {
      const timestamp = initialResponse.timestamp;
      console.log(`⏳ Procesando ${type}... (timestamp: ${timestamp})`);

      let elapsed = 0;

      while (elapsed < MAX_WAIT_TIME) {
        await sleep(POLL_INTERVAL);
        elapsed += POLL_INTERVAL;

        try {
          const { data: resultResponse } = await axios.get(
            "https://optishield.uk/api/result",
            {
              params: { timestamp },
              timeout: POLL_TIMEOUT,
              headers: {
                "User-Agent": "OptiShield/2.0",
                "Accept": "application/json"
              }
            }
          );

          if (resultResponse.processed === true && resultResponse.status === "ok") {
            console.log(`✅ ${type} completado en ${(elapsed / 1000).toFixed(1)}s`);
            return resultResponse;
          }

          if (resultResponse.processed === true && resultResponse.status === "error") {
            console.error(`❌ ${type} falló: ${resultResponse.error || "Error desconocido"}`);
            return resultResponse;
          }

          if (resultResponse.status === "processing" && resultResponse.processed === false) {
            const progress = resultResponse.progress || "...";
            console.log(`⏳ Procesando... ${(elapsed / 1000).toFixed(0)}s ${progress}`);
            continue;
          }

          if (resultResponse.error) {
            console.error(`❌ Error consultando Eliminado, la api ah eliminado el resultado o ya no existe el resultado: ${resultResponse.error}`);
            return resultResponse;
          }

          console.warn(`⚠️ Respuesta inesperada en polling:`, resultResponse);

        } catch (pollError) {
          console.warn(`⚠️ Error en polling (${(elapsed / 1000).toFixed(0)}s):`, pollError.message);
          
          if (pollError.code === "ECONNREFUSED" || 
              pollError.code === "ETIMEDOUT" ||
              pollError.code === "ENOTFOUND") {
            continue;
          }
          
          if (pollError.response?.status >= 400) {
            return {
              error: `Error ${pollError.response.status} al consultar resultado`,
              timestamp
            };
          }
        }
      }
      console.warn(`⏱️ [${type}] Tiempo máximo alcanzado, reintentando desde el inicio...`)
      return await callApi(type, params)
    }

    console.warn(`⚠️ Respuesta sin estado de procesamiento:`, initialResponse);
    return initialResponse;

  } catch (error) {
    console.error(`❌ Error en callApi (${type}):`, error.message);
    
    return {
      error: `Error de conexión: ${error.message}`,
      code: error.code,
      details: error.response?.data || null,
      suggestion: "Verifica tu conexión a internet"
    };
  }
}

async function uploadFile(imageBuffer, filename = 'image.png') {
  if (!imageBuffer || !Buffer.isBuffer(imageBuffer)) {
    throw new Error("Buffer inválido");
  }

  if (imageBuffer.length === 0) {
    throw new Error("Buffer vacío");
  }

  if (imageBuffer.length > 99 * 1024 * 1024) {
    throw new Error("Archivo demasiado grande (máx 99MB)");
  }

  try {
    const formData = new FormData();
    formData.append('file', imageBuffer, {
      filename: filename,
      contentType: 'image/png'
    });

    const response = await axios.post('https://optishield.uk/api/upload', formData, {
      headers: {
        ...formData.getHeaders(),
        "User-Agent": "OptiShield/2.0"
      },
      maxContentLength: 99 * 1024 * 1024,
      maxBodyLength: 99 * 1024 * 1024,
      timeout: 120000
    });

    return response.data;
  } catch (error) {
    console.error('❌ Upload error:', error.response?.data || error.message);
    throw new Error(`Error al subir archivo: ${error.message}`);
  }
}

async function uploadFileGitHub(imageBuffer, filename = 'image.png') {
  if (!imageBuffer || !Buffer.isBuffer(imageBuffer)) {
    throw new Error("Buffer inválido");
  }

  if (imageBuffer.length === 0) {
    throw new Error("Buffer vacío");
  }

  if (imageBuffer.length > 99 * 1024 * 1024) {
    throw new Error("Archivo demasiado grande (máx 99MB)");
  }

  try {
    const formData = new FormData();
    formData.append('file', imageBuffer, {
      filename: filename,
      contentType: 'application/octet-stream'
    });

    const response = await axios.post('https://optishield.uk/api/upload/github', formData, {
      headers: {
        ...formData.getHeaders(),
        "User-Agent": "OptiShield/2.0"
      },
      maxContentLength: 99 * 1024 * 1024,
      maxBodyLength: 99 * 1024 * 1024,
      timeout: 120000
    });

    return response.data;
  } catch (error) {
    console.error('❌ Upload GitHub error:', error.response?.data || error.message);
    throw new Error(`Error al subir archivo a GitHub: ${error.message}`);
  }
}

global.OptiShield = {
  callApi,
  uploadFile,
  uploadFileGitHub
};

console.log("Probando OptiShield....");

try {
  console.info(await global.OptiShield.callApi('ok', { apikey: "anonymous" }))
} catch (error) {
  console.error(error)
}

console.log("✅ OptiShield cargado correctamente");

export default global.OptiShield;
