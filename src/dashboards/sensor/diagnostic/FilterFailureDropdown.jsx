import React, { useEffect, useState } from "react";
import { colors } from "../../../utilities";

const FilterFailureDropdown = ({
  update,
  options,
  setOptions,
  show,
}) => {

  const handleOptionsChange = ({target: { id }}) => {
    if (options[id].checked) {
      options[id].checked = false;
      update();
      return setOptions(options);
    } else {
      options[id].checked = true;
      update();
      return setOptions(options);
    }
  };

  useEffect(() => {
    options.map((opt) => {
      opt.checked = false;
    })
  }, [])

  return (
    <div className="checkbox-dropdown__wrapper" style={{ Zindex: 10, width: "100%", position: "absolute"}}>
      <fieldset className="checkbox-dropdown">
        {show && (
          <ul className="checkbox-dropdown__options-wrapper filterOptions" style={{width: window.innerWidth > 700 ? "18vw" : "77vw", marginTop: "14%", animation: "slideDown .3s forwards"}}>
            {options.map((option, index) => (
              <li
                className="checkbox-dropdown__checkbox-group"
                key={`option-${index + 1}`}
                style={{ fontSize: 14 }}
                id={index}
              >
                <input
                  type="checkbox"
                  name={option.name}
                  id={index}
                  checked={option.checked}
                  onChange={handleOptionsChange}
                  style={{borderRadius: 2, cursor: "pointer"}}
                />
                <label htmlFor={`checkboxOption-${index + 1}`} style={{cursor: "pointer"}} id={index} onClick={handleOptionsChange}>
                  {option.name}
                </label>
              </li>
            ))}
          </ul>
        )}
      </fieldset>
    </div>
  );
};

export default FilterFailureDropdown;
