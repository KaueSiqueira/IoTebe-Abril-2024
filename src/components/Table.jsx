import React, { useState } from "react";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";

function MakeTable({ columns, data: rows, onRowClick }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = ({ target: { value } }) => {
    setRowsPerPage(+value);
    setPage(0);
  };

  return (
    <div className="container">
      <Paper style={{ width: "100%" }}>
        <TableContainer style={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table" size="small">
            <TableHead>
              <TableRow>
                <TableCell />

                <TableCell align="center" colSpan={3} style={{ fontWeight: "bold", fontSize: "1.1em" }}>
                  Aceleração (g)
                </TableCell>

                <TableCell align="center" colSpan={3} style={{ fontWeight: "bold", fontSize: "1.1em" }}>
                  Velocidade (mm/s)
                </TableCell>
              </TableRow>

              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth, fontWeight: "bold" }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                <TableRow
                  onClick={() => {
                    onRowClick(row);
                  }}
                  hover
                  role="checkbox"
                  tabIndex={-1}
                  key={row.ng1vt_raw_data_id}
                  style={{ cursor: "pointer" }}
                >
                  {columns.map(({ id, align }) => (
                    <TableCell key={id} align={align}>
                      {id === "time" ? row[id] : row[id].toFixed(3)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}

// function Table(props) {
//   console.log(props)
//   return (
//     <MaterialTable
//       title={props.title}
//       columns={props.columns}
//       data={props.data}
//       components={{
//         Container: props => <Paper {...props} elevation={0} />
//       }}
//       onRowClick={props.onRowClick}
//       options={{
//         pageSize: 10,
//         toolbar: (props.title === undefined) ? false : true,
//         headerStyle: { textTransform: 'uppercase', textAlign: 'center', fontFamily: 'Montserrat', fontSize: '18px', fontWeight: 600 },
//         cellStyle: { textAlign: 'center' }
//       }}
//       localization={{
//         header: {
//           actions: 'Ações'
//         },
//         toolbar: {
//           searchPlaceholder: 'Buscar',
//           searchTooltip: 'Buscar'
//         },
//         body: {
//           emptyDataSourceMessage: 'Não existem dados a serem exibidos',
//         },
//         pagination: {
//           firstTooltip: 'Primeira Página',
//           previousTooltip: 'Página Anterior',
//           lastTooltip: 'Última Página',
//           nextTooltip: 'Próxima Página',
//           labelRowsSelect: 'linhas',
//           labelDisplayedRows: "{from}-{to} a {count}"
//         }
//       }}
//     />
//   );
// }

export default MakeTable;
