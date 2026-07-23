import React, { useState, useRef } from "react";
import { Tooltip, ClickAwayListener, Grow, Paper, Popper, MenuItem, MenuList } from "@material-ui/core";
import { FilterList } from "@mui/icons-material";
import { Button, Input, PopupModal } from "../../../components";

const options = [
  // { title: "5 Hz a 100 Hz", min: 5, max: 100 },
  { title: "50 Hz a 1000 Hz", min: 50, max: 1000 },
  { title: "500 Hz a 6000 Hz", min: 500, max: 6000 },
];

export function FilterFreqButton({ setFilter, lockEffect }) {
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [freq, setFreq] = useState({ freqMin: null, freqMax: null });
  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
    if(lockEffect)
      lockEffect((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) return;

    setOpen(false);
    if(lockEffect)
      lockEffect(false);
  };

  const handleMenuItemClick = (index) => {
    setSelectedIndex(index);
    const { title, ...rest } = options[index];
    setFilter(rest);
  };

  const handleInputChange = ({ target: { name, value } }) => {
    setFreq({ ...freq, [name]: parseInt(value) });
  };

  const handleFilter = () => {
    if (freq.freqMin > 6000 || freq.freqMax > 6000 || freq.freqMin < 0 || freq.freqMax < 0) {
      alert("Apenas frequências entre 0 e 6000");
      return;
    }
    if (freq.freqMin >= freq.freqMax) {
      alert("Valor mínimo deve ser maior que o valor máximo!");
      return;
    }
    if (!!freq.freqMin && !!freq.freqMax) {
      setModal((prev) => !prev);
      setFilter({ min: freq.freqMin, max: freq.freqMax });
    } else {
      alert("Preencha todos os campos");
    }
  };

  return (
    <>
      <Button
        buttonRef={anchorRef}
        aria-controls={open ? "menu-list-grow" : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        id="filter-button"
        small
        style={{ padding: "auto", fill: "white" }}
        className="selected-chart-button chart-button"
      >
        <Tooltip title="Faixa de filtragem">
          <FilterList style={{ fontSize: 18 }} />
        </Tooltip>
      </Button>
      <Popper style={{zIndex: 5}} open={open} anchorEl={anchorRef.current} role={undefined} transition>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{ transformOrigin: placement === "bottom" ? "center top" : "center bottom" }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="menu-list-grow">
                  {options.map((option, index) => (
                    <MenuItem
                      key={option.title}
                      selected={index === selectedIndex}
                      onClick={() => handleMenuItemClick(index)}
                    >
                      {option.title}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
      <PopupModal
        showModal={modal}
        toggleModal={() => {
          setModal((prev) => !prev);
        }}
        title={"Editar faixa de filtragem"}
        dismissFunc={() => {
          setModal((prev) => !prev);
        }}
        onDismissTitle={"Cancelar"}
        onConfirm={handleFilter}
        onConfirmTitle={"Filtrar"}
      >
        <div className="row" style={{ marginTop: 6 }}>
          <div className="col-6" style={{ marginBottom: 6 }}>
            <Input
              type={"number"}
              name="freqMin"
              min={0}
              max={5999}
              onChange={handleInputChange}
              value={freq.freqMin}
              label="Frequência Miníma"
              tooltip="Frequência de corte inferior"
            />
          </div>
          <div className="col-6" style={{ marginBottom: 6 }}>
            <Input
              type={"number"}
              name="freqMax"
              min={1}
              max={6000}
              onChange={handleInputChange}
              value={freq.freqMax}
              label="Frequência Maxima"
              tooltip="Frequência de corte superior"
            />
          </div>
        </div>
      </PopupModal>
    </>
  );
}
