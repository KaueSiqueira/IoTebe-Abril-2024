import React from "react";
import { Input, IoTebeModal } from "../../../components";
import useDiagnosticModal from "../../../hooks/Diagnostic/useDiagnosticModal";
import { colors } from "../../../utilities";
import DiagnosticCauseDropdown from "./DiagnosticCauseDropdown";

const DiagnosticModal = ({ changeModal, setChangeModal, diagnosticId }) => {
  const {
    feedback,
    setFeedback,
    handleSubmit,
    validationFields,
    reccomendation,
    handleIsEffectiveChange,
    handleNotEffectiveAlarmCauseChange,
    handleOtherCause,
    otherCauseCount,
    NOT_EFFECTIVE_FAILURES,
    EFFECTIVE_FAILURES,
    handleEffectiveCauseReset,
    controlOtherCauseError,
    observationCount,
    handleObservationChange,
  } = useDiagnosticModal(setChangeModal, diagnosticId);

  return (
    <IoTebeModal
      showModal={changeModal}
      toggleModal={() => setChangeModal(!changeModal)}
      title="Conclusão de alarme"
      onConfirmTitle="Salvar"
      onDismissTitle="Cancelar"
      onConfirm={() => {
        handleSubmit();
      }}
      style={{ fontFamily: "Montserrat, sans-serif", color: "#777777" }}
      fontFamily={"Montserrat, sans-serif"}
      onConfirmStyle={{ marginLeft: 0 }}
      children={
        <div className="diagnosticModal">
          <p style={{ fontSize: 14, fontWeight: 500 }}>
            Após concluído, não será possível editar as informações.
          </p>
          <div className="titled-radio-group">
            <p className="radio-group-title">O alarme foi efetivo?</p>
            <div className="radio-group">
              <label htmlFor="effective" className="radio-label">
                <input
                  type="radio"
                  name="isEffective"
                  id="effective"
                  value={true}
                  checked={feedback.isEffective === "true"}
                  onChange={handleIsEffectiveChange}
                />
                <span
                  className={`radioCircle`}
                  style={
                    validationFields.isEffective === "invalid"
                      ? {
                          borderColor: colors.formErrorFeedback,
                        }
                      : {}
                  }
                >
                  <div
                    className={`${
                      feedback.isEffective === "true" ? "checked" : ""
                    }`}
                  ></div>
                </span>
                Sim
              </label>
              <label htmlFor="notEffective" className="radio-label">
                <input
                  type="radio"
                  name="isEffective"
                  id="notEffective"
                  value={false}
                  checked={feedback.isEffective === "false"}
                  onChange={handleIsEffectiveChange}
                />
                <span
                  className={`radioCircle`}
                  style={
                    validationFields.isEffective === "invalid"
                      ? {
                          borderColor: colors.formErrorFeedback,
                        }
                      : {}
                  }
                >
                  <div
                    className={`${
                      feedback.isEffective === "false" ? "checked" : ""
                    }`}
                  ></div>
                </span>
                Não
              </label>
            </div>
          </div>

          {feedback.isEffective === "false" && (
            <div>
              <Input
                name="notEffectiveAlarmCause"
                label="Qual a causa do alarme?"
                options={NOT_EFFECTIVE_FAILURES}
                value={feedback.notEffectiveAlarmCause}
                onChange={handleNotEffectiveAlarmCauseChange}
                style={
                  validationFields.notEffectiveAlarmCause === "invalid"
                    ? {
                        borderColor: colors.formErrorFeedback,
                        outlineColor: colors.formErrorFeedback,
                      }
                    : {}
                }
                labelError={
                  validationFields.notEffectiveAlarmCause === "invalid" ? (
                    <p
                      style={{
                        color: colors.formErrorFeedback,
                        fontSize: 12,
                        fontWeight: 500,
                      }}
                    >
                      Por favor, responda a causa do alarme primeiro.
                    </p>
                  ) : null
                }
              />
              {reccomendation && (
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    marginTop: 12,
                  }}
                >
                  <span
                    style={{
                      fontWeight: 600,
                    }}
                  >
                    Recomendação:{" "}
                  </span>
                  {reccomendation}
                </p>
              )}
              {feedback.notEffectiveAlarmCause === "Outro" && (
                <label
                  htmlFor="notEffectiveOtherCause"
                  className="inputCounter"
                  style={{ paddingTop: 20 }}
                >
                  <span>{otherCauseCount}/20</span>
                  <input
                    className="inputCounter__otherCause"
                    type="text"
                    name="notEffectiveOtherCause"
                    id="notEffectiveOtherCause"
                    value={feedback.notEffectiveOtherCause}
                    onChange={handleOtherCause}
                    style={
                      validationFields.notEffectiveOtherCause === "invalid"
                        ? {
                            borderBottomColor: colors.formErrorFeedback,
                          }
                        : {}
                    }
                  />
                </label>
              )}
            </div>
          )}

          {feedback.isEffective === "true" && (
            <>
              <div>
                <DiagnosticCauseDropdown
                  label="Qual a causa do alarme?"
                  options={EFFECTIVE_FAILURES}
                  objKey={"effectiveAlarmCause"}
                  objArr={feedback.effectiveAlarmCause}
                  otherCauseObj={feedback.effectiveOtherCause}
                  otherCauseCount={otherCauseCount}
                  handleOtherCause={handleOtherCause}
                  controlOtherCauseError={controlOtherCauseError}
                  validationFields={validationFields}
                  setOptions={setFeedback}
                  resetValidation
                  resetValidationField={(key) => handleEffectiveCauseReset(key)}
                  style={
                    validationFields.effectiveAlarmCause === "invalid"
                      ? {
                          borderColor: colors.formErrorFeedback,
                        }
                      : {}
                  }
                  labelError={
                    validationFields.effectiveAlarmCause === "invalid" ? (
                      <p
                        style={{
                          color: colors.formErrorFeedback,
                          fontSize: 12,
                          fontWeight: 500,
                        }}
                      >
                        Por favor, responda a causa do alarme primeiro.
                      </p>
                    ) : null
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="observation"
                  style={{
                    marginBottom: 5,
                  }}
                >
                  Observação
                </label>
                <div className="inputCounter observation">
                  <span>{observationCount}/120</span>
                  <textarea
                    className="inputCounter__observation"
                    name="observation"
                    id="observation"
                    value={feedback.observation}
                    onChange={handleObservationChange}
                  ></textarea>
                </div>
              </div>
            </>
          )}
        </div>
      }
      backdrop={"static"}
    />
  );
};

export default DiagnosticModal;
