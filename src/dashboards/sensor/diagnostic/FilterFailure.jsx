import React from "react";
import { FilterList } from "@mui/icons-material";
import FilterFailureDropdown from "./FilterFailureDropdown";
import useFilterModal from "../../../hooks/Diagnostic/useFilterModal";
import { ClickAwayListener } from "@material-ui/core";

export default function FilterFailure({ card, setCards }) {
  const {
    failures,
    setFailures,
    updateFunc,
    show,
    setShow
  } = useFilterModal(card, setCards);

  return (
    <ClickAwayListener onClickAway={() => setShow(false)}>
      <div className="filterDiagnostic" style={
        {
          marginLeft: window.innerWidth < 700 &&  "-2%", 
          marginBottom: window.innerWidth < 700 && (card?.length > 0 ? 10 : "25vh"),
          position: window.innerWidth < 700 && "absolute",
        }}>
        <div style={{zIndex: 5}} onClick={() => setShow(!show)}>
          Tipo de defeito <FilterList style={{fontSize: 16}}/>
        </div>
        <FilterFailureDropdown
          label="Qual a causa do alarme?"
          options={failures}
          objKey={"effectiveAlarmCause"}
          setOptions={setFailures}
          update={updateFunc}
          show={show}
          setShow={setShow}
        />
      </div>
    </ClickAwayListener>
  );
}
