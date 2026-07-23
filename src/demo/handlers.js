/* eslint-disable */
// =============================================================================
// IoTebe — Camada de Demonstração
// Handlers de rota: traduzem cada endpoint do backend em um payload mockado,
// preservando a MESMA forma que a API real retornava (response.data).
//
// Estratégia de fidelidade de dados:
//   • CONFIRMADO  → dado rico e realista (forma verificada no consumidor).
//   • NÃO AUDITADO → default seguro (lista vazia / objeto vazio) para a tela
//                    renderizar seu estado vazio sem quebrar. São os pontos de
//                    aprofundamento marcados como "fork: profundidade de dados".
// =============================================================================

import {
  FLAT_TREE,
  DEMO_USER,
  SENSORS,
  NOTIFICATIONS,
  GATEWAYS,
  DIAGNOSTICS_OPEN,
  DIAGNOSTICS_CLOSED,
  makeTrend,
  makeSpectrum,
  makeRawWaveform,
  rmsOf,
  makeAlarmCards,
  makeAlarmTrend,
  makeSpotSummary,
  nowMinus,
  getSpotDescendants,
  getSpotAlarm,
  getSpotSeverity,
  getSpotSensorType,
  velocityRMSFromSeverity,
  accelRMSFromSeverity,
  tempFromSeverity,
} from "./db";
import { store } from "./store";

const ok = (data) => data;

