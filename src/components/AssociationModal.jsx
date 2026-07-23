import React, { useState, useEffect, useContext, useRef } from "react";
import { Modal, ModalHeader } from "reactstrap";
import { readSensorIds, updateAssociatedSensor, readSpotInfo } from "../apis";
import { WhichRenderContext } from "../contexts";
import { mountFullPath, strToNumFirmwareVersion } from "../utilities";
import { ComponentLoader } from "../components"
import FeedbackToast from "./FeedbackToast/FeedbackToast";

function isAssociationAllowed(gatewayVersion, sensorVersion){
  return gatewayVersion === 0 || !(
    (
      gatewayVersion < strToNumFirmwareVersion("v2.0.0")
      && 
      sensorVersion >= strToNumFirmwareVersion("v3.0.0")
    ) || (
      gatewayVersion >= strToNumFirmwareVersion("v2.0.0")
      &&
      sensorVersion < strToNumFirmwareVersion("v3.0.0")
    ) || (
      gatewayVersion < strToNumFirmwareVersion("v2.0.7")
      && 
      sensorVersion >= strToNumFirmwareVersion("v3.1.0")
    ) || (
      gatewayVersion === strToNumFirmwareVersion("v2.0.7")
      && 
      sensorVersion < strToNumFirmwareVersion("v3.1.0")
    ) || (
      gatewayVersion === strToNumFirmwareVersion("v2.0.8")
      && 
      sensorVersion >= strToNumFirmwareVersion("v3.1.0")
    ) || (
      gatewayVersion < strToNumFirmwareVersion("v2.0.7")
      && 
      sensorVersion >= strToNumFirmwareVersion("v3.1.0")
    ) || (
      gatewayVersion < strToNumFirmwareVersion("v2.0.10")
      && 
      sensorVersion >= strToNumFirmwareVersion("v3.1.6")
    )
  )
}

