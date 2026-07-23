import React, { useRef, useState } from "react";
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  ClickAwayListener,
  Grow,
  Paper,
  Popper,
  Tooltip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const TebeCheckbox = withStyles({
  root: {
    color: "#156284",
    "&$checked": {
      color: "#156284",
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

export function FilterAnnotButton({
  setCheckedFilterAnnot,
  checkedFilterAnnot,
}) {
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(checkedFilterAnnot);

  const anchorRef = useRef(null);

  const handleToggleCheck = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    const splited = value.split("-");

    if (currentIndex === -1) {
      newChecked.push(value);
      if (!!splited[1]) {
        checked.indexOf(splited[1]) === -1 && newChecked.push(splited[1]);
      }
    } else {
      newChecked.splice(currentIndex, 1);
      if (!!splited[1]) {
        const seila = newChecked.some((el) => {
          if (el.includes(`-${splited[1]}`)) return true;
          else return false;
        });
        if (!seila) {
          const index = newChecked.indexOf(splited[1]);
          newChecked.splice(index, 1);
        }
      }
    }

    setChecked(newChecked);
    setCheckedFilterAnnot(newChecked);
  };

  const handleToggleAll = (value) => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    setChecked(newChecked);
  };

  const handleToggleOpen = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) return;
    setOpen(false);
  };

  return (
    <>
      <button
        id="filterAnnotBtn"
        small
        onClick={handleToggleOpen}
        className="vibTempFuncBtn"
        style={{ paddingLeft: "7px" }}
        ref={anchorRef}
        aria-controls={open ? "split-button-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-label="fail frequency"
        aria-haspopup="menu"
      >
        <Tooltip title={"Filtrar marcações"}>
          <VisibilityIcon
            style={{
              fontSize: "1.35em",
              display: "flex",
              justifyContent: "center",
            }}
          />
        </Tooltip>
      </button>

      <Popper open={open} anchorEl={anchorRef.current} transition>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <List dense>
                  <ListItem
                    key={"annot"}
                    role={undefined}
                    button
                    onClick={handleToggleCheck("annot")}
                  >
                    <ListItemIcon>
                      <TebeCheckbox
                        size="small"
                        checked={checked.indexOf("annot") !== -1}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{
                          "aria-labelledby": `checkbox-list-label-annot`,
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      id={`checkbox-list-label-annot`}
                      primary={"Anotações"}
                    />
                  </ListItem>
                  <ListItem
                    key={"anom"}
                    role={undefined}
                    button
                    onClick={handleToggleCheck("anom")}
                  >
                    <ListItemIcon>
                      <TebeCheckbox
                        size="small"
                        checked={checked.indexOf("anom") !== -1}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{
                          "aria-labelledby": `checkbox-list-label-anom`,
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      id={`checkbox-list-label-anom`}
                      primary={"Anomalias"}
                    />
                  </ListItem>
                  <ListItem
                    key={"alarm"}
                    role={undefined}
                    button
                    onClick={handleToggleCheck("alarm")}
                  >
                    <ListItemIcon>
                      <TebeCheckbox
                        size="small"
                        checked={checked.indexOf("alarm") !== -1}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{
                          "aria-labelledby": `checkbox-list-label-alarm`,
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      id={`checkbox-list-label-alarm`}
                      primary={"Alarmes"}
                    />
                  </ListItem>
                </List>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
}
