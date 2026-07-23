/* eslint-disable */
// =============================================================================
// IoTebe — Camada de Demonstração
// Dataset mockado. NENHUMA chamada de backend real é feita no modo demo.
// Este arquivo NÃO altera UI/comportamento — apenas fornece dados de exemplo
// com a MESMA forma que o backend retornava, para que cada tela renderize.
// =============================================================================

// -----------------------------------------------------------------------------
// Identidade do usuário logado (mock)
// -----------------------------------------------------------------------------
export const DEMO_USER = {
  name: "Kauê Siqueira",
  username: "kaue.demo",
  email: "demo@iotebe.com.br",
  company_name: "Tebe",
  phone_number: "+5519999999999",
  locale: "Tebe",
};

// -----------------------------------------------------------------------------
// SEVERIDADE — fonte única da verdade de "quão comprometida" está cada máquina.
// Tudo que antes era definido em paralelo (alarmLabel, amplitude dos gráficos,
// defeitos) agora é CALCULADO a partir de um único número por ponto. Isso não é
// cosmético: os mesmos limiares de alarme usados na tela de configuração do
// ponto (alarm_1vel=3.5, alarm_2vel=7.1 mm/s) são os limiares usados aqui para
// classificar o estado — não uma tabela de cores escolhida à parte.
// severity: 0 (perfeitamente saudável) .. 1 (pico do limite crítico de fábrica)
// null = sensor offline (GRAY) — não é "severidade zero", é ausência de leitura.
// -----------------------------------------------------------------------------
export const SPOT_SEVERITY = {
  131: 0.90,  // Motor LA — desbalanceamento severo, vel≈8.4mm/s → RED
  132: 0.55,  // Motor LOA — desalinhamento moderado, vel≈5.6mm/s → YELLOW
  133: 0.06,  // Ventilador Mancal — saudável
  134: 0.45,  // Acionamento Redutor — folga+lubrificação, vel≈4.8mm/s → YELLOW
  135: 0.08,  // Tambor de Retorno — saudável
  136: 0.05,  // Prensagem Motor LA — saudável
  137: 0.10,  // Redutor Saída — saudável
  138: null,  // Motor Acoplamento — GRAY (sensor offline, bateria crítica)
  231: 0.50,  // Terno Moagem Acionamento — engrenamento, vel≈5.2mm/s → YELLOW
  232: 0.12,  // Redutor Planetário — saudável
  233: 0.04,  // Bomba de Caldo Motor — saudável
  331: 0.03,  // Envasadora Motor — saudável
  139: 0.10,  // Mancal Dianteiro (TEMP_ONLY) — saudável, só temperatura
  140: 0.15,  // Selo Mecânico (INTEGRATED) — saudável, dado bruto via API 3ª parte
};

// Limiares — os MESMOS valores usados em alarm_1vel/alarm_2vel no readspotinfo
// e em alarm_alert/alarm_critical no plotchart. A classificação abaixo não é
// uma segunda opinião: é literalmente a mesma régua aplicada ao valor calculado.
const ALARM_1_VEL = 3.5; // mm/s — limiar de alerta
const ALARM_2_VEL = 7.1; // mm/s — limiar crítico
const ALARM_1_TEMP = 65; // °C
const ALARM_2_TEMP = 80; // °C

// RMS de velocidade "visto" na tela — calculado a partir da severidade.
// Faixa: 1.2 mm/s (parado/saudável) até ~9.2 mm/s (bem acima do crítico).
export function velocityRMSFromSeverity(severity) {
  if (severity == null) return null;
  return parseFloat((1.2 + severity * 8.0).toFixed(3));
}
// RMS de aceleração — cresce mais rápido que a velocidade em defeitos de alta
// frequência (rolamento/engrenamento), por isso o fator não é uma fração fixa
// da velocidade: usa a mesma severidade mas com curva própria.
export function accelRMSFromSeverity(severity) {
  if (severity == null) return null;
  return parseFloat((0.12 + severity * 0.95).toFixed(3));
}
// Temperatura — sobe com atrito/degradação mecânica associada à severidade.
export function tempFromSeverity(severity) {
  if (severity == null) return null;
  return parseFloat((38 + severity * 42).toFixed(1));
}
// alarmLabel É o resultado de comparar o valor calculado contra os MESMOS
// limiares mostrados na tela de alarmes — não uma cor escolhida a dedo.
export function alarmLabelFromSeverity(severity) {
  if (severity == null) return "GRAY";
  const vel = velocityRMSFromSeverity(severity);
  if (vel >= ALARM_2_VEL) return "RED";
  if (vel >= ALARM_1_VEL) return "YELLOW";
  return "GREEN";
}
// atalho usado ao montar o FLAT_TREE — mantém a definição da árvore legível
function sevAlarm(spotId) {
  return alarmLabelFromSeverity(SPOT_SEVERITY[spotId]);
}

