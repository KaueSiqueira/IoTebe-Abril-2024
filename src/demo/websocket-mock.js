/* eslint-disable */
// Mock do WebSocket para SpecChart — substitui conexão real com resposta sintética
// O SpecChart envia uma mensagem JSON e espera receber dados do gráfico espectral
// Aqui simulamos uma resposta imediata com dados sintéticos

import { FLAT_TREE, getSpotSeverity, getSpotSensorType, velocityRMSFromSeverity, makeSpectrum } from "./db";

function makeSyntheticSpectrumData(chartId) {
  // extrai spot_id do chart_id: "cht-raw-131" → 131
  const parts = String(chartId).split("-");
  const spotId = Number(parts[parts.length - 1]) || 0;
  const sensorType = getSpotSensorType(FLAT_TREE, spotId);
  const severity = getSpotSeverity(spotId);
  // sensor offline (severity null) ou tipo sem espectro (TEMP_ONLY/INTEGRATED)
  // — sem dado de tendência espectral real para mostrar
  if (severity == null || sensorType === "TEMP_ONLY" || sensorType === "INTEGRATED") {
    return {
      non_processed_data_count: 0,
      labels: [],
      chart_name: "Tendência Espectral",
      unit: "mm/s",
      annotations: [],
      chart_config: { amplitude: "RMS", metric: "VELOCIDADE", fmax: 1000, lines: 200, window: "HANNING" },
      data: [],
    };
  }
  const velBase = velocityRMSFromSeverity(severity);
  const spec = makeSpectrum({ rotHz: 24.5, lines: 200, fmax: 1000 });

  // A forma esperada pelo SpecChart (useEffect verifica "labels" in plotData):
  // plotData.labels — array de frequências (eixo X)
  // plotData.data   — array de { axis, data: [{x,y}] }
  // plotData.chart_name, plotData.unit, plotData.annotations, plotData.chart_config
  // plotData.non_processed_data_count
  const freqs = spec.freqs;
  return {
    non_processed_data_count: 0,
    labels: freqs,                      // OBRIGATÓRIO — useEffect testa "labels" in plotData
    chart_name: "Tendência Espectral",
    unit: "mm/s",
    annotations: [],
    chart_config: {
      amplitude: "RMS",
      metric: "VELOCIDADE",
      fmax: 1000,
      lines: 200,
      window: "HANNING",
    },
    data: [
      {
        axis: "VERTICAL",
        data: freqs.map((f, i) => ({ x: f, y: parseFloat((spec.amps[i] * velBase * 1.2).toFixed(4)) })),
      },
      {
        axis: "HORIZONTAL",
        data: freqs.map((f, i) => ({ x: f, y: parseFloat((spec.amps[i] * velBase * 0.9).toFixed(4)) })),
      },
      {
        axis: "AXIAL",
        data: freqs.map((f, i) => ({ x: f, y: parseFloat((spec.amps[i] * velBase * 0.65).toFixed(4)) })),
      },
    ],
  };
}

// Substitui o construtor global WebSocket por um mock que responde automaticamente
const OriginalWebSocket = window.WebSocket;

class MockWebSocket {
  constructor(url) {
    this.url = url;
    this.readyState = WebSocket.CONNECTING;
    this._listeners = {};
    this._chartId = null;

    // Simula abertura assíncrona
    setTimeout(() => {
      this.readyState = WebSocket.OPEN;
      this._dispatch("open", {});
    }, 50);
  }

  addEventListener(type, fn) {
    if (!this._listeners[type]) this._listeners[type] = [];
    this._listeners[type].push(fn);
  }

  _dispatch(type, event) {
    (this._listeners[type] || []).forEach((fn) => fn(event));
  }

  send(message) {
    try {
      const msg = JSON.parse(message);
      const chartId = msg.chart_id || "cht-raw-0";
      console.log("%c[WS mock] send chart_id=" + chartId + " readyState=" + this.readyState, "color:#7c3aed");
      // Responde com dados sintéticos após pequeno delay
      setTimeout(() => {
        const data = makeSyntheticSpectrumData(chartId);
        console.log("%c[WS mock] dispatch message len=" + JSON.stringify(data).length, "color:#7c3aed");
        this._dispatch("message", { data: JSON.stringify(data) });
      }, 100);
    } catch (e) { console.error("[WS mock] send error:", e); }
  }

  close() {
    this.readyState = WebSocket.CLOSED;
  }
}

// Instala o mock — preserva WebSocket original para outros usos não-SpecChart
export function installWebSocketMock() {
  window.WebSocket = MockWebSocket;
  console.info("%c[IoTebe demo] WebSocket mockado — dados espectrais sintéticos", "color:#7c3aed");
}
