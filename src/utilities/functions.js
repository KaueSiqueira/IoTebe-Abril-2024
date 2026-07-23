import { walk, find } from "react-sortable-tree";
import { Auth } from "aws-amplify";

export function formatUnixTimestamp(UNIX_timestamp) {
  const a = new Date(UNIX_timestamp * 1000);
  const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
  const year = a.getFullYear();
  const month = months[a.getMonth()];
  const date = a.getDate();
  const hour = a.getHours();
  const min = a.getMinutes();
  const time = `${date.toString().length === 1 ? `0${date}` : date}/${month}/${year} às ${
    hour.toString().length === 1 ? `0${hour}` : hour
  }h${min.toString().length === 1 ? `0${min}` : min}`;
  return time;
}

// 19/01/1970 às 16h27

export function formatEventMessage(e) {
  let formattedType = "";
  switch (e.type) {
    case "TEMPERATURE":
      formattedType = "Temperatura, ";
      break;
    case "VIBRATION":
      formattedType = "Vibração, ";
      break;
    case "A_VIBRATION":
      formattedType = "Vibração axial, ";
      break;
    case "H_VIBRATION":
      formattedType = "Vibração horizontal, ";
      break;
    case "V_VIBRATION":
      formattedType = "Vibração vertical, ";
      break;
    default:
      formattedType = "Desconhecido ";
      break;
  }

  let formattedEvent = "";
  switch (e.event) {
    case "FLAG_CHANGE":
      formattedEvent = "mudou o alarme para ";
      break;
    case "UPDATE_A2":
      formattedEvent = "foi alterado o alarme alerta (amarelo) ";
      break;
    case "UPDATE_A1":
      formattedEvent = "foi alterado o alarme crítico (vermelho) ";
      break;
    case "DISABLE":
      formattedEvent = "foi ";
      break;
    default:
      formattedEvent = "... ";
      break;
  }

  let formattedValue = "";
  switch (e.value) {
    case "GREEN":
      formattedValue = "ok.";
      break;
    case "YELLOW":
      formattedValue = "alerta.";
      break;
    case "RED":
      formattedValue = "crítico.";
      break;
    case "TRUE":
      formattedValue = "desativada.";
      break;
    case "FALSE":
      formattedValue = "ativada.";
      break;
    default:
      formattedValue = ".";
      break;
  }

  return formattedType + formattedEvent + formattedValue;
}

export function getOneDayAgoTimestamp() {
  var date = Math.floor(Date.now() / 1000);
  date = date - 60 * 60 * 24 * 1;
  return date;
}

export function getSevenDaysAgoTimestamp() {
  var opa = new Date();
  var date = Math.floor(opa.getTime() / 1000);
  date = date - 60 * 60 * 24 * 7;
  return date;
}

export function getThirtyDaysAgoTimestamp() {
  var date = Math.floor(Date.now() / 1000);
  date = date - 60 * 60 * 24 * 30;
  return date;
}

export function getSixtyDaysAgoTimestamp() {
  var date = Math.floor(Date.now() / 1000);
  date = date - 60 * 60 * 24 * 60;
  return date;
}

export function getNinetyDaysAgoTimestamp() {
  var date = Math.floor(Date.now() / 1000);
  date = date - 60 * 60 * 24 * 90;
  return date;
}

export function getCurrentTimezone() {
  return (new Date().getTimezoneOffset() * -1) / 60;
}

export function checkNetworkError(error) {
  // console.log("ERRO JSON", JSON.stringify(error));
  // console.log("ERRO config", error.config);
  // console.log("ERRO status", error.status);
  // console.log("ERRO code", error.code);
  // console.log("ERRO response.status", error.response.status);
  // console.log("ERRO response.data", error.response.data);
  // console.log("ERRO ", error.);
  // console.log("ERRO ", error);
  // console.log("ERRO", error);
  // if (error.message === 'Network Error') {
  //   if (window.confirm('ERRO AO SE CONECTAR COM O BANCO DE DADOS\nDeseja atualizar a página?'))
  //     window.location.reload();
  //   else
  //     console.log("You pressed Cancel!");
  // }

  if (error.response) {
    // console.log("client received an error response (5xx, 4xx)");
  } else if (error.request) {
    // console.log("client never received a response, or request never left");
  } else {
    // console.log(" anything else");
  }
}

export async function validateAccessToken(token) {
  // console.log("token", token);
  if (token.payload.exp > Math.floor(Date.now() / 1000)) {
    // console.log("TOKEN VALIDO, ENCAMINHANDO");
    return token.jwtToken;
  } else {
    // console.log("TOKEN VENCIDO, GERANDO NOVO");
    await Auth.currentAuthenticatedUser()
      .then((user) => {
        return user.signInUserSession.accessToken.jwtToken;
      })
      .catch((error) => {
        // console.log("ERRO EM getAccessToken()", error);
        return undefined;
      });
  }
}

