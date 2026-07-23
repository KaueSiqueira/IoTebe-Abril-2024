import React, { useEffect, useState } from "react";
import { PopupModal, Input, ComponentLoader } from "../../../../components";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@material-ui/core";
import { readBearingData } from "../../../../apis";

const columns = [
  { id: "model", label: "Modelo", align: "center", minWidth: 100 },
  { id: "elements", label: "Elementos", align: "center", minWidth: 80 },
  { id: "manufacturer", label: "Marca", align: "center", minWidth: 100 },
];

export function PopupBearing({ modal, setModal, data, setData }) {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [bearingBD, setBearingBD] = useState({ total: 0, data: [] });

  const [newBearingData, setNewBearingData] = useState({
    model: null,
    elements: null,
    manufacturer: null,
    ftf: null,
    bsf: null,
    bpfo: null,
    bpfi: null,
    selected_bearing: 0,
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    loadData(newPage, search);
  };

  const handleInputChange = ({ target: { value, name } }) => {
    setNewBearingData({ ...newBearingData, [name]: value });
  };

  const handleSearchChange = ({ target: { value } }) => {
    setSearch(value);
  };

  const handleOnConfirm = () => {
    let isEmpty = false;
    if (newBearingData.bpfi === null || newBearingData.bpfi ===  "") isEmpty = true;
    if (newBearingData.bpfo === null || newBearingData.bpfo ===  "") isEmpty = true;
    if (newBearingData.bsf === null || newBearingData.bsf ===  "") isEmpty = true;
    if (newBearingData.ftf === null || newBearingData.ftf ===  "") isEmpty = true;
    if (newBearingData.manufacturer === null || newBearingData.manufacturer ===  "") isEmpty = true;
    if (newBearingData.model === null || newBearingData.model ===  "") isEmpty = true;

    data.map((bearing) => {
      if(bearing.selected_bearing === 1)
        newBearingData.selected_bearing = 0;
    })

    if (isEmpty) {
      alert("Preencha todos os campos do rolamento!");
    } else {
      let nullObj = { ...newBearingData };
      Object.keys(nullObj).forEach((key) => {
        nullObj[key] = null;
      });
      setNewBearingData(nullObj);
      setData([...data, newBearingData]);
      setModal(!modal);
    }
  };

  const handleDismiss = () => {
    let nullObj = { ...newBearingData };
    Object.keys(nullObj).forEach((key) => {
      nullObj[key] = null;
    });
    setNewBearingData(nullObj);
    setModal(!modal);
  };

  const loadData = async (page, search) => {
    setLoading(true);
    try {
      const { data } = await readBearingData(page + 1, search);
      setBearingBD(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setPage(0);
      loadData(0, search);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  return (
    <PopupModal
      showModal={modal}
      title={"Configuração de Rolamento"}
      toggleModal={() => {
        setModal(!modal);
      }}
      onDismissTitle={"Cancelar"}
      dismissFunc={handleDismiss}
      onConfirmTitle={"Adicionar"}
      onConfirm={handleOnConfirm}
    >
      <div className="row" style={{ marginTop: 6 }}>
        <div className="col-12" style={{ marginBottom: 6 }}>
          <Input
            name="searchBox"
            onChange={handleSearchChange}
            placeholder="Pesquise por modelos..."
            value={search}
          />
        </div>
        <div
          style={{
            width: "100%",
            maxHeight: "200px",
            minHeight: "200px",
            overflow: "auto",
            position: "relative",
          }}
        >
          {loading ? (
            <ComponentLoader />
          ) : (
            <Paper>
              <TableContainer>
                <Table stickyHeader aria-label="sticky table" size="small">
                  <TableHead>
                    <TableRow>
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={{ minWidth: column.minWidth }}
                        >
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bearingBD.data.map((row) => (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.bearing_ref_id}
                        onClick={() => {
                          const { bearing_ref_id, ...rest } = row;
                          setNewBearingData({...rest, selected_bearing: 1});
                        }}
                      >
                        {columns.map(({ id, align }) => (
                          <TableCell key={id} align={align}>
                            {row[id]}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                rowsPerPageOptions={[]}
                component="div"
                count={bearingBD.total}
                rowsPerPage={10}
                page={page}
                onPageChange={handleChangePage}
              />
            </Paper>
          )}
        </div>
      </div>

      <div className="row" style={{ marginTop: 6 }}>
        <div className="col-12 col-md-6" style={{ marginBottom: 6 }}>
          <Input
            name="model"
            onChange={handleInputChange}
            value={newBearingData.model}
            label="Modelo"
            placeholder="Ex: 6202"
            tooltip="Modelo do rolamento."
            required
          />
        </div>

        <div className="col-12 col-md-6" style={{ marginBottom: 6 }}>
          <Input
            name="manufacturer"
            onChange={handleInputChange}
            placeholder="Ex: Tebe"
            value={newBearingData.manufacturer}
            label="Marca"
            tooltip="Fabricante do rolamento."
            required
          />
        </div>

        <div className="col-12 col-md-3" style={{ marginBottom: 6 }}>
          <Input
            name="ftf"
            onChange={handleInputChange}
            value={newBearingData.ftf}
            type="number"
            placeholder="Ex: 10.0 Hz"
            min={0}
            max={100000}
            label="FTF"
            tooltip="Frequência de falha da gaiola."
            required
          />
        </div>

        <div className="col-12 col-md-3" style={{ marginBottom: 6 }}>
          <Input
            name="bsf"
            onChange={handleInputChange}
            value={newBearingData.bsf}
            type="number"
            placeholder="Ex: 20.0 Hz"
            min={0}
            max={100000}
            label="BSF"
            tooltip="Frequência de falha do elemento rolante."
            required
          />
        </div>

        <div className="col-12 col-md-3" style={{ marginBottom: 6 }}>
          <Input
            name="bpfo"
            onChange={handleInputChange}
            value={newBearingData.bpfo}
            type="number"
            placeholder="Ex: 30.0 Hz"
            min={0}
            max={100000}
            label="BPFO"
            tooltip="Frequência de falha da pista externa."
            required
          />
        </div>

        <div className="col-12 col-md-3" style={{ marginBottom: 6 }}>
          <Input
            name="bpfi"
            onChange={handleInputChange}
            value={newBearingData.bpfi}
            type="number"
            placeholder="Ex: 40.0 Hz"
            min={0}
            max={100000}
            label="BPFI"
            tooltip="Frequência de falha da pista interna."
            required
          />
        </div>
      </div>
    </PopupModal>
  );
}
