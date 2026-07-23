import React, { useState, useEffect, useContext } from "react";
import { Waves, InfoOutlined } from "@mui/icons-material";
import { Button, Input, PopupModal } from "../../../components";
import { CascateTable } from "./CascateTable";
import { withStyles, Tooltip } from "@material-ui/core";
import Slider from "@material-ui/core/Slider";
import { colors } from "../../../utilities";

function ValueLabelComponent({ children, open, value }) {
  return (
    <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
}

const FILTEROPTIONS = [
  { label: "Nenhum", min: null, max: null },
  { label: "500 Hz a 6000 Hz", min: 500, max: 6000 },
  { label: "50 Hz a 1000 Hz", min: 50, max: 1000 },
];

const ENVELOPEFILTEROPTIONS = [
  // { label: "Nenhum", min: null, max: null },
  { label: "500 Hz a 6000 Hz", min: 500, max: 6000 },
  { label: "50 Hz a 1000 Hz", min: 50, max: 1000 },
];

const TYPEOPTIONS = [
  { type: "velocity", label: "Velocidade" },
  { type: "acceleration", label: "Aceleração" },
  { type: "envelope", label: "Envelope" },
];

const AXISOPTIONS = [
  { type: "vertical", label: "Vertical" },
  { type: "horizontal", label: "Horizontal" },
  { type: "axial", label: "Axial" },
];

const MyCustomSlider = withStyles({
  root: {
    color: colors.greenLogo,
    height: 8,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: colors.greenLogo,
    marginTop: -8,
    marginLeft: -12,
    "&:focus, &:hover, &$active": {
      boxShadow: "inherit",
    },
  },
  active: {},
  valueLabel: {
    left: "calc(-50% + 8px)",
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
    width: "97%",
  },
})(Slider);

export function CascateModal({ setPage, spotId, spectrumListData, setCascateAPI, specChart, metric, specAxis, time }) {
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState([]);

  const [filter, setFilter] = useState(0);
  const [type, setType] = useState(0);
  const [axis, setAxis] = useState(0);
  const [frequencyRange, setFrequencyRange] = useState([0, 1000]);

  const isEnvelope = () => TYPEOPTIONS[type].type === "envelope";

  const handleChangeFilter = ({ target: { value } }) => {
    const index = isEnvelope()
      ? ENVELOPEFILTEROPTIONS.findIndex((val) => val.label === value)
      : FILTEROPTIONS.findIndex((val) => val.label === value);

    setFilter(index);
  };

  const handleChangeType = ({ target: { value } }) => {
    const index = TYPEOPTIONS.findIndex((val) => val.label === value);
    setType(index);
  };

  const handleChangeAxis = ({ target: { value } }) => {
    const index = AXISOPTIONS.findIndex((val) => val.label === value);
    setAxis(index);
  };

  const handleChangeSlider = (e, newValue) => setFrequencyRange(newValue);

  const toApi = () => {
    if (isEnvelope()) {
      return { min: ENVELOPEFILTEROPTIONS[filter].min, max: ENVELOPEFILTEROPTIONS[filter].max };
    } else if (!!FILTEROPTIONS[filter].min && !!FILTEROPTIONS[filter].max) {
      return { min: FILTEROPTIONS[filter].min, max: FILTEROPTIONS[filter].max };
    } else {
      return null;
    }
  };

  useEffect(() => {
    setFilter(0);
  }, [type]);

  useEffect(() => {
    if(showModal===true && metric && specAxis){
      const type = TYPEOPTIONS.findIndex((val) => val.label === metric.label);
      setType(type);
      const axis = AXISOPTIONS.findIndex((val) => val.label === specAxis.label);
      setAxis(axis);
    }
  },[showModal])

  return (
    <>
      <Button
        className={specChart ? "selected-chart-button chart-button" : "row-center selectedButton rounded-button-with-icon"}
        onClick={() => setShowModal((prev) => !prev)}
        style={!specChart && { padding: "3px 13px" }}
      >
        <Waves style={{fontSize: "1.15rem"}}/>
        {!specChart && "Cascata"}
      </Button>

      <PopupModal
        showModal={showModal}
        toggleModal={() => setShowModal((prev) => !prev)}
        title={"Configurações do Gráfico de Cascata"}
        style={{ minWidth: "70%" }}
        dismissFunc={() => setShowModal(() => false)}
        disabledConfirm={!selected.length}
        onConfirm={() => {
          setCascateAPI({
            spot_id: spotId,
            raw_data_ids: selected,
            axis: AXISOPTIONS[axis].type,
            type: TYPEOPTIONS[type].type,
            filter: toApi(),
            frequency: { min: frequencyRange[0], max: frequencyRange[1] },
          });
          setPage("cascate");
          setShowModal(false);
        }}
        onConfirmTitle={"Abrir gráfico"}
      >
        <div className="row">
          <div className="col-6">
            <Input
              name="metrics"
              onChange={handleChangeType}
              value={TYPEOPTIONS[type].label}
              label="Metrica"
              options={TYPEOPTIONS.map((x) => x.label)}
              type="text"
              placeholder=""
              tooltip={"Metrica dos gráficos"}
            />
          </div>

          {isEnvelope() && <div className="col-6">
            <Input
              name="filter"
              onChange={handleChangeFilter}
              value={
                isEnvelope()
                  ? ENVELOPEFILTEROPTIONS[filter !== ENVELOPEFILTEROPTIONS.length ? filter : 0].label
                  : FILTEROPTIONS[filter].label
              }
              label="Filtro"
              options={
                isEnvelope() ? ENVELOPEFILTEROPTIONS.map((x) => x.label) : FILTEROPTIONS.map((x) => x.label)
              }
              type="text"
              placeholder=""
              tooltip={"Filtro de Passa Banda a ser aplicada"}
            />
          </div>}
        </div>

        <div className="row" style={{ marginTop: 6 }}>
          <div className="col-6">
            <Input
              name="axis"
              onChange={handleChangeAxis}
              value={AXISOPTIONS[axis].label}
              label="Eixo"
              options={AXISOPTIONS.map((x) => x.label)}
              placeholder=""
              tooltip={"Eixo a ser observado no gráfico"}
            />
          </div>

          <div className="col-6">
            <label style={isEnvelope() ? 
              { width: "100%", fontSize: 14, margin: 0 } : { width: "91%", fontSize: 14, margin: 0, bottom: "84%", position: "absolute" }}>
              <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between" }}>
                <span className="label-add-graph">Faixa de frequência</span>
                <Tooltip
                  style={{ color: "gray" }}
                  className="info"
                  title={"Intervalo de frequencia em que os gráficos serão carregados"}
                >
                  <InfoOutlined style={{fontSize: "16px", cursor: "pointer", color: "rgb(21, 98, 132)" }}/>
                </Tooltip>
              </div>

              <MyCustomSlider
                style={{
                  width: "100%",
                  backgroundColor: "white",
                  borderColor: "black",
                  borderWidth: 1,
                  borderRadius: 8,
                  paddingLeft: 6,
                  height: 25,
                }}
                value={frequencyRange}
                onChange={handleChangeSlider}
                valueLabelDisplay="auto"
                min={0}
                max={6000}
                step={100}
                ValueLabelComponent={ValueLabelComponent}
                valueLabelFormat={(value) => `${value} Hz`}
                aria-labelledby="range-slider"
                getAriaValueText={(value) => `${value} Hz`}
              />
            </label>
          </div>
        </div>

        <CascateTable spectrumListData={spectrumListData} selected={selected} setSelected={setSelected} />
      </PopupModal>
    </>
  );
}