export async function getCurrentAccessToken() {
  try {
    const user = await Auth.currentAuthenticatedUser();
    return user.signInUserSession.accessToken.jwtToken;
  } catch (error) {
    return undefined;
  }
}

export function getFormattedDate(date) {
  let year = date.getFullYear();
  let month = (1 + date.getMonth()).toString().padStart(2, "0");
  let day = date.getDate().toString().padStart(2, "0");

  return day + "/" + month + "/" + year;
}

export function getGroupChildren(selectedNode) {
  let children = [];

  walk({
    treeData: [selectedNode],
    getNodeKey: ({ treeIndex }) => treeIndex,
    ignoreCollapsed: false,
    callback: (node) => {
      node.node.type === "SPOT" && children.push(node.node.id);
    },
  });

  return children;
}

export function getGroupLabelColor(node) {
  if (!!node) {
    let label;
    let labels = [];

    for (let i = 0; i < node.children.length; i++) {
      labels.push(node.children[i].alarmLabel);
      if (label === undefined) label = node.children[i].alarmLabel;
      else if (
        node.children[i].alarmLabel === "GRAY" &&
        !(label === "GREEN" || label === "YELLOW" || label === "RED")
      )
        label = "GRAY";
      else if (node.children[i].alarmLabel === "GREEN" && !(label === "YELLOW" || label === "RED"))
        label = "GREEN";
      else if (node.children[i].alarmLabel === "YELLOW" && !(label === "RED")) label = "YELLOW";
      else if (node.children[i].alarmLabel === "RED") label = "RED";
    }

    return label;
  }
}

export function getCurrentTreeIndex(node, spotId) {
  const { matches } = find({
    getNodeKey: ({ treeIndex }) => treeIndex,
    treeData: [node],
    searchQuery: spotId,
    searchMethod: ({ node, searchQuery }) => node.id === searchQuery,
    searchFocusOffset: 0,
    expandFocusMatchPaths: true,
  });
  if (!matches[0]) return;  
  const currentTreeIndex = matches[0].node.tree_index;
  return currentTreeIndex;
};

export function mountFullPath(tree, tree_id, removeFirst = true, removeLast = false) {
  const path = [];

  function findPath(node, targetId) {
    if (node.tree_id === targetId) {
      path.push(node.title);
      return true;
    }

    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        if (findPath(child, targetId)) {
          path.push(node.title);
          return true;
        }
      }
    }

    return false;
  }

  for (const item of tree) {
    if (findPath(item, tree_id)) {
      break;
    }
  }

  path.reverse()

  removeFirst && path.length > 1 && path.shift();
  removeLast && path.length > 1 && path.pop();

  return path.join(" / ");
}

export function namePath(tree, tree_id) {
  const { treeData, matches } = find({
    getNodeKey: ({ treeIndex }) => treeIndex,
    treeData: tree,
    searchQuery: tree_id,
    searchMethod: ({ node, searchQuery }) => node.tree_id === searchQuery,
    searchFocusOffset: 0,
    expandFocusMatchPaths: true,
  });

  if (!matches[0]) return;
  const treePath = matches[0].path;
  let fullPath = [];

  treePath.forEach((index) => {
    walk({
      treeData: treeData,
      getNodeKey: ({ treeIndex }) => treeIndex,
      ignoreCollapsed: true,
      callback: (node) => {
        if (node.treeIndex === index) {
          fullPath.push({
            id: node.node.tree_id,
            tree_index: node.node.tree_index,
            path: node.node.title,
            type: node.node.type,
          });
        }
      },
    });
  });
  return fullPath;
}

export function findNode(tree, tree_id) {
  const { matches } = find({
    getNodeKey: ({ treeIndex }) => treeIndex,
    treeData: tree,
    searchQuery: tree_id,
    searchMethod: ({ node, searchQuery }) => node.tree_id === searchQuery,
    searchFocusOffset: 0,
    expandFocusMatchPaths: true,
  });

  return matches[0];
}

