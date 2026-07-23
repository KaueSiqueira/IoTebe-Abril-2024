import React, { useState } from "react";
import "./BearingConfig.css";
import { PopupModal, Input, Button } from "../../../../../components";
import RadioInput from "../../../../../components/RadioGroup/RadioInput/RadioInput";
import RadioGroup from "../../../../../components/RadioGroup/RadioGroup";
import { PopupBearing } from "../PopupBearing";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import { Delete, Add, InfoOutlined } from "@mui/icons-material";
import { CardData } from "../../../../../components/NoDataLayer";

const columns = [
  { id: "select", label: "Seleção do usuário", align: "center", minWidth: 50 },
  { id: "model", label: "Modelo", align: "center", minWidth: 50 },
  { id: "manufacturer", label: "Marca", align: "center", minWidth: 50 },
  { id: "ftf", label: "FTF", align: "center", minWidth: 50 },
  { id: "bsf", label: "BSF", align: "center", minWidth: 50 },
  { id: "bpfo", label: "BPFO", align: "center", minWidth: 50 },
  { id: "bpfi", label: "BPFI", align: "center", minWidth: 50 },
  { id: "delete", label: "", align: "center", minWidth: 40 },
];

const AXIS_OPTIONS = ["Vertical", "Horizontal", "Axial"];