// -----------------------------------------------------------------------------
// Handlers por NOME de endpoint (rotas estáticas)
// -----------------------------------------------------------------------------
const STATIC = {
  // ---- CONFIRMADO: núcleo do sistema -------------------------------------
  readassetstree: () => {
    const override = store.getSpot("__tree__");
    if (!override) return ok(structuredCloneSafe(FLAT_TREE));
    // updateAssetsTree.js só envia nós com permission==="OWNER"
    // os nós VIEWER nunca chegam no update — precisam ser preservados do FLAT_TREE original
    const viewerNodes = FLAT_TREE.filter((n) => n.permission === "VIEWER");
    return ok(structuredCloneSafe([...override.flatTree, ...viewerNodes]));
  },
  readuserinfo: () => ok({ ...DEMO_USER }),
  configuserinfo: () => ok({ ...DEMO_USER }),

  // ---- Associações de grupo / usuários -----------------------------------
  readusergroupassociation: () => ok([]),
  updategroupassociation: () => ok({ success: true }),
  deleteassociationfromuser: () => ok({ success: true }),

  // readmanagmentview → useOldSpotManagement faz res.data.cards
  // cada card precisa de spot_id e status_color (spotCounter) +
  // title e alarmLabel (OldSpotViewCard/Column)
  readmanagmentview: () =>
    ok({
      cards: makeAlarmCards().map((c) => ({
        spot_id: c.spot_id,
        sensor_id: c.sensor_id,
        title: c.spot_name,
        status_color: c.alarmed_color,
        alarmLabel: c.alarmed_color,
        timestamp: c.timestamp,
      })),
    }),
  // plotgroupinsights → filtra SPOTs descendentes do group_id enviado no body
  // Assim os alarmes exibidos são coerentes com o nível hierárquico selecionado
  plotgroupinsights: (body) => {
    const tree = store.getSpot("__tree__") ? store.getSpot("__tree__").flatTree : FLAT_TREE;
    const groupId = body && (body.group_id || body.spot_group_id);
    // spots relevantes: descendentes do grupo (ou todos se sem groupId)
    const relevantSpots = groupId
      ? getSpotDescendants(tree, Number(groupId) || groupId)
      : tree.filter((n) => n.type === "SPOT");
    const alarmedSpots = relevantSpots.filter((n) => n.alarmLabel !== "GREEN" && n.alarmLabel !== "GRAY");
    const cards = alarmedSpots.map((n, i) => ({
      spot_id: n.id,
      sensor_id: n.sensor_id,
      spot_name: n.title,
      alarmed_color: n.alarmLabel,
      status_now: n.alarmLabel,
      status_color: n.alarmLabel,
      timestamp: nowMinus(20 + i * 35),
      message: n.alarmLabel === "RED"
        ? "Alarme crítico — vibração acima do limite"
        : "Alarme de alerta — acompanhar tendência",
    }));
    return ok({ cards });
  },

  // plotgrouptrendalarms — conta alarmes dos SPOTs descendentes do grupo
  plotgrouptrendalarms: (body) => {
    const tree = store.getSpot("__tree__") ? store.getSpot("__tree__").flatTree : FLAT_TREE;
    const groupId = body && (body.group_id || body.spot_group_id);
    const spots = groupId
      ? getSpotDescendants(tree, Number(groupId) || groupId)
      : tree.filter((n) => n.type === "SPOT");
    return ok(makeAlarmTrend({ days: 7, tree: spots }));
  },

  // plotgroupcriticalspots → não auditado a fundo; consumidor tolera array vazio.
  plotgroupcriticalspots: () => ok([]),

  // ---- Séries temporais de um spot (vib/temp) ----------------------------
  plotvelrms: () => ok(makeTrend({ points: 168, base: 2.8, noise: 0.5, drift: 1.2, stepSec: 3600 })),
  plotacelrms: () => ok(makeTrend({ points: 168, base: 0.9, noise: 0.3, drift: 0.4, stepSec: 3600 })),
  plottemperature: () => ok(makeTrend({ points: 168, base: 48, noise: 2, drift: 3, stepSec: 3600 })),
  readveltrend: () => ok(makeTrend({ points: 168, base: 2.8, noise: 0.5, stepSec: 3600 })),
  readaceltrend: () => ok(makeTrend({ points: 168, base: 0.9, noise: 0.3, stepSec: 3600 })),
  readtemptrend: () => ok(makeTrend({ points: 168, base: 48, noise: 2, stepSec: 3600 })),
  // readbattery — BatteryCard.jsx é o ÚNICO consumidor e lê res.data.battery_level
  // como número simples (0-100), não como série histórica. Não existe nenhum
  // gráfico de tendência de bateria no produto — a versão anterior deste
  // handler gerava um trend array por engano, e BatteryCard sempre lia
  // `undefined.battery_level` → mostrava 0% independente do sensor real.
  readbattery: (body) => {
    const tree = store.getSpot("__tree__") ? store.getSpot("__tree__").flatTree : FLAT_TREE;
    const spotId = body && body.spot_id;
    const spotNode = spotId ? tree.find((n) => n.id == spotId) : null;
    const sensor = spotNode && spotNode.sensor_id ? SENSORS[spotNode.sensor_id] : null;
    // sem sensor associado (spot novo, sem sensor_id) → 0%, BatteryCard trata como "sem dado"
    const battery_level = sensor ? sensor.battery : 0;
    return ok({ battery_level });
  },
  // readspotcondition — usa alarmLabel real do spot
  // OldSensorStatus usa data.failure como array de índices numéricos do mapa:
  // 1=Desbalanceamento, 2=Desalinhamento, 3=Folga, 5=Falha de rolamento, 18=Aumento de temperatura
  // PossibleFailures renderiza: types.map(f => failures[f].failure)
  readspotcondition: (body) => {
    const tree = store.getSpot("__tree__") ? store.getSpot("__tree__").flatTree : FLAT_TREE;
    const spotId = body && body.spot_id;
    const alarm = spotId ? getSpotAlarm(tree, spotId) : "GREEN";
    // Defeitos por spot — FAILURE_OPTION keys: UNBALANCE=1, MISALIGNMENT=2, LOOSENESS=3,
    // GEAR_FAILURE=4, BEARING_FAILURE=5, LUBRICATION_FAILURE=6
    const SPOT_FAILURES = {
      131: alarm === "RED" ? [1, 5] : [],     // Motor LA: desbalanceamento + rolamento
      132: alarm === "YELLOW" ? [2] : [],      // Motor LOA: desalinhamento
      134: alarm === "YELLOW" ? [3, 6] : [],   // Acionamento Redutor: folga + lubrificação
      231: alarm === "YELLOW" ? [4] : [],      // Terno Moagem: engrenamento
    };
    const type = SPOT_FAILURES[Number(spotId)] !== undefined
      ? SPOT_FAILURES[Number(spotId)]
      : (alarm === "RED" ? [1] : alarm === "YELLOW" ? [3] : []);
    return ok({
      card_alarm: alarm,
      status_now: alarm,
      timestamp: alarm !== "GREEN" && alarm !== "GRAY" ? nowMinus(42) : nowMinus(15),
      type,
      failure: type,
    });
  },

  // readspotconnection — inclui dados reais do sensor (battery, rssi, last_seen)
  readspotconnection: (body) => {
    const tree = store.getSpot("__tree__") ? store.getSpot("__tree__").flatTree : FLAT_TREE;
    const spotId = body && body.spot_id;
    const spotNode = spotId ? tree.find((n) => n.id == spotId) : null;
    const sensor = spotNode && spotNode.sensor_id ? SENSORS[spotNode.sensor_id] : null;
    return ok({
      gateway_id: "gw-001",
      gateway_connectivity: 1,
      spot_connectivity: sensor ? 1 : 0,
      last_seen: sensor ? sensor.last_seen : nowMinus(60),
      battery: sensor ? sensor.battery : null,
      rssi: sensor ? sensor.rssi : null,
    });
  },

  // readspotinfo — lê override de sessão se existir (editado por updatespotinfo)
  readspotinfo: (body) => {
    const spotId = body && body.spot_id;
    const override = spotId ? store.getSpot(spotId) : null;
    const tree = store.getSpot("__tree__") ? store.getSpot("__tree__").flatTree : FLAT_TREE;
    const node = spotId ? tree.find(n => n.id == spotId) : null;
    const alarm = node ? node.alarmLabel : "GREEN";

    // machine_type é índice de MACHINE_TYPES_OPTIONS (useSettingsView.jsx):
    // 1=Motor Elétrico, 2=Bomba Centrífuga, 3=Ventilador/Exaustor, 4=Turbina a Vapor,
    // 5=Redutor, 6=Gerador, 7=Rotores em Geral, 8=Outros
    // fixation_type_id: FIXATION_OPTIONS = [Selecione, Rígida, Flexível] → 1 ou 2
    // transmission_type_id: TRANSMISSION = [Selecione, Polia, Cardã, Integrada, Acoplamento] → 1-4
    // Parâmetros por ponto — rotação e tipo de máquina específicos
    const SPOT_PARAMS = {
      131: { rotation_speed: 1470, power: 75,  machine_type: 1, bearing_model: "6312",  bpfi: 5.4, bpfo: 3.6, bsf: 2.3, ftf: 0.38, fixation_type_id: 1, transmission_type_id: 4 }, // Motor LA — acoplado direto, base rígida — crítico
      132: { rotation_speed: 1470, power: 75,  machine_type: 1, bearing_model: "6312",  bpfi: 5.4, bpfo: 3.6, bsf: 2.3, ftf: 0.38, fixation_type_id: 1, transmission_type_id: 4 }, // Motor LOA — alerta
      133: { rotation_speed: 960,  power: 45,  machine_type: 3, bearing_model: "6309",  bpfi: 4.9, bpfo: 3.1, bsf: 2.1, ftf: 0.35, fixation_type_id: 2, transmission_type_id: 1 }, // Ventilador — mancal flexível, acionado por polia
      // "Acionamento • Redutor" — o nome do ponto diz Redutor; estava com
      // machine_type=1 (Motor), incoerente com o próprio nome. Corrigido para
      // 5=Redutor. Ponto de sensor no eixo de entrada (alta rotação, 1470rpm).
      134: { rotation_speed: 1470, power: 75,  machine_type: 5, bearing_model: "NU314", bpfi: 6.2, bpfo: 4.8, bsf: 2.9, ftf: 0.41, fixation_type_id: 1, transmission_type_id: 3 }, // Acionamento Redutor — transmissão integrada — alerta
      135: { rotation_speed:  320, power: 30,  machine_type: 7, bearing_model: "22216", bpfi: 7.1, bpfo: 5.9, bsf: 3.4, ftf: 0.43, fixation_type_id: 1, transmission_type_id: 4 }, // Tambor de Retorno — rotor acoplado
      136: { rotation_speed: 1760, power: 110, machine_type: 1, bearing_model: "6314",  bpfi: 5.2, bpfo: 3.8, bsf: 2.4, ftf: 0.37, fixation_type_id: 1, transmission_type_id: 4 }, // Prensagem Motor LA
      137: { rotation_speed:  147, power: 110, machine_type: 5, bearing_model: "NU315", bpfi: 6.8, bpfo: 5.2, bsf: 3.1, ftf: 0.40, fixation_type_id: 1, transmission_type_id: 3 }, // Redutor Saída — integrado à linha
      138: { rotation_speed: 1760, power: 55,  machine_type: 1, bearing_model: "6311",  bpfi: 5.0, bpfo: 3.4, bsf: 2.2, ftf: 0.36, fixation_type_id: 1, transmission_type_id: 4 }, // Bomba Óleo — gray
      139: { rotation_speed: 1760, power: 55,  machine_type: 1, bearing_model: "6311",  bpfi: 5.0, bpfo: 3.4, bsf: 2.2, ftf: 0.36, fixation_type_id: 1, transmission_type_id: 4 }, // Mancal Dianteiro (TEMP_ONLY) — mesma bomba de 138
      140: { rotation_speed: 1760, power: 110, machine_type: 2, bearing_model: null,    bpfi: 0,   bpfo: 0,   bsf: 0,   ftf: 0,    fixation_type_id: 1, transmission_type_id: 4 }, // Selo Mecânico (INTEGRATED) — eixo de bomba, dado bruto via API, sem detalhamento de rolamento
      231: { rotation_speed:  490, power: 315, machine_type: 1, bearing_model: "6318",  bpfi: 5.6, bpfo: 4.4, bsf: 2.6, ftf: 0.39, fixation_type_id: 1, transmission_type_id: 4 }, // Terno Moagem — alerta
      232: { rotation_speed:   49, power: 315, machine_type: 5, bearing_model: "23124", bpfi: 7.8, bpfo: 6.2, bsf: 3.6, ftf: 0.44, fixation_type_id: 1, transmission_type_id: 3 }, // Redutor Planetário
      233: { rotation_speed: 1760, power: 55,  machine_type: 1, bearing_model: "6312",  bpfi: 5.4, bpfo: 3.6, bsf: 2.3, ftf: 0.38, fixation_type_id: 1, transmission_type_id: 4 }, // Bomba de Caldo Motor
      331: { rotation_speed: 1460, power: 22,  machine_type: 1, bearing_model: "6308",  bpfi: 4.7, bpfo: 3.3, bsf: 2.0, ftf: 0.34, fixation_type_id: 1, transmission_type_id: 4 }, // Envasadora Motor
    };
    const sp = SPOT_PARAMS[Number(spotId)] || { rotation_speed: 1470, power: 75, machine_type: 1, bearing_model: "6312", bpfi: 5.4, bpfo: 3.6, bsf: 2.3, ftf: 0.38, fixation_type_id: 1, transmission_type_id: 4 };

    // Limites de alarme coerentes com o estado atual
    const velAlert  = alarm === "RED" ? 3.5  : alarm === "YELLOW" ? 3.5  : 3.5;
    const velCrit   = alarm === "RED" ? 7.1  : alarm === "YELLOW" ? 7.1  : 7.1;
    const tempAlert = alarm === "RED" ? 65   : alarm === "YELLOW" ? 65   : 65;
    const tempCrit  = alarm === "RED" ? 80   : alarm === "YELLOW" ? 80   : 80;

    const defaults = {
      sensor_name: node ? "Sensor IoTebe — " + (node.sensor_id || "Demo") : "Sensor IoTebe Demo",
      machine_type: sp.machine_type,
      has_variable_rotation: 0, min_rotation: null, max_rotation: null,
      rotation_speed: sp.rotation_speed,
      power: sp.power,
      // valores em palavra completa — normalizeAxisOption() em useSettingsView.jsx faz
      // charAt(0)+resto.toLowerCase(), então precisa bater com AXIS_OPTIONS
      // ["Vertical","Horizontal","Axial"] de BearingConfig.jsx. Com "H"/"V"/"A" (letra
      // única) nenhum dos 3 dropdowns reconhecia o valor e todos caíam na mesma opção
      // padrão — daí os "3 eixos configurados com o mesmo dado".
      axis_x: "HORIZONTAL", axis_y: "VERTICAL", axis_z: "AXIAL",
      passing_frequency: 0,
      fixation_type_id: sp.fixation_type_id,
      transmission_type_id: sp.transmission_type_id,
      disable_vel_alarm:  "FALSE", alarm_1vel:  velAlert,  alarm_2vel:  velCrit,
      disable_acel_alarm: "FALSE", alarm_1acel: 1.5,       alarm_2acel: 4.0,
      disable_temp_alarm: "FALSE", alarm_1temp: tempAlert, alarm_2temp: tempCrit,
      rmstemp_sampling_period: 600,
      spectrum_sampling_time: "01:00:00",
      disable_spectrum: alarm === "GRAY" ? "TRUE" : "FALSE",
      // rolamento específico por ponto
      bearing_list: [],
      bearing_type: "ROLLING",
      disable_bearing: alarm === "GRAY" ? 1 : 0,
      bearing_model: sp.bearing_model,
      fixation_bearing: null, fixation_bearing_race: null,
      bpfi: sp.bpfi, bpfo: sp.bpfo, bsf: sp.bsf, ftf: sp.ftf,
      firmware_version: "v2.4.1",
      automatic_collect_setup: true,
      dynamic_band: 8,
      gateway_id: "gw-001",
      gateway_connectivity_ble: 0,
      // gear_box_gmf_list fica vazio propositalmente — machine_type=5 (Redutor) tem
      // validação própria de rotação nominal por estágio de engrenamento que não
      // reconstruí com confiança suficiente para não gerar dados inconsistentes.
      gear_box_gmf_list: [],
    };
    return ok({ ...defaults, ...(override || {}) });
  },

  // readspotsummaryinfo — mesclado com override de sessão
  readspotsummaryinfo: (body) => {
    const spotId = body && body.spot_id;
    const override = spotId ? store.getSpot(spotId) : null;
    const defaults = {
      machine_type: 1, bearing_type: "6312", rotation_speed: 1470, power: 75,
      rmstemp_sampling_period: 600, gateway_rmstemp_synchronization: 60,
      spectrum_sampling_time: "01:00:00",
    };
    return ok({ ...defaults, ...(override || {}) });
  },

  readbearingdata: () => ok({ total: 0, data: [] }),
  readrmstempannotation: () => ok([]),
  updatermstempannotation: () => ok({ success: true }),

  // updatespotinfo — persiste no store indexado por spot_id
  updatespotinfo: (body) => {
    if (body && body.spot_id) {
      store.setSpot(body.spot_id, {
        rotation_speed: body.rotation_speed, power: body.power,
        machine_type: body.machine_type, bearing_type: body.bearing_type,
        spectrum_sampling_time: body.spectrum_sampling_time,
        rmstemp_sampling_period: body.rmstemp_sampling_period,
        disable_vel_alarm: body.disable_vel_alarm,
        alarm_1vel: body.alarm_1vel, alarm_2vel: body.alarm_2vel,
        disable_acel_alarm: body.disable_acel_alarm,
        alarm_1acel: body.alarm_1acel, alarm_2acel: body.alarm_2acel,
        disable_temp_alarm: body.disable_temp_alarm,
        alarm_1temp: body.alarm_1temp, alarm_2temp: body.alarm_2temp,
        disable_spectrum: body.disable_spectrum,
        passing_frequency: body.passing_frequency,
        has_variable_rotation: body.has_variable_rotation,
        min_rotation: body.min_rotation, max_rotation: body.max_rotation,
        fixation_type_id: body.fixation_type_id,
        transmission_type_id: body.transmission_type_id,
      });
    }
    return ok({ success: true });
  },

  // ---- Espectro / FFT -----------------------------------------------------
  // spectrum_info agora é resolvido via PATTERNS (spot/:id/spectrum_info) — ver abaixo,
  // pois verifySpec() do Diagnóstico Automático precisa do spotId para cruzar
  // as coletas com o alarmLabel real e cobrir todo o período de treinamento.

  // readspectrumlist → SpecChart popula spectrumListData que alimenta CascateTable
  // campos obrigatórios por linha: ng1vt_raw_data_id (key + seleção), time (formatado),
  // rms_vel_vert/hor/axial (mm/s), rms_acel_vert/hor/axial (g)
  readspectrumlist: () => {
    const now = Math.floor(Date.now() / 1000);
    const spectrumList = Array.from({ length: 6 }, (_, i) => {
      const base = 1.5 + Math.sin(i * 0.8) * 0.5;
      return {
        ng1vt_raw_data_id: `raw-${i + 1}`,   // chave usada no CascateTable e cascateAPI.raw_data_ids
        time: now - i * 3600,                  // formatUnixTimestamp() converte para string
        spectrum_type: "VELOCITY",
        source: "MANUAL",
        rms_vel_vert:  parseFloat((base + 0.3).toFixed(3)),
        rms_vel_hor:   parseFloat((base + 0.1).toFixed(3)),
        rms_vel_axial: parseFloat((base - 0.2).toFixed(3)),
        rms_acel_vert:  parseFloat((base * 0.4 + 0.1).toFixed(3)),
        rms_acel_hor:   parseFloat((base * 0.3 + 0.05).toFixed(3)),
        rms_acel_axial: parseFloat((base * 0.2).toFixed(3)),
        grms_vertical:   parseFloat((base + 0.3).toFixed(3)),
        grms_horizontal: parseFloat((base + 0.1).toFixed(3)),
        grms_axial:      parseFloat((base - 0.2).toFixed(3)),
      };
    });
    return ok({ res: { spectrumList } });
  },

  // readspectrumdata → SpecChart.loadSpec() desestrutura data.*
  // spectrum_axial/horizontal/vertical: array de { x: freq, y: amp }
  // wave_*: forma de onda no domínio do tempo (ms × mm/s) — ESTE é o dado mais
  // próximo do sensor que existe na demo. grms_* não é mais um número escolhido
  // à parte: é o RMS real (rmsOf) calculado sobre os mesmos pontos de wave_*
  // devolvidos abaixo — se a forma de onda mudar, o painel muda junto, porque
  // é o mesmo dado.
  readspectrumdata: (body) => {
    const spotId = body && body.spot_id;
    const tree = store.getSpot("__tree__") ? store.getSpot("__tree__").flatTree : FLAT_TREE;
    const node = spotId ? tree.find((n) => n.id == spotId) : null;
    const sensorType = getSpotSensorType(tree, spotId);
    const severity = getSpotSeverity(spotId);
    const velocityRMS = velocityRMSFromSeverity(severity);
    // rotação real do ponto — mesma tabela usada em readspotinfo, senão cai
    // no default de 1470rpm (24.5Hz), coerente com a maioria dos motores da demo
    const ROTATION_RPM = { 131:1470,132:1470,133:960,134:1470,135:320,136:1760,137:147,138:1760,139:1760,140:1760,231:490,232:49,233:1760,331:1460 };
    const rpm = ROTATION_RPM[Number(spotId)] || 1470;
    const rotHz = rpm / 60;

    if (severity == null || sensorType === "TEMP_ONLY" || sensorType === "INTEGRATED") {
      // sem acelerômetro (TEMP_ONLY), sensor offline (GRAY), ou sensor
      // INTEGRATED (dado bruto via API de terceiro — não passa pela análise
      // espectral completa do protocolo nativo) — sem forma de onda detalhada
      return ok({
        spectrum_vertical: [], spectrum_horizontal: [], spectrum_axial: [],
        spectrum_radial: [], spectrum_tangencial: [],
        wave_vertical: [], wave_horizontal: [], wave_axial: [],
        grms_vertical: null, grms_horizontal: null, grms_axial: null,
        rotation_speed: rpm, passing_frequency: 0, machine_type: node ? undefined : 1,
        bpfi: 0, bpfo: 0, bsf: 0, ftf: 0, bearings_freq: [], status: severity == null ? "OFFLINE" : "N/A",
      });
    }

    const spec = makeSpectrum({ rotHz });
    const toXY = (freqs, amps) => freqs.map((f, i) => ({ x: f, y: amps[i] }));
    const xyData = toXY(spec.freqs, spec.amps);
    const vary = (data, scale) => data.map(pt => ({ x: pt.x, y: parseFloat((pt.y * scale).toFixed(4)) }));

    // forma de onda BRUTA — gerada pelo mesmo modelo físico usado no espectro,
    // amplitude calibrada pelo velocityRMS real do ponto (não um número fixo)
    const wavePoints = 512;
    const waveVert = makeRawWaveform({ rotationHz: rotHz, velocityRMS, axisScale: 1.00, points: wavePoints });
    const waveHor  = makeRawWaveform({ rotationHz: rotHz, velocityRMS, axisScale: 0.85, points: wavePoints });
    const waveAxi  = makeRawWaveform({ rotationHz: rotHz, velocityRMS, axisScale: 0.60, points: wavePoints });

    return ok({
      spectrum_vertical:   vary(xyData, 1.00),
      spectrum_horizontal: vary(xyData, 0.85),
      spectrum_axial:      vary(xyData, 0.60),
      spectrum_radial: [], spectrum_tangencial: [],
      wave_vertical:   waveVert,
      wave_horizontal: waveHor,
      wave_axial:      waveAxi,
      // GRMS literalmente calculado sobre a forma de onda acima, não um valor à parte
      grms_vertical:   parseFloat(rmsOf(waveVert).toFixed(3)),
      grms_horizontal: parseFloat(rmsOf(waveHor).toFixed(3)),
      grms_axial:      parseFloat(rmsOf(waveAxi).toFixed(3)),
      rotation_speed: rpm, passing_frequency: 0, machine_type: 1,
      bpfi: 0, bpfo: 0, bsf: 0, ftf: 0, bearings_freq: [], status: "OK",
    });
  },

  // readspectrumwaterfall → Cascate.jsx faz formatData(data.data, cascateAPI.type)
  // formatData acessa item.data.y (freqs) e item.data.z (amps)
  // IMPORTANTE: o Plotly r128 tem bug com line.color=[array] em scatter3d quando
  // os valores são muito uniformes — o colorscale chama .toFixed em valores internos.
  // Solução: devolver z com variação suficiente para o colorscale não colapsar.
  readspectrumwaterfall: (body) => {
    const now = Math.floor(Date.now() / 1000);
    const LINES = 80;
    const FMAX = 500;
    const ROT = 24.5;
    const df = FMAX / LINES;
    const makeFreqs = () => Array.from({ length: LINES }, (_, i) => parseFloat((i * df).toFixed(2)));
    const makeAmps = (seed) => {
      const freqs = makeFreqs();
      return freqs.map((f, i) => {
        let a = 0.005 + Math.abs(Math.sin(i * 0.3 + seed)) * 0.01;
        [1, 2, 3, 4].forEach((h, hi) => {
          const d = Math.abs(f - ROT * h);
          if (d < 10) a += (0.8 / (hi + 1)) * Math.exp(-(d * d) / 8);
        });
        return parseFloat(a.toFixed(4));
      });
    };
    const freqs = makeFreqs();
    const items = Array.from({ length: 5 }, (_, i) => ({
      date: now - i * 3600,
      data: { y: freqs, z: makeAmps(i * 1.3) },
    }));
    return ok({ data: items });
  },
  readspectraloptions: () =>
    ok({
      spot_config: {
        rotation_speed: 1470, machine_type: 1, has_variable_rotation: 0,
        min_rotation: null, max_rotation: null, passing_frequency: 0,
        bearing_type: "ROLLING", bearing_list: [], disable_bearing: 1,
      },
      types: ["VELOCITY", "ACCELERATION", "ENVELOPE"],
      filters: [],
    }),

  // spectrumtendencyplotchart → SpecChart usa mesma estrutura de plotchart:
  // res.data.data.map(axisData => axisData.data.sort(...))
  // chart_config para freqAnnot(), unit, annotations
  // custom_chart_id codifica o spot_id — mesma convenção do plotchart principal,
  // então a amplitude aqui também vem da severidade real, não de números fixos.
  spectrumtendencyplotchart: (body) => {
    const chartId = String((body && body.custom_chart_id) || "raw-0");
    const parts = chartId.split("-");
    const spotId = parts[parts.length - 1];
    const severity = getSpotSeverity(spotId);
    const vel = velocityRMSFromSeverity(severity);
    const endMs = body && body.end_date ? body.end_date * 1000 : Date.now();
    const startMs = body && body.start_date ? body.start_date * 1000 : endMs - 86400000;
    const step = (endMs - startMs) / 30;
    const noise = 0.25 + (severity || 0) * 0.6;
    const makeSeries = (scale) => Array.from({ length: 30 }, (_, i) => ({
      x: Math.round(startMs + i * step),
      y: severity == null ? null : parseFloat(Math.max(0, vel * scale + (Math.random() - 0.5) * noise).toFixed(3)),
    })).filter((pt) => pt.y !== null);
    return ok({
      chart_name: "Tendência Espectral", unit: "mm/s",
      data: [
        { axis: "VERTICAL",   data: makeSeries(1.00) },
        { axis: "HORIZONTAL", data: makeSeries(0.85) },
        { axis: "AXIAL",      data: makeSeries(0.60) },
      ],
      anomalies: [], annotations: [], chart_config: {},
      alarm_alert: 3.5, alarm_critical: 7.1, disable_alarm: severity == null,
    });
  },
  configspectralchart: () => ok({ success: true }),
  createspectralchart: () => ok({ success: true, id: "spc-" + Date.now() }),
  deletespectralchart: () => ok({ success: true }),

  // ---- Gráficos customizáveis (VibAndTemp / ModelChart) ------------------
  // readchartids — codifica o spot_id no chart_id para plotchart recuperar o alarmLabel
  readchartids: (body) => {
    const spotId = (body && body.spot_id) || "0";
    return ok([
      { chart_id: `cht-vel-${spotId}`, type: "GLOBAL",        chart_name: "Velocidade RMS",   unit: "mm/s" },
      { chart_id: `cht-tmp-${spotId}`, type: "GLOBAL",        chart_name: "Temperatura",       unit: "°C"   },
      { chart_id: `cht-raw-${spotId}`, type: "PROCESSED_RAW", chart_name: "Tendência Espectral", unit: "mm/s" },
    ]);
  },

  // plotchart — amplitude derivada da SEVERIDADE real do spot (não mais de uma
  // tabela de 4 cores) — o mesmo severity que classifica o alarmLabel é usado
  // para calcular o valor numérico exibido, então gráfico e alarme nunca podem
  // divergir entre si.
  // chart_id codifica o spot_id: "cht-vel-131", "cht-tmp-131", "cht-raw-131"
  plotchart: (body) => {
    const chartId = String((body && (body.chart_id || body.custom_chart_id)) || "vel-0");
    const isTemp = chartId.includes("tmp");
    const isRaw  = chartId.includes("raw");
    const isAcel = chartId.includes("acel");
    // extrai spot_id do chart_id (último segmento)
    const parts = chartId.split("-");
    const spotId = parts[parts.length - 1];
    const severity = getSpotSeverity(spotId);
    const alarm = severity == null ? "GRAY"
      : severity >= (7.1 - 1.2) / 8.0 ? "RED"
      : severity >= (3.5 - 1.2) / 8.0 ? "YELLOW"
      : "GREEN";
    const vel  = velocityRMSFromSeverity(severity);
    const acel = accelRMSFromSeverity(severity);
    const temp = tempFromSeverity(severity);
    const base  = isTemp ? temp : isAcel ? acel : vel;
    // ruído proporcional à severidade — máquina degradada tem sinal mais errático
    const noise = isTemp ? (1.5 + (severity || 0) * 3) : isAcel ? (0.05 + (severity || 0) * 0.12) : (0.25 + (severity || 0) * 0.6);
    const unit = isTemp ? "°C" : isAcel ? "g" : "mm/s";
    const name = isTemp ? "Temperatura" : isRaw ? "Tendência Espectral" : isAcel ? "Aceleração RMS" : "Velocidade RMS";
    const endMs = body && body.end_date ? body.end_date * 1000 : Date.now();
    const startMs = body && body.start_date ? body.start_date * 1000 : endMs - 86400000;
    const points = 30;
    const step = (endMs - startMs) / points;
    // deriva série com tendência crescente para severidade alta (simula deterioração)
    const drift = severity == null ? 0 : severity >= 0.6 ? base * 0.010 : severity >= 0.25 ? base * 0.004 : 0;
    const makeSeries = (scaleH) =>
      Array.from({ length: points }, (_, i) => ({
        x: Math.round(startMs + i * step),
        y: severity == null ? null : parseFloat(
          Math.max(0, base * scaleH + i * drift + (Math.random() - 0.5) * noise).toFixed(3)
        ),
      })).filter((pt) => pt.y !== null);
    const data = isTemp
      ? [{ axis: "TEMPERATURE", data: makeSeries(1.0) }]
      : [
          { axis: "VERTICAL",   data: makeSeries(1.00) },
          { axis: "HORIZONTAL", data: makeSeries(0.85) },
          { axis: "AXIAL",      data: makeSeries(0.60) },
        ];
    const alertVel = 3.5, critVel = 7.1, alertAcel = 0.5, critAcel = 1.2, alertTemp = 65, critTemp = 80;
    return ok({
      chart_name: name, unit, data,
      anomalies: [], annotations: [],
      alarm_alert:    isTemp ? alertTemp : isAcel ? alertAcel : alertVel,
      alarm_critical: isTemp ? critTemp  : isAcel ? critAcel  : critVel,
      disable_alarm: severity == null,
      metric_id: isTemp ? 2 : isAcel ? 3 : 1,
    });
  },
  createchart: () => ok({ success: true, id: "cht-" + Date.now() }),
  updatechart: () => ok({ success: true }),
  deletechart: () => ok({ success: true }),

  // readchartalarms — lê override de sessão se existir
  readchartalarms: (body) => {
    const chartId = body && (body.custom_chart_id || body.chart_id);
    const override = chartId ? store.getChartAlarms(chartId) : null;
    const defaults = {
      disable_alarm: false, alarm_alert: 3.5, alarm_critical: 7.1,
      trigger_condition: "OR", sampling_period: 600,
    };
    return ok({ ...defaults, ...(override || {}) });
  },

  // updatechartalarms — persiste no store indexado por chart_id
  updatechartalarms: (body) => {
    const chartId = body && (body.custom_chart_id || body.chart_id);
    if (chartId) {
      store.setChartAlarms(chartId, {
        disable_alarm: body.disable_alarm,
        alarm_alert: body.alarm_alert,
        alarm_critical: body.alarm_critical,
        trigger_condition: body.trigger_condition,
      });
    }
    return ok({ success: true });
  },
  readsensorids: () => ok(Object.keys(SENSORS)),
  deletedashgroupcard: () => ok({ success: true }),

  // ---- Notificação de canal (email/whatsapp) ------------------------------
  // NotificationButton lê response.data.email, .whatsApp, .user_phone
  // DIFERENTE de readassociationnotification (que é array de solicitações de compartilhamento)
  readnotification: () =>
    ok({
      email: null,
      whatsApp: null,
      user_phone: null,
    }),
  readassociationnotification: () => ok([]),
  updatenotification: () => ok({ success: true }),
  updateassociationnotification: () => ok({ success: true }),

  // ---- Gateways -----------------------------------------------------------
  generategatewayslist: () => ok(structuredCloneSafe(GATEWAYS)),

  // gatewayspotsdatabase → GatewayConfig.getList() desestrutura:
  // const { columns, spots } = res.data — spots é dicionário indexado por String(id)
  // CORREÇÃO: "gatewayId" não estava definido (ReferenceError silencioso) → isLoading nunca virava false
  gatewayspotsdatabase: (body) => {
    const gatewayId = (body && body.gateway_id) || "gw-001";
    const tree = store.getSpot("__tree__");
    const flatTree = tree ? tree.flatTree : FLAT_TREE;
    const spotsObj = {};
    const availableIds = [];
    const registeredIds = [];
    flatTree.filter((n) => n.type === "SPOT").forEach((n, i) => {
      const spotId = String(n.id);
      spotsObj[spotId] = { id: spotId, content: n.title, sensor_id: n.sensor_id || "None" };
      if (i < 3) registeredIds.push(spotId);
      else availableIds.push(spotId);
    });
    const gwOverride = store.getGateway(gatewayId);
    return ok({
      columns: {
        availableSpots: { spotIds: availableIds },
        registeredSpots: { spotIds: registeredIds },
      },
      spots: spotsObj,
      rmstempCollectPeriod: (gwOverride && gwOverride.rmstempCollectPeriod) || 10,
      gateway_name: (gwOverride && gwOverride.gateway_name) || "Gateway Demo — TBE-GW01",
      gateway_version: "2.4.1",
    });
  },

  // updategatewayname — persiste no store
  updategatewayname: (body) => {
    if (body && body.gateway_id) {
      store.setGateway(body.gateway_id, { gateway_name: body.gateway_name });
    }
    return ok({ success: true });
  },
  gatewaycommandsend: () => ok({ success: true }),
  updategatewayspot: () => ok({ success: true }),

  // ---- Anomalias / IA -----------------------------------------------------
  // readalldetectedanomalies → RightMenu.jsx faz
  // anomalies.data.detected_anoms (não res.data direto) e
  // loadSpot() dispara um reducer que roda .filter() nesse array.
  // Lista vazia é a escolha certa aqui (anomalias de IA são um recurso
  // avançado/secundário); o que estava quebrado era a FORMA do envelope.
  readalldetectedanomalies: () =>
    ok({ detected_anoms: [], turn_on_timestamp: null }),
  toggleanomdetection: () => ok({ success: true }),
  updateanomtype: () => ok({ success: true }),
  updateanomdesc: () => ok({ success: true }),
  automaticalarm: () => ok({ success: true }),

  // ---- API keys -----------------------------------------------------------
  readapikey: () => ok({ api_key: null }),
  createapikey: () => ok({ api_key: "demo-" + Math.random().toString(36).slice(2) }),

  // ---- Diagnóstico --------------------------------------------------------
  updatediagnosticcard: () => ok({ success: true }),
  updateassociatedsensor: () => ok({ success: true }),
  // readhistoric → SpotHistoricTable faz: if (!!res.data.data) setSpotHistoric(res.data.data)
  // precisa de { data: [] } — antes era [] e res.data.data seria undefined
  readhistoric: () => ok({ data: [] }),
  // updateassetstree — persiste a árvore editada no store.
  // IDs do FLAT_TREE são NUMÉRICOS → Number(parentNode.id) preserva o valor → parent chega correto no JSON.
  // Com IDs string, NaN→null destruía a hierarquia no transporte.
  updateassetstree: (body) => {
    if (body && body.spot_tree && Array.isArray(body.spot_tree)) {
      // mapa de ID → alarmLabel dos nós originais (para preservar cores)
      const originalAlarms = {};
      FLAT_TREE.forEach((n) => { originalAlarms[n.id] = n.alarmLabel; });
      // também preserva alarmes de edições anteriores do store
      const prev = store.getSpot("__tree__");
      if (prev && prev.flatTree) {
        prev.flatTree.forEach((n) => {
          if (!originalAlarms[n.id]) originalAlarms[n.id] = n.alarmLabel;
        });
      }
      const flatTree = body.spot_tree.map((node) => ({
        id: node.id,
        type: node.type,
        parent: node.parent,        // numérico ou null — hierarquia preservada com IDs numéricos
        permission: "OWNER",
        title: node.name || String(node.id),
        alarmLabel: originalAlarms[node.id] || "GREEN", // preserva cor original; novos ficam GREEN
        sensor_id: node.sensor_id || null,
      }));
      store.setSpot("__tree__", { flatTree });
    }
    return ok({ success: true });
  },
};

