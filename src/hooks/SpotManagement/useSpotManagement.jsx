import { useState, useEffect } from "react";
import {
  find,
  getFlatDataFromTree,
  getTreeFromFlatData,
} from "react-sortable-tree";
import {
  getGroupAlarmHistory,
  getSoundAlarm,
  readAssetsTree,
  updateSoundAlarm,
} from "../../apis";
import FeedbackToast from "../../components/FeedbackToast/FeedbackToast";

export default function useSpotManagement(tree, setTree) {
  /*TESTE*/
  const debugMode = false;
  /*TESTE*/

  const [loading, setLoading] = useState(false);

  // Estado que armazena os alarmes
  const [data, setData] = useState([]);

  // Estado que armazena toda a arvore
  const [plantArray, setPlantArray] = useState([]);

  // Estado que armazena a planta selecionada
  const [selectedPath, setSelectedPath] = useState({});

  // Estado que armazena todos os setores da planta selecionada
  const [sectorArray, setSectorArray] = useState([]);

  // Estado que armazena o setor selecionado
  const [selectedSector, setSelectedSector] = useState({});

  // Estado que informa se os setores devem aparecer ou não na navegação das plantas
  const [hideSector, setHideSector] = useState(true);

  // Estados que armazenam a quantidade de spots vermelhos, amarelos, verdes, cinza
  const [red, setRed] = useState(0);
  const [yellow, setYellow] = useState(0);
  const [green, setGreen] = useState(0);
  const [gray, setGray] = useState(0);

  // Estados que informam quais cartões devem mostrar seus spots de acordo com a cor (filtro).
  const [showRed, setShowRed] = useState("RED");
  const [showYellow, setShowYellow] = useState("YELLOW");
  const [showGreen, setShowGreen] = useState("NO");
  const [showGray, setShowGray] = useState("NO");

  // Estado para abrir ou fechar os filtros
  const [spotFilter, setSpotFilter] = useState(false);
  const [alarmFilter, setAlarmFilter] = useState(false);

  // Estados de dia e hora atuais, para indicar a última atualização
  const [hour, setHour] = useState("");
  const [day, setDay] = useState("");

  // Estado para indicar se é a primeira renderizada da tela
  const [firstLoad, setFirstLoad] = useState(true);

  const [showPendents, setShowPendents] = useState(true);

  const [showSoundConfig, setShowSoundConfig] = useState(false);

  const [alarmSound, setAlarmSound] = useState(false);

  const [updatingSoundAlarm, setUpdatingSoundAlarm] = useState(false);

  // Variavel para auxiliar a armazenagem dos alarmes, a fim de utilizar seu resultado no setData e na função spotCounter
  let tempArray = [];

  // Função que busca todos os alarmes
  const loadData = async (plantId) => {
    try {
      const res = await getGroupAlarmHistory(plantId);
      const today = new Date(Date.now());
      tempArray = res.data;
      setData(tempArray);
      setDay(today.toLocaleDateString());
      setHour(today.toLocaleTimeString());
    } catch (error) {
      console.error(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  // Função para contabilizar a quantidade de de spots vermelhos, amarelos, verdes, cinza
  const spotCounter = (dataTree) => {
    const flatPlant = getFlatDataFromTree({
      treeData: dataTree?.children,
      getNodeKey: ({ treeIndex }) => treeIndex,
      ignoreCollapsed: false,
    });
    const colorCounts = {
      RED: 0,
      YELLOW: 0,
      GREEN: 0,
      GRAY: 0,
    };

    for (const spot of flatPlant) {
      if (spot.node.type === "SPOT") {
        const spotId = spot.node.id;
        const alarmList = tempArray.length > 0 ? tempArray : data;

        for (const alarm of alarmList) {
          if (alarm.spot_id === spotId) {
            // Se o filtro de showPendents for false, então só podere validar a contagem caso esses spot esteja alarmado no momento
            if (
              showPendents ||
              (!showPendents && spot.node.alarmLabel === alarm.status_color)
            ) {
              colorCounts[alarm.status_color]++;
            } else {
              colorCounts[spot.node.alarmLabel]++;
            }
          }
        }

        if (!alarmList.some((alarm) => alarm.spot_id === spotId)) {
          if (spot.node.alarmLabel === "GREEN") {
            colorCounts.GREEN++;
          } else if (spot.node.alarmLabel === "YELLOW") {
            colorCounts.YELLOW++;
          } else if (spot.node.alarmLabel === "RED") {
            colorCounts.RED++;
          } else if (spot.node.alarmLabel === "GRAY") {
            colorCounts.GRAY++;
          }
        }
      }
    }

    setRed(colorCounts.RED);
    setYellow(colorCounts.YELLOW);
    setGreen(colorCounts.GREEN);
    setGray(colorCounts.GRAY);
  };

  const compareTrees = (tree1, tree2, propToRemove = "children") => {
    // Verificar se as propriedades são iguais, ignorando a propriedade a ser removida e os childrens
    let { [propToRemove]: prop1, ...rest1 } = tree1;
    let { [propToRemove]: prop2, ...rest2 } = tree2;
    let { children: prop3, ...rest3 } = rest1;
    let { children: prop4, ...rest4 } = rest2;
    if (JSON.stringify(rest3) !== JSON.stringify(rest4)) {
      debugMode && console.log("Diferença nas propriedades:", rest3, rest4);
      return false;
    }

    // Recursivamente comparar os childrens (se existirem)
    const childrenProp = "children";
    const children1 = tree1[childrenProp] || [];
    const children2 = tree2[childrenProp] || [];

    if (children1.length !== children2.length) {
      debugMode &&
        console.log("Diferença no número de childrens:", children1, children2);
      return false;
    }

    for (let i = 0; i < children1.length; i++) {
      if (!compareTrees(children1[i], children2[i], propToRemove)) {
        return false;
      }
    }

    return true;
  };

  const filterPlants = async () => {
    let temp = tree;

    temp.forEach((obj) => {
      if (obj.type === "PLANT" && obj.children) {
        const spotsArray = obj.children.filter(
          (child) => child.type === "SPOT"
        );
        obj.children = obj.children.filter((child) => child.type !== "SPOT");

        if (spotsArray.length > 0) {
          const redSpot = spotsArray.find((spot) => {
            return spot.alarmLabel === "RED";
          });
          const yellowSpot = spotsArray.find((spot) => {
            return spot.alarmLabel === "YELLOW";
          });
          const greenSpot = spotsArray.find((spot) => {
            return spot.alarmLabel === "GREEN";
          });

          const hierarchy = redSpot
            ? "RED"
            : yellowSpot
            ? "YELLOW"
            : greenSpot
            ? "GREEN"
            : "GRAY";

          obj.children.push({
            title: "SPOTS SEM GRUPO",
            children: spotsArray,
            id: "spotWithoutGroup" + obj.id,
            type: "SECTOR",
            alarmLabel: hierarchy,
          });
        }
      }
    });

    const isSelectedPathEmpty = JSON.stringify(selectedPath) === "{}";

    let definitiveArray = [{}];

    if (temp.length > 0) {
      definitiveArray = temp;
    }

    let newSelectedPath = isSelectedPathEmpty
      ? definitiveArray[0]
      : definitiveArray.find((obj) => obj.id === selectedPath.id);

    debugMode &&
      console.log(
        "================================================================================"
      );
    debugMode && console.log("Filtro de Árvore");

    const sameTrees = compareTrees(
      selectedPath,
      newSelectedPath,
      "rmstemp_last_collect"
    );

    debugMode && console.log("Os SelectedPath são iguais?", sameTrees);
    setSelectedPath(sameTrees ? selectedPath : newSelectedPath);
    setPlantArray(definitiveArray);

    if (sameTrees) {
      filterSector(selectedPath, selectedSector);
    }
  };

  const filterSector = async (plant, selectedSector = {}) => {
    debugMode &&
      console.log(
        "================================================================================"
      );
    debugMode && console.log("Filtro de Setor");
    let tempSector = [];
    for (const sector of plant.children) {
      tempSector.push(sector);
    }
    if (tempSector.length > 0) {
      const sameSectorArray = compareTrees(
        { children: sectorArray },
        { children: tempSector },
        "rmstemp_last_collect"
      );
      debugMode && console.log("Os SectorArrays são iguais?", sameSectorArray);
      await loadData(plant.id);
      setSectorArray(sameSectorArray ? sectorArray : tempSector);
      spotCounter(
        JSON.stringify(selectedSector) !== "{}" ? selectedSector : plant
      );
      tempArray = [];
    }
  };

  const loadTree = async () => {
    const { tree_id } = sessionStorage.getItem("whichClicked")
      ? JSON.parse(sessionStorage.getItem("whichClicked"))
      : { tree_id: null };

    try {
      const res = await readAssetsTree();

      for (let node of res.data) {
        node["tree_id"] =
          node["type"] === "SPOT"
            ? node["id"] + "_spot"
            : node["id"] + "_group";
        node["parent"] =
          node["parent"] !== null ? node["parent"] + "_group" : null;
      }

      const treeData = getTreeFromFlatData({
        flatData: res.data,
        getKey: (node) => node.tree_id,
        getParentKey: (node) => node.parent,
        rootKey: null,
      }).map((node) => {
        node.expanded = false;
        return node;
      });

      const { treeData: tree } = find({
        getNodeKey: ({ treeIndex }) => treeIndex,
        treeData: treeData,
        searchQuery: tree_id,
        searchMethod: ({ node, searchQuery }) => node.tree_id === searchQuery,
        searchFocusOffset: 0,
        expandFocusMatchPaths: true,
      });

      setTree(tree);
    } catch (error) {
      console.error(error);
    }
  };

  const handleColumnWidthChange = () => {
    document.querySelectorAll(".spotViewCard").forEach((spotViewCard) => {
      const scrollWidthInVw =
        (spotViewCard.scrollWidth / window.innerWidth) * 100;

      if (scrollWidthInVw < 16) {
        spotViewCard.style.width = "16vw";
      } else {
        spotViewCard.style.width = "";
        spotViewCard.style.width = `calc(${spotViewCard.scrollWidth}px + 2vh)`;
      }
    });

    document.querySelectorAll(".svcCards").forEach((svcCard) => {
      svcCard.style.width = "";
      svcCard.style.width = `${svcCard.scrollWidth}px`;
    });
  };

  const handleSpotFilter = (
    red = "NO",
    yellow = "NO",
    green = "NO",
    gray = "NO"
  ) => {
    localStorage.setItem(
      "spotFilter",
      JSON.stringify({ red, yellow, green, gray })
    );
    setShowRed(red);
    setShowYellow(yellow);
    setShowGreen(green);
    setShowGray(gray);
  };

  const handleAlarmFilter = (pendents = true) => {
    setAlarmSound(false);
    localStorage.setItem("alarmFilter", JSON.stringify({ pendents }));
    setShowPendents(pendents);
    setTimeout(() => {
      setAlarmSound(true);
    }, 1000);
  };

  const handleOpenPath = () => {
    if (JSON.stringify(selectedSector) === "{}") {
      filterSector(selectedPath);
      setHideSector(false);
    }
  };

  const handleClosePath = () => {
    if (JSON.stringify(selectedSector) !== "{}") {
      cleanSector();
    } else {
      JSON.stringify(selectedPath) !== "{}" && cleanPlant();
    }
  };

  const cleanSector = async () => {
    setSelectedSector({});
    setHideSector(false);
  };

  const cleanPlant = async () => {
    setSelectedPath({});
    setHideSector(true);
  };

  const handleAlarmSound = async () => {
    setUpdatingSoundAlarm(true);
    try {
      await updateSoundAlarm({ sound_alarm: !alarmSound });
      setAlarmSound(!alarmSound);
      FeedbackToast.success();
    } catch {
      console.error("Error while updating sound alarm");
      FeedbackToast.error();
    } finally {
      setUpdatingSoundAlarm(false);
    }
  };

  useEffect(() => {
    const loadSoundConfig = async () => {
      setUpdatingSoundAlarm(true);
      try {
        const res = await getSoundAlarm();
        setAlarmSound(res?.data?.management_view_sound_enabled);
      } catch {
        console.error("Error while loading sound alarm");
      } finally {
        setUpdatingSoundAlarm(false);
      }
    };

    if (firstLoad) {
      setLoading(true);
      loadSoundConfig();
      filterPlants();
      setFirstLoad(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstLoad]);

  useEffect(() => {
    if (!firstLoad) {
      filterPlants();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tree]);

  useEffect(() => {
    if (
      JSON.stringify(selectedPath) !== "{}" &&
      // eslint-disable-next-line no-self-compare
      selectedPath === selectedPath &&
      !firstLoad
    ) {
      filterSector(selectedPath, selectedSector);
    }

    const timer = setInterval(() => {
      loadTree();
    }, 1000 * 60);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPath, selectedSector]);

  useEffect(() => {
    setTimeout(() => {
      handleColumnWidthChange();
    }, 10);
  }, [spotFilter, alarmFilter, selectedPath, selectedSector, sectorArray]);

  useEffect(() => {
    spotCounter(
      JSON.stringify(selectedSector) !== "{}" ? selectedSector : selectedPath
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showPendents, spotCounter]);

  useEffect(() => {
    let spotFilter = localStorage.getItem("spotFilter");
    let alarmFilter = localStorage.getItem("alarmFilter");
    if (spotFilter) {
      spotFilter = JSON.parse(spotFilter);
      setShowRed(spotFilter.red);
      setShowYellow(spotFilter.yellow);
      setShowGreen(spotFilter.green);
      setShowGray(spotFilter.gray);
    }
    if (alarmFilter) {
      alarmFilter = JSON.parse(alarmFilter);
      setShowPendents(alarmFilter.pendents);
    }
  }, []);

  return {
    setSpotFilter,
    setAlarmFilter,
    setShowGray,
    setSelectedSector,
    setHideSector,
    handleColumnWidthChange,
    handleSpotFilter,
    handleOpenPath,
    handleClosePath,
    setSelectedPath,
    handleAlarmFilter,
    loading,
    spotFilter,
    alarmFilter,
    showRed,
    showYellow,
    showGreen,
    showGray,
    red,
    green,
    gray,
    yellow,
    day,
    hour,
    selectedSector,
    selectedPath,
    sectorArray,
    data,
    hideSector,
    plantArray,
    showPendents,
    showSoundConfig,
    setShowSoundConfig,
    alarmSound,
    handleAlarmSound,
    updatingSoundAlarm,
  };
}
