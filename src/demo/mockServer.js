/* eslint-disable */
import axios from "axios";
import { resolveRoute } from "./handlers";

const MIN_LATENCY = 0;
const MAX_LATENCY = 5;

// store importado de store.js (sem dependências — evita ciclo ESM)

function effectivePath(config) {
  let url = config.url || "";
  // URLs absolutas: remove scheme+host
  if (url.startsWith("http")) url = url.replace(/^https?:\/\/[^/]+/i, "");
  // Remove query string — endpoints GET com ?param=value quebravam os regex com $
  // ex: "/group/101/alarm_history?diagnostic_type=pending" → "/group/101/alarm_history"
  const qIdx = url.indexOf("?");
  if (qIdx !== -1) url = url.slice(0, qIdx);
  // Normaliza barra inicial ausente. 29 dos 30 arquivos em src/apis/ constroem
  // a URL como `/spot/${id}/...` (com barra) — mas readSpectrumList.js usa
  // `spot/${id}/spectrum_info` (sem barra), inconsistência do próprio código
  // fonte v2. Com axios.baseURL terminando em "/", a URL final real fica
  // correta de qualquer jeito (concatenação simples) — mas o path CRU que
  // chega aqui no adapter mockado preserva essa diferença, e os regex do
  // PATTERNS (todos escritos como /\/spot\/.../ com barra) nunca casavam
  // para esse único endpoint, caindo no fallback [] silenciosamente.
  if (url && !url.startsWith("/")) url = "/" + url;
  return url;
}

function parseBody(config) {
  // Para GET: config.data é undefined, os parâmetros ficam em config.params
  const d = config.data || config.params;
  if (d == null) return {};
  if (typeof d === "string") { try { return JSON.parse(d); } catch { return d; } }
  return d;
}

function demoAdapter(config) {
  const path = effectivePath(config);
  const body = parseBody(config);

  // LOG DE DIAGNÓSTICO — mostra TODAS as chamadas de escrita ao adapter
  if (/update|create|delete|config/.test(path)) {
    console.log(
      `%c[IoTebe demo] ${path}`,
      "color:#e11d48;font-weight:bold",
      JSON.stringify(body).slice(0, 200)
    );
  }
  if (/readspotinfo|readchartalarms|readspotcondition/.test(path)) {
    console.log(
      `%c[IoTebe demo] ${path}`,
      "color:#7c3aed;font-weight:bold",
      body
    );
  }
  return new Promise((resolve) => {
    const latency = MIN_LATENCY + Math.random() * (MAX_LATENCY - MIN_LATENCY);
    setTimeout(() => {
      let data;
      try { data = resolveRoute(path, body); }
      catch (err) {
        console.warn("[IoTebe demo] erro no handler de mock para", path, err);
        data = [];
      }
      // LOG DIAGNÓSTICO — mostra path + resultado para diagnóstico
      const resultLen = Array.isArray(data) ? data.length : (data && typeof data === "object" ? Object.keys(data).length : data);
      console.log("%c[mock] " + path + " → " + JSON.stringify(resultLen), "color:#059669", body && Object.keys(body).length ? body : "");
      resolve({ data, status: 200, statusText: "OK",
        headers: { "content-type": "application/json" }, config, request: {} });
    }, latency);
  });
}

let installed = false;
export function installDemoServer() {
  if (installed) return;
  installed = true;
  axios.defaults.adapter = demoAdapter;
  console.info("%c[IoTebe] Modo demonstração ativo — backend 100% mockado.", "color:#7c3aed;font-weight:bold");
}

export default demoAdapter;
