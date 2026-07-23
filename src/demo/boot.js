/* eslint-disable */
// =============================================================================
// IoTebe — Camada de Demonstração
// Boot do modo demo.
//
// Importado como a PRIMEIRA linha de src/index.js. Como os imports ESM são
// avaliados em ordem, este módulo termina de rodar (globais + adapter do axios
// instalados) ANTES de App e seus imports transitivos (bootstrap JS, arquivos
// de API) serem avaliados. É a garantia de ordem de inicialização.
// =============================================================================

import "./vendor-globals"; // window.$ / window.jQuery / window.moment
import { installDemoServer } from "./mockServer";
import { installWebSocketMock } from "./websocket-mock";
import Chart from "chart.js/auto";

installDemoServer();
installWebSocketMock();

Chart.defaults.animation = false; // axios.defaults.adapter = mock
