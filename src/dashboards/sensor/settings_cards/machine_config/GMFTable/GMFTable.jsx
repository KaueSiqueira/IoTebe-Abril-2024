import React, { useEffect, useState } from "react";
import RadioInput from "../../../../../components/RadioGroup/RadioInput/RadioInput";
import "./GMFTable.css";
import { Button, Input, PopupModal } from "../../../../../components";
import { IconButton, Tooltip } from "@material-ui/core";
import { Add, Delete, InfoOutlined } from "@mui/icons-material";

const GMFTable = ({
  variableRotation,
  gmfData,
  handleTableChange,
  addTableRow,
  deselectTableRows,
  deleteTableRow,
  sideMenu,
  turnLock,
  gearLock,
  disabled,
}) => {
  const [deleteModal, setDeleteModal] = useState(false);
  const [indexDelete, setIndexDelete] = useState(null);

  useEffect(() => {
    gmfData.length < 1 &&
      addTableRow(
        "gearBoxGmfList",
        {
          gear_teeth_count: 0,
          nominal_rotation: 0,
          min_rotation: 0,
          max_rotation: 0,
          selected_gmf: 0,
        },
        "selected_gmf"
      );
  }, [addTableRow, gmfData.length]);

  return (
    <div
      className="gmf-table-container"
      style={{ gap: sideMenu && turnLock && gearLock && 10 }}
    >
      {gmfData?.length < 1 ? (
        ""
      ) : (
        <div className="gmf-table">
          <table>
            <thead>
              <tr>
                <th>
                  Seleção do usuário{" "}
                  <Tooltip
                    placement="top"
                    style={{ color: "gray" }}
                    className="info"
                    title={
                      <p className="table-tooltip">
                        Esta seleção determina a rotação nominal e a GMF que
                        serão utilizadas no IoTebe. Recomenda-se a seleção do
                        eixo mais próximo ao local de instalação do sensor.
                      </p>
                    }
                    arrow
                  >
                    <InfoOutlined
                      style={{
                        fontSize: "16px",
                        cursor: "pointer",
                        color: "#156284",
                      }}
                    />
                  </Tooltip>
                </th>
                <th>
                  <p style={{ display: sideMenu && "flex" }}>
                    Rotação nominal do eixo (RPM)
                    {sideMenu && (
                      <p
                        style={{
                          fontSize: 14,
                          color: "#FD0D1B",
                          marginLeft: 3,
                        }}
                      >
                        *
                      </p>
                    )}
                  </p>
                </th>
                {variableRotation ? (
                  <>
                    <th>
                      <p style={{ display: sideMenu && "flex" }}>
                        Rotação mínima do eixo (RPM)
                        {sideMenu && (
                          <p
                            style={{
                              fontSize: 14,
                              color: "#FD0D1B",
                              marginLeft: 3,
                            }}
                          >
                            *
                          </p>
                        )}
                      </p>
                    </th>
                    <th>
                      <p style={{ display: sideMenu && "flex" }}>
                        Rotação máxima do eixo (RPM)
                        {sideMenu && (
                          <p
                            style={{
                              fontSize: 14,
                              color: "#FD0D1B",
                              marginLeft: 3,
                            }}
                          >
                            *
                          </p>
                        )}
                      </p>
                    </th>
                  </>
                ) : (
                  ""
                )}
                <th>N° de dentes</th>
                <th>
                  GMF (Nominal em Hz){" "}
                  <Tooltip
                    placement="top"
                    style={{ color: "gray" }}
                    className="info"
                    title={
                      <p className="table-tooltip">
                        Frequência de engrenamento calculada em função da
                        rotação nominal e do número de dentes.
                      </p>
                    }
                    arrow
                  >
                    <InfoOutlined
                      style={{
                        fontSize: "16px",
                        cursor: "pointer",
                        color: "#156284",
                      }}
                    />
                  </Tooltip>
                </th>
              </tr>
            </thead>
            <tbody>
              {gmfData.map((data, index) => {
                return (
                  <tr
                    className={sideMenu && "sideMenu"}
                    key={"gmf-table" + toString(index)}
                  >
                    <td>
                      <div
                        className="flex-cell"
                        style={{ marginTop: sideMenu && 15 }}
                      >
                        <RadioInput
                          onChange={(e) => {
                            deselectTableRows(
                              "gearBoxGmfList",
                              e.target.name,
                              index
                            );
                            handleTableChange("gearBoxGmfList", index, e);
                          }}
                          checked={!!data.selected_gmf}
                          value={1}
                          name="selected_gmf"
                          disabled={disabled}
                        />
                      </div>
                    </td>
                    <td>
                      <Input
                        name="nominal_rotation"
                        onChange={(e) => {
                          handleTableChange("gearBoxGmfList", index, e);
                        }}
                        value={data.nominal_rotation}
                        style={{
                          width: "214px",
                        }}
                        type="number"
                        step="1"
                        hideTooltip={true}
                        required={sideMenu}
                        labelError={
                          turnLock &&
                          sideMenu &&
                          (((!data.nominal_rotation ||
                            data.nominal_rotation === 0) &&
                            "Defina a rotação nominal do eixo.") ||
                            (data.nominal_rotation < 300 &&
                              "A rotação nominal deve ser maior ou igual a 300 RPM."))
                        }
                        disabled={disabled}
                      />
                    </td>
                    {variableRotation ? (
                      <>
                        <td>
                          <Input
                            name="min_rotation"
                            onChange={(e) => {
                              handleTableChange("gearBoxGmfList", index, e);
                            }}
                            value={data.min_rotation}
                            style={{
                              width: "214px",
                            }}
                            type="number"
                            step="1"
                            hideTooltip={true}
                            required={sideMenu}
                            labelError={
                              turnLock &&
                              sideMenu &&
                              (((!data.min_rotation ||
                                data.min_rotation === 0) &&
                                "Defina a rotação mínima do eixo.") ||
                                ((data.min_rotation > data.nominal_rotation ||
                                  data.min_rotation > data.max_rotation) &&
                                  "A rotação mínima deve ser menor ou igual a rotação nominal.") ||
                                (data.min_rotation < 300 &&
                                  "A rotação mínima deve ser maior ou igual a 300 RPM."))
                            }
                            disabled={disabled}
                          />
                        </td>
                        <td>
                          <Input
                            name="max_rotation"
                            onChange={(e) => {
                              handleTableChange("gearBoxGmfList", index, e);
                            }}
                            value={data.max_rotation}
                            style={{
                              width: "214px",
                            }}
                            type="number"
                            step="1"
                            hideTooltip={true}
                            required={sideMenu}
                            labelError={
                              turnLock &&
                              sideMenu &&
                              (((!data.max_rotation ||
                                data.max_rotation === 0) &&
                                "Defina a rotação máxima do eixo.") ||
                                ((data.max_rotation < data.nominal_rotation ||
                                  data.min_rotation > data.max_rotation) &&
                                  "A rotação máxima deve ser maior que a rotação mínima e maior ou igual a nominal.") ||
                                (data.max_rotation - data.min_rotation > 600 &&
                                  "A rotação máxima deve ser maior que a rotação mínima e maior ou igual a nominal."))
                            }
                            disabled={disabled}
                          />
                        </td>
                      </>
                    ) : (
                      ""
                    )}
                    <td>
                      <Input
                        name="gear_teeth_count"
                        onChange={(e) => {
                          handleTableChange("gearBoxGmfList", index, e);
                        }}
                        value={data.gear_teeth_count}
                        style={{
                          width: "94px",
                        }}
                        type="text"
                        pattern="[0-9]*"
                        hideTooltip={true}
                        disabled={disabled}
                      />
                    </td>
                    <td>
                      <Input
                        name="gmf"
                        onChange={(e) => {
                          handleTableChange("gearBoxGmfList", index, e);
                        }}
                        value={
                          (data.nominal_rotation / 60) * data.gear_teeth_count
                        }
                        disabled
                        style={{
                          width: "170px",
                          backgroundColor: "#F8F8F8",
                          borderColor: "#777",
                        }}
                        type="number"
                        step="any"
                        hideTooltip={true}
                      />
                    </td>
                    <td>
                      {!disabled && (
                        <IconButton
                          size="small"
                          onClick={() => {
                            setIndexDelete(index);
                            setDeleteModal(true);
                          }}
                          style={{ marginTop: sideMenu && 10 }}
                        >
                          <Delete style={{ color: "#DF1C27" }} />
                        </IconButton>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {sideMenu && turnLock && gearLock && (
        <p className="warning">Reveja as configurções da tabela acima.</p>
      )}

      {!disabled && (
        <Button
          className="topSensorOptions"
          buttonType="rounded-button"
          style={{ padding: "4px 9px", marginLeft: "10px" }}
          onClick={() => {
            addTableRow(
              "gearBoxGmfList",
              {
                gear_teeth_count: 0,
                nominal_rotation: 0,
                min_rotation: 0,
                max_rotation: 0,
                selected_gmf: 0,
              },
              "selected_gmf"
            );
          }}
        >
          <Add />
          Adicionar Linha
        </Button>
      )}

      <PopupModal
        showModal={deleteModal}
        toggleModal={() => {
          setDeleteModal(!deleteModal);
        }}
        title={"Tem certeza de que deseja remover essa linha?"}
        dismissFunc={() => {
          setDeleteModal(!deleteModal);
        }}
        onDismissTitle={"Cancelar"}
        onConfirm={() => {
          deleteTableRow(
            "gearBoxGmfList",
            indexDelete,
            "selected_gmf",
            "removedGearBoxGmf",
            "gear_box_gmf_id"
          );
          setDeleteModal(!deleteModal);
        }}
        onConfirmTitle={"Confirmar"}
      >
        <p className="delete-row-message">
          Após a exclusão, a ação não pode ser desfeita.
        </p>
      </PopupModal>
    </div>
  );
};

export default GMFTable;