// -----------------------------------------------------------------------------
// Árvore de ativos (FORMATO PLANO — exatamente como `readassetstree` devolvia)
// Cada nó: { id, type, parent, permission, title, alarmLabel, sensor_id }
// type ∈ GROUP | PLANT | SECTOR | EQUIPMENT | SPOT
// alarmLabel ∈ GREEN | YELLOW | RED | GRAY — para SPOT, sempre sevAlarm(id);
// para PLANT/SECTOR/EQUIPMENT é recalculado logo abaixo por rollup dos filhos
// (Tree.jsx colore TODO nó da árvore com base nisso, não só folhas).
// sensorType ∈ FULL (vibração+temperatura, protocolo nativo) |
//              TEMP_ONLY (só temperatura) |
//              INTEGRATED (vibração via API de terceiro, dado pouco tratado)
// A UI monta a hierarquia via getTreeFromFlatData (react-sortable-tree).
// -----------------------------------------------------------------------------
export const FLAT_TREE = [
  // IDs são NUMÉRICOS — o updateAssetsTree.js faz Number(parentNode.id) para enviar
  // o parent ao backend. Com IDs string, Number("plt-graos") = NaN → null no JSON
  // → hierarquia destruída no transporte. IDs numéricos preservam a hierarquia.
  // Tree.jsx já trata ids > 0 como numéricos (linha 125: if (node.node.id > 0)).

  // PLANTA 1 — Processadora de Grãos
  { id: 101, type: "PLANT",     parent: null, permission: ["CONFIG_ASSETS_TREE", "CONFIG_SPOTS", "CONFIG_ALARMS", "MAKE_ANNOTATIONS", "CONFIG_CHARTS", "CONFIG_MACHINE_INFO", "MANAGE_DIAGNOSTICS", "MANAGE_USERS", "API_ACCESS", "COMPLETE_DIAGNOSTICS"],  title: "Processadora de Grãos — Unidade Leste",  alarmLabel: "RED",    sensor_id: null },
  { id: 111, type: "SECTOR",    parent: 101,  permission: ["CONFIG_ASSETS_TREE", "CONFIG_SPOTS", "CONFIG_ALARMS", "MAKE_ANNOTATIONS", "CONFIG_CHARTS", "CONFIG_MACHINE_INFO", "MANAGE_DIAGNOSTICS", "MANAGE_USERS", "API_ACCESS", "COMPLETE_DIAGNOSTICS"],  title: "Extração",                               alarmLabel: "RED",    sensor_id: null },
  { id: 121, type: "EQUIPMENT", parent: 111,  permission: ["CONFIG_ASSETS_TREE", "CONFIG_SPOTS", "CONFIG_ALARMS", "MAKE_ANNOTATIONS", "CONFIG_CHARTS", "CONFIG_MACHINE_INFO", "MANAGE_DIAGNOSTICS", "MANAGE_USERS", "API_ACCESS", "COMPLETE_DIAGNOSTICS"],  title: "Exaustor Principal 01",                  alarmLabel: "RED",    sensor_id: null },
  { id: 131, type: "SPOT",      parent: 121,  permission: ["CONFIG_ASSETS_TREE", "CONFIG_SPOTS", "CONFIG_ALARMS", "MAKE_ANNOTATIONS", "CONFIG_CHARTS", "CONFIG_MACHINE_INFO", "MANAGE_DIAGNOSTICS", "MANAGE_USERS", "API_ACCESS", "COMPLETE_DIAGNOSTICS"],  title: "Motor • LA",                             alarmLabel: sevAlarm(131), sensor_id: "sn-0001", sensorType: "FULL" },
  { id: 132, type: "SPOT",      parent: 121,  permission: ["CONFIG_ASSETS_TREE", "CONFIG_SPOTS", "CONFIG_ALARMS", "MAKE_ANNOTATIONS", "CONFIG_CHARTS", "CONFIG_MACHINE_INFO", "MANAGE_DIAGNOSTICS", "MANAGE_USERS", "API_ACCESS", "COMPLETE_DIAGNOSTICS"],  title: "Motor • LOA",                            alarmLabel: sevAlarm(132), sensor_id: "sn-0002", sensorType: "FULL" },
  { id: 133, type: "SPOT",      parent: 121,  permission: ["CONFIG_ASSETS_TREE", "CONFIG_SPOTS", "CONFIG_ALARMS", "MAKE_ANNOTATIONS", "CONFIG_CHARTS", "CONFIG_MACHINE_INFO", "MANAGE_DIAGNOSTICS", "MANAGE_USERS", "API_ACCESS", "COMPLETE_DIAGNOSTICS"],  title: "Ventilador • Mancal",                    alarmLabel: sevAlarm(133), sensor_id: "sn-0003", sensorType: "FULL" },
  { id: 122, type: "EQUIPMENT", parent: 111,  permission: ["CONFIG_ASSETS_TREE", "CONFIG_SPOTS", "CONFIG_ALARMS", "MAKE_ANNOTATIONS", "CONFIG_CHARTS", "CONFIG_MACHINE_INFO", "MANAGE_DIAGNOSTICS", "MANAGE_USERS", "API_ACCESS", "COMPLETE_DIAGNOSTICS"],  title: "Correia Transportadora 02",              alarmLabel: "YELLOW", sensor_id: null },
  { id: 134, type: "SPOT",      parent: 122,  permission: ["CONFIG_ASSETS_TREE", "CONFIG_SPOTS", "CONFIG_ALARMS", "MAKE_ANNOTATIONS", "CONFIG_CHARTS", "CONFIG_MACHINE_INFO", "MANAGE_DIAGNOSTICS", "MANAGE_USERS", "API_ACCESS", "COMPLETE_DIAGNOSTICS"],  title: "Acionamento • Redutor",                  alarmLabel: sevAlarm(134), sensor_id: "sn-0004", sensorType: "FULL" },
  { id: 135, type: "SPOT",      parent: 122,  permission: ["CONFIG_ASSETS_TREE", "CONFIG_SPOTS", "CONFIG_ALARMS", "MAKE_ANNOTATIONS", "CONFIG_CHARTS", "CONFIG_MACHINE_INFO", "MANAGE_DIAGNOSTICS", "MANAGE_USERS", "API_ACCESS", "COMPLETE_DIAGNOSTICS"],  title: "Tambor de Retorno",                      alarmLabel: sevAlarm(135), sensor_id: "sn-0005", sensorType: "FULL" },
  { id: 112, type: "SECTOR",    parent: 101,  permission: ["CONFIG_ASSETS_TREE", "CONFIG_SPOTS", "CONFIG_ALARMS", "MAKE_ANNOTATIONS", "CONFIG_CHARTS", "CONFIG_MACHINE_INFO", "MANAGE_DIAGNOSTICS", "MANAGE_USERS", "API_ACCESS", "COMPLETE_DIAGNOSTICS"],  title: "Prensagem",                              alarmLabel: "GREEN",  sensor_id: null },
  { id: 123, type: "EQUIPMENT", parent: 112,  permission: ["CONFIG_ASSETS_TREE", "CONFIG_SPOTS", "CONFIG_ALARMS", "MAKE_ANNOTATIONS", "CONFIG_CHARTS", "CONFIG_MACHINE_INFO", "MANAGE_DIAGNOSTICS", "MANAGE_USERS", "API_ACCESS", "COMPLETE_DIAGNOSTICS"],  title: "Prensa Expeller 01",                     alarmLabel: "GREEN",  sensor_id: null },
  { id: 136, type: "SPOT",      parent: 123,  permission: ["CONFIG_ASSETS_TREE", "CONFIG_SPOTS", "CONFIG_ALARMS", "MAKE_ANNOTATIONS", "CONFIG_CHARTS", "CONFIG_MACHINE_INFO", "MANAGE_DIAGNOSTICS", "MANAGE_USERS", "API_ACCESS", "COMPLETE_DIAGNOSTICS"],  title: "Motor • LA",                             alarmLabel: sevAlarm(136), sensor_id: "sn-0006", sensorType: "FULL" },
  { id: 137, type: "SPOT",      parent: 123,  permission: ["CONFIG_ASSETS_TREE", "CONFIG_SPOTS", "CONFIG_ALARMS", "MAKE_ANNOTATIONS", "CONFIG_CHARTS", "CONFIG_MACHINE_INFO", "MANAGE_DIAGNOSTICS", "MANAGE_USERS", "API_ACCESS", "COMPLETE_DIAGNOSTICS"],  title: "Redutor • Saída",                        alarmLabel: sevAlarm(137), sensor_id: "sn-0007", sensorType: "FULL" },
  { id: 139, type: "SPOT",      parent: 123,  permission: ["CONFIG_ASSETS_TREE", "CONFIG_SPOTS", "CONFIG_ALARMS", "MAKE_ANNOTATIONS", "CONFIG_CHARTS", "CONFIG_MACHINE_INFO", "MANAGE_DIAGNOSTICS", "MANAGE_USERS", "API_ACCESS", "COMPLETE_DIAGNOSTICS"],  title: "Mancal Dianteiro • Temperatura",         alarmLabel: sevAlarm(139), sensor_id: "sn-0013", sensorType: "TEMP_ONLY" },
  { id: 124, type: "EQUIPMENT", parent: 112,  permission: ["CONFIG_ASSETS_TREE", "CONFIG_SPOTS", "CONFIG_ALARMS", "MAKE_ANNOTATIONS", "CONFIG_CHARTS", "CONFIG_MACHINE_INFO", "MANAGE_DIAGNOSTICS", "MANAGE_USERS", "API_ACCESS", "COMPLETE_DIAGNOSTICS"],  title: "Bomba de Óleo 03",                       alarmLabel: "GRAY",   sensor_id: null },
  { id: 138, type: "SPOT",      parent: 124,  permission: ["CONFIG_ASSETS_TREE", "CONFIG_SPOTS", "CONFIG_ALARMS", "MAKE_ANNOTATIONS", "CONFIG_CHARTS", "CONFIG_MACHINE_INFO", "MANAGE_DIAGNOSTICS", "MANAGE_USERS", "API_ACCESS", "COMPLETE_DIAGNOSTICS"],  title: "Motor • Acoplamento",                    alarmLabel: sevAlarm(138), sensor_id: "sn-0008", sensorType: "FULL" },
  { id: 140, type: "SPOT",      parent: 124,  permission: ["CONFIG_ASSETS_TREE", "CONFIG_SPOTS", "CONFIG_ALARMS", "MAKE_ANNOTATIONS", "CONFIG_CHARTS", "CONFIG_MACHINE_INFO", "MANAGE_DIAGNOSTICS", "MANAGE_USERS", "API_ACCESS", "COMPLETE_DIAGNOSTICS"],  title: "Selo Mecânico",                          alarmLabel: sevAlarm(140), sensor_id: "sn-0014", sensorType: "INTEGRATED" },

  // PLANTA 2 — Usina de Açúcar e Álcool
  { id: 201, type: "PLANT",     parent: null, permission: ["CONFIG_ASSETS_TREE", "CONFIG_SPOTS", "CONFIG_ALARMS", "MAKE_ANNOTATIONS", "CONFIG_CHARTS", "CONFIG_MACHINE_INFO", "MANAGE_DIAGNOSTICS", "MANAGE_USERS", "API_ACCESS", "COMPLETE_DIAGNOSTICS"],  title: "Usina de Açúcar e Álcool — Moenda",     alarmLabel: "YELLOW", sensor_id: null },
  { id: 211, type: "SECTOR",    parent: 201,  permission: ["CONFIG_ASSETS_TREE", "CONFIG_SPOTS", "CONFIG_ALARMS", "MAKE_ANNOTATIONS", "CONFIG_CHARTS", "CONFIG_MACHINE_INFO", "MANAGE_DIAGNOSTICS", "MANAGE_USERS", "API_ACCESS", "COMPLETE_DIAGNOSTICS"],  title: "Moenda",                                 alarmLabel: "YELLOW", sensor_id: null },
  { id: 221, type: "EQUIPMENT", parent: 211,  permission: ["CONFIG_ASSETS_TREE", "CONFIG_SPOTS", "CONFIG_ALARMS", "MAKE_ANNOTATIONS", "CONFIG_CHARTS", "CONFIG_MACHINE_INFO", "MANAGE_DIAGNOSTICS", "MANAGE_USERS", "API_ACCESS", "COMPLETE_DIAGNOSTICS"],  title: "Terno de Moagem 01",                     alarmLabel: "YELLOW", sensor_id: null },
  { id: 231, type: "SPOT",      parent: 221,  permission: ["CONFIG_ASSETS_TREE", "CONFIG_SPOTS", "CONFIG_ALARMS", "MAKE_ANNOTATIONS", "CONFIG_CHARTS", "CONFIG_MACHINE_INFO", "MANAGE_DIAGNOSTICS", "MANAGE_USERS", "API_ACCESS", "COMPLETE_DIAGNOSTICS"],  title: "Acionamento • Motor",                    alarmLabel: sevAlarm(231), sensor_id: "sn-0009", sensorType: "FULL" },
  { id: 232, type: "SPOT",      parent: 221,  permission: ["CONFIG_ASSETS_TREE", "CONFIG_SPOTS", "CONFIG_ALARMS", "MAKE_ANNOTATIONS", "CONFIG_CHARTS", "CONFIG_MACHINE_INFO", "MANAGE_DIAGNOSTICS", "MANAGE_USERS", "API_ACCESS", "COMPLETE_DIAGNOSTICS"],  title: "Redutor Planetário",                     alarmLabel: sevAlarm(232), sensor_id: "sn-0010", sensorType: "FULL" },
  { id: 222, type: "EQUIPMENT", parent: 211,  permission: ["CONFIG_ASSETS_TREE", "CONFIG_SPOTS", "CONFIG_ALARMS", "MAKE_ANNOTATIONS", "CONFIG_CHARTS", "CONFIG_MACHINE_INFO", "MANAGE_DIAGNOSTICS", "MANAGE_USERS", "API_ACCESS", "COMPLETE_DIAGNOSTICS"],  title: "Bomba de Caldo 02",                      alarmLabel: "GREEN",  sensor_id: null },
  { id: 233, type: "SPOT",      parent: 222,  permission: ["CONFIG_ASSETS_TREE", "CONFIG_SPOTS", "CONFIG_ALARMS", "MAKE_ANNOTATIONS", "CONFIG_CHARTS", "CONFIG_MACHINE_INFO", "MANAGE_DIAGNOSTICS", "MANAGE_USERS", "API_ACCESS", "COMPLETE_DIAGNOSTICS"],  title: "Motor • LA",                             alarmLabel: sevAlarm(233), sensor_id: "sn-0011", sensorType: "FULL" },

  // PLANTA 3 — Fábrica de Alimentos (VIEWER — exercita permissão compartilhada)
  { id: 301, type: "PLANT",     parent: null, permission: [], title: "Fábrica de Alimentos — Linha de Envase", alarmLabel: "GREEN",  sensor_id: null },
  { id: 321, type: "EQUIPMENT", parent: 301,  permission: [], title: "Envasadora 01",                          alarmLabel: "GREEN",  sensor_id: null },
  { id: 331, type: "SPOT",      parent: 321,  permission: [], title: "Motor • LA",                             alarmLabel: sevAlarm(331), sensor_id: "sn-0012", sensorType: "FULL" },
];

