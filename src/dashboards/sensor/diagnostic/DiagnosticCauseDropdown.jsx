import React, { useEffect, useState } from "react";
import { ClickAwayListener } from "@material-ui/core";
import { colors } from "../../../utilities";

const DiagnosticCauseDropdown = ({
  label,
  defaultValue,
  options,
  objKey,
  objArr,
  setOptions,
  resetValidation,
  resetValidationField,
  style,
  labelError,
  otherCauseCount,
  otherCauseObj,
  handleOtherCause,
  validationFields,
  controlOtherCauseError,
}) => {
  const [showOptions, setShowOptions] = useState(false);

  const handleOptionsChange = ({ target: { name, checked } }) => {
    resetValidation && resetValidationField(objKey);
    if (checked) {
      setOptions((prevOptions) => {
        return {
          ...prevOptions,
          [objKey]: name === "Nenhum" ? [name] : [...objArr, name],
        };
      });
    } else {
      let currentOptions = objArr;
      currentOptions.splice(currentOptions.indexOf(name), 1);
      setOptions((prevOptions) => {
        return {
          ...prevOptions,
          [objKey]: currentOptions,
        };
      });
    }
  };

  const currentValue =
    objArr.length === 0 && defaultValue
      ? defaultValue
      : objArr.length === 0
      ? "Selecione"
      : objArr.join(", ");

  useEffect(() => {
    controlOtherCauseError > 0 && setShowOptions(true);
  }, [controlOtherCauseError]);

  return (
    <ClickAwayListener onClickAway={() => setShowOptions(false)}>
      <div className="checkbox-dropdown__wrapper">
        <fieldset className="checkbox-dropdown">
          <legend>
            {label} {labelError}
          </legend>
          <div className="checkbox-dropdown__input-wrapper">
            <input
              className="checkbox-dropdown__input"
              type="text"
              readOnly
              style={style ? { ...style } : {}}
              value={currentValue}
              onFocus={() => resetValidation && resetValidationField(objKey)}
              onClick={() => setShowOptions(!showOptions)}
            />
          </div>

          {showOptions && (
            <ul className="checkbox-dropdown__options-wrapper">
              {options.map((option, index) => (
                <li
                  className="checkbox-dropdown__checkbox-group"
                  key={`option-${index + 1}`}
                  style={{ fontSize: 14 }}
                >
                  <input
                    type="checkbox"
                    name={option}
                    id={`checkboxOption-${index + 1}`}
                    onChange={handleOptionsChange}
                    checked={objArr.indexOf(option) !== -1}
                    disabled={option !== "Nenhum" && objArr.includes("Nenhum")}
                  />
                  <label htmlFor={`checkboxOption-${index + 1}`}>
                    {option}
                  </label>
                </li>
              ))}
              {objArr.includes("Outro") && (
                <label
                  htmlFor="effectiveOtherCause"
                  className="inputCounter"
                  style={{ paddingTop: 12, paddingInline: 12, fontSize: 14 }}
                >
                  <span style={{margin: 9}}>{otherCauseCount}/20</span>
                  <input
                    className="checkbox-dropdown__input"
                    type="text"
                    name="effectiveOtherCause"
                    id="effectiveOtherCause"
                    placeholder="Defina a causa"
                    value={otherCauseObj}
                    onChange={handleOtherCause}
                    onFocus={() => resetValidation && resetValidationField("effectiveOtherCause")}
                    style={
                      validationFields.effectiveOtherCause === "invalid"
                        ? {
                            borderColor: colors.formErrorFeedback,
                          }
                        : {}
                    }
                  />
                </label>
              )}
            </ul>
          )}
        </fieldset>
      </div>
    </ClickAwayListener>
  );
};

export default DiagnosticCauseDropdown;