// -----------------------------------------------------------------------------
// Handlers por PADRÃO (rotas dinâmicas: /spot/:id/..., /group/:id/...)
// -----------------------------------------------------------------------------
const PATTERNS = [
  // /spot/:id/plot_chart/metric/:metricId — diagnóstico automático
  // CRÍTICO: os dados precisam cobrir o período de treinamento configurado
  // (now-30d a now-7d), com pontos acima do limit (0.3 mm/s) para validar
  { test: /\/spot\/[^/]+\/plot_chart\/metric\/[^/]+$/, handler: (m) => {
    const spotId   = seg(m, 3);
    const metricId = seg(m, 0);
    const severity = getSpotSeverity(spotId);
    const isTemp = String(metricId) === "2";
    const isAcel = String(metricId) === "3";
    const base  = isTemp ? tempFromSeverity(severity) : isAcel ? accelRMSFromSeverity(severity) : velocityRMSFromSeverity(severity);
    const noise = isTemp ? (1.5 + (severity || 0) * 3) : isAcel ? (0.05 + (severity || 0) * 0.12) : (0.25 + (severity || 0) * 0.6);
    const now = Date.now();
    // Cobertura: 35 dias atrás até agora (garante overlap com qualquer período de treinamento)
    // 1 ponto a cada 6 horas = 140 pontos — densidade suficiente para totalOnTime > 1h
    const DAYS = 35;
    const STEP_MS = 6 * 3600 * 1000; // 6 horas por ponto
    const totalPoints = Math.floor((DAYS * 86400000) / STEP_MS);
    const drift = severity == null ? 0 : severity >= 0.6 ? base * 0.010 : severity >= 0.25 ? base * 0.004 : 0;
    // timestamps FIXOS por índice (não usar Math.random no x) para garantir
    // que todos os eixos compartilhem os mesmos x → trainingData[x].values.length === nAxes
    const timestamps = Array.from({ length: totalPoints }, (_, i) =>
      now - DAYS * 86400000 + i * STEP_MS
    );
    const makeSeries = (scale) => timestamps.map((t, i) => ({
      x: t,
      y: severity == null ? null : parseFloat(
        Math.max(0.1, base * scale + i * drift + (Math.random() - 0.5) * noise).toFixed(3)
      ),
    })).filter(pt => pt.y !== null);
    const data = isTemp
      ? [{ axis: "TEMPERATURE", data: makeSeries(1) }]
      : isAcel
      ? [{ axis: "VERTICAL", data: makeSeries(1) }, { axis: "HORIZONTAL", data: makeSeries(0.85) }]
      : [{ axis: "VERTICAL", data: makeSeries(1) }, { axis: "HORIZONTAL", data: makeSeries(0.85) }, { axis: "AXIAL", data: makeSeries(0.6) }];
    return ok({ chart_name: isTemp ? "Temperatura" : isAcel ? "Aceleração RMS" : "Velocidade RMS",
                unit: isTemp ? "°C" : isAcel ? "g" : "mm/s",
                data, anomalies: [], annotations: [] });
  }},

  // /spot/:id/spectrum_info — readSpectrumList(spotId), consumido por verifySpec()
  // no wizard de Diagnóstico Automático (useTrainingData.jsx).
  // CAUSA DO BUG "Verificar pisca e não avança": o mock anterior gerava só 6
  // coletas, todas nas últimas 5 horas. verifySpec() filtra as coletas cujo
  // `time` cai DENTRO do período de treinamento escolhido (7-30 dias) E dentro
  // de um intervalo "ligado" (periodOnList, derivado do plot_chart/metric).
  // Qualquer período de treinamento fora da janela "últimas 5h" batia zero
  // coletas → specOnList.length < 5 → specError permanente → o botão chama
  // verifySpec() de novo a cada clique, sem nunca setar validSpec.
  // Correção: mesma cobertura temporal (35 dias) e mesmo passo (6h) do
  // plot_chart/metric, para garantir overlap com qualquer período válido.
  { test: /\/spot\/[^/]+\/spectrum_info$/, handler: (m) => {
    const spotId = seg(m, 1);
    const tree = store.getSpot("__tree__") ? store.getSpot("__tree__").flatTree : FLAT_TREE;
    const sensorType = getSpotSensorType(tree, spotId);
    const severity = getSpotSeverity(spotId);
    // TEMP_ONLY não tem acelerômetro — sem coleta de espectro. INTEGRATED tem
    // dado bruto pouco tratado — pipeline de espectro/diagnóstico automático
    // não se aplica (é uma leitura direta via API de terceiro, não a análise
    // completa do protocolo nativo IoTebe).
    if (sensorType === "TEMP_ONLY" || sensorType === "INTEGRATED") return ok({ res: { spectrumList: [] } });
    const now = Math.floor(Date.now() / 1000);
    const DAYS = 35;
    const STEP_SEC = 6 * 3600; // mesmo passo do plot_chart/metric — garante overlap com periodOnList
    const totalPoints = Math.floor((DAYS * 86400) / STEP_SEC);
    if (severity == null) return ok({ res: { spectrumList: [] } }); // sensor offline: sem coletas
    const spectrumList = Array.from({ length: totalPoints }, (_, i) => {
      const t = now - DAYS * 86400 + i * STEP_SEC;
      const velBase  = velocityRMSFromSeverity(severity);
      const acelBase = accelRMSFromSeverity(severity);
      const wobble = Math.sin(i * 0.8) * (0.25 + severity * 0.6) * 0.4;
      return {
        ng1vt_raw_data_id: `raw-${spotId}-${i + 1}`,
        time: t,
        spectrum_type: "VELOCITY",
        source: i % 6 === 0 ? "MANUAL" : "AUTOMATIC", // coleta manual a cada ~36h, resto automático
        rms_vel_vert:   parseFloat((velBase + wobble).toFixed(3)),
        rms_vel_hor:    parseFloat(((velBase + wobble) * 0.85).toFixed(3)),
        rms_vel_axial:  parseFloat(((velBase + wobble) * 0.60).toFixed(3)),
        rms_acel_vert:  parseFloat((acelBase + wobble * 0.08).toFixed(3)),
        rms_acel_hor:   parseFloat(((acelBase + wobble * 0.08) * 0.85).toFixed(3)),
        rms_acel_axial: parseFloat(((acelBase + wobble * 0.08) * 0.60).toFixed(3)),
      };
    });
    return ok({ res: { spectrumList } });
  }},

  // /spot/:id/collect_info — GET (getCollectInfo) e PUT (updateCollectInfo)
  // useSettingsView: collect.sensor_firmware_version, collect.gateway_firmware_version
  { test: /\/spot\/[^/]+\/collect_info$/, handler: (m) => {
    const spotId = seg(m, 1);
    const override = store.getSpot("collect_" + spotId);
    return ok({
      sensor_firmware_version:  "v3.2.0",
      gateway_firmware_version: "v2.1.0",
      spectrum_sampling_time:   "01:00:00",
      spectrum_sampling_period: 3600,
      rms_sampling_time:        "00:10:00",
      global_sampling_period:   600,
      spectrum_lines:           800,
      automatic_collect_setup:  true,
      dynamic_band:             8,
      spectrum_on_alarm:        false,
      // setups: configuração por tipo de coleta (0=padrão, 1=setup adicional, 2=setup2)
      // useSettingsView acessa setups[0].axes, setups[0].spectrum_lines, setups[0].spectrum_max_frequency
      // e setups[1/2].metrics, .high_pass_frequency, .low_pass_frequency, .spectrum_max_frequency
      setups: [
        { axes: ["H", "V", "A"], spectrum_lines: 800, spectrum_max_frequency: 1000,
          high_pass_frequency: null, low_pass_frequency: null,
          metrics: ["VEL", "ACEL"], sampling_rate: null },
        null,
        null,
      ],
      ...( override || {} ),
    });
  }},

  // /spot/:id/automatic_diagnostic/disable — POST
  { test: /\/spot\/[^/]+\/automatic_diagnostic\/disable$/, handler: () => ok({ success: true }) },

  // /chart/:id/alarm_info — v2 (antes era readchartalarms com body)
  // ModelChart: alarm.data.disable_alarm, alarm_alert, alarm_critical, metric_id
  { test: /\/chart\/[^/]+\/alarm_info$/, handler: (m) => {
    const chartId = seg(m, 1);
    const override = store.getChartAlarms(chartId);
    const isTemp = String(chartId).includes("tmp");
    const defaults = {
      disable_alarm: false,
      alarm_alert:    isTemp ? 65  : 3.5,
      alarm_critical: isTemp ? 80  : 7.1,
      trigger_condition: "OR",
      sampling_period: 600,
      metric_id: isTemp ? 2 : 1,
    };
    return ok({ ...defaults, ...(override || {}) });
  }},

  // /spot/:id/chartids — novo endpoint v2 (antes era readchartids com body)
  // VibAndTemp filtra type="GLOBAL" && is_visible=true
  // SpectralTendency filtra type="PROCESSED_RAW" && is_visible=true
  { test: /\/spot\/[^/]+\/chartids$/, handler: (m) => {
    const spotId = seg(m, 1);
    const tree = store.getSpot("__tree__") ? store.getSpot("__tree__").flatTree : FLAT_TREE;
    const alarm = getSpotAlarm(tree, Number(spotId) || spotId);
    const sensorType = getSpotSensorType(tree, spotId);
    const hasSpectrum = alarm !== "GRAY";

    // TEMP_ONLY — sem acelerômetro: só a leitura de temperatura existe.
    if (sensorType === "TEMP_ONLY") {
      return ok([
        { chart_id: `cht-tmp-${spotId}`, type: "GLOBAL", is_visible: true, automatic_diag: false, chart_name: "Temperatura", unit: "°C" },
      ]);
    }
    // INTEGRATED — vibração via API de terceiro, dado bruto e pouco tratado:
    // uma leitura única (sem quebra vel/acel/temp em 3 gráficos calculados) e
    // sem espectro/diagnóstico automático, que dependem do protocolo nativo.
    if (sensorType === "INTEGRATED") {
      return ok([
        { chart_id: `cht-vel-${spotId}`, type: "GLOBAL", is_visible: true, automatic_diag: false, chart_name: "Vibração (bruto)", unit: "mm/s" },
      ]);
    }

    // automatic_diag: false → gráfico manual (Gráficos Manuais)
    // automatic_diag: true  → gráfico automático (Gráficos Automáticos)
    const charts = [
      { chart_id: `cht-vel-${spotId}`,  type: "GLOBAL",        is_visible: true,        automatic_diag: false, chart_name: "Velocidade RMS",     unit: "mm/s" },
      { chart_id: `cht-acel-${spotId}`, type: "GLOBAL",        is_visible: hasSpectrum, automatic_diag: false, chart_name: "Aceleração RMS",     unit: "g"    },
      { chart_id: `cht-tmp-${spotId}`,  type: "GLOBAL",        is_visible: true,        automatic_diag: true,  chart_name: "Temperatura",         unit: "°C"   },
      { chart_id: `cht-raw-${spotId}`,  type: "PROCESSED_RAW", is_visible: hasSpectrum, automatic_diag: true,  chart_name: "Tendência Espectral", unit: "mm/s" },
    ];
    return ok(charts);
  }},

  // /spot/:id/summary — usa alarmLabel real do spot da URL
  { test: /\/spot\/[^/]+\/summary$/, handler: (m) => {
    const tree = store.getSpot("__tree__") ? store.getSpot("__tree__").flatTree : FLAT_TREE;
    const spotId = seg(m, 1);
    const alarm = getSpotAlarm(tree, Number(spotId) || spotId);
    const lastAlarmed = (alarm === "RED" || alarm === "YELLOW") ? nowMinus(42) : null;
    return ok({ alarm_status: alarm, spot_status: alarm === "RED" ? "CRITICAL" : alarm === "YELLOW" ? "ALERT" : "NORMAL", last_alarmed_time: lastAlarmed });
  }},
  { test: /\/spot\/[^/]+\/machine_info$/, handler: (m) => ok({ spot_id: seg(m, 1), machine_type: "MOTOR", power: 75, rotation_speed: 1470, bearing_model: "6312", fixation_type: "RÍGIDA" }) },
  // /spot/:id/automatic_diagnostic — getAutomaticDiagnostic
  // res.data.automatic_diag = true → isAutoEnabled = true → aba Diagnóstico Automático aparece
  { test: /\/spot\/[^/]+\/automatic_diagnostic$/, handler: (m) => {
    const spotId = seg(m, 1);
    const now = Math.floor(Date.now() / 1000);
    const tree = store.getSpot("__tree__") ? store.getSpot("__tree__").flatTree : FLAT_TREE;
    const alarm = getSpotAlarm(tree, Number(spotId) || spotId);
    // automatic_diag_on_off_limit — limiar entre máquina parada e operando
    // setLimit usa esse valor — sem ele, o campo fica 0 e a validação bloqueia
    // valor coerente com a rotação: ~0.3 mm/s para máquinas industriais paradas
    return ok({
      automatic_diag: true,
      automatic_diag_start_training_time: now - 30 * 86400,
      automatic_diag_end_training_time:   now - 7  * 86400,
      training_period: 30,
      automatic_diag_on_off_limit:  0.3,   // mm/s — limiar parada/operando
      automatic_diag_on_off_metric: "VEL", // métrica: VEL ou ACEL
      limit: 0.3,
      metric: 1,
    });
  }},

  { test: /\/spot\/[^/]+\/open_diagnostic$/, handler: (m) => {
    const spotId = Number(seg(m, 1)) || seg(m, 1);
    const cards = DIAGNOSTICS_OPEN.filter(c => c.spot_id == spotId || String(c.spot_id) === String(spotId));
    return ok(structuredCloneSafe(cards));
  }},
  { test: /\/spot\/[^/]+\/closed_diagnostic$/, handler: (m) => {
    const spotId = Number(seg(m, 1)) || seg(m, 1);
    const cards = DIAGNOSTICS_CLOSED.filter(c => c.spot_id == spotId || String(c.spot_id) === String(spotId));
    return ok(structuredCloneSafe(cards));
  }},
  { test: /\/spot\/[^/]+\/alarmed_periods$/, handler: () => ok([]) },
  {
    test: /\/group\/[^/]+\/alarm_history$/,
    handler: (m) => {
      const tree = store.getSpot("__tree__") ? store.getSpot("__tree__").flatTree : FLAT_TREE;
      const groupId = seg(m, 1);
      const spots = getSpotDescendants(tree, Number(groupId) || groupId);
      const alarmed = spots.filter(n => n.alarmLabel !== "GREEN" && n.alarmLabel !== "GRAY");
      // InsightCard v2: status_color, path, spot_id, diagnostic_card_id,
      // last_alarmed_time, start_diagnostic_time, end_diagnostic_time (null=pendente)
      return ok(alarmed.map((n, i) => ({
        spot_id: n.id,
        diagnostic_card_id: `diag-${n.id}-${i}`,
        status_color: n.alarmLabel,
        path: `Demo / ${n.title}`,
        last_alarmed_time: nowMinus(20 + i * 35),
        start_diagnostic_time: nowMinus(60 + i * 120),
        end_diagnostic_time: null,
        sensor_id: n.sensor_id,
      })));
    },
  },
  // /group/:id/spots/summary — useCriticalSpots usa para:
  // totalSpots, totalSensors, totalGateways, offlineSensors, offlineGateways, criticalBatterys
  // Campos por item: spot_id, sensor_id, gateway_id, battery_level,
  //   global_last_collect (unix), gateway_last_connection_update (unix), gateway_internet_connection (0/1)
  { test: /\/group\/[^/]+\/spots\/summary$/, handler: (m) => {
    const tree = store.getSpot("__tree__") ? store.getSpot("__tree__").flatTree : FLAT_TREE;
    const groupId = seg(m, 2);
    const spots = getSpotDescendants(tree, Number(groupId) || groupId);
    const now = Math.floor(Date.now() / 1000);
    return ok(spots.map(n => {
      const sensor = n.sensor_id ? SENSORS[n.sensor_id] : null;
      const isOffline = n.alarmLabel === "GRAY" || !sensor;
      return {
        spot_id: n.id,
        sensor_id: n.sensor_id || null,
        gateway_id: "gw-001",
        battery_level: sensor ? sensor.battery : null,
        global_last_collect: sensor
          ? (isOffline ? now - 7200 : now - Math.floor(Math.random() * 3600))
          : null,
        gateway_last_connection_update: now - (isOffline ? 1800 : 60),
        gateway_internet_connection: isOffline ? 0 : 1,
        rssi: sensor ? sensor.rssi : null,
      };
    }));
  }},
];

