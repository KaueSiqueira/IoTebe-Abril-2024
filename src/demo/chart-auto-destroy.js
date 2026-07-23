/* eslint-disable */
// Wrapper do Chart.js que auto-destrói charts existentes antes de criar novos
// Importa pelo path real para evitar ciclo de alias (chart.js/auto → este arquivo → chart.js/auto)
import OriginalChart from "../../node_modules/chart.js/auto/auto.js";

class Chart extends OriginalChart {
  constructor(ctx, config) {
    if (ctx) {
      const canvas = typeof ctx === "string" ? document.getElementById(ctx) : ctx;
      if (canvas) {
        const existing = OriginalChart.getChart(canvas);
        if (existing) existing.destroy();
      }
    }
    super(ctx, config);
  }
}

Object.setPrototypeOf(Chart, OriginalChart);

export default Chart;