// Rollup: PLANT/SECTOR/EQUIPMENT herdam o pior status entre os SPOTs
// descendentes (RED > YELLOW > GRAY > GREEN) — Tree.jsx colore TODO nó da
// árvore com base em alarmLabel, não só as folhas, então isso precisa ser
// coerente com os SPOTs reais, não escolhido à parte.
(function rollUpAlarmLabels() {
  const RANK = { RED: 3, YELLOW: 2, GRAY: 1, GREEN: 0 };
  const spotsByParentChain = (nodeId) => {
    const descendants = [];
    const stack = FLAT_TREE.filter((n) => n.parent === nodeId);
    while (stack.length) {
      const n = stack.pop();
      descendants.push(n);
      FLAT_TREE.filter((c) => c.parent === n.id).forEach((c) => stack.push(c));
    }
    return descendants.filter((n) => n.type === "SPOT");
  };
  FLAT_TREE.forEach((node) => {
    if (node.type === "SPOT") return;
    const spots = spotsByParentChain(node.id);
    if (spots.length === 0) return;
    let worst = "GREEN";
    spots.forEach((s) => { if (RANK[s.alarmLabel] > RANK[worst]) worst = s.alarmLabel; });
    node.alarmLabel = worst;
  });
})();

// -----------------------------------------------------------------------------
// Sensores / spots — info detalhada usada por config de spot e cards
// -----------------------------------------------------------------------------
export const SENSORS = {
  // Processadora de Grãos — Extração (sn-0001 crítico, sn-0002 alerta, sn-0004 alerta)
  "sn-0001": { sensor_id: "sn-0001", serial: "TBE-A1B2C3", spot_name: "Motor • LA",            battery: 23, rssi: -62, last_seen: nowMinus(2),   firmware: "2.4.1" },
  "sn-0002": { sensor_id: "sn-0002", serial: "TBE-D4E5F6", spot_name: "Motor • LOA",           battery: 64, rssi: -71, last_seen: nowMinus(7),   firmware: "2.4.1" },
  "sn-0003": { sensor_id: "sn-0003", serial: "TBE-G7H8I9", spot_name: "Ventilador • Mancal",   battery: 92, rssi: -58, last_seen: nowMinus(1),   firmware: "2.4.1" },
  "sn-0004": { sensor_id: "sn-0004", serial: "TBE-J1K2L3", spot_name: "Acionamento • Redutor", battery: 38, rssi: -78, last_seen: nowMinus(15),  firmware: "2.3.9" },
  "sn-0005": { sensor_id: "sn-0005", serial: "TBE-M4N5O6", spot_name: "Tambor de Retorno",      battery: 81, rssi: -55, last_seen: nowMinus(3),   firmware: "2.4.1" },
  // Processadora de Grãos — Prensagem (saudável)
  "sn-0006": { sensor_id: "sn-0006", serial: "TBE-P7Q8R9", spot_name: "Motor • LA",            battery: 94, rssi: -52, last_seen: nowMinus(1),   firmware: "2.4.1" },
  "sn-0007": { sensor_id: "sn-0007", serial: "TBE-S1T2U3", spot_name: "Redutor • Saída",       battery: 77, rssi: -65, last_seen: nowMinus(4),   firmware: "2.4.1" },
  // Bomba de Óleo — GRAY (offline, bateria crítica)
  "sn-0008": { sensor_id: "sn-0008", serial: "TBE-V4W5X6", spot_name: "Motor • Acoplamento",   battery: 4,  rssi: -97, last_seen: nowMinus(480), firmware: "2.3.8" },
  // Usina de Açúcar e Álcool (sn-0009 alerta)
  "sn-0009": { sensor_id: "sn-0009", serial: "TBE-Y7Z8A9", spot_name: "Acionamento • Motor",   battery: 55, rssi: -74, last_seen: nowMinus(18),  firmware: "2.4.0" },
  "sn-0010": { sensor_id: "sn-0010", serial: "TBE-B1C2D3", spot_name: "Redutor Planetário",     battery: 71, rssi: -68, last_seen: nowMinus(6),   firmware: "2.4.1" },
  "sn-0011": { sensor_id: "sn-0011", serial: "TBE-E4F5G6", spot_name: "Motor • LA",            battery: 88, rssi: -59, last_seen: nowMinus(2),   firmware: "2.4.1" },
  // Fábrica de Alimentos (saudável — VIEWER)
  "sn-0012": { sensor_id: "sn-0012", serial: "TBE-H7I8J9", spot_name: "Motor • LA",            battery: 96, rssi: -51, last_seen: nowMinus(1),   firmware: "2.4.1" },
  // Sensor só-temperatura (TEMP_ONLY) — mesmo protocolo, sem acelerômetro
  "sn-0013": { sensor_id: "sn-0013", serial: "TBE-K3L4M5", spot_name: "Mancal Dianteiro",       battery: 68, rssi: -66, last_seen: nowMinus(5),   firmware: "2.4.1" },
  // Sensor integrado via API de terceiro (INTEGRATED) — dado bruto, pouco tratamento
  "sn-0014": { sensor_id: "sn-0014", serial: "EXT-PLC-0091", spot_name: "Selo Mecânico",         battery: null, rssi: null, last_seen: nowMinus(10),  firmware: null },
};

