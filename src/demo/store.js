/* eslint-disable */
// =============================================================================
// IoTebe — Camada de Demonstração
// store.js — memória de sessão (reseta no F5/reload).
//
// Arquivo sem dependências próprias — existe para quebrar a importação circular
// handlers.js ↔ mockServer.js. Ambos importam store.js; ninguém cria ciclos.
// =============================================================================

const sessionStore = {
  gateways:    {},  // gateway_id  → campos editados
  spots:       {},  // spot_id     → campos editados
  chartAlarms: {},  // chart_id    → { alarm_alert, alarm_critical, ... }
};

export const store = {
  // Gateway
  getGateway: (id) => sessionStore.gateways[id] || null,
  setGateway: (id, patch) => {
    sessionStore.gateways[id] = { ...(sessionStore.gateways[id] || {}), ...patch };
  },

  // Spot (configuração + alarmes)
  getSpot: (id) => sessionStore.spots[id] || null,
  setSpot: (id, patch) => {
    sessionStore.spots[id] = { ...(sessionStore.spots[id] || {}), ...patch };
  },

  // Alarmes de gráfico customizável
  getChartAlarms: (id) => sessionStore.chartAlarms[id] || null,
  setChartAlarms: (id, patch) => {
    sessionStore.chartAlarms[id] = { ...(sessionStore.chartAlarms[id] || {}), ...patch };
  },
};
