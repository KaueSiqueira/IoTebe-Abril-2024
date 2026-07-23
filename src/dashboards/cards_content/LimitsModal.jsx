import React from "react";
import { FormGroup, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { Button, Input } from "../../components";

export function LimitsModal({
  thereIsX,
  thereIsY,
  isModalVisible,
  yAxis,
  setYAxis,
  xAxis,
  setXAxis,
  toggle,
  onSave,
  freqOrTime
}) {
  const handleYChange = ({ target: { name, value } }) => setYAxis((prev) => ({ ...prev, [name]: value }));
  const handleXChange = ({ target: { name, value } }) => setXAxis((prev) => ({ ...prev, [name]: value }));
  const onEnterPress = (target) => target.charCode === 13 && onSave();

  return (
    <Modal isOpen={isModalVisible} toggle={toggle} freqOrTime={freqOrTime} centered>
      <ModalHeader toggle={toggle}>Alterar limite do gráfico</ModalHeader>

      <ModalBody>
        <FormGroup>
          {thereIsY && (
            <>
              <Label className="label-add-graph">Amplitude mínima</Label>
              <Input
                className="iotebe-input"
                type="number"
                value={yAxis.min}
                name="min"
                onChange={handleYChange}
                onKeyPress={onEnterPress}
              />

              <Label className="label-add-graph">Amplitude máxima</Label>
              <Input
                className="iotebe-input"
                type="number"
                value={yAxis.max}
                name="max"
                onChange={handleYChange}
                onKeyPress={onEnterPress}
              />
            </>
          )}

          {thereIsX && (
            <>
              <Label className="label-add-graph">{freqOrTime} mínim{freqOrTime === "Frequência" ? "a" : "o"}</Label>
              <Input
                className="iotebe-input"
                type="number"
                value={xAxis.min}
                name="min"
                onChange={handleXChange}
                onKeyPress={onEnterPress}
              />

              <Label className="label-add-graph">{freqOrTime} máxim{freqOrTime === "Frequência" ? "a" : "o"}</Label>
              <Input
                className="iotebe-input"
                type="number"
                value={xAxis.max}
                name="max"
                onChange={handleXChange}
                onKeyPress={onEnterPress}
              />
            </>
          )}
        </FormGroup>
      </ModalBody>

      <ModalFooter style={{ height: 60, display: "flex", justifyContent: "flex-end" }}>
        <Button cancel onClick={toggle} buttonType="rounded-button-outlined">
          Cancelar
        </Button>

        <Button onClick={onSave} buttonType="rounded-button">Salvar</Button>
      </ModalFooter>
    </Modal>
  );
}