function AssociationModal({
  showModal,
  treeUpdate,
  style,
  isOnTree,
  dismissFunc,
  className,
  sensorId,
  newSpotId,
  setSensorUpdate
}) {
  const [sensorArray, setSensorArray] = useState([]);
  const [firmwareArray, setFirmwareArray] = useState([]);
  const [usedArray, setUsedArray] = useState([])
  const [sensor, setSensor] = useState(sensorId);
  const [selected, setSelected] = useState(false);
  const [inUse, setInUse] = useState(false);
  const [confirmChange, setConfirmChange] = useState(false);
  const [spotPath, setSpotPath] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { flatTree, setIsPageLoading, treeData } = useContext(WhichRenderContext);
  const [versionError, setVersionError] = useState(false)
  const [gatewayVersion, setGatewayVersion] = useState("")
  const cRef = useRef();


  const filterArray = async () => {
    let tempArray = [];
    flatTree.forEach(n => {
      if (n.sensor_id !== null) {
        tempArray.push(n.sensor_id);
      }
    })
    setUsedArray(tempArray);
  }

  const confirmFunc = () => {
    setConfirmChange(true);
    flatTree.forEach(n => {
      if (n.sensor_id === sensor) {
        setSpotPath(mountFullPath(treeData, n.tree_id, false));
      }
    })
  }

  const setOption = (sensorOption) => {
    setVersionError(false);
    const gatewayVersionInt = strToNumFirmwareVersion(gatewayVersion);
    const sensorVersionInt = strToNumFirmwareVersion(firmwareArray[sensorArray?.indexOf(sensorOption)]);

    if (sensorOption === "Nenhum") {
      setSensor(null);
    }
    else if (isAssociationAllowed(gatewayVersionInt, sensorVersionInt)){
      setSensor(sensorOption);
      usedArray.includes(sensorOption) ? setInUse(true) : setInUse(false);
    }
    else {
      setVersionError(true)
      return
    }
    if (isOnTree === true) setSensorUpdate(sensorOption);
  }

  const updateSensor = async () => {
    if (isOnTree === true) {
      treeUpdate();
    } else {
      try {
        setIsPageLoading(true);
        await updateAssociatedSensor(newSpotId, sensor);
        window.location.reload();
        FeedbackToast.success();
      } catch (error) {
        console.log(error);
        setIsPageLoading(false);
        FeedbackToast.error();
      }
    }
  }

  const loadSensor = async () => {
    try {
      const res = await readSensorIds();
      setSensorArray(res.data.sensor_list.sensor_ids)
      setFirmwareArray(res.data.sensor_list.sensor_firmwares)
    }
    catch (error) {
      //console.log(error)
    }
  }

  const loadSpot = async () => {
    const spotInfo = await readSpotInfo(newSpotId);
    setGatewayVersion(spotInfo.data.gateway_version)
  }

  useEffect(() => {
    setIsLoading(true);
    loadSensor();
    filterArray();
    setIsLoading(false);
    loadSpot();
    const handleClick = (event) => {
      if (cRef.current && !cRef.current.contains(event.target)) {
        setSelected(false)
      }
    };

    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [])

  const saveHandler = () => {
    if (!confirmChange && inUse) confirmFunc();
    else {
      updateSensor()
      dismissFunc()
    }
  }

  const cancelHandler = () => {
    confirmChange ? setConfirmChange(false) : dismissFunc();
  }

  const Buttons = () => {
    return (
      <div className="buttonsDiv">
        <button className="rounded-button-outlined" onClick={() => { cancelHandler() }} >
          Cancelar
        </button>
        <button className="rounded-button" onClick={() => { saveHandler(); }} disabled={versionError}>
          Salvar
        </button>
      </div>
    )
  }

  return (
    <Modal isOpen={showModal} style={style} className={className} centered>
      <div className="divSpot" onMouseEnter={() => filterArray()}>
        {isLoading && <ComponentLoader />}
        <ModalHeader toggle={dismissFunc} style={{ color: "#777777" }}>Associação de Sensor</ModalHeader>
        {confirmChange ? (
          <>
            <h4 className="modalText" style={{ color: "#777777" }}>
              Se você associar o sensor <b>{sensor}</b> a este ponto, o ponto{" "}
              <b>{spotPath}</b> ficará sem nenhum sensor associado.
            </h4>
            <br />
            <h4 className="modalText" style={{ color: "#777777", marginTop: "-2.5%" }}>
              Deseja prosseguir?
            </h4>
            <Buttons />
          </>
        ) : (
          <>
            <h4 className="modalText" style={{ color: "#777777" }}>
              Selecione um sensor cujos dados coletados serão exibidos neste ponto
            </h4>
            <select
              className="spotInput"
              autoComplete="off"
              ref={cRef}
              size={
                selected
                  ? sensorArray.length > 10
                    ? "10"
                    : sensorArray.length
                  : "0"
              }
              onMouseDown={() => setSelected(true)}
              onChange={(e) => {
                setOption(e.target.value, e.target.used);
                setSelected(false);
                filterArray();
              }}
              placeholder={sensorId}
              value={sensor}
            >
              <option
                className="select-option-sensor-id"
                value={null}
                style={selected ? {} : { display: "none" }}
                onClick={() => {
                  setOption("Nenhum");
                  setSelected(false);
                }}
              >
                Nenhum
              </option>
              {sensorId && (
                <option
                  className="select-option-sensor-id"
                  style={selected ? {} : { display: "none" }}
                  value={sensorId}
                >
                  {sensorId} - Sensor Atual
                </option>
              )}
              {sensorArray.map((n) => {
                return n === sensorId ? (
                  <></>
                ) :
                  <option
                    className="select-option-sensor-id"
                    style={selected ? {} : { display: "none" }}
                    value={n}
                  >
                    {n} {usedArray.includes(n) ? " - Esse Sensor já está em uso!" : ""}
                  </option>
              }
              )}
            </select>
            {inUse && (
              <h4 className="modalText" style={{ color: "#777777", marginTop: "17%" }}>
                Esse sensor já está associado a outro ponto.
              </h4>
            )}
            {versionError && (
              <h4 className="modalText" style={{ color: "#e61234", marginTop: "17%" }}>
                Desculpe, mas a versão deste sensor não é compatível com o gateway atual.
              </h4>
            )}
            <Buttons />
          </>
        )}
      </div>
    </Modal>
  );
}

export default AssociationModal;
