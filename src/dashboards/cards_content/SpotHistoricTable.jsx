import { CheckCircle, Error, ToggleOff, ToggleOn, Warning } from "@mui/icons-material";
import axios from "axios";
import MaterialTable from "material-table";
import React, { useEffect, useState } from "react";
import { readHistoric } from "../../apis";

import { checkNetworkError, colors, formatUnixTimestamp, getCurrentAccessToken } from "../../utilities";

const EVENT = {
  FLAG_CHANGE: "Alteração de alarme",
  UPDATE_A1: "Valor de alarme de alerta atualizado",
  UPDATE_A2: "Valor de alarme crítico atualizado",
  DISABLE: "Configuração de coletas alterado",
};

const ICON = {
  GREEN: <CheckCircle style={{ color: colors.alarmOk, fontSize: 25 }} />,
  YELLOW: <Warning style={{ color: colors.alarmAlert, fontSize: 25 }} />,
  RED: <Error style={{ color: colors.alarmCritical, fontSize: 25 }} />,
  FALSE: <ToggleOn style={{ color: colors.alarmOk, fontSize: 25 }} />,
  TRUE: <ToggleOff style={{ color: colors.alarmCritical, fontSize: 25 }} />,
};

function SpotHistoricTable({ isLoadingController, spotId, dateRange }) {
  const [spotHistoric, setSpotHistoric] = useState([]);

  async function loadData() {
    isLoadingController(true);
    try {
      const res = await readHistoric(spotId, dateRange);
      if (!!res.data.data) setSpotHistoric(res.data.data);
    } catch (error) {
      setSpotHistoric([]);
    } finally {
      isLoadingController(false);
    }
  }

  useEffect(() => {
    loadData();
    return () => isLoadingController(true);
  }, [spotId, dateRange]);

  return (
    <div style={{ width: "100%", height: "100%", overflow: "auto" }}>
      <div style={{ height: "100%", width: "100%" }}>
        <MaterialTable
          title="Histórico"
          data={spotHistoric}
          columns={[
            {
              field: "timestamp",
              title: "Data",
              render: (rowData) => formatUnixTimestamp(rowData.timestamp / 1000),
            },
            {
              field: "chart_name",
              title: "Gráfico",
              render: ({ chart_name }) => (chart_name.charAt(0).toUpperCase() + chart_name.slice(1).toLowerCase()),
            },
            {
              field: "event",
              title: "Evento",
              render: ({ event }) => (!!EVENT[event] ? EVENT[event] : ""),
            },
            {
              field: "value",
              title: "Valor",
              render: ({ value }) => (!!ICON[value] ? ICON[value] : Number(value).toFixed(2)),
            },
          ]}
          options={{
            pageSize: 15,
            headerStyle: { padding: 2, textAlign: "center", fontFamily: "Montserrat" },
            cellStyle: { padding: 5, textAlign: "center", fontSize: 12 },
          }}
          localization={{
            header: {
              actions: "Ações",
            },
            toolbar: {
              searchPlaceholder: "Buscar",
              searchTooltip: "Buscar",
            },
            body: {
              emptyDataSourceMessage: "",
            },
            pagination: {
              firstTooltip: "Primeira Página",
              previousTooltip: "Página Anterior",
              lastTooltip: "Última Página",
              nextTooltip: "Próxima Página",
              labelRowsSelect: "linhas",
              labelDisplayedRows: "{from}-{to} a {count}",
            },
          }}
        />
      </div>
    </div>
  );
}

export default SpotHistoricTable;