// -----------------------------------------------------------------------------
// Helpers de tempo
// -----------------------------------------------------------------------------
function nowSec() {
  return Math.floor(Date.now() / 1000);
}
export function nowMinus(minutes) {
  return nowSec() - minutes * 60;
}

// -----------------------------------------------------------------------------
// Geradores de séries temporais (vibração / temperatura) com aparência crível
// -----------------------------------------------------------------------------
export function makeTrend({ points = 180, base = 2.5, noise = 0.6, drift = 0, spikeEvery = 0, spikeMag = 0, stepSec = 3600 }) {
  const end = nowSec();
  const out = [];
  for (let i = points - 1; i >= 0; i--) {
    const t = end - i * stepSec;
    let v = base + drift * (points - i) / points;
    v += (Math.sin(i / 7) + Math.cos(i / 13)) * noise * 0.4;
    v += (Math.random() - 0.5) * noise;
    if (spikeEvery && i % spikeEvery === 0) v += spikeMag;
    out.push([t * 1000, Math.max(0, Number(v.toFixed(3)))]);
  }
  return out;
}

// Espectro FFT sintético (picos em 1x, 2x, 3x da rotação + ruído de fundo)
export function makeSpectrum({ lines = 800, fmax = 1000, rotHz = 24.5 }) {
  const freqs = [];
  const amps = [];
  const df = fmax / lines;
  for (let i = 0; i < lines; i++) {
    const f = i * df;
    let a = Math.random() * 0.02;
    [1, 2, 3, 4].forEach((h, idx) => {
      const center = rotHz * h;
      const d = Math.abs(f - center);
      if (d < 6) a += (0.9 / (idx + 1)) * Math.exp(-(d * d) / 4);
    });
    freqs.push(Number(f.toFixed(2)));
    amps.push(Number(a.toFixed(4)));
  }
  return { freqs, amps, rotHz };
}

