import React from "react";
import { Input } from "../../../../components";
import GMFTable from "./GMFTable/GMFTable";
import "./MachineConfig.css";

const PASSING_FREQUENCY = [
  "",
  "",
  "Número de pás",
  "Número de pás",
  "",
  "",
  "",
  "Número de divisões do rotor",
  "",
];
const TOOLTIP_FREQUENCY = [
  "",
  "",
  "Frequência de passagem calculada em função da rotação nominal e do número de pás",
  "Frequência de passagem calculada em função da rotação nominal e do número de pás",
  "",
  "",
  "",
  "Frequência de passagem calculada em função da rotação nominal e do número de divisões",
  "",
];

const BINARY_OPTIONS = ["Não", "Sim"];
const FIXATION_OPTIONS = ["Selecione", "Rígida", "Flexível"];
const TRANSMISSION_OPTIONS = [
  "Selecione",
  "Polia",
  "Cardã",
  "Integrada",
  "Acoplamento",
];

export function MachineConfig({
  sensorSettings,
  handleDropdownChange,
  handleInputChange,
  handleSwitchRotation,
  handleTransmissionChange,
  handleFixationChange,
  MACHINE_TYPES_OPTIONS,
  handleTableChange,
  addTableRow,
  deselectTableRows,
  deleteTableRow,
  style,
  sideMenu,
  turnLock,
  gearLock,
  allowTooltips = true,
  disabled,
}) {
  sensorSettings.machineType = !sensorSettings.machineType
    ? 0
    : sensorSettings.machineType;
  return (
    <div
      className={sideMenu ? "machineSideMenu" : "row"}
      style={{ paddingBottom: !sideMenu && 50, ...style }}
    >
      <h1>Equipamento</h1>
      <div className="row">
        <div
          className={sideMenu ? "sideInput" : "col-12 col-sm-6 col-xl-4"}
          style={{ marginBottom: 20 }}
        >
          <Input
            name="machineType"
            onChange={handleDropdownChange}
            value={MACHINE_TYPES_OPTIONS[sensorSettings.machineType]}
            hideTooltip={true}
            label="Tipo de Máquina"
            options={MACHINE_TYPES_OPTIONS}
            required={sideMenu}
            labelError={
              turnLock &&
              sideMenu &&
              (sensorSettings.machineType === 0 ||
                sensorSettings.machineType === 8) &&
              "Selecione um tipo de máquina (Exceto Outros)."
            }
            tooltip={
              allowTooltips &&
              "Categorize a máquina em que o sensor foi instalado, selecionando uma das opções disponíveis."
            }
            disabled={disabled}
          />
        </div>
        <div
          className={sideMenu ? "sideInput" : "col-12 col-sm-6 col-xl-4"}
          style={{ marginBottom: 20 }}
        >
          <Input
            name="power"
            onChange={(e) => {
              handleInputChange("machine", e);
            }}
            value={sensorSettings.power}
            label="Potência (kW)"
            type="number"
            placeholder="Ex: 10.0 kW"
            min={0}
            max={100000}
            tooltip={allowTooltips && "Potência nominal do equipamento em kW."}
            step="any"
            hideTooltip={true}
            required={sideMenu}
            labelError={
              turnLock &&
              sideMenu &&
              (!sensorSettings.power || sensorSettings.power === 0) &&
              "Defina a potência do equipamento."
            }
            disabled={disabled}
          />
        </div>
      </div>
      <div className="row">
        <div
          className={sideMenu ? "sideInput" : "col-12 col-sm-6 col-xl-4"}
          style={{ marginBottom: 20 }}
        >
          <Input
            name="transmissionTypeId"
            onChange={handleTransmissionChange}
            value={TRANSMISSION_OPTIONS[sensorSettings.transmissionTypeId]}
            label="Tipo de transmissão"
            options={TRANSMISSION_OPTIONS}
            tooltip={
              allowTooltips &&
              "Especificação do tipo de transmissão da máquina."
            }
            hideTooltip={true}
            required={sideMenu}
            labelError={
              turnLock &&
              sideMenu &&
              (!sensorSettings.transmissionTypeId ||
                sensorSettings.transmissionTypeId === 0) &&
              "Selecione um tipo de transmissão."
            }
            disabled={disabled}
          />
        </div>
        <div
          className={sideMenu ? "sideInput" : "col-12 col-sm-6 col-xl-4"}
          style={{ marginBottom: 20 }}
        >
          <Input
            name="fixationTypeId"
            onChange={handleFixationChange}
            value={FIXATION_OPTIONS[sensorSettings.fixationTypeId]}
            label="Tipo de fixação"
            options={FIXATION_OPTIONS}
            hideTooltip={true}
            required={sideMenu}
            labelError={
              turnLock &&
              sideMenu &&
              (!sensorSettings.fixationTypeId ||
                sensorSettings.fixationTypeId === 0) &&
              "Selecione um tipo de fixação."
            }
            tooltip={
              allowTooltips &&
              "Fixação rígida se refere a equipamentos que são presos diretamente em solos rígidos. Fixação flexível se refere a equipamentos que possuem molas, vibra-stop ou qualquer outro elemento que fazem com que haja uma baixa rigidez em sua fixação."
            }
            disabled={disabled}
          />
        </div>
      </div>
      <div className="row">
        <div
          className={sideMenu ? "sideInput" : "col-12 col-sm-6 col-xl-4"}
          style={{ marginBottom: 20 }}
        >
          <Input
            name="hasVariableRotation"
            onChange={handleSwitchRotation}
            value={BINARY_OPTIONS[sensorSettings.hasVariableRotation]}
            label="Rotação Variável"
            options={BINARY_OPTIONS}
            tooltip={
              allowTooltips &&
              "A rotação do equipamento em que o Sensor foi instalado, varia ou é constante?"
            }
            hideTooltip={true}
            required={sideMenu}
            disabled={disabled}
          />
        </div>
        {sensorSettings.machineType !== 5 ? (
          <div
            className={sideMenu ? "sideInput" : "col-12 col-sm-6 col-xl-4"}
            style={{ marginBottom: 20 }}
          >
            <Input
              name="rotationSpeed"
              onChange={(e) => {
                handleInputChange("machine", e);
              }}
              value={sensorSettings.rotationSpeed}
              label="Rotação nominal (RPM)"
              type="number"
              placeholder="Ex: 200 RPM"
              min={0}
              max={20000}
              tooltip={
                allowTooltips && "Rotação nominal do equipamento em RPM."
              }
              hideTooltip={true}
              required={sideMenu}
              labelError={
                turnLock &&
                sideMenu &&
                (((!sensorSettings.rotationSpeed ||
                  sensorSettings.rotationSpeed === 0) &&
                  "Defina a rotação nominal do equipamento.") ||
                  (sensorSettings.rotationSpeed < 300 &&
                    "A rotação nominal deve ser maior ou igual a 300 RPM."))
              }
              disabled={disabled}
            />
          </div>
        ) : (
          ""
        )}
      </div>
      {sensorSettings.hasVariableRotation &&
      sensorSettings.machineType !== 5 ? (
        <div className="row">
          <div
            className={sideMenu ? "sideInput" : "col-12 col-sm-6 col-xl-4"}
            style={{ marginBottom: 20 }}
          >
            <Input
              name="minRotation"
              onChange={(e) => {
                handleInputChange("machine", e);
              }}
              value={sensorSettings.minRotation}
              label="Rotação mínima (RPM)"
              type="number"
              placeholder="Ex: 150 RPM"
              min={0}
              max={20000}
              tooltip={allowTooltips && "Rotação mínima do equipamento em RPM."}
              hideTooltip={true}
              required={sideMenu}
              labelError={
                turnLock &&
                sideMenu &&
                (((!sensorSettings.minRotation ||
                  sensorSettings.minRotation === 0) &&
                  "Defina a rotação mínima do equipamento.") ||
                  (sensorSettings.minRotation > sensorSettings.rotationSpeed &&
                    "A rotação mínima deve ser menor ou igual a rotação nominal.") ||
                  (sensorSettings.minRotation < 300 &&
                    "A rotação mínima deve ser maior ou igual a 300 RPM."))
              }
              disabled={disabled}
            />
          </div>
          <div
            className={sideMenu ? "sideInput" : "col-12 col-sm-6 col-xl-4"}
            style={{ marginBottom: 20 }}
          >
            <Input
              name="maxRotation"
              onChange={(e) => {
                handleInputChange("machine", e);
              }}
              value={sensorSettings.maxRotation}
              label="Rotação máxima (RPM)"
              type="number"
              placeholder="Ex: 300 RPM"
              min={0}
              max={20000}
              tooltip={allowTooltips && "Rotação máxima do equipamento em RPM."}
              hideTooltip={true}
              required={sideMenu}
              labelError={
                turnLock &&
                sideMenu &&
                (((!sensorSettings.maxRotation ||
                  sensorSettings.maxRotation === 0) &&
                  "Defina a rotação máxima do equipamento.") ||
                  ((sensorSettings.minRotation > sensorSettings.maxRotation ||
                    sensorSettings.rotationSpeed >
                      sensorSettings.maxRotation) &&
                    "A rotação máxima deve ser maior que a rotação mínima e maior ou igual a nominal.") ||
                  (sensorSettings.maxRotation - sensorSettings.minRotation >
                    600 &&
                    "A diferença entre a rotação máxima e a mínima deve ser menor ou igual a 600 RPM."))
              }
              disabled={disabled}
            />
          </div>
        </div>
      ) : (
        ""
      )}
      {![0, 1, 4, 5, 6, 8].includes(sensorSettings.machineType) && (
        <div className="row">
          <div
            className={sideMenu ? "sideInput" : "col-12 col-sm-6 col-xl-4"}
            style={{ marginBottom: 20 }}
          >
            <Input
              name="divisionCount"
              onChange={(e) => {
                handleInputChange("machine", e);
              }}
              value={sensorSettings.divisionCount}
              label={`${PASSING_FREQUENCY[sensorSettings.machineType]}`}
              type="number"
              step={1}
              min={0}
              max={100}
              tooltip={
                allowTooltips &&
                `${
                  PASSING_FREQUENCY[sensorSettings.machineType]
                } presente no equipamento.`
              }
              hideTooltip={true}
              disabled={disabled}
            />
          </div>
          <div
            className={sideMenu ? "sideInput" : "col-12 col-sm-6 col-xl-4"}
            style={{ marginBottom: 20 }}
          >
            <Input
              name="passingFrequency"
              onChange={(e) => {
                handleInputChange("machine", e);
              }}
              value={(
                sensorSettings.divisionCount *
                (sensorSettings.rotationSpeed / 60)
              ).toFixed(2)}
              label={`BPF (Nominal em Hz)`}
              type="number"
              placeholder="--"
              min={0}
              max={100000}
              tooltip={
                allowTooltips && TOOLTIP_FREQUENCY[sensorSettings.machineType]
              }
              disabled
              style={{ backgroundColor: "#EFEFEF", borderColor: "#777" }}
            />
          </div>
        </div>
      )}
      {sensorSettings.machineType === 5 && (
        <div className="row" id="gmf-table">
          <GMFTable
            variableRotation={sensorSettings.hasVariableRotation}
            gmfData={sensorSettings.gearBoxGmfList}
            handleTableChange={handleTableChange}
            addTableRow={addTableRow}
            deselectTableRows={deselectTableRows}
            deleteTableRow={deleteTableRow}
            sideMenu={sideMenu}
            turnLock={turnLock}
            gearLock={gearLock}
            disabled={disabled}
          />
        </div>
      )}
    </div>
  );
}
