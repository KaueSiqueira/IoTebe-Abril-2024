import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Checkbox,
  withStyles,
  makeStyles,
} from "@material-ui/core";

const SPECTRUMHEADCELLS = [
  { id: "time", label: "Data coleta", colSpan: 1 },
  { id: "velocity", label: "Velocidade (mm/s)", colSpan: 1 },
  { id: "acceleration", label: "Aceleração (g)", colSpan: 1 },
];

const useStyles = makeStyles({
  root: {
    "&.Mui-selected": {
      backgroundColor: "#15628420",
      "&:hover": {
        backgroundColor: "#15628420",
      },
    },
  },
});

const TebeCheckbox = withStyles({
  root: {
    color: "#156284",
    "&$checked": {
      color: "#156284",
      backgroundColor: "#15628410",
    },
  },
})((props) => <Checkbox color="default" {...props} />);

function AlarmCard({ value, children, style, alarms }) {
  const [critical, alert] = alarms;

  const whichGradient = (critical, alert, value) => {
    return !!critical && !!alert
      ? critical < value
        ? "rgba(253, 13, 27, 1)"
        : alert < value
        ? "rgba(255, 224, 50, 1)"
        : "rgba(28, 191, 33, 1)"
      : "rgba(21, 98, 132, 1)";
  };

  return (
    <div
      className="alarmCard"
      style={{
        background: `linear-gradient(90deg, rgba(21, 98, 132, 1), ${whichGradient(critical, alert, value)})`,
        ...style,
      }}
    >
      {`${children}: ${value}`}
    </div>
  );
}

export function CascateTable({ spectrumListData, selected, setSelected }) {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      let newSelecteds;

      if (spectrumListData.spectrumList.length < 10) {
        newSelecteds = spectrumListData.spectrumList
          .slice(0, spectrumListData.spectrumList.length)
          .map((x) => x.ng1vt_raw_data_id);
      } else {
        newSelecteds = spectrumListData.spectrumList.slice(0, 10).map((x) => x.ng1vt_raw_data_id);
      }

      setSelected(newSelecteds);

      return;
    }
    setSelected([]);
  };

  const handleClick = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      if (selected.length >= 10) return;
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }

    setSelected(newSelected);
  };

  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const max = spectrumListData.spectrumList.length > 10 ? 10 : parseInt(spectrumListData.spectrumList.length);

  return (
    <div>
      <TableContainer className="scroll overflow-auto" style={{ maxHeight: 322 }}>
        <Table aria-labelledby="tableTitle" size="medium" aria-label="enhanced table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" align="center">
                <div className="row-center ">
                  <TebeCheckbox
                    indeterminate={selected.length > 0 && selected.length < max}
                    checked={spectrumListData.spectrumList.length > 0 && selected.length === max}
                    onChange={handleSelectAllClick}
                    inputProps={{ "aria-label": "select all desserts" }}
                  />

                  <span style={{ color: "#156284" }}>{`${selected.length}/10`}</span>
                </div>
              </TableCell>

              {SPECTRUMHEADCELLS.map((headCell, index) => (
                <TableCell key={headCell.id} align={"center"} colSpan={headCell.colSpan}>
                  {headCell.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody className="scroll overflow-auto">
            {spectrumListData.spectrumList
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                const isItemSelected = selected.indexOf(row.ng1vt_raw_data_id) !== -1;
                const labelId = `enhanced-table-checkbox-${index}`;

                const {
                  alarm_1vel: alertVel,
                  alarm_2vel: criticalVel,
                  alarm_1acel: alertAccel,
                  alarm_2acel: criticalAccel,
                } = spectrumListData;

                const alarmsVel = [criticalVel, alertVel];
                const alarmsAccel = [criticalAccel, alertAccel];

                return (
                  <TableRow
                    hover
                    className={classes.root}
                    onClick={() => handleClick(row.ng1vt_raw_data_id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.ng1vt_raw_data_id}
                    selected={isItemSelected}
                  >
                    <TableCell align="center" padding="checkbox">
                      <TebeCheckbox checked={isItemSelected} inputProps={{ "aria-labelledby": labelId }} />
                    </TableCell>

                    <TableCell align="center" component="th" id={labelId} scope="row" padding="none">
                      {row.time}
                    </TableCell>

                    <TableCell align="center">
                      <AlarmCard alarms={alarmsVel} value={row.rms_vel_vert.toFixed(3)}>
                        VER
                      </AlarmCard>

                      <AlarmCard
                        alarms={alarmsVel}
                        value={row.rms_vel_hor.toFixed(3)}
                        style={{ marginRight: "2px", marginLeft: "2px" }}
                      >
                        HOR
                      </AlarmCard>

                      <AlarmCard alarms={alarmsVel} value={row.rms_vel_axial.toFixed(3)}>
                        AXI
                      </AlarmCard>
                    </TableCell>

                    <TableCell align="center">
                      <AlarmCard alarms={alarmsAccel} value={row.rms_acel_vert.toFixed(3)}>
                        VER
                      </AlarmCard>

                      <AlarmCard
                        alarms={alarmsAccel}
                        value={row.rms_acel_hor.toFixed(3)}
                        style={{ marginRight: "2px", marginLeft: "2px" }}
                      >
                        HOR
                      </AlarmCard>

                      <AlarmCard alarms={alarmsAccel} value={row.rms_acel_axial.toFixed(3)}>
                        AXI
                      </AlarmCard>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={spectrumListData.spectrumList.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
}