// -----------------------------------------------------------------------------
// Resolução de rota
// -----------------------------------------------------------------------------
export function resolveRoute(path, body) {
  // 1) padrões dinâmicos
  for (const p of PATTERNS) {
    if (p.test.test(path)) return p.handler(path, body);
  }
  // 2) nome do endpoint = último segmento (ou caminho inteiro sem barras)
  const key = lastSegment(path).toLowerCase();
  if (STATIC[key]) return STATIC[key](body);

  // 3) default seguro — lista vazia (a maioria dos consumidores itera sobre data)
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.info(`[IoTebe demo] endpoint sem mock dedicado: "${key}" — retornando [] (forma padrão segura).`);
  }
  return [];
}

// -----------------------------------------------------------------------------
// Utils
// -----------------------------------------------------------------------------
function lastSegment(path) {
  const clean = (path || "").split("?")[0].replace(/\/+$/, "");
  const segs = clean.split("/").filter(Boolean);
  return segs.length ? segs[segs.length - 1] : clean;
}
function seg(path, fromEnd) {
  const segs = (path || "").split("?")[0].split("/").filter(Boolean);
  return segs[segs.length - 1 - fromEnd];
}
function structuredCloneSafe(obj) {
  try {
    return typeof structuredClone === "function" ? structuredClone(obj) : JSON.parse(JSON.stringify(obj));
  } catch {
    return JSON.parse(JSON.stringify(obj));
  }
}