export function makeCsv({ datasets }) {
  const data = [];
  const headers = [
    { label: "Dia", key: "Dia" },
    { label: "Hora", key: "Hora" },
  ];

  let f = []
  datasets.map((d, i) => {
    f[i] = d;
    headers.push({label: d.label, key: d.label})
  })

  // datasets.forEach((e) => {
  //   headers.push({ label: e.label, key: e.label });
  // });

  for (let i = 0; i < datasets[0].data.length; i++) {
    const date = new Date(datasets[0].data[i].x).toLocaleString().split(" ");
    const d = date[0];
    const h = date[1];
    let preData = {Dia: d, Hora: h}
    
    f.map((d, idx ) => {
      let label = d.label;
      let value = d.data[i].y.toString().replace(".", ",");
      preData = {...preData, [label]: value}
    })
    
    data.push(preData);
  }
  //console.log(data)
  return { headers, data };
/*
  const data = [];
  const f1 = datasets[0].label;

  const headers = [
    { label: "Dia", key: "Dia" },
    { label: "Hora", key: "Hora" },
    { label: f1, key: f1 },
  ];

  for (let i = 0; i < datasets[0].data.length; i++) {
    const date = new Date(datasets[0].data[i].x).toLocaleString().split(" ");
    const d = date[0];
    const h = date[1];
    const v1 = datasets[0].data[i].y.toString().replace(".", ",");

    data.push({ Dia: d, Hora: h, [f1]: v1 });
  }
  return { headers, data };
  }*/
}

export function makeTempCsv({ datasets }) {
  const data = [];
  const f1 = datasets[0].label;

  const headers = [
    { label: "Dia", key: "Dia" },
    { label: "Hora", key: "Hora" },
    { label: f1, key: f1 },
  ];

  for (let i = 0; i < datasets[0].data.length; i++) {
    const date = new Date(datasets[0].data[i].x).toLocaleString().split(" ");
    const d = date[0];
    const h = date[1];
    const v1 = datasets[0].data[i].y.toString().replace(".", ",");

    data.push({ Dia: d, Hora: h, [f1]: v1 });
  }
  return { headers, data };
}

export function makeSpectrumCsv(chartData, title = "Frequencia") {
  const data = [];

  const axial = chartData.dataAxial;
  const horizontal = chartData.dataHorizontal;
  const vertical = chartData.dataVertical;

  const l = title;

  const headers = [
    { label: l, key: l },
    { label: "Axial", key: "Axial" },
    { label: "Horizontal", key: "Horizontal" },
    { label: "Vertical", key: "Vertical" },
  ];

  for (let i = 0; i < chartData.dataAxial.length; i++) {
    const x = axial[i].x.toString().replace(".", ",");
    const a = axial[i].y.toString().replace(".", ",");
    const h = horizontal[i].y.toString().replace(".", ",");
    const v = vertical[i].y.toString().replace(".", ",");

    data.push({ [l]: x, Axial: a, Horizontal: h, Vertical: v });
  }
  return { headers, data };
}

export function timeText (timestamp) {
  const hour = 3600;
  const day = 86400;
  const month = 2592000;
  const year = 31556926;

  if (timestamp < hour) {
    let m = Math.floor(timestamp / 60);
    if (m <= 1) return "há 1 minuto";
    return "há " + m + " minutos";
  }
  else if (timestamp < day) {
    let h = Math.floor(timestamp / hour);
    if (h <= 1) return "há 1 hora";
    return "há " + h + " horas";
  }
  else if (timestamp < month) {
    let d = Math.floor(timestamp / day);
    if (d <= 1) return "há 1 dia";
    return "há " + d + " dias";
  }
  else if (timestamp < year) {
    let M = Math.floor(timestamp / month);
    if (M <= 1) return "há 1 mês";
    return "há " + M + " meses";
  }
  else if (timestamp >= year) {
    let a = Math.floor(timestamp / year);
    if (a <= 1) return "há 1 ano";
    return "há " + a + " anos";
  }
};

export const convertHour = (
  hour,
  utcInMinutes = -new Date().getTimezoneOffset()
) => {
  const originalDate = new Date("1970-01-01T" + hour);

  originalDate.setMinutes(originalDate.getMinutes() + utcInMinutes);

  return originalDate.toTimeString().slice(0, 8);
};

export function haveChanges(originalObj, changedObj) {
  return JSON.stringify(originalObj) !== JSON.stringify(changedObj)
}

export function strToNumFirmwareVersion(versionString){
  if (!versionString) return 0
  const [ major, minor, patch ] = versionString.substring(1).split(".");
  return parseInt(major*10e6) + parseInt(minor*10e3) + parseInt(patch)
}

export const concatClassName = (...classes) => {
  const validClasses = classes.filter(
    (item) => typeof item === "string" && item.trim() !== ""
  );
  return validClasses.length > 0 ? validClasses.join(" ") : "";
};

export const formatErrorList = (errors) => {
  return errors?.types
    ? Object.entries(errors.types).map(([type, message]) =>
        typeof message === "string" ? message : ""
      )
    : [];
};