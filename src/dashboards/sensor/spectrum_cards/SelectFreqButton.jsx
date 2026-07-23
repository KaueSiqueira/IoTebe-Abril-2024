import React, { useRef, useState, useEffect } from "react";
import {
  ClickAwayListener,
  Grow,
  Paper,
  Popper,
  Tooltip,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Checkbox,
  IconButton,
  Collapse,
} from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { ChartBearing } from "../../../assets/customIcons/";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Button } from "../../../components";

const colors = {
  FTF: ["rgba(255, 204, 0, 0.2)", "rgba(255, 204, 0)"],
  BSF: ["rgba(255, 153, 51, 0.2)", "rgba(255, 153, 51)"],
  BPFO: ["rgba(204, 102, 0, 0.2)", "rgba(204, 102, 0)"],
  BPFI: ["rgba(255, 51, 0, 0.2)", "rgba(255, 51, 0)"],
  RPM: ["rgba(24, 185, 185, 0.2)", "rgba(24, 185, 185)"],
  BPF: ["rgba(255, 224, 50, 0.2)", "rgba(255, 224, 50)"],
  GMF: ["rgba(3, 133, 3, 0.2)", "rgba(3, 133, 3)"],
};

const useStyles = makeStyles((theme) => ({
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

const TebeCheckbox = withStyles({
  root: {
    color: "#156284",
    "&$checked": {
      color: "#156284",
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

export function SelectFreqButton({
  spectrumType,
  spectrumData,
  setFreqAnnotations,
  lockEffect,
  pageRotation,
  specFrequency,
  close = false,
}) {
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState([]);
  const [collapses, setCollapses] = useState({});
  //const [tempRotation, setTempRotation] = useState(pageRotation)

  const anchorRef = useRef(null);
  const classes = useStyles();

  useEffect(() => {
    let a = {};
    if (!!spectrumData) {
      if (!!spectrumData.bearingList) {
        spectrumData.bearingList.forEach((el) => {
          a[[el["b_id"]]] = false;
        });
        setCollapses(a);
      }
    }
  }, [spectrumData]);

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
  };

  const handleToggleAll = (value) => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
      ["FTF", "BSF", "BPFO", "BPFI"].forEach((el) => {
        if (newChecked.indexOf(`${el}-${value}`) === -1)
          newChecked.push(`${el}-${value}`);
      });
    } else {
      newChecked.splice(currentIndex, 1);
      ["FTF", "BSF", "BPFO", "BPFI"].forEach((el) => {
        const a = newChecked.indexOf(`${el}-${value}`);
        if (a !== -1) newChecked.splice(a, 1);
      });
    }

    setChecked(newChecked);
  };

  const handleToggleOpen = () => {
    setOpen((prevOpen) => !prevOpen);
    if (lockEffect) lockEffect((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) return;
    setOpen(false);
    if (lockEffect) lockEffect(false);
  };

  const setFrequencies = (list) => {
    const a = list.filter((el) => {
      return (
        el === "RPM" || el === "BPF" || el.includes("GMF") || el.includes("-")
      );
    });
    return a;
  };

  const makeSpectrumAnnotation = (value, content, color) => {
    if (specFrequency === "Hz")
      return [
        {
          type: "line",
          scaleID: "x",
          value: value - 0.5,
          borderColor: "rgba(0,0,0,0)",
          label: {
            enabled: true,
            content: content,
            rotation: -90,
            position: "start",
            textAlign: "start",
            xAdjust: -6,
            backgroundColor: "rgba(0,0,0,0)",
            color: colors[color][1],
          },
        },
        {
          type: "box",
          scaleID: "x",
          xMin: value - 0.5,
          xMax: value + 0.5,
          borderColor: colors[color][0],
          backgroundColor: colors[color][0],
        },
      ];
    else
      return [
        {
          type: "line",
          scaleID: "x",
          value: value * 60 - 0.5,
          borderColor: "rgba(0,0,0,0)",
          label: {
            enabled: true,
            content: content,
            rotation: -90,
            position: "start",
            textAlign: "start",
            xAdjust: -6,
            backgroundColor: "rgba(0,0,0,0)",
            color: colors[color][1],
          },
        },
        {
          type: "box",
          scaleID: "x",
          xMin: value * 60 - 0.5,
          xMax: value * 60 + 0.5,
          borderColor: colors[color][0],
          backgroundColor: colors[color][0],
        },
      ];
  };

  const filterAnnot = (filtred) => {
    let annots = {};

    filtred.forEach((freq) => {
      const [fail, id] = freq.split("-");

      const firstHarmonic =
        pageRotation.type === "Hz"
          ? pageRotation.frequency_value
          : pageRotation.frequency_value / 60;

      let N_harmonics = Math.floor(
        spectrumData.dataAxial[spectrumData.dataAxial.length - 1].x /
          firstHarmonic
      );
      if (N_harmonics > 50) {
        N_harmonics = 50;
      }

      if (freq === "RPM") {
        if (!!pageRotation) {
          for (let i = 1; i <= N_harmonics; i++) {
            const harmonic_i = firstHarmonic * i;

            const annot = makeSpectrumAnnotation(
              harmonic_i,
              `RPM ${i}x`,
              "RPM"
            );
            annots[`vlineRPM ${i}x`] = annot[0];
            annots[`vBoxRPM ${i}x`] = annot[1];
          }
        } else {
          alert(
            "Para ver o RPM da máquina é nencessário configurar a rotação."
          );
        }
      } else if (freq === "BPF") {
        const harmonicBpf = firstHarmonic * spectrumData.divisionCount;

        const annot = makeSpectrumAnnotation(harmonicBpf, `${freq}`, `${freq}`);
        annots[`vline${freq}`] = annot[0];
        annots[`vBox${freq}`] = annot[1];
      } else if (freq.includes("GMF")) {
        const objectIndex = freq.match(/\d+/);
        const gmfObject = spectrumData.gmfList[objectIndex - 1];
        const harmonicGmf =
          (!!gmfObject.selected_gmf
            ? firstHarmonic
            : gmfObject.nominal_rotation / 60) * gmfObject.gear_teeth_count;

        const annot = makeSpectrumAnnotation(harmonicGmf, `${freq}`, `GMF`);
        annots[`vline${freq}`] = annot[0];
        annots[`vBox${freq}`] = annot[1];
      } else {
        const { rotation } = spectrumData;
        for (let i = 0; i < 4; i++) {
          const bearing = spectrumData.bearingList.find(
            (el) => el.b_id.toString() === id
          );
          const content = `${bearing.model} (${bearing.manufacturer
            .slice(0, 3)
            .toUpperCase()}) ${i + 1} X ${fail}`;
          const value =
            pageRotation.type === "rpm"
              ? (pageRotation.frequency_value / rotation) *
                (bearing[fail.toLowerCase()] * (i + 1))
              : ((pageRotation.frequency_value * 60) / rotation) *
                (bearing[fail.toLowerCase()] * (i + 1));

          const annotation = makeSpectrumAnnotation(
            value,
            content,
            fail.toUpperCase()
          );

          annots[`vline${content}`] = annotation[0];
          annots[`vBox${content}`] = annotation[1];
        }
      }
    });

    return annots;
  };

  useEffect(() => {
    const annots = filterAnnot(setFrequencies(checked));
    setFreqAnnotations(annots);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageRotation]);

  useEffect(() => {
    setOpen(false);
    if (lockEffect) lockEffect(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [close]);

  useEffect(() => {
    const annots = filterAnnot(setFrequencies(checked));
    setFreqAnnotations(annots);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked]);

  useEffect(() => {
    setChecked([]);
  }, [spectrumData]);

  return (
    <>
      <Button
        id="harmonic-button"
        small
        style={{ padding: "auto", fill: "white" }}
        onClick={handleToggleOpen}
        className="selectedButton"
        buttonType="chart-button"
        buttonRef={anchorRef}
        aria-controls={open ? "split-button-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-label="fail frequency"
        aria-haspopup="menu"
      >
        <Tooltip title={"Frequências"}>
          <span>
            <ChartBearing />
          </span>
        </Tooltip>
      </Button>

      <Popper
        modifiers={{
          preventOverflow: { enabled: false },
          flip: { enabled: false },
        }}
        placement="bottom"
        disablePortal={true}
        style={{ zIndex: 3 }}
        open={open}
        anchorEl={anchorRef.current}
        transition
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <List dense>
                  <ListItem
                    key={"RPM"}
                    role={undefined}
                    button
                    onClick={handleToggleCheck("RPM")}
                  >
                    <ListItemIcon>
                      <TebeCheckbox
                        size="small"
                        checked={checked.indexOf("RPM") !== -1}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{
                          "aria-labelledby": `checkbox-list-label-RPM`,
                        }}
                      />
                    </ListItemIcon>

                    <ListItemText
                      id={`checkbox-list-label-RPM`}
                      primary={"RPM"}
                    />
                  </ListItem>
                  {[
                    "Ventilador/Exaustor",
                    "Bomba Centrifuga",
                    "Rotores em Geral",
                    "Outros",
                  ].includes(spectrumData.machineType) &&
                  spectrumData.divisionCount &&
                  spectrumData.rotation ? (
                    <ListItem
                      key={"BPF"}
                      role={undefined}
                      button
                      onClick={handleToggleCheck("BPF")}
                    >
                      <ListItemIcon>
                        <TebeCheckbox
                          size="small"
                          checked={checked.indexOf("BPF") !== -1}
                          tabIndex={-1}
                          disableRipple
                          inputProps={{
                            "aria-labelledby": `checkbox-list-label-BPF`,
                          }}
                        />
                      </ListItemIcon>

                      <ListItemText
                        id={`checkbox-list-label-BPF`}
                        primary={"BPF"}
                      />
                    </ListItem>
                  ) : (
                    ""
                  )}
                  {spectrumData.machineType === "Redutor"
                    ? spectrumData?.gmfList?.map((option, index) => {
                        const label =
                          "GMF " +
                          (index + 1) +
                          (option.selected_gmf === 1 ? " (sel.)" : "");
                        return (
                          <ListItem
                            key={label}
                            role={undefined}
                            button
                            onClick={handleToggleCheck(label)}
                          >
                            <ListItemIcon>
                              <TebeCheckbox
                                size="small"
                                checked={checked.indexOf(label) !== -1}
                                tabIndex={-1}
                                disableRipple
                                inputProps={{
                                  "aria-labelledby": `checkbox-list-label-${label}`,
                                }}
                              />
                            </ListItemIcon>

                            <ListItemText
                              id={`checkbox-list-label-${label}`}
                              primary={label}
                            />
                          </ListItem>
                        );
                      })
                    : ""}
                  {spectrumType === "envelope" &&
                    spectrumData.bearingList.map((value) => (
                      <>
                        <ListItem
                          key={value.b_id}
                          role={undefined}
                          button
                          onClick={() => handleToggleAll(value.b_id.toString())}
                        >
                          <ListItemIcon>
                            <TebeCheckbox
                              size="small"
                              checked={
                                checked.indexOf(value.b_id.toString()) !== -1
                              }
                              tabIndex={-1}
                              disableRipple
                              inputProps={{
                                "aria-labelledby": `checkbox-list-label-${value.b_id}`,
                              }}
                            />
                          </ListItemIcon>

                          <ListItemText
                            id={`checkbox-list-label-${value.b_id}`}
                            primary={`${value.model} (${value.manufacturer
                              .slice(0, 3)
                              .toUpperCase()})`}
                          />

                          <ListItemSecondaryAction
                            onClick={() => {
                              setCollapses({
                                ...collapses,
                                [value.b_id.toString()]:
                                  !collapses[value.b_id.toString()],
                              });
                            }}
                          >
                            <IconButton
                              edge="end"
                              size="small"
                              aria-label="comments"
                            >
                              {collapses[value.b_id.toString()] ? (
                                <ExpandLess />
                              ) : (
                                <ExpandMore />
                              )}
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>

                        <Collapse
                          in={collapses[value.b_id.toString()]}
                          timeout="auto"
                          unmountOnExit
                        >
                          <List dense component="div" disablePadding>
                            {["FTF", "BSF", "BPFO", "BPFI"].map((el) => (
                              <ListItem
                                button
                                className={classes.nested}
                                onClick={handleToggleCheck(
                                  `${el}-${value.b_id}`
                                )}
                              >
                                <ListItemIcon>
                                  <TebeCheckbox
                                    size="small"
                                    checked={
                                      checked.indexOf(`${el}-${value.b_id}`) !==
                                      -1
                                    }
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{
                                      "aria-labelledby": `checkbox-list-label-${el}`,
                                    }}
                                  />
                                </ListItemIcon>

                                <ListItemText
                                  id={`checkbox-list-label-${el}`}
                                  primary={el}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Collapse>
                      </>
                    ))}
                </List>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
}
