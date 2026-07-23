/* eslint-disable */
// =============================================================================
// IoTebe — Camada de Demonstração
// Globais de fornecedores (vendor globals).
//
// O código original roda sob Create React App (webpack), que tolera certas
// bibliotecas legadas que esperam `window.jQuery` / `window.moment` definidos
// globalmente (Bootstrap 4 JS e o plugin bootstrap-daterangepicker usado por
// react-bootstrap-daterangepicker).
//
// Sob Vite/ESM isso não é automático, então expomos os globais aqui.
// ESTE DEVE SER O PRIMEIRO IMPORT do index.js — antes de qualquer módulo que
// importe "bootstrap/dist/js/..." ou o daterangepicker.
//
// Nota: o Popper (exigido pelo Bootstrap 4 JS) é resolvido via alias no
// vite.config.js, que troca o import do bootstrap pelo bundle que já o inclui.
// =============================================================================

import $ from "jquery";
import moment from "moment";
import "moment/locale/pt-br"; // registra o locale (efeito colateral, ESM-safe)

moment.locale("pt-br");

if (typeof window !== "undefined") {
  window.$ = window.jQuery = $;
  window.moment = moment;
}

export { $, moment };