// Forma de onda BRUTA no domínio do tempo — este é o dado mais próximo do
// sensor que existe na demo. velocityRMS informa a amplitude fundamental;
// o RMS "medido" (grms_*) é calculado LITERALMENTE a partir dos pontos
// gerados aqui (função rmsOf), não escolhido à parte — se a forma de onda
// mudar, o número exibido no painel muda junto, porque é o mesmo cálculo
// que a UI faria sobre um sinal real.
export function makeRawWaveform({ rotationHz = 24.5, velocityRMS = 1.8, axisScale = 1, points = 512, windowMs = 1000 }) {
  // para uma senoide pura, RMS = amplitude / sqrt(2) — usamos isso como âncora
  // física para calibrar a amplitude fundamental a partir do RMS desejado.
  const baseAmp = velocityRMS * Math.SQRT2 * axisScale;
  const harmonics = [
    { mult: 1, amp: baseAmp * 1.00, phase: Math.random() * Math.PI * 2 },
    { mult: 2, amp: baseAmp * 0.26, phase: Math.random() * Math.PI * 2 },
    { mult: 3, amp: baseAmp * 0.11, phase: Math.random() * Math.PI * 2 },
  ];
  const noiseAmp = baseAmp * 0.07;
  const out = [];
  for (let i = 0; i < points; i++) {
    const t = (i / points) * (windowMs / 1000); // segundos
    let y = 0;
    harmonics.forEach((h) => { y += h.amp * Math.sin(2 * Math.PI * rotationHz * h.mult * t + h.phase); });
    y += (Math.random() - 0.5) * noiseAmp;
    out.push({ x: parseFloat((t * 1000).toFixed(3)), y: parseFloat(y.toFixed(4)) });
  }
  return out;
}
// RMS real dos pontos gerados — usado para que o número exibido (GRMS) seja
// literalmente derivado da forma de onda mostrada, não um valor paralelo.
export function rmsOf(points) {
  if (!points || points.length === 0) return 0;
  const sumSq = points.reduce((s, p) => s + p.y * p.y, 0);
  return Math.sqrt(sumSq / points.length);
}