export function BearingConfig({
  sensorSettings,
  setSensorSettings,
  normalizeAxisOption,
  handleDropdownChange,
  handleBearingTypeSave,
  style,
  sideMenu,
  disabled,
  allowTooltips = true,
  turnLock,
}) {
  const [modal, setModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [indexDelete, setIndexDelete] = useState();

  const handleSelectBearing = (index) => {
    const a = sensorSettings.bearingList;

    a[index].selected_bearing = 1;

    a.forEach((bearing, idx) => {
      if (index !== idx) bearing.selected_bearing = 0;
    });
    const b = [...a];

    setSensorSettings({ ...sensorSettings, bearingList: b });
  };

  const handleDeleteClick = (index) => {
    const a = [...sensorSettings.bearingList];
    const [b] = a.splice(index, 1);
    const c = b.hasOwnProperty("bearing_user_id")
      ? [...sensorSettings.removedBearing, b.bearing_user_id]
      : [...sensorSettings.removedBearing];

    if (a.length > 0 && b.selected_bearing === 1)
      a[
        index >= a.length && index > 0 ? index - 1 : index
      ].selected_bearing = 1;

    setSensorSettings({ ...sensorSettings, bearingList: a, removedBearing: c });
  };

  return (
    <div
      className={sideMenu ? "bearingSideMenu" : "row"}
      style={{
        marginBlock: !sideMenu && 10,
        paddingBottom: !sideMenu && 50,
        ...style,
      }}
    >
      <h1>Eixos</h1>
      <div
        className={sideMenu ? "" : "col-12 col-sm-5 col-xl-4"}
        style={{ marginBottom: 16 }}
      >
        <Input
          name="axisX"
          onChange={handleDropdownChange}
          value={normalizeAxisOption(sensorSettings.axisX)}
          label="X"
          options={AXIS_OPTIONS}
          hideTooltip={true}
          tooltip={
            allowTooltips &&
            "Selecionar qual é a direção (Horizontal / Vertical / Axial) que está alinhada com o eixo X do Sensor."
          }
          disabled={disabled}
          labelError={
            turnLock &&
            sideMenu &&
            [sensorSettings.axisY, sensorSettings.axisZ].includes(
              sensorSettings.axisX
            ) &&
            "Eixo repetido."
          }
          required={sideMenu}
        />
      </div>
      <div
        className={sideMenu ? "" : "col-12 col-sm-5 col-xl-4"}
        style={{ marginBottom: 16 }}
      >
        <Input
          name="axisY"
          onChange={handleDropdownChange}
          value={normalizeAxisOption(sensorSettings.axisY)}
          label="Y"
          options={AXIS_OPTIONS}
          hideTooltip={true}
          tooltip={
            allowTooltips &&
            "Selecionar qual é a direção (Horizontal / Vertical / Axial) que está alinhada com o eixo Y do Sensor."
          }
          disabled={disabled}
          labelError={
            turnLock &&
            sideMenu &&
            [sensorSettings.axisX, sensorSettings.axisZ].includes(
              sensorSettings.axisY
            ) &&
            "Eixo repetido."
          }
          required={sideMenu}
        />
      </div>
      <div
        className={sideMenu ? "" : "col-12 col-sm-5 col-xl-4"}
        style={{ marginBottom: 16 }}
      >
        <Input
          name="axisZ"
          onChange={handleDropdownChange}
          value={normalizeAxisOption(sensorSettings.axisZ)}
          label="Z"
          options={AXIS_OPTIONS}
          hideTooltip={true}
          tooltip={
            allowTooltips &&
            "Selecionar qual é a direção (Horizontal / Vertical / Axial) que está alinhada com o eixo Z do Sensor."
          }
          disabled={disabled}
          labelError={
            turnLock &&
            sideMenu &&
            [sensorSettings.axisX, sensorSettings.axisY].includes(
              sensorSettings.axisZ
            ) &&
            "Eixo repetido."
          }
          required={sideMenu}
        />
      </div>
      <h1 style={{ marginTop: 14, marginBottom: sideMenu && 10 }}>Mancal</h1>
      <div
        style={{
          width: "100%",
          maxHeight: "230px",
          minHeight: sensorSettings.bearingType === "ROLLING" && "115px",
          position: "relative",
        }}
      >
        <div style={{ margin: !sideMenu && "0px 15px 15px" }}>
          <RadioGroup
            children={
              <>
                <RadioInput
                  name="bearingType"
                  value="Deslizamento"
                  label="Deslizamento"
                  checked={sensorSettings.bearingType === "SLEEVE"}
                  onChange={handleBearingTypeSave}
                  disabled={disabled}
                />
                <RadioInput
                  name="bearingType"
                  value="Rolamento"
                  label="Rolamento"
                  checked={sensorSettings.bearingType === "ROLLING"}
                  onChange={handleBearingTypeSave}
                  disabled={disabled}
                />
                <RadioInput
                  name="bearingType"
                  value="Outros"
                  label="Outros"
                  checked={
                    sensorSettings.bearingType === "OTHER" ||
                    sensorSettings.bearingType === null ||
                    sensorSettings.bearingType === undefined
                  }
                  onChange={handleBearingTypeSave}
                  disabled={disabled}
                />
              </>
            }
          ></RadioGroup>
        </div>
        {!!sensorSettings?.bearingList?.length &&
        sensorSettings.bearingType === "ROLLING" ? (
          <Paper
            style={{
              boxShadow: "none",
              overflowY: "auto",
              margin: sideMenu ? "15px 0" : "0 15px",
              maxHeight: 150,
            }}
          >
            <TableContainer>
              <Table stickyHeader aria-label="sticky table" size="small">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{
                          minWidth: column.minWidth,
                          maxWidth:
                            window.innerWidth > 700
                              ? sideMenu
                                ? 145
                                : 110
                              : 160,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {column.label}
                        {column.id === "select" &&
                          window.innerWidth > 700 &&
                          !sideMenu && (
                            <Tooltip
                              style={{ color: "gray" }}
                              placement="top"
                              className="info"
                              title={
                                <span
                                  style={{
                                    display: "block",
                                    textAlign: "center",
                                  }}
                                >
                                  {
                                    "Esta seleção determina o modelo do rolamento que será\n utilizado no IoTebe. Recomenda-se a seleção do rolamento\n mais próximo ao local de instalação do sensor"
                                  }
                                </span>
                              }
                              arrow
                            >
                              <InfoOutlined
                                style={{
                                  fontSize: "16px",
                                  cursor: "pointer",
                                  color: "#156284",
                                  marginLeft: 5,
                                  marginBottom: 1,
                                }}
                              />
                            </Tooltip>
                          )}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sensorSettings.bearingList.map((row, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                      {columns.map(({ id, align }) => (
                        <TableCell key={id} align={align}>
                          {id === "select" && (
                            <RadioInput
                              checked={row["selected_bearing"] === 1}
                              onChange={() => handleSelectBearing(index)}
                              disabled={disabled}
                            />
                          )}
                          {id !== "delete"
                            ? row[id]
                            : !disabled && (
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    setDeleteModal(true);
                                    setIndexDelete(index);
                                  }}
                                >
                                  <Delete style={{ color: "#DF1C27" }} />
                                </IconButton>
                              )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        ) : (
          sensorSettings.bearingType === "ROLLING" && (
            <CardData
              title="Nenhum rolamento cadastrado"
              font={{
                fontWeight: "normal",
                fontSize: 16,
                textAlign: "center",
                color: "#777",
                inlineSize: "100%",
                marginTop: window.innerWidth < 700 ? 30 : sideMenu && 35,
              }}
            />
          )
        )}
      </div>

      {sensorSettings.bearingType === "ROLLING" && !disabled && (
        <Button
          className="topSensorOptions"
          buttonType="rounded-button"
          style={{
            padding: sideMenu ? "2px 7px" : "4px 9px",
            marginLeft: !sideMenu && 15,
            marginTop: 15,
            zIndex: 1,
          }}
          onClick={() => setModal(true)}
        >
          <Add />
          Adicionar Rolamento
        </Button>
      )}

      <PopupModal
        showModal={deleteModal}
        toggleModal={() => {
          setDeleteModal(!deleteModal);
        }}
        title={"Atenção"}
        dismissFunc={() => {
          setDeleteModal(!deleteModal);
        }}
        onDismissTitle={"Não"}
        onConfirm={() => {
          handleDeleteClick(indexDelete);
          setDeleteModal(!deleteModal);
        }}
        onConfirmTitle={"Sim"}
      >
        <p>Deseja realmente excluir esse item?</p>
      </PopupModal>

      <PopupBearing
        modal={modal}
        setModal={setModal}
        data={sensorSettings.bearingList}
        setData={(data) => {
          setSensorSettings({ ...sensorSettings, bearingList: data });
        }}
      />
    </div>
  );
}
