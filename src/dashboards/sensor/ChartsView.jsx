/* IMPORTAÇÃO DOS ICONES Material UI v5.10.12 */
import {
  ExpandMore,
  Assignment,
  WarningRounded,
  NoteAdd,
  KeyboardArrowDown,
  AutoMode
} from "@mui/icons-material";

import { TextField, Tooltip } from "@mui/material";

import React, { useEffect, useState, useRef, useContext } from "react";
import DateRangePicker from "react-bootstrap-daterangepicker";
import { FilterAnnotButton } from "./FilterAnnotButton";
import {
  readSpectrumList,
  updateRmsTempAnnotation,
  readSpotInfo
} from "../../apis";

import { Button, Card, Input, PopupModal, Table } from "../../components";
import {
  formatUnixTimestamp,
  getFormattedDate,
  getOneDayAgoTimestamp,
  getSevenDaysAgoTimestamp,
} from "../../utilities";
import { SpotHistoricTable } from "../cards_content";

import Spectrum from "./Spectrum";
import VibAndTemp from "./VibAndTemp";
import Automatic from "./automatic/Automatic";
import { SpectrumButtons } from "./spectrum_cards/SpectrumButtons";
import { CascateModal } from "./spectrum_cards/CascateModal";
import { Cascate } from "./Cascate";
import SpectralTendency from "./SpectralTendency";

import { DiagnosticContext, RightSideMenuContext, WhichRenderContext } from "../../contexts";
import DiagnosticCharts from "./diagnostic/DiagnosticCharts";
import DiagnosticMenu from "./diagnostic/DiagnosticMenu";
import MobileDescription from "./diagnostic/MobileDescription";
import MobileHistoric from "./diagnostic/MobileHistoric";
import FeedbackToast from "../../components/FeedbackToast/FeedbackToast";
import { ProtectedFeature } from "../../components/ProtectedFeature/ProtectedFeature";

const locale = {
  format: "DD/MM/YYYY",
  applyLabel: "Aplicar",
  cancelLabel: "Cancelar",
  daysOfWeek: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"],
  monthNames: [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ],
};

const columnsSpectrumList = [
  {
    id: "time",
    label: "Data da Coleta",
    align: "center",
    minWidth: 100,
  },
  {
    id: "rms_acel_vert",
    label: "Vertical",
    align: "center",
    minWidth: 70,
  },
  {
    id: "rms_acel_hor",
    label: "Horizontal",
    align: "center",
    minWidth: 70,
  },
  {
    id: "rms_acel_axial",
    label: "Axial",
    align: "center",
    minWidth: 70,
  },
  {
    id: "rms_vel_vert",
    label: "Vertical",
    align: "center",
    minWidth: 70,
  },
  {
    id: "rms_vel_hor",
    label: "Horizontal",
    align: "center",
    minWidth: 70,
  },
  {
    id: "rms_vel_axial",
    label: "Axial",
    align: "center",
    minWidth: 70,
  },
];