// -----------------------------------------------------------------------------
// Helpers de lookup derivados do FLAT_TREE (usados pelos handlers)
// -----------------------------------------------------------------------------

// Mapa id → nó (atualizado quando a árvore é editada — handlers usam getCurrentTree())
export function getCurrentTree() {
  // handlers.js importa store e sobrescreve este lookup quando updateassetstree é chamado
  return FLAT_TREE;
}

// Retorna todos os descendentes (qualquer nível) de um nó
export function getDescendants(tree, nodeId) {
  const result = [];
  const children = tree.filter((n) => n.parent === nodeId);
  for (const child of children) {
    result.push(child);
    result.push(...getDescendants(tree, child.id));
  }
  return result;
}

// Retorna os SPOTs descendentes de um nó (qualquer nível)
export function getSpotDescendants(tree, nodeId) {
  return getDescendants(tree, nodeId).filter((n) => n.type === "SPOT");
}

// Retorna o alarmLabel de um SPOT pelo seu ID
export function getSpotAlarm(tree, spotId) {
  const node = tree.find((n) => n.id == spotId); // == para comparar string/número
  return node ? node.alarmLabel : "GREEN";
}
// Severidade bruta (0..1 ou null) de um SPOT — fonte da verdade para os
// geradores de gráfico. Cai em 0 se o spot não estiver no mapa (ex.: nó
// criado pelo usuário na demo, sem sensor associado ainda).
export function getSpotSeverity(spotId) {
  const v = SPOT_SEVERITY[Number(spotId)];
  return v === undefined ? 0 : v;
}
// Tipo de sensor do SPOT (FULL | TEMP_ONLY | INTEGRATED) — usado pelos
// handlers para decidir quais gráficos/endpoints fazem sentido.
export function getSpotSensorType(tree, spotId) {
  const node = tree.find((n) => n.id == spotId);
  return (node && node.sensorType) || "FULL";
}

// -----------------------------------------------------------------------------
// Cards de alarme (usados em CriticalSpots/InsightsAndAlerts/OldInsightsAndAlerts
// na tela inicial). Forma confirmada lendo os componentes-fonte:
// cada card precisa de spot_id, alarmed_color, status_now, sensor_id, timestamp
// (mais campos de exibição usados pelo OldInsightCard).
// Derivado dos SPOTs reais de FLAT_TREE com alarmLabel != GREEN, para coerência
// com o que aparece na árvore de ativos.
// -----------------------------------------------------------------------------
export function makeAlarmCards() {
  return FLAT_TREE.filter((n) => n.type === "SPOT" && n.alarmLabel !== "GREEN" && n.alarmLabel !== "GRAY").map(
    (n, i) => ({
      spot_id: n.id,
      sensor_id: n.sensor_id,
      spot_name: n.title,
      alarmed_color: n.alarmLabel, // RED | YELLOW
      status_now: n.alarmLabel,
      status_color: n.alarmLabel,
      timestamp: nowMinus(20 + i * 35),
      message:
        n.alarmLabel === "RED"
          ? "Alarme crítico — vibração acima do limite"
          : "Alarme de alerta — acompanhar tendência",
    })
  );
}

// -----------------------------------------------------------------------------
// Tendência de alarmes (gráfico "TENDÊNCIA DE ALARMES" da tela inicial).
// Forma confirmada em AlarmsTrend.jsx: dateLabels (strings "DD/MM/AAAA"),
// healthyData/alertData/criticalData/undefinedData (séries paralelas por dia),
// instantHealthy/instantAlert/instantCritical/instantUndefined (números do dia
// atual) e lastDate (string).
// -----------------------------------------------------------------------------
export function makeAlarmTrend({ days = 7, tree = null } = {}) {
  // Se tree for passada (lista de SPOTs do grupo), usa ela; senão usa o FLAT_TREE completo
  const spots = tree || FLAT_TREE.filter((n) => n.type === "SPOT");
  // contagem real por alarmLabel — reflete o estado atual da árvore
  const nRed    = spots.filter((n) => n.alarmLabel === "RED").length;
  const nYellow = spots.filter((n) => n.alarmLabel === "YELLOW").length;
  const nGray   = spots.filter((n) => n.alarmLabel === "GRAY").length;
  const nGreen  = spots.filter((n) => n.alarmLabel === "GREEN").length;
  const total   = spots.length;

  const dateLabels = [];
  const healthyData = [];
  const alertData = [];
  const criticalData = [];
  const undefinedData = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    dateLabels.push(`${dd}/${mm}/${d.getFullYear()}`);

    // simula tendência: hoje = estado real, dias anteriores tinham menos alarmes
    const factor = (days - i) / days; // 0→1 ao longo dos dias
    const critical = Math.round(nRed * factor);
    const alert    = Math.round(nYellow * factor + (nRed - critical));
    const undef    = nGray > 0 ? nGray : 0;
    const healthy  = Math.max(0, total - critical - alert - undef);

    healthyData.push(healthy);
    alertData.push(Math.max(0, alert));
    criticalData.push(Math.max(0, critical));
    undefinedData.push(undef);
  }

  const last = dateLabels[dateLabels.length - 1];
  return {
    dateLabels,
    healthyData,
    alertData,
    criticalData,
    undefinedData,
    instantHealthy:   healthyData[healthyData.length - 1],
    instantAlert:     alertData[alertData.length - 1],
    instantCritical:  criticalData[criticalData.length - 1],
    instantUndefined: undefinedData[undefinedData.length - 1],
    lastDate: last,
  };
}

