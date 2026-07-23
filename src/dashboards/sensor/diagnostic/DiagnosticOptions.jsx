import React from "react";
import useDiagnosticOptions from "../../../hooks/Diagnostic/useDiagnosticOptions";
import { ClickAwayListener } from "@material-ui/core";
import { MoreHorizRounded } from "@mui/icons-material";

export default function DiagnosticOptions({
  isPlannedIntervention,
  diagnosticId,
}) {
  const { show, setShow, handlePlannedIntervention, checkPlannedIntervention } =
    useDiagnosticOptions(diagnosticId, isPlannedIntervention);

  return (
    <ClickAwayListener onClickAway={() => setShow(false)}>
      <div className="diagnosticOptions" style={{paddingRight: window.innerWidth < 700 && 10}}>
        <button
          className={`${show ? "activeOptions" : ""}`}
          onClick={() => setShow(!show)}
        >
          <MoreHorizRounded style={{ fontSize: 17 }} />
        </button>
        <div
          className="checkbox-dropdown__wrapper"
          style={{ Zindex: 10, width: "100%", position: "absolute" }}
        >
          <fieldset className="checkbox-dropdown">
            {show && (
              <ul className="checkbox-dropdown__options-wrapper optionsList">
                <li
                  className="checkbox-dropdown__checkbox-group"
                  id="plannedIntervation"
                  onMouseDown={handlePlannedIntervention}
                >
                  <input
                    type="checkbox"
                    name="plannedIntervationInput"
                    id={"plannedIntervationInput"}
                    checked={checkPlannedIntervention}
                    style={{ borderRadius: 2 }}
                  />
                  <label
                    htmlFor="plannedIntervationInput"
                    id={"plannedIntervationLabel"}
                  >
                    Intervenção Planejada
                  </label>
                </li>
              </ul>
            )}
          </fieldset>
        </div>
      </div>
    </ClickAwayListener>
  );
}
