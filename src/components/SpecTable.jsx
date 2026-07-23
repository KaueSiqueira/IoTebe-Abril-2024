import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";

export default function SpecTable({
  id,
  spectrumData,
  sideBandAnnotations,
  setSideBandAnnotations,
  harmAnnotations,
  setHarmAnnotations,
  axis,
  unit,
  amplitude,
  specType,
  frequency,
}) {
  const [sideBandLines, setSideBandLines] = useState([]);
  const [harmLines, setHarmLines] = useState([]);
  const [isChangingColor, setIsChangingColor] = useState(false);
  const [axisValues, setAxisValues] = useState([]);

  useEffect(() => {
    if (!isChangingColor) {
      let annotations;
      let type;
      if (sideBandAnnotations && sideBandAnnotations.length > 0) {
        annotations = sideBandAnnotations;
        type = "sideBand";
      } else if (harmAnnotations && harmAnnotations.length > 0) {
        annotations = harmAnnotations;
        type = "harm";
      }

      if (annotations) {
        const lines = annotations.reduce((acc, obj1) => {
          const obj2 = annotations.find(
            (obj) => obj.type === "box" && obj1.value === obj.xMin
          );
          if (obj1.type === "line" && obj2) {
            acc.push({
              xMin: obj2.xMin,
              xMax: obj2.xMax,
              xMid: (obj2.xMin + obj2.xMax) / 2,
              deltaF: 0,
              content: obj1.label.content,
            });
          }
          return acc;
        }, []);

        if (lines.length > 1 && type === "sideBand") {
          let deltaF = lines[1].xMid - lines[0].xMid;

          lines.forEach((element) => {
            element.deltaF = deltaF;
          });
        }

        if (type === "sideBand") {
          setSideBandLines(lines);
          setHarmLines([]);
        } else {
          setSideBandLines([]);
          setHarmLines(lines);
        }
      } else {
        setSideBandLines([]);
        setHarmLines([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sideBandAnnotations, harmAnnotations]);

  useEffect(() => {
    if (!isChangingColor) {
      const getAxisValues = () => {
        const { dataVertical, dataHorizontal, dataAxial } = spectrumData;
        const lines =
          sideBandLines.length > 0 ? sideBandLines : harmLines.slice(0, 10);

        const result = lines.map((line) => {
          const itemVertical = dataVertical?.find(
            (item) => item.x >= line.xMin && item.x <= line.xMax
          );
          const itemHorizontal = dataHorizontal?.find(
            (item) => item.x >= line.xMin && item.x <= line.xMax
          );
          const itemAxial = dataAxial?.find(
            (item) => item.x >= line.xMin && item.x <= line.xMax
          );

          return {
            banda: line.content,
            frequencia: line.xMid.toLocaleString("pt-BR", {
              minimumFractionDigits: 3,
              maximumFractionDigits: 3,
            }),
            vertical:
              itemVertical !== undefined ? itemVertical.y.toFixed(4) : "-",
            horizontal:
              itemHorizontal !== undefined ? itemHorizontal.y.toFixed(4) : "-",
            axial: itemAxial !== undefined ? itemAxial.y.toFixed(4) : "-",
            deltaF:
              line.deltaF > 0
                ? line.deltaF.toLocaleString("pt-BR", {
                    minimumFractionDigits: 3,
                    maximumFractionDigits: 3,
                  })
                : 0,
            xMin: line.xMin,
          };
        });

        return result;
      };

      sideBandLines.length > 0 || harmLines.length > 0
        ? setAxisValues(getAxisValues)
        : setAxisValues([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spectrumData, sideBandLines, harmLines]);

  const handleHover = (isIn, xMin) => {
    setIsChangingColor(true);
    const lineColor = isIn ? "rgba(16, 121, 121, 1)" : "rgba(24, 185, 185, 1)";
    const boxColor = isIn
      ? "rgba(16, 121, 121, .5)"
      : "rgba(24, 185, 185, 0.2)";

    sideBandLines.length > 0
      ? setSideBandAnnotations((prevAnnotations) =>
          prevAnnotations.map((item) => {
            if (item.value === xMin || item.xMin === xMin) {
              return {
                ...item,
                label: { ...item.label, color: lineColor },
                borderColor: boxColor,
                backgroundColor: boxColor,
              };
            }
            return item;
          })
        )
      : setHarmAnnotations((prevAnnotations) =>
          prevAnnotations.map((item) => {
            if (item.value === xMin || item.xMin === xMin) {
              return {
                ...item,
                label: { ...item.label, color: lineColor },
                borderColor: boxColor,
                backgroundColor: boxColor,
              };
            }
            return item;
          })
        );

    setTimeout(() => setIsChangingColor(false), 100);
  };

  const yTicksLabel =
    (specType === "velocity" && `${unit} - ${amplitude.toLowerCase()}`) ||
    (specType === "acceleration" && `${unit} - ${amplitude.toLowerCase()}`) ||
    (specType === "envelope" && `gE - ${amplitude.toLowerCase()}`);

  return (
    axisValues.length > 0 && (
      <>
        <hr style={{ margin: "1% 0" }} />
        <TableContainer id={id} className="customSpectralTable">
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center">
                  {sideBandLines.length > 0 ? "Banda" : "Harmônico"}
                </TableCell>
                <TableCell align="center">Frequência</TableCell>
                {axis.map((item, index) => {
                  return !item.hidden ? (
                    <TableCell align="center" key={"axisColumn" + index.toString()}>
                      {item.text}
                    </TableCell>
                  ) : null;
                })}
                {sideBandLines.length > 0 ? (
                  <TableCell align="center">Δf</TableCell>
                ) : (
                  ""
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {axisValues.map((row, index) => (
                <TableRow
                  key={"tableRow" + index.toString()}
                  onMouseEnter={(e) => {
                    e.currentTarget.classList.toggle("highlighted-row", true);
                    handleHover(true, row.xMin);
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.classList.toggle("highlighted-row", false);
                    handleHover(false, row.xMin);
                  }}
                  style={{ backgroundColor: "white" }}
                >
                  <TableCell align="center" style={{fontWeight: 500}}>{row.banda}</TableCell>
                  <TableCell align="center">
                    {row.frequencia} {frequency}
                  </TableCell>
                  {axis.map((item, index) => {
                    if (!item.hidden) {
                      switch (item.text) {
                        case "Horizontal":
                          return (
                            <TableCell
                              align="center"
                              key={"horizontal" + index.toString()}
                            >
                              {row.horizontal}{" "}
                              {row.horizontal !== "-" && yTicksLabel}
                            </TableCell>
                          );
                        case "Vertical":
                          return (
                            <TableCell align="center" key={"vertical" + index.toString()}>
                              {row.vertical}{" "}
                              {row.vertical !== "-" && yTicksLabel}
                            </TableCell>
                          );
                        case "Axial":
                          return (
                            <TableCell align="center" key={"axial" + index.toString()}>
                              {row.axial} {row.axial !== "-" && yTicksLabel}
                            </TableCell>
                          );
                        default:
                          return null;
                      }
                    }
                    return null;
                  })}
                  {sideBandLines.length > 0 ? (
                    <TableCell align="center">{row.deltaF} {frequency}</TableCell>
                  ) : (
                    ""
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    )
  );
}