function ChartsView(props) {
  const [loading, setLoading] = useState(true);
  const [vibTemp, setVibTemp] = useState(false);
  const [update, setUpdate] = useState(false);
  const [cancel, setCancel] = useState(false);
  const [frequency, setFrequency] = useState("rpm");
  const [freqValue, setFreqValue] = useState("0000");
  const [freqData, setFreqData] = useState({})

  const [vibTempDateRange, setVibTempDateRange] = useState({
    startDate: new Date(getSevenDaysAgoTimestamp() * 1000),
    endDate: new Date(),
  });

  const [historicDateRange, setHistoricDateRange] = useState({
    startDate: new Date(getSevenDaysAgoTimestamp() * 1000),
    endDate: new Date(vibTempDateRange.endDate.getTime() + 5000),
  });

  const [dateType, setDateType] = useState("day");
  const [dateButton, setDataButton] = useState("_7dVibTempOptions");

  const [showSpectrumList, setShowSpectrumList] = useState(false);

  const [dataId, setDataId] = useState(null);
  const [spectrumListData, setSpectrumListData] = useState([{}]);
  const [spectrumButtonText, setSpectrumButtonText] = useState("Coletas");
  const [spectrumType, setSpectrumType] = useState("velocity");

  const [checkedFilterAnnot, setCheckedFilterAnnot] = useState([
    "anom",
    "alarm",
    "annot",
  ]);

  const [annotation, setAnnotation] = useState();
  const [saveAnnotation, setSaveAnnotation] = useState(false);
  const [modalAnnotation, setModalAnnotation] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [annotationSelected, setAnnotationSelected] = useState(undefined);

  const [title, setTitle] = useState("");
  const [confirmTitle, setConfirmTitle] = useState("Editar");
  const [description, setDescription] = useState("");

  const [cascateAPI, setCascateAPI] = useState({});

  const [alarmMode, setAlarmMode] = useState(false);
  const [mobileMode, setMobileMode] = useState(false);
  const [timeSelector, setTimeSelector] = useState(false);
  const [mobileSelector, setMobileSelector] = useState(false);
  const [timeValue, setTimeValue] = useState("7 Dias");

  const { whichPage, setSpotPage, alarmYellow, alarmRed, warningAlarm, setWarningAlarm, selectedNode } = useContext(WhichRenderContext);
  const {
    waitingFeedbackAnomalies,
    toggleSidemenu,
    setChartStates,
    sidemenuContext,
    trainingPeriod,
    setTrainingPeriod,
    setPageDate,
    loadingAutomaticInfo,
    isAutoEnabled,
    setSensorVersion
  } = useContext(RightSideMenuContext);
  const { diagnosticType } = useContext(DiagnosticContext)

  const maxDate = new Date();
  const returnPage = props.returnPage;
  const setReturnPage = props.setReturnPage

  // const summary = useRef(null);
  // const vibandtemp = useRef(null);
  // const spectre = useRef(null);
  // const historic = useRef(null);
  const annotationButton = useRef(null);
  const rotationRef = useRef(null)

  const loadData = async () => {
    try {
      const { data } = await readSpotInfo(props.spotId);
      setSensorVersion(data.firmware_version);
      await setFrequency("rpm")
      await setFreqValue(data.rotation_speed);
      await setFreqData({frequency_value: data.rotation_speed, type: "rpm"})
    }
    catch(error){
      console.log(error)
    }
  }

  function handleVibTempApply(event, picker) {
    setDateType("day");
    buttonTogglerVibTempOptions();
    setDataButton("");
    setTimeSelector(false);

    let auxEndDate = new Date(
      picker.endDate._d.getFullYear(),
      picker.endDate._d.getMonth(),
      picker.endDate._d.getDate(),
      new Date().getHours(),
      new Date().getMinutes(),
      new Date().getMilliseconds()
    );
    setVibTempDateRange({
      startDate: picker.startDate._d,
      endDate: auxEndDate,
    });
  }

  function handleHistoricApply(event, picker) {
    setHistoricDateRange({
      startDate: picker.startDate._d,
      endDate: picker.endDate._d,
    });
  }

  function handleFreqValue(event){
    if(event.target.value < 20000){
      setFreqValue(parseFloat(event.target.value));
      setFreqData({frequency_value: parseFloat(event.target.value), type: frequency})
    }
    else{
      setFreqValue(20000);
      setFreqData({frequency_value: 20000, type: frequency})
    }
  }

  function handleFrequency(event){
    let tempFreq = frequency === "rpm" ? (freqValue/60).toFixed(2) : Math.round(freqValue*60);
    setFreqValue(tempFreq);
    setFrequency(event.target.value);
    setFreqData({frequency_value: tempFreq, type: event.target.value})
  }

  async function loadSpectrumList() {
    try {
      const { data } = await readSpectrumList(props.spotId);

      if (!(data.res.spectrumList.length === 0)) {
        setSpectrumButtonText(
          "Coleta " + formatUnixTimestamp(data.res.spectrumList[0].time)
        );
        setDataId(data.res.spectrumList[0].ng1vt_raw_data_id);
      } else {
        setSpectrumButtonText("Lista de Coletas");
        setDataId(null);
      }

      setSpectrumListData({
        ...data.res,
        spectrumList: data.res.spectrumList.map((data) => {
          data.time = formatUnixTimestamp(data.time);
          return data;
        }),
      });
    } catch (error) {
      console.error(error);
    }
  }

  const loadCharts = async () => {
    setChartStates(setVibTempDateRange);
    setVibTemp(false);
    const timeout = setTimeout(() => {
      setVibTemp(true);
      clearTimeout(timeout);
    }, 1);
  };

  function buttonTogglerSpectrumType(buttonName) {
    let buttons = document.getElementsByClassName("buttonSpectrumType");
    for (var i = 0; i < buttons.length; i++)
      buttons[i].classList.add("selectedButton");

    document
      .querySelector(".buttonSpectrumType." + buttonName)
      .classList.remove("selectedButton");
  }

  function buttonTogglerVibTempOptions(buttonName) {
    let buttons = document.getElementsByClassName("buttonVibTempOptions");
    for (var i = 0; i < buttons.length; i++)
      buttons[i].classList.add("selectedButton");

    buttonName &&
      document
        .querySelector(".buttonVibTempOptions." + buttonName)
        .classList.remove("selectedButton");
  }

  const handleClick = (who) => {
    if (dateButton === "_24hVibTempOptions") {
      setTimeValue("7 Dias");
      setVibTempDateRange({
        startDate: new Date(getSevenDaysAgoTimestamp() * 1000),
        endDate: new Date(),
      });
      setDateType("day");
      buttonTogglerVibTempOptions("_7dVibTempOptions");
      setDataButton("_7dVibTempOptions");
    }
    setSpotPage(who);
  };

  useEffect(() => {
    if(window.innerWidth < 992)
      setMobileSelector(true);
    else
      setMobileSelector(false);
    if (alarmMode && window.innerWidth < 992)
      setMobileMode(true);
    else
      setMobileMode(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alarmMode, window.innerWidth])

  useEffect(() => {
    setSensorVersion(null);
    loadData();
    setChartStates(setVibTempDateRange);
    setSpectrumListData(undefined);
    loadSpectrumList();
    setLoading(true);
    whichPage === "cascate" && setSpotPage("vibandtemp");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.spotId]);

  // Verifica se o periodo de treinamento fugiu do intervalo de tempo definido na página
  // Se sim, define a data da página como o periodo de treinamento e plota o grafico novamente
  useEffect(() => {
    if (whichPage === "automatic") {
      if (
        trainingPeriod &&
        trainingPeriod.startDate !== "" &&
        trainingPeriod.endDate !== ""
      ) {
        if (trainingPeriod?.reload) {
          const startDate = new Date(trainingPeriod.startDate);
          const endDate = new Date(trainingPeriod.endDate);

          const diff = Math.abs(endDate - startDate);
          const hoursDiff = diff / (1000 * 60 * 60);
          const daysDiff = hoursDiff / 24;
          setTimeValue("Personalizado");
          setDateType(daysDiff >= 1 ? "day" : "hour");
          buttonTogglerVibTempOptions();
          setDataButton("");
          setTimeSelector(false);
          setVibTempDateRange({
            startDate: startDate,
            endDate: endDate,
            keepTrainingPeriod: true,
          });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trainingPeriod]);

  useEffect(() => {
    loading || (whichPage === "automatic" && loadingAutomaticInfo) ? props.setLoading(true) : props.setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, loadingAutomaticInfo, whichPage]);

  useEffect(() => {
    saveAnnotation && setModalAnnotation(!modalAnnotation);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [annotation]);

  useEffect(() => {
    loadCharts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.spotId, vibTempDateRange]);

  useEffect(() => {
    annotationSelected !== undefined && setEditModal(true);
  }, [annotationSelected]);

  useEffect(() => {
    if(whichPage !== "automatic")
      setReturnPage("");
    !alarmMode && toggleSidemenu("summary");
    setSpectrumType("velocity");
    if(whichPage === "cascate")
      toggleSidemenu(undefined);
    if (whichPage === "diagnostic") {
      toggleSidemenu("diagnostic")
      props.setConfigAlarm(false); setAlarmMode(false); setCancel(true)
    }
    if(whichPage === "automatic") {
      toggleSidemenu("train")
      props.setConfigAlarm(false); setAlarmMode(false); setCancel(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [whichPage]);

  useEffect(() => {
    return () => {
      toggleSidemenu(undefined);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setPageDate(vibTempDateRange)
    if (!vibTempDateRange?.keepTrainingPeriod) {
      setTrainingPeriod(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setPageDate, vibTempDateRange])

  useEffect(() => {
    if (sidemenuContext === "train") {
      toggleSidemenu(undefined);
      setSpotPage("vibandtemp");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNode])

  return (
    <div>
      <div
        id="tabscontainer"
        style={{
          display: "flex",
          justifyContent: "space-between",
          zIndex: window.innerWidth < 700 ? 6 : 4,
          backgroundColor: "white",
          position: "sticky"
        }}
      >
        {!alarmMode && <div style={{ display: "flex", flexWrap: "nowrap", overflow: "auto" }}>
          <button
            className={`tablink VibracaoeTemperatura ${
              (whichPage === "vibandtemp" || whichPage === "spectral") && "selectedtablink"
            }`}
            onClick={() => handleClick("vibandtemp")}
          >
            Tendência
          </button>

          <button
            className={`tablink Espectro ${
              whichPage === "spectre" && "selectedtablink"
            }`}
            onClick={() => handleClick("spectre")}
          >
            Espectro
          </button>

          <button
            className={`tablink Historico ${
              whichPage === "history" && "selectedtablink"
            }`}
            onClick={() => handleClick("history")}
          >
            Histórico
          </button>

        </div>
        }

        {(whichPage === "vibandtemp" || whichPage === "automatic") && (
          <div
          id="vibtempoptions"
          className="lg-mt-1"
          style={(whichPage === "automatic" && isAutoEnabled) ? { display: "none" } : mobileMode ? { display: "flex", height: "25px", marginBottom:"5px" } : (alarmMode ? { display: "flex", height: "25px", margin: "1% 1% 0 auto"} : { display: "flex", height: "25px" })}
          >
            {mobileMode && (
            <div style={{display: "flex", flexDirection: "row", marginLeft: "2%"}}>
              <Button onClick={() => {props.setConfigAlarm(false); setAlarmMode(false); setCancel(true)}} cancel className="rounded-button-outlined">
                Cancelar
              </Button>
              <div style={{ width: 10 }}></div>
              <Button onClick={() => {
                if(alarmYellow >= alarmRed){
                  setWarningAlarm(true);
                }
                else
                  {props.setConfigAlarm(false); 
                  setAlarmMode(false);
                  setUpdate(true);}}} className="rounded-button">
                Salvar
              </Button>
            </div>
          )}
            <div style={mobileSelector ? {marginRight: 3, display: "flex", flexDirection: "column"} : { display: "flex", alignItems: "center" }}>
              {mobileSelector && <><Button
                className="buttonVibTempOptions _7dVibTempOptions selectedButtonMobile"
                buttonType="rounded-button-with-icon"
                onClick={() => {
                  setTimeSelector(!timeSelector);
                }}
                style={{margin: "auto 0px", alignSelf: "center"}}
                small
              >
                {timeValue}
                <KeyboardArrowDown style={{fontSize:"1rem"}}/>
              </Button>
              <div className="timeSelector" style={timeSelector ? {} : {display: "none"}}>
                <label
                  className="selectedButton" 
                  style={{margin: "0", padding: "3%", borderRadius: "5px 5px 0 0", cursor: "pointer", width: "100%", textAlign: "center"}}
                  onClick={() => {
                    setTimeValue("24 Horas");
                    setVibTempDateRange({
                      startDate: new Date(getOneDayAgoTimestamp() * 1000),
                      endDate: new Date(),
                    });
                    setDateType("hour");
                    buttonTogglerVibTempOptions("_24hVibTempOptions");
                    setDataButton("_24hVibTempOptions");
                    setTimeSelector(false);
                  }}>24 Horas
                </label>
                <hr style={{margin: "0"}}/>
                <label 
                  className="selectedButton" 
                  style={{margin: "0", padding: "3%", cursor: "pointer", width: "100%", textAlign: "center"}}
                  onClick={() => {
                    setTimeValue("7 Dias");
                    setVibTempDateRange({
                      startDate: new Date(getSevenDaysAgoTimestamp() * 1000),
                      endDate: new Date(),
                    });
                    setDateType("day");
                    buttonTogglerVibTempOptions("_7dVibTempOptions");
                    setDataButton("_7dVibTempOptions");
                  }}>7 Dias</label>
                <hr style={{margin: "0"}}/>
                <label 
                  className="selectedButton mr-4px"
                  style={{margin: "0", padding: "3%", borderRadius: "0 0 5px 5px", cursor: "pointer", width: "100%", textAlign: "center"}}
                  onClick={() => {
                    setTimeValue("Personalizado");
                  }}
                >
                  <DateRangePicker
                    startDate={vibTempDateRange.startDate}
                    endDate={vibTempDateRange.endDate}
                    maxDate={getFormattedDate(maxDate)}
                    onApply={handleVibTempApply}
                    locale={locale}
                    alignSelf="baseline"
                    className="selectedButton"
                  >
                    Personalizado
                  </DateRangePicker>
                </label>
                
                </div>
                
                </>
              }
              <Button
                className="buttonVibTempOptions _24hVibTempOptions selectedButton"
                buttonType="tinny-button"
                onClick={() => {
                  setVibTempDateRange({
                    startDate: new Date(getOneDayAgoTimestamp() * 1000),
                    endDate: new Date(),
                  });
                  setDateType("hour");
                  buttonTogglerVibTempOptions("_24hVibTempOptions");
                  setDataButton("_24hVibTempOptions");
                }}
                style={mobileSelector ? {display: "none"} : { margin: "auto 0px", border: "1px solid #156284"}}
                small
              >
                24 horas
              </Button>

              <Button
                className="buttonVibTempOptions _7dVibTempOptions ml-1 mr-1"
                buttonType="tinny-button"
                onClick={() => {
                  setVibTempDateRange({
                    startDate: new Date(getSevenDaysAgoTimestamp() * 1000),
                    endDate: new Date(),
                  });
                  setDateType("day");
                  buttonTogglerVibTempOptions("_7dVibTempOptions");
                  setDataButton("_7dVibTempOptions");
                }}
                style={mobileSelector ? {display: "none"} : { margin: "auto 0px", border: "1px solid #156284"}}
                small
              >
                7 dias
              </Button>
              <div className="divider-buttons"></div>
              <DateRangePicker
                startDate={vibTempDateRange.startDate}
                endDate={vibTempDateRange.endDate}
                maxDate={getFormattedDate(maxDate)}
                onApply={handleVibTempApply}
                locale={locale}
                style={mobileSelector ? {display: "none"} : { }}
              >
                <Button buttonType="tinny-button" style={mobileSelector ? {display: "none"} : { }} small>Personalizado</Button>
              </DateRangePicker>
            </div>
            {!mobileMode && props.configAlarm && (
            <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", gap: "5px"}}>
              <div className="alarmBorder" style={{margin: "0px 5%"}}/>
              <Button onClick={() => {props.setConfigAlarm(false); setAlarmMode(false); setCancel(true)}} cancel className="rounded-button-outlined">
                Cancelar
              </Button>
              <div style={{ width: 10 }}></div>
              <Button className="rounded-button" onClick={() => {
                if(alarmYellow >= alarmRed){
                  setWarningAlarm(true);
                }
                else
                  {props.setConfigAlarm(false); 
                  setAlarmMode(false);
                  setUpdate(true);}}}>
                Salvar
              </Button>
            </div>
          )}
            {!!annotationSelected && (
              <PopupModal
                showModal={editModal}
                toggleModal={() => {
                  setEditModal(!editModal);
                  setAnnotationSelected(undefined);
                }}
                title={"Anotação"}
                onDismissTitle={"Excluir"}
                onConfirmTitle={confirmTitle}
                onConfirm={() => {
                  if (confirmTitle === "Editar") setConfirmTitle("Salvar");
                  else {
                    updateRmsTempAnnotation(
                      props.spotId,
                      "update",
                      {
                        title: !!title
                          ? title
                          : annotationSelected.label.content,
                        timestamp: annotationSelected.value,
                        description: !!description ? description : "",
                      },
                      annotationSelected.id
                    ).then(() => {
                      setEditModal(!editModal);
                      setAnnotationSelected(undefined);
                      setConfirmTitle("Editar");
                      setDescription(null);
                      loadCharts();
                      FeedbackToast.success();
                    }).catch(error => {
                      console.error(error);
                      FeedbackToast.error();
                    });
                  }
                }}
                dismissFunc={() => {
                  updateRmsTempAnnotation(
                    props.spotId,
                    "delete",
                    {},
                    annotationSelected.id
                  ).then(() => {
                    setEditModal(!editModal);
                    setAnnotationSelected(undefined);
                    loadCharts();
                    FeedbackToast.success();
                  }).catch(error => {
                    console.error(error);
                    FeedbackToast.error();
                  });
                }}
              >
                <TextField
                  id="editTitle"
                  label="Título:"
                  placeholder="Manutenção..."
                  fullWidth
                  defaultValue={annotationSelected.label.content}
                  margin="dense"
                  onChange={({ nativeEvent }) => {
                    setTitle(nativeEvent.target.value);
                  }}
                  InputProps={{
                    readOnly: confirmTitle === "Editar",
                  }}
                  variant={confirmTitle === "Editar" ? "standard" : "outlined"}
                />

                <TextField
                  id="editDesc"
                  label="Descrição:"
                  placeholder="Manutenção..."
                  fullWidth
                  multiline
                  defaultValue={description}
                  margin="dense"
                  onChange={({ nativeEvent }) => {
                    setDescription(nativeEvent.target.value);
                  }}
                  InputProps={{
                    readOnly: confirmTitle === "Editar",
                  }}
                  variant={confirmTitle === "Editar" ? "standard" : "outlined"}
                />
              </PopupModal>
            )}

            <PopupModal
              showModal={modalAnnotation}
              toggleModal={() => {
                setModalAnnotation(!modalAnnotation);
                setSaveAnnotation(!saveAnnotation);
                annotationButton.current.classList.remove(
                  "vibTempFuncBtnSelected"
                );
              }}
              title={`Salvar Anotação em ${formatUnixTimestamp(
                annotation / 1000
              )}?`}
              onDismissTitle={"Cancelar"}
              onConfirmTitle={"Salvar"}
              onConfirm={() => {
                if (title.length < 30 && description.length < 256) {
                  updateRmsTempAnnotation(props.spotId, "new", {
                    title: title,
                    timestamp: annotation,
                    description: description,
                  }).then((res) => {
                    setTitle("");
                    setDescription("");
                    loadCharts();
                    annotationButton.current.classList.remove(
                      "vibTempFuncBtnSelected"
                    );
                    FeedbackToast.success();
                  }).catch(error => {
                    console.error(error);
                    FeedbackToast.error();
                  });
                  setModalAnnotation(!modalAnnotation);
                  setSaveAnnotation(!saveAnnotation);
                } else {
                  alert("Tamanho do título acima de 30 caracteres!");
                }
              }}
            >
              <TextField
                id="annotationTitle"
                label="Título:"
                placeholder="Manutenção..."
                fullWidth
                margin="dense"
                onChange={({ nativeEvent }) => {
                  setTitle(nativeEvent.target.value);
                }}
                variant="outlined"
              />

              <TextField
                id="annotationDesc"
                label="Descrição:"
                placeholder="Máquina foi desligada para manutenção..."
                fullWidth
                multiline
                rows={3}
                margin="dense"
                onChange={({ nativeEvent }) => {
                  setDescription(nativeEvent.target.value);
                }}
                variant="outlined"
              />
            </PopupModal>
          </div>
        )}

        {whichPage === "spectral" && (
          <div
          id="vibtempoptions"
          className="lg-mt-1"
          style={mobileMode ? { display: "flex", height: "25px", marginBottom:"5px" } : (alarmMode ? { display: "flex", height: "25px", margin: "1% 2% 0 auto"} : { display: "flex", height: "25px" })}
          >
            {mobileMode && (
            <div style={{display: "flex", flexDirection: "row", marginLeft: "2%"}}>
              <Button onClick={() => {props.setConfigAlarm(false); setAlarmMode(false); setCancel(true)}} cancel className="rounded-button-outlined">
                Cancelar
              </Button>
              <div style={{ width: 10 }}></div>
              <Button onClick={() => {
                if(alarmYellow >= alarmRed){
                  setWarningAlarm(true);
                }
                else if (!warningAlarm)
                  {props.setConfigAlarm(false); 
                  setWarningAlarm(false);
                  setAlarmMode(false);
                  setUpdate(true);}}} className="rounded-button">
                Salvar
              </Button>
            </div>
          )}
            <div style={mobileSelector ? {marginRight: 3, display: "flex", flexDirection: "column"} : { display: "flex", alignItems: "center" }}>
              {mobileSelector && <><Button
                className="buttonVibTempOptions _7dVibTempOptions selectedButtonMobile"
                buttonType="rounded-button-with-icon"
                onClick={() => {
                  setTimeSelector(!timeSelector);
                }}
                style={{margin: "auto 0px", alignSelf: "center"}}
                small
              >
                {timeValue}
                <KeyboardArrowDown style={{fontSize:"1rem"}}/>
              </Button>
              <div className="timeSelector" style={timeSelector ? {} : {display: "none"}}>
                <label 
                  className="selectedButton" 
                  style={{margin: "0", padding: "3%", cursor: "pointer", width: "100%", textAlign: "center"}}
                  onClick={() => {
                    setTimeValue("7 Dias");
                    setVibTempDateRange({
                      startDate: new Date(getSevenDaysAgoTimestamp() * 1000),
                      endDate: new Date(),
                    });
                    setDateType("day");
                    buttonTogglerVibTempOptions("_7dVibTempOptions");
                    setDataButton("_7dVibTempOptions");
                  }}>7 Dias</label>
                <hr style={{margin: "0"}}/>
                <label 
                  className="selectedButton mr-4px"
                  style={{margin: "0", padding: "3%", borderRadius: "0 0 5px 5px", cursor: "pointer", width: "100%", textAlign: "center"}}
                  onClick={() => {
                    setTimeValue("Personalizado");
                  }}
                >
                  <DateRangePicker
                    startDate={vibTempDateRange.startDate}
                    endDate={vibTempDateRange.endDate}
                    maxDate={getFormattedDate(maxDate)}
                    onApply={handleVibTempApply}
                    locale={locale}
                    alignSelf="baseline"
                    className="selectedButton"
                  >
                    Personalizado
                  </DateRangePicker>
                </label>
                
                </div>
                
                </>
              }
              <Button
                className="buttonVibTempOptions _7dVibTempOptions ml-1 mr-1"
                buttonType="tinny-button"
                onClick={() => {
                  setVibTempDateRange({
                    startDate: new Date(getSevenDaysAgoTimestamp() * 1000),
                    endDate: new Date(),
                  });
                  setDateType("day");
                  buttonTogglerVibTempOptions("_7dVibTempOptions");
                  setDataButton("_7dVibTempOptions");
                }}
                style={mobileSelector ? {display: "none"} : { margin: "auto 0px", border: "1px solid #156284"}}
                small
              >
                7 dias
              </Button>
              <div className="divider-buttons"></div>
              <DateRangePicker
                startDate={vibTempDateRange.startDate}
                endDate={vibTempDateRange.endDate}
                maxDate={getFormattedDate(maxDate)}
                onApply={handleVibTempApply}
                locale={locale}
                style={mobileSelector ? {display: "none"} : { }}
              >
                <Button style={mobileSelector ? {display: "none"} : { }} buttonType="tinny-button" small>Personalizado</Button>
              </DateRangePicker>
            </div>
            {!mobileMode && props.configAlarm && (
            <div style={{display: "flex", flexDirection: "row", gap: "5px"}}>
              <div className="alarmBorder" style={{margin: "0px 5%"}}/>
              <Button onClick={() => {props.setConfigAlarm(false); setAlarmMode(false); setCancel(true)}} cancel className="rounded-button-outlined">
                Cancelar
              </Button>
              <div style={{ width: 10 }}></div>
              <Button onClick={() => { 
                if(alarmYellow >= alarmRed){
                  setWarningAlarm(true);
                }
                else
                  {props.setConfigAlarm(false);
                  setWarningAlarm(false);
                  setAlarmMode(false);
                  setUpdate(true);}}} className="rounded-button">
                Salvar
              </Button>
            </div>
          )}
            {!!annotationSelected && (
              <PopupModal
                showModal={editModal}
                toggleModal={() => {
                  setEditModal(!editModal);
                  setAnnotationSelected(undefined);
                }}
                title={"Anotação"}
                onDismissTitle={"Excluir"}
                onConfirmTitle={confirmTitle}
                onConfirm={() => {
                  if (confirmTitle === "Editar") setConfirmTitle("Salvar");
                  else {
                    updateRmsTempAnnotation(
                      props.spotId,
                      "update",
                      {
                        title: !!title
                          ? title
                          : annotationSelected.label.content,
                        timestamp: annotationSelected.value,
                        description: !!description ? description : "",
                      },
                      annotationSelected.id
                    ).then(() => {
                      setEditModal(!editModal);
                      setAnnotationSelected(undefined);
                      setConfirmTitle("Editar");
                      setDescription(null);
                      loadCharts();
                      FeedbackToast.success();
                    }).catch(error => {
                      console.error(error);
                      FeedbackToast.error();
                    });
                  }
                }}
                dismissFunc={() => {
                  updateRmsTempAnnotation(
                    props.spotId,
                    "delete",
                    {},
                    annotationSelected.id
                  ).then(() => {
                    setEditModal(!editModal);
                    setAnnotationSelected(undefined);
                    loadCharts();
                    FeedbackToast.success();
                  }).catch(error => {
                    console.error(error);
                    FeedbackToast.error();
                  });
                }}
              >
                <TextField
                  id="editTitle"
                  label="Título:"
                  placeholder="Manutenção..."
                  fullWidth
                  defaultValue={annotationSelected.label.content}
                  margin="dense"
                  onChange={({ nativeEvent }) => {
                    setTitle(nativeEvent.target.value);
                  }}
                  InputProps={{
                    readOnly: confirmTitle === "Editar",
                  }}
                  variant={confirmTitle === "Editar" ? "standard" : "outlined"}
                />

                <TextField
                  id="editDesc"
                  label="Descrição:"
                  placeholder="Manutenção..."
                  fullWidth
                  multiline
                  defaultValue={description}
                  margin="dense"
                  onChange={({ nativeEvent }) => {
                    setDescription(nativeEvent.target.value);
                  }}
                  InputProps={{
                    readOnly: confirmTitle === "Editar",
                  }}
                  variant={confirmTitle === "Editar" ? "standard" : "outlined"}
                />
              </PopupModal>
            )}

            <PopupModal
              showModal={modalAnnotation}
              toggleModal={() => {
                setModalAnnotation(!modalAnnotation);
                setSaveAnnotation(!saveAnnotation);
                annotationButton.current.classList.remove(
                  "vibTempFuncBtnSelected"
                );
              }}
              title={`Salvar Anotação em ${formatUnixTimestamp(
                annotation / 1000
              )}?`}
              onDismissTitle={"Cancelar"}
              onConfirmTitle={"Salvar"}
              onConfirm={() => {
                if (title.length < 30 && description.length < 256) {
                  updateRmsTempAnnotation(props.spotId, "new", {
                    title: title,
                    timestamp: annotation,
                    description: description,
                  }).then((res) => {
                    setTitle("");
                    setDescription("");
                    loadCharts();
                    annotationButton.current.classList.remove(
                      "vibTempFuncBtnSelected"
                    );
                    FeedbackToast.success();
                  }).catch(error => {
                    console.error(error);
                    FeedbackToast.error();
                  });
                  setModalAnnotation(!modalAnnotation);
                  setSaveAnnotation(!saveAnnotation);
                } else {
                  alert("Tamanho do título acima de 30 caracteres!");
                }
              }}
            >
              <TextField
                id="annotationTitle"
                label="Título:"
                placeholder="Manutenção..."
                fullWidth
                margin="dense"
                onChange={({ nativeEvent }) => {
                  setTitle(nativeEvent.target.value);
                }}
                variant="outlined"
              />

              <TextField
                id="annotationDesc"
                label="Descrição:"
                placeholder="Máquina foi desligada para manutenção..."
                fullWidth
                multiline
                rows={3}
                margin="dense"
                onChange={({ nativeEvent }) => {
                  setDescription(nativeEvent.target.value);
                }}
                variant="outlined"
              />
            </PopupModal>
          </div>
        )}

        {(whichPage === "spectre" || whichPage === "cascate") && (
          <div id="spectrumoptions" style={{ display: "flex" }}>
            <div
              style={{
                display: "flex",
                height: "min-content",
                alignItems: "center",
                gap: 5,
              }}
            >
              <CascateModal
                setPage={setSpotPage}
                spotId={props.spotId}
                spectrumListData={spectrumListData}
                setCascateAPI={setCascateAPI}
              />

              {whichPage === "spectre" && (
                <>
                  <SpectrumButtons setSpectrumType={setSpectrumType} />

                  <Button
                    small
                    className="row-center"
                    buttonType="select-button"
                    style={{ border: "1px solid #156284" }}
                    onClick={() => setShowSpectrumList(!showSpectrumList)}
                  >
                    {spectrumButtonText}
                    <ExpandMore style={{ color: "white", fontSize: 16 }} fontSize="small" />
                  </Button>
                </>
              )}
            </div>

            <PopupModal
              showModal={showSpectrumList}
              toggleModal={() => {
                setShowSpectrumList(!showSpectrumList);
              }}
              style={{ minWidth: "70%" }}
              title="Análises Espectrais"
            >
              {!!spectrumListData ? (
                <Table
                  columns={columnsSpectrumList}
                  data={spectrumListData.spectrumList}
                  onRowClick={(rowData) => {
                    setShowSpectrumList(!showSpectrumList);
                    setSpectrumButtonText(`Coleta ${rowData.time}`);
                    setDataId(rowData.ng1vt_raw_data_id);
                  }}
                />
              ) : (
                <div>Não há dados</div>
              )}
            </PopupModal>
          </div>
        )}

        {whichPage === "history" && (
          <div id="historicoptions" style={{ display: "flex" }}>
            <DateRangePicker
              startDate={historicDateRange.startDate}
              endDate={historicDateRange.endDate}
              maxDate={getFormattedDate(maxDate)}
              onApply={handleHistoricApply}
              locale={locale}
            >
              <Button className="rounded-button" small>
                {getFormattedDate(historicDateRange.startDate) +
                  " - " +
                  getFormattedDate(historicDateRange.endDate)}
              </Button>
            </DateRangePicker>
          </div>
        )}
      </div>

      <div className={`cont-espc-config-buttons ${(whichPage === "spectre" || whichPage === "history") && "display-none"}`}>
        <div className="divider-screen">
          <button className={`divider-screen-button ${(whichPage === "vibandtemp" || returnPage === "vibandtemp") && "divider-screen-selected"}`}
              onClick={() => handleClick("vibandtemp")}>
              Global
          </button>
          
          <button className={`divider-screen-button ${(whichPage === "spectral" || returnPage === "spectral") && "divider-screen-selected"}`}
              onClick={() => handleClick("spectral")}>
              Espectral
          </button>

          <button className={`divider-screen-button ${(whichPage === "diagnostic" || returnPage === "diagnostic") && "divider-screen-selected"}`}
              onClick={() => handleClick("diagnostic")}>
              Diagnósticos
          </button>
        </div>

        {!alarmMode && whichPage !== "cascate" && whichPage !== "diagnostic" && <div className="config-buttons" style={{overflow: window.innerWidth < 700 && "auto"}}>
                {whichPage === "spectral" && !mobileSelector &&<div ref={rotationRef} style={{display: "flex", alignItems: "center"}}>
                  <Tooltip title={<p style={{ textAlign: "center", fontSize: "12px" }}>A mudança neste valor de rotação não altera as configurações do equipamento. Ela impacta <br/> somente nas frequências de rotação e de falhas exibidas nos gráficos abaixo.</p>} placement="top" arrow>
                    <h7 style={{marginRight: 8, fontSize: "0.9rem", fontFamily: "roboto", fontWeight: 500}}>
                      Rotação 
                    </h7>
                  </Tooltip>
                  <Input
                    name="rotation"
                    type="number"
                    step={1}
                    value={freqValue}
                    max={20000}
                    onChange={handleFreqValue}
                    selectStyle={{
                      textAlign: "center",
                      fontSize: "0.8rem",
                      fontFamily: "roboto",
                      paddingBlock: 2, 
                      borderRadius: 6,
                      paddingLeft: 3,
                      paddingRight: 4,
                      width: "100%",
                      color: "#000",
                      cursor: "pointer",
                      marginBottom: 0
                    }}
                  />
                  <Input
                  name="frequency"
                  options={["rpm", "Hz"]}
                  value={frequency}
                  onChange={handleFrequency}
                  selectStyle={{
                    fontSize: "0.8rem",
                    fontFamily: "roboto",
                    borderRadius: 6,
                    paddingLeft: 6,
                    paddingRight: 15,
                    width: "auto",
                    backgroundColor: "#F7F7F7",
                    color: "#000",
                    cursor: "pointer"
                  }}
                  />
                </div>}
                <button
                  className={`vibTempFuncBtn ${
                    sidemenuContext === "summary" ? "vibTempFuncBtnSelected" : ""
                  }`}
                  onClick={() => { 
                    if (sidemenuContext !== "summary") {
                      whichPage === "automatic" && setSpotPage(returnPage);
                      toggleSidemenu("summary");
                      setAlarmMode(false);
                      props.setConfigAlarm(false);
                    } else {
                      toggleSidemenu(undefined);
                    }
                  }}
                  small
                >
                  <Tooltip title={"Resumo"}>
                    <span>
                      <Assignment
                        style={{
                          fontSize: "1.30em",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      />
                    </span>
                  </Tooltip>
                </button>
                
                <ProtectedFeature requiredPermissions={["CONFIG_ALARMS"]}>
                  <button
                    className={`vibTempFuncBtn ${
                      alarmMode ? "vibTempFuncBtnSelected" : ""
                    }`}
                    onClick={() => {
                      if (sidemenuContext === "summary") {
                        toggleSidemenu(undefined);
                        setAlarmMode(true);
                        props.setConfigAlarm(true);
                      } else if (sidemenuContext === "train") {
                        setSpotPage(returnPage);
                        setAlarmMode(true);
                        props.setConfigAlarm(true);
                        toggleSidemenu(undefined);
                      } else {
                        setAlarmMode(!alarmMode);
                        props.setConfigAlarm(!props.configAlarm);
                      }
                    }}
                    small
                  >
                    <Tooltip title={"Alarmes"}>
                      <span>
                        <WarningRounded
                          style={{
                            fontSize: "1.30em",
                            display: "flex",
                            justifyContent: "center",
                          }}
                        />
                      </span>
                    </Tooltip>
                  </button>
                </ProtectedFeature>
                
                <ProtectedFeature requiredPermissions={["CONFIG_SPOTS"]}>
                  <button
                    className={`vibTempFuncBtn ${
                      sidemenuContext === "train" ? "vibTempFuncBtnSelected" : ""
                    }`}
                    onClick={() => {
                      if (sidemenuContext !== "train") {
                        toggleSidemenu("train");
                        setReturnPage(whichPage);
                        setAlarmMode(false);
                        props.setConfigAlarm(false);
                        handleClick("automatic");
                      } else {
                        toggleSidemenu(undefined);
                        setSpotPage(returnPage);
                      }
                    }}
                    small
                  >
                    {!!waitingFeedbackAnomalies && waitingFeedbackAnomalies > 0 && (
                      <span className="waitingFeedbackSpanIndicator">
                        {waitingFeedbackAnomalies}
                      </span>
                    )}
                    <Tooltip title={"Diagnóstico Automático"}>
                      <span>
                        <AutoMode
                          style={{
                            fontSize: "1.1em",
                            display: "flex",
                            justifyContent: "center",
                            margin: "auto",
                          }}
                        />
                      </span>
                    </Tooltip>
                  </button>
                </ProtectedFeature>


                <FilterAnnotButton
                  setCheckedFilterAnnot={setCheckedFilterAnnot}
                  checkedFilterAnnot={checkedFilterAnnot}
                />

                <ProtectedFeature requiredPermissions={["MAKE_ANNOTATIONS"]}>
                  <button
                    ref={annotationButton}
                    className="vibTempFuncBtn"
                    onClick={() => {
                      whichPage === "automatic" && setSpotPage(returnPage);
                      setSaveAnnotation(!saveAnnotation);
                      const isSelected =
                        annotationButton.current.className.includes(
                          "vibTempFuncBtnSelected"
                        );
                      isSelected
                        ? annotationButton.current.classList.remove(
                            "vibTempFuncBtnSelected"
                          )
                        : annotationButton.current.classList.add(
                            "vibTempFuncBtnSelected"
                          );
                    }}
                  >
                    <Tooltip title={"Adicionar anotação"}>
                      <span>
                        <NoteAdd
                          style={{
                            fontSize: "1.35em",
                            display: "flex",
                            justifyContent: "center",
                          }}
                        />
                      </span>
                    </Tooltip>
                  </button>
                </ProtectedFeature>
              </div>}
      </div>

      {whichPage === "vibandtemp" && !!vibTemp && (
        <div id="VibracaoeTemperatura" className="tabcontent">
          <VibAndTemp
            spotId={props.spotId}
            dateRange={vibTempDateRange}
            setLoading={setLoading}
            whichButton={buttonTogglerVibTempOptions}
            dateType={dateType}
            dateButton={dateButton}
            setAnnotation={setAnnotation}
            filterAnnotations={checkedFilterAnnot}
            saveAnnotation={saveAnnotation}
            setAnnotationSelected={setAnnotationSelected}
            setDescription={setDescription}
            alarmMode={alarmMode}
            update={update}
            setUpdate={setUpdate}
            cancel={cancel}
            setCancel={setCancel}
          />
        </div>
      )}

      {whichPage === "spectral" && !!vibTemp &&  (
        <div id="Espectral" className="tabcontent">
          <SpectralTendency
            spotId={props.spotId}
            dateRange={vibTempDateRange}
            setLoading={setLoading}
            whichButton={buttonTogglerVibTempOptions}
            dateType={dateType}
            dataId={dataId}
            spectrumType={"velocity"}
            dateButton={dateButton}
            setAnnotation={setAnnotation}
            filterAnnotations={checkedFilterAnnot}
            saveAnnotation={saveAnnotation}
            setAnnotationSelected={setAnnotationSelected}
            setDescription={setDescription}
            alarmMode={alarmMode}
            update={update}
            setUpdate={setUpdate}
            cancel={cancel}
            setCancel={setCancel}
            rotation={freqData}
            showSettings={props.showSettings}
            setCascateAPI={setCascateAPI}
            rotationRef={rotationRef}
            spectrumListData={spectrumListData}
          />
        </div>
      )}

      {whichPage === "diagnostic" && !!vibTemp && (
        <div id="Diagnostico" className="tabcontent" style={{height: window.innerWidth < 700 && "auto"}}>
          {window.innerWidth < 700 && <DiagnosticMenu />}
          {window.innerWidth < 700 && ( diagnosticType !== "pending" ? <MobileHistoric/> : <MobileDescription/>)}
          <DiagnosticCharts
            setLoading={setLoading}
            globalProps={{
              spotId: props.spotId,
              update,
              dateType,
              filterAnnotations: checkedFilterAnnot,
              saveAnnotation,
              setAnnotationSelected,
              setDescription,
              setAnnotation,
              alarmMode,
              setUpdate,
              cancel,
              setCancel,
              dateRange: vibTempDateRange,
            }}
            spectralProps={{
              spotId: props.spotId,
              update,
              filterAnnotations: checkedFilterAnnot,
              saveAnnotation,
              setAnnotationSelected,
              setDescription,
              setAnnotation,
              alarmMode,
              setUpdate,
              cancel,
              setCancel,
              dataId,
              spectrumType,
              setCascateAPI,
              rotation: freqData,
              rotationRef,
              spectrumListData
            }}
          />
        </div>
      )}

      {whichPage === "automatic" && !!vibTemp && !loadingAutomaticInfo && (
        <div id="Automatico" className="tabcontent">
          <Automatic
            spotId={props.spotId}
            dateRange={vibTempDateRange}
            setLoading={setLoading}
            whichButton={buttonTogglerVibTempOptions}
            dateType={dateType}
            dateButton={dateButton}
            setAnnotation={setAnnotation}
            filterAnnotations={checkedFilterAnnot}
            saveAnnotation={saveAnnotation}
            setAnnotationSelected={setAnnotationSelected}
            setDescription={setDescription}
            alarmMode={alarmMode}
            update={update}
            setUpdate={setUpdate}
            cancel={cancel}
            setCancel={setCancel}
          />
        </div>
      )}

      {whichPage === "spectre" && (
        <div id="Espectro" className="tabcontent">
          <Spectrum
            spotId={props.spotId}
            dataId={dataId}
            spectrumType={spectrumType}
            setLoading={setLoading}
            loading={loading}
            whichButton={buttonTogglerSpectrumType}
          />
        </div>
      )}

      {whichPage === "cascate" && (
        <div id="Cascata" className="tabcontent">
          <Cascate
            spotId={props.spotId}
            cascateAPI={cascateAPI}
            setCascateAPI={setCascateAPI}
            setLoading={setLoading}
            loading={loading}
          />
        </div>
      )}

      {whichPage === "history" && (
        <div id="Historico" className="tabcontent">
          <div className="row" style={{ height: "100%" }}>
            <Card className="col-12" height="100%" minHeight="460px">
              <SpotHistoricTable
                spotId={props.spotId}
                dateRange={historicDateRange}
                isLoadingController={setLoading}
              />
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChartsView;