// -----------------------------------------------------------------------------
// Resumo de spots por grupo ("SAÚDE DA PLANTA" / "DESEMPENHO" na tela inicial).
// Forma confirmada em CriticalSpots.jsx: array de objetos com sensor_id,
// gateway_id, global_last_collect, gateway_last_connection_update,
// gateway_internet_connection, battery_level, spot_id.
// -----------------------------------------------------------------------------
export function makeSpotSummary() {
  return FLAT_TREE.filter((n) => n.type === "SPOT").map((n, i) => {
    const sensor = n.sensor_id ? SENSORS[n.sensor_id] : null;
    return {
      spot_id: n.id,
      sensor_id: n.sensor_id,
      gateway_id: n.sensor_id ? `gw-00${(i % 3) + 1}` : null,
      global_last_collect: sensor ? sensor.last_seen : nowMinus(15),
      gateway_last_connection_update: nowMinus(2),
      gateway_internet_connection: i === 5 ? 0 : 1, // 1 gateway offline propositalmente
      battery_level: sensor ? sensor.battery : 70,
      alarmed_color: n.alarmLabel,
    };
  });
}

// -----------------------------------------------------------------------------
// Notificações / eventos (mostradas no sino e no painel)
// -----------------------------------------------------------------------------
export const NOTIFICATIONS = [
  { id: "ntf-1", spot_id: "spt-exa01-la", spot_name: "Exaustor Principal 01 — Motor • LA", type: "VIBRATION", event: "FLAG_CHANGE", value: "RED", timestamp: nowMinus(42), read: false },
  { id: "ntf-2", spot_id: "spt-exa01-loa", spot_name: "Exaustor Principal 01 — Motor • LOA", type: "TEMPERATURE", event: "FLAG_CHANGE", value: "YELLOW", timestamp: nowMinus(120), read: false },
  { id: "ntf-3", spot_id: "spt-cor02-acion", spot_name: "Correia 02 — Acionamento • Redutor", type: "V_VIBRATION", event: "FLAG_CHANGE", value: "YELLOW", timestamp: nowMinus(300), read: true },
  { id: "ntf-4", spot_id: "spt-ter01-acion", spot_name: "Terno 01 — Acionamento • Motor", type: "A_VIBRATION", event: "FLAG_CHANGE", value: "YELLOW", timestamp: nowMinus(610), read: true },
];

// -----------------------------------------------------------------------------
// Gateways (lista e configuração)
// -----------------------------------------------------------------------------
export const GATEWAYS = [
  { gateway_id: "gw-001", name: "Gateway Extração", mac: "B0:A7:32:11:9C:01", status: "online", rssi: -54, last_seen: nowMinus(2), spots: ["sn-0001", "sn-0002", "sn-0003", "sn-0004", "sn-0005"] },
  { gateway_id: "gw-002", name: "Gateway Prensagem", mac: "B0:A7:32:11:9C:02", status: "online", rssi: -67, last_seen: nowMinus(4), spots: ["sn-0006", "sn-0007", "sn-0008"] },
  { gateway_id: "gw-003", name: "Gateway Moenda", mac: "B0:A7:32:11:9C:03", status: "offline", rssi: null, last_seen: nowMinus(740), spots: ["sn-0009", "sn-0010", "sn-0011"] },
];

// -----------------------------------------------------------------------------
// Diagnósticos (abertos / fechados)
// -----------------------------------------------------------------------------
// Helpers para timestamps
const daysAgo  = (d) => Math.floor(Date.now() / 1000) - d * 86400;
const hoursAgo = (h) => Math.floor(Date.now() / 1000) - h * 3600;
// percentual acima do limiar — calculado a partir da mesma severidade que
// gera os valores nos gráficos, não escolhido à parte. Usa o limiar de ALERTA
// para falhas em status YELLOW (ainda não cruzou o crítico) e o limiar
// CRÍTICO para status RED — mesmos limiares usados em plotchart/readspotinfo.
const ALERT_VEL = 3.5, CRIT_VEL = 7.1, ALERT_ACEL = 0.5, CRIT_ACEL = 1.2;
const pctAboveVel  = (spotId, status) => {
  const th = status === "RED" ? CRIT_VEL : ALERT_VEL;
  return Math.round((velocityRMSFromSeverity(SPOT_SEVERITY[spotId]) / th - 1) * 100);
};
const pctAboveAcel = (spotId, status) => {
  const th = status === "RED" ? CRIT_ACEL : ALERT_ACEL;
  return Math.round((accelRMSFromSeverity(SPOT_SEVERITY[spotId]) / th - 1) * 100);
};

