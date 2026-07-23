import React from "react";
import { SpotViewColumn } from "../components";
import logo from "../assets/imgs/logo_iotebe.svg";
import {
  Tab,
  Business,
  Check,
  Close,
  ArrowBackIosNewRounded,
  CampaignRounded,
} from "@mui/icons-material";
import useSpotManagement from "../hooks/SpotManagement/useSpotManagement";
import useScroll from "../hooks/SpotManagement/useScroll";
import { MyCustomSwitch } from "../dashboards/sensor/settings_cards/Customizations";
import { ClickAwayListener } from "@material-ui/core";

function SpotManagement({
  // Props para realizar o redirecionamento ao clicar em um spot
  spotView,
  setNode,
  setPath,
  setChildren,
  setWhichClicked,
  setSpotPage,

  // Props da arvore, contendo todo seu conteudo e o set pra atualizar seu estado.
  // São as duas props mais importantes, pois é com elas que o gestão a vista é atualizado em loop
  setTree,
  tree,
}) {
  // useScroll é um hook personalizado que permite que a tela seja rolada automaticamente
  const {
    setIsDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleAutomaticScroll,
    scrollRef,
    isDragging,
  } = useScroll();

  // useSpotManagement é um hook personalizado que contém toda a lógica e funções da tela, além das regras de negócio
  const {
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
  } = useSpotManagement(tree, setTree);
  //As props da arvore são enviadas pois é nesse hook que elas serão utilizadas para ler e atualizar os dados
  return (
    <div className="spotViewContent" onMouseMove={handleAutomaticScroll}>
      {!loading && (
        <div className="spotViewHeader">
          <a className="navbar-brand" href="./">
            <img
              alt="TebeLogo"
              src={logo}
              width="auto"
              height="40"
              loading="lazy"
            />
          </a>
          <div className="spotHeaderButtons">
            <ClickAwayListener onClickAway={() => setSpotFilter(false)}>
              <div className="spotHeaderButton">
                <div
                  className="spotViewPointsButton buttonViewPoints"
                  onClick={() => {
                    setSpotFilter(!spotFilter);
                  }}
                >
                  <span>Pontos</span>
                </div>
                {spotFilter && (
                  <div
                    className="spotViewFilter"
                    onClick={() => {
                      setSpotFilter(false);
                    }}
                  >
                    <div
                      className="pointFilter"
                      onClick={() => handleSpotFilter("RED", "YELLOW")}
                    >
                      <h3 style={{ color: "#072531" }}>
                        Expandir alarmados
                        <span
                          style={{
                            marginLeft: "3%",
                            fontStyle: "italic",
                            color: "#072531",
                          }}
                        >
                          (Padrão)
                        </span>
                        {showRed === "RED" &&
                          showYellow === "YELLOW" &&
                          showGreen === "NO" &&
                          showGray === "NO" && (
                            <Check
                              style={{
                                fontSize: "24px",
                                color: "#072531",
                                position: "absolute",
                                right: "5%",
                              }}
                            />
                          )}
                      </h3>
                      <span style={{ color: "#777777" }}>
                        Tanto em alerta quanto críticos.
                      </span>
                    </div>
                    <div
                      className="pointFilter"
                      onClick={() => handleSpotFilter("RED")}
                    >
                      <h3 style={{ color: "#072531" }}>
                        Expandir críticos
                        {showRed === "RED" &&
                          showYellow === "NO" &&
                          showGreen === "NO" &&
                          showGray === "NO" && (
                            <Check
                              style={{
                                fontSize: "24px",
                                color: "#072531",
                                position: "absolute",
                                right: "5%",
                              }}
                            />
                          )}
                      </h3>
                      <span style={{ color: "#777777" }}>
                        Somente críticos.
                      </span>
                    </div>
                    <div
                      className="pointFilter"
                      onClick={() =>
                        handleSpotFilter("RED", "YELLOW", "GREEN", "GRAY")
                      }
                    >
                      <h3 style={{ color: "#072531" }}>
                        Expandir tudo
                        {showRed === "RED" &&
                          showYellow === "YELLOW" &&
                          showGreen === "GREEN" &&
                          showGray === "GRAY" && (
                            <Check
                              style={{
                                fontSize: "24px",
                                color: "#072531",
                                position: "absolute",
                                right: "5%",
                              }}
                            />
                          )}
                      </h3>
                      <span style={{ color: "#777777" }}>
                        Tanto alarmados quanto sem alarmes.
                      </span>
                    </div>
                    <h3
                      className="pointFilter"
                      onClick={() => handleSpotFilter("NO", "NO", "NO", "NO")}
                      style={{ color: "#072531" }}
                    >
                      Recolher tudo
                      {showRed === "NO" &&
                        showYellow === "NO" &&
                        showGreen === "NO" &&
                        showGray === "NO" && (
                          <Check
                            style={{
                              fontSize: "24px",
                              color: "#072531",
                              position: "absolute",
                              right: "5%",
                            }}
                          />
                        )}
                    </h3>
                  </div>
                )}
              </div>
            </ClickAwayListener>
            <ClickAwayListener onClickAway={() => setAlarmFilter(false)}>
              <div className="spotHeaderButton">
                <div
                  className="spotViewPointsButton buttonViewPoints"
                  onClick={() => {
                    setAlarmFilter(!alarmFilter);
                  }}
                >
                  <span>Alarmes</span>
                </div>
                {alarmFilter && (
                  <div
                    className="spotViewFilter"
                    onClick={() => {
                      setAlarmFilter(false);
                    }}
                  >
                    <div
                      className="pointFilter"
                      onClick={() => handleAlarmFilter(true)}
                    >
                      <h3 style={{ color: "#072531" }}>
                        Todos os alarmes
                        <span
                          style={{
                            marginLeft: "3%",
                            fontStyle: "italic",
                            color: "#072531",
                          }}
                        >
                          (Padrão)
                        </span>
                        {showPendents && (
                          <Check
                            style={{
                              fontSize: "24px",
                              color: "#072531",
                              position: "absolute",
                              right: "5%",
                            }}
                          />
                        )}
                      </h3>
                      <span style={{ color: "#777777" }}>
                        Em andamento e pendentes
                      </span>
                    </div>
                    <div
                      className="pointFilter"
                      onClick={() => handleAlarmFilter(false)}
                    >
                      <h3 style={{ color: "#072531" }}>
                        Apenas alarmes em andamento
                        {!showPendents && (
                          <Check
                            style={{
                              fontSize: "24px",
                              color: "#072531",
                              position: "absolute",
                              right: "5%",
                            }}
                          />
                        )}
                      </h3>
                    </div>
                  </div>
                )}
              </div>
            </ClickAwayListener>
            <ClickAwayListener onClickAway={() => setShowSoundConfig(false)}>
              <div className="spotHeaderButton">
                <div
                  className="spotViewPointsButton buttonViewPoints"
                  onClick={() => {
                    setShowSoundConfig(!showSoundConfig);
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <CampaignRounded /> Alertas sonoros
                  </span>
                </div>
                {showSoundConfig && (
                  <div className="spotViewFilter soundConfig">
                    <div
                      className={`pointFilter soundOption`}
                      onClick={!updatingSoundAlarm && handleAlarmSound}
                    >
                      <div>
                        <h3 style={{ color: "#072531" }}>Alerta de alarmes</h3>
                        <span style={{ color: "#777777" }}>
                          Você vai ouvir um alerta sonoro sempre que um alarme
                          surgir
                        </span>
                      </div>
                      {updatingSoundAlarm && <div className="loader"></div>}
                      <MyCustomSwitch
                        className={`${
                          updatingSoundAlarm ? "invisibleSwitch" : ""
                        }`}
                        name="switchSoundConfig"
                        checked={alarmSound}
                      />
                    </div>
                  </div>
                )}
              </div>
            </ClickAwayListener>
          </div>

          <div className="spotStatusDiv">
            <div className="spotStatusNumber" style={{ background: "#A4E5A6" }}>
              {green}
            </div>
            <div className="spotStatusNumber" style={{ background: "#FFF3AD" }}>
              {yellow}
            </div>
            <div className="spotStatusNumber" style={{ background: "#FFCED1" }}>
              {red}
            </div>
            <div className="spotStatusNumber" style={{ background: "#E5E5E5" }}>
              {gray}
            </div>
          </div>
          <span className="spotUpdateText">
            {"Última atualização: " + day + " às " + hour}
          </span>
          <span
            className="spotViewPath"
            onClick={() => {
              setShowGray("NO");
            }}
          >
            {JSON.stringify(selectedSector) !== "{}"
              ? selectedPath.title + " / " + selectedSector.title
              : JSON.stringify(selectedPath) !== "{}"
              ? selectedPath.title
              : "Gestão à vista"}
          </span>
        </div>
      )}
      <div
        className="spotViewColumnsDiv"
        ref={scrollRef}
        style={{
          overflowX: "auto",
          position: "relative",
          cursor: isDragging ? "grabbing" : "grab",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => setIsDragging(false)}
      >
        {JSON.stringify(selectedSector) === "{}" ? (
          sectorArray.map((sector, index) => (
            <SpotViewColumn
              key={sector.title + index}
              id={sector.id}
              title={sector.title}
              color={sector.alarmLabel}
              data={sector.children}
              red={showRed}
              yellow={showYellow}
              green={showGreen}
              gray={showGray}
              alarm={data}
              close={spotView}
              setNode={setNode}
              setPath={setPath}
              tree={tree}
              setChildren={setChildren}
              handleColumnWidthChange={handleColumnWidthChange}
              setWhichClicked={setWhichClicked}
              setSpotPage={setSpotPage}
              showPendents={showPendents}
              alarmSound={alarmSound}
            />
          ))
        ) : (
          <SpotViewColumn
            title={selectedSector.title}
            color={selectedSector.alarmLabel}
            data={selectedSector.children}
            red={showRed}
            yellow={showYellow}
            green={showGreen}
            gray={showGray}
            alarm={data}
            close={spotView}
            setNode={setNode}
            setPath={setPath}
            tree={tree}
            setChildren={setChildren}
            handleColumnWidthChange={handleColumnWidthChange}
            setWhichClicked={setWhichClicked}
            setSpotPage={setSpotPage}
            showPendents={showPendents}
            alarmSound={alarmSound}
          />
        )}
      </div>
      <div className="hoverFooter" />
      <div className="spotViewFooter">
        <div className="svfReturn" onClick={() => spotView(false)}>
          <ArrowBackIosNewRounded style={{ color: "#156284", fontSize: 15 }} />
          Dashboard
        </div>
        <div className="svfPathsDiv">
          {!hideSector &&
            sectorArray.map((sector, index) => (
              <div
                key={sector.title + index}
                className="svfPath"
                onClick={() => {
                  setSelectedSector(sector);
                  setHideSector(true);
                }}
              >
                <div className="svfPathIcon">
                  <Tab
                    style={{
                      color: "white",
                      fontSize: "1rem",
                      padding: "2px",
                    }}
                  />
                </div>
                {sector.title}
              </div>
            ))}
          {hideSector && JSON.stringify(selectedSector) === "{}" ? (
            plantArray.map((plant, index) => (
              <div
                key={plant.title + index}
                className="svfPath"
                style={
                  selectedPath === plant.title
                    ? { backgroundColor: "#E5E5E5" }
                    : {}
                }
                onClick={() => {
                  setSelectedPath(plant);
                  setHideSector(false);
                }}
              >
                <div className="svfPathIcon">
                  <Business
                    style={{
                      color: "white",
                      fontSize: "1rem",
                      padding: "2px",
                    }}
                  />
                </div>
                {plant.title}
              </div>
            ))
          ) : (
            <div
              className="svfPath"
              style={{ backgroundColor: "#E5E5E5" }}
              onClick={handleOpenPath}
            >
              <div className="svfPathIcon">
                <Business
                  style={{ color: "white", fontSize: "1rem", padding: "2px" }}
                />
              </div>
              {JSON.stringify(selectedSector) !== "{}"
                ? selectedPath.title + " / " + selectedSector.title
                : selectedPath.title}
            </div>
          )}
          <div className="svfPathClose" onClick={handleClosePath}>
            <Close style={{ color: "#156284", fontSize: "1rem" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpotManagement;
