import React, { useState } from "react";
import { InfoTooltip } from "../../../../../components";
import { ClickAwayListener } from "@material-ui/core";

const MetricCheckboxDropdown = ({
  label,
  tooltip,
  defaultValue,
  options,
  objKey,
  objArr,
  setOptions,
  resetPayload,
  resetPayloadField,
  style,
  fieldsetStyle,
  disabled, 
  margin
}) => {
  const [showOptions, setShowOptions] = useState(false);

  const handleOptionsChange = ({ target: { name, checked } }) => {
    resetPayload && resetPayloadField(objKey);
    if (checked) {
      setOptions([...objArr, name]);
    } else {
      let currentOptions = objArr;
      currentOptions.splice(currentOptions.indexOf(name), 1);
      setOptions(currentOptions);
    }
  };

  const currentValue =
    objArr.length === 0 && defaultValue
      ? defaultValue
      : objArr.length === 0
      ? "Selecione"
      : objArr.join(", ");

  return (
    <ClickAwayListener onClickAway={() => setShowOptions(false)}>
      <div className="checkbox-dropdown__wrapper" style={margin}>
        <fieldset className="checkbox-dropdown-metric" style={fieldsetStyle}>
          <legend>
            {label}
            {tooltip && <InfoTooltip content={tooltip} />}
          </legend>
          <div className={`checkbox-dropdown__input-wrapper ${disabled ? "checkbox-dropdown__input-wrapper-disabled" : ""}`}>
            <input
              className="checkbox-dropdown__input"
              type="text"
              readOnly
              style={style ? { ...style } : {}}
              value={currentValue}
              onClick={() => setShowOptions(!showOptions)}
              disabled = {disabled}
            />
          </div>

          {showOptions && (
            <ul className="checkbox-dropdown__options-wrapper">
              {options.map((option, index) => (
                <li
                  className="checkbox-dropdown__checkbox-group"
                  key={`option-${index + 1}`}
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
            </ul>
          )}
        </fieldset>
      </div>
    </ClickAwayListener>
  );
};

export default MetricCheckboxDropdown;