export const DIAGNOSTICS_OPEN = [
  // spot 131 — Motor LA (RED): desbalanceamento severo + rolamento em degradação
  {
    diagnostic_card_id: "dg-open-131-a",
    spot_id: 131,
    status: "PENDING",
    status_color: "RED",
    start_diagnostic_time: daysAgo(5),
    related_failures: [
      {
        related_failure: "UNBALANCE",        // chave do FAILURE_OPTION
        alarm_status:    "RED",
        max_value_time:  hoursAgo(2),
        percent_above_alarm: pctAboveVel(131, "RED"),
        start_time: daysAgo(5),
        end_time:   null,                   // null = ainda ativo
        // desbalanceamento se manifesta em 1x rotação — velocidade global + tendência espectral
        related_graphics: ["cht-vel-131", "cht-raw-131"],
      },
      {
        related_failure: "BEARING_FAILURE",
        alarm_status:    "YELLOW",
        max_value_time:  hoursAgo(6),
        percent_above_alarm: pctAboveAcel(131, "YELLOW"),
        start_time: daysAgo(3),
        end_time:   null,
        // defeito de rolamento aparece em alta frequência — aceleração + espectro
        related_graphics: ["cht-acel-131", "cht-raw-131"],
      },
    ],
  },
  // spot 132 — Motor LOA (YELLOW): desalinhamento angular
  {
    diagnostic_card_id: "dg-open-132-a",
    spot_id: 132,
    status: "PENDING",
    status_color: "YELLOW",
    start_diagnostic_time: daysAgo(8),
    related_failures: [
      {
        related_failure: "MISALIGNMENT",
        alarm_status:    "YELLOW",
        max_value_time:  hoursAgo(12),
        percent_above_alarm: pctAboveVel(132, "YELLOW"),
        start_time: daysAgo(8),
        end_time:   null,
        // desalinhamento aparece em 2x rotação e componente axial — velocidade + espectro
        related_graphics: ["cht-vel-132", "cht-raw-132"],
      },
    ],
  },
  // spot 134 — Acionamento Redutor (YELLOW): folga mecânica + lubrificação
  {
    diagnostic_card_id: "dg-open-134-a",
    spot_id: 134,
    status: "PENDING",
    status_color: "YELLOW",
    start_diagnostic_time: daysAgo(12),
    related_failures: [
      {
        related_failure: "LOOSENESS",
        alarm_status:    "YELLOW",
        max_value_time:  hoursAgo(18),
        percent_above_alarm: pctAboveVel(134, "YELLOW"),
        start_time: daysAgo(12),
        end_time:   null,
        // folga mecânica gera harmônicos — velocidade + espectro
        related_graphics: ["cht-vel-134", "cht-raw-134"],
      },
      {
        related_failure: "LUBRICATION_FAILURE",
        alarm_status:    "YELLOW",
        max_value_time:  hoursAgo(24),
        percent_above_alarm: pctAboveAcel(134, "YELLOW"),
        start_time: daysAgo(10),
        end_time:   null,
        // falta de lubrificação eleva temperatura e vibração em alta frequência (atrito)
        related_graphics: ["cht-tmp-134", "cht-acel-134"],
      },
    ],
  },
  // spot 231 — Terno de Moagem (YELLOW): desgaste de engrenagem
  {
    diagnostic_card_id: "dg-open-231-a",
    spot_id: 231,
    status: "PENDING",
    status_color: "YELLOW",
    start_diagnostic_time: daysAgo(6),
    related_failures: [
      {
        related_failure: "GEAR_FAILURE",
        alarm_status:    "YELLOW",
        max_value_time:  hoursAgo(8),
        percent_above_alarm: pctAboveAcel(231, "YELLOW"),
        start_time: daysAgo(6),
        end_time:   null,
        // engrenamento gera frequências altas (nº de dentes x rotação) — aceleração + espectro
        related_graphics: ["cht-acel-231", "cht-raw-231"],
      },
    ],
  },
];

export const DIAGNOSTICS_CLOSED = [
  // spot 131 — Motor LA: desalinhamento corrigido há 3 semanas (antes do desbalanceamento atual)
  {
    diagnostic_card_id: "dg-closed-131-old",
    spot_id: 131,
    status: "CLOSED",
    status_color: "GREEN",
    start_diagnostic_time: daysAgo(45),
    related_failures: [
      {
        related_failure: "MISALIGNMENT",
        alarm_status:    "GREEN",
        max_value_time:  daysAgo(30),
        percent_above_alarm: 0,
        start_time: daysAgo(45),
        end_time:   daysAgo(30),
        related_graphics: ["cht-vel-131", "cht-raw-131"],
      },
    ],
  },
  // spot 136 — Motor Prensagem: rolamento substituído (resolvido)
  {
    diagnostic_card_id: "dg-closed-136-a",
    spot_id: 136,
    status: "CLOSED",
    status_color: "GREEN",
    start_diagnostic_time: daysAgo(60),
    related_failures: [
      {
        related_failure: "BEARING_FAILURE",
        alarm_status:    "GREEN",
        max_value_time:  daysAgo(40),
        percent_above_alarm: 0,
        start_time: daysAgo(60),
        end_time:   daysAgo(40),
        related_graphics: ["cht-acel-136", "cht-raw-136"],
      },
    ],
  },
  // spot 232 — Redutor Planetário: folga identificada e ajustada
  {
    diagnostic_card_id: "dg-closed-232-a",
    spot_id: 232,
    status: "CLOSED",
    status_color: "GREEN",
    start_diagnostic_time: daysAgo(90),
    related_failures: [
      {
        related_failure: "LOOSENESS",
        alarm_status:    "GREEN",
        max_value_time:  daysAgo(75),
        percent_above_alarm: 0,
        start_time: daysAgo(90),
        end_time:   daysAgo(75),
        related_graphics: ["cht-vel-232", "cht-raw-232"],
      },
    ],
  },
];
