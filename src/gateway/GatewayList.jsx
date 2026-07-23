import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import { Tooltip } from "@material-ui/core";
import { WifiTethering, PortableWifiOff } from "@mui/icons-material";
import { Card, ComponentLoader } from "../components";
import GatewayConfig from "./GatewayConfig";
import { generateGatewaysList } from "../apis";

import "react-table/react-table.css";

export function GatewayList() {
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isListVisible, setIsListVisible] = useState(true);
  const [selectedGatewayId, setSelectedGatewayId] = useState("");

  const getList = async () => {
    try {
      const res = await generateGatewaysList();
      // mac_address != str()
      const data = res.data;
      for (let gateway in data) {
        if (typeof data[gateway].mac_address != typeof "") {
          data[gateway].mac_address = "-";
        }
      }
      setList(data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const backToList = () => setIsListVisible(true);

  // useEffect(() => {
  //   setIsListVisible(false);
  // }, [selectedGatewayId]);

  useEffect(() => {
    if(isListVisible){
      getList();
    }
  }, [isListVisible]);

  // useEffect(() => {
  //   getList();
  // }, []);

  return (
    <div style={{ width: "100%", height: "100%" }} className="relative">
      {!!isLoading && <ComponentLoader />}
      <div style={{ width: "100%", height: "fit-content" }}>
        {isListVisible && (
          <Card height="100%">
            <div style={{ width: "100%" }}>
              <MaterialTable
                title="Lista de Gateways"
                data={list}
                style={{ boxShadow: "none" }}
                onRowClick={(event, rowData) => {
                  setSelectedGatewayId(rowData.gateway_id);
                  setIsListVisible(false);
                  // this.setState({ selectedGatewayId: rowData.gateway_id }, () => {
                  //   this.setState({ isListVisible: false });
                  // });
                }}
                columns={[
                  {
                    title: "ID",
                    field: "gateway_id",
                    cellStyle: { textAlign: "center", width: "232.8px", padding: 5 },
                    headerStyle: { textAlign: "center", paddingLeft: "24px", zIndex: 1 },
                    width: "16%",
                  },
                  {
                    title: "Nome",
                    field: "gateway_name",
                    cellStyle: { textAlign: "center", width: "232.8px", padding: 5 },
                    headerStyle: { textAlign: "center", paddingLeft: "24px", zIndex: 1 },
                    width: "16%",
                  },
                  {
                    title: "Endereço MAC",
                    field: "mac_address",
                    cellStyle: { textAlign: "center", width: "232.8px", padding: 5 },
                    headerStyle: { textAlign: "center", paddingLeft: "24px", zIndex: 1 },
                    width: "16%",
                  },
                  {
                    title: "Pontos de Coleta Cadastrados",
                    field: "registeredSpots",
                    cellStyle: { textAlign: "center", width: "232.8px", padding: 5 },
                    headerStyle: { textAlign: "center", paddingLeft: "24px", zIndex: 1 },
                    width: "16%",
                  },
                  {
                    title: "Sensores Cadastrados",
                    field: "registeredSensors",
                    cellStyle: { textAlign: "center", width: "232.8px", padding: 5 },
                    headerStyle: { textAlign: "center", paddingLeft: "24px", zIndex: 1 },
                    width: "16%",
                  },
                  {
                    title: "Status Internet",
                    field: "internetStatus",
                    cellStyle: { textAlign: "center", width: "232.8px", padding: 5 },
                    headerStyle: { textAlign: "center", paddingLeft: "24px", zIndex: 1 },
                    width: "16%",
                    searchable: false,
                    render: (rowData) =>
                      rowData.internetStatus === "OK" ? (
                        <Tooltip title="Conexão do Gateway com a internet OK.">
                          <WifiTethering style={{ color: "green" }}></WifiTethering>
                        </Tooltip>
                      ) : rowData.internetStatus === "NOK" ? (
                        <Tooltip title="Não existe conexão do Gateway com a internet. Verifique a conexão.">
                          <PortableWifiOff style={{ color: "red" }}></PortableWifiOff>
                        </Tooltip>
                      ) : (
                        <p>erro</p>
                      ),
                  },
                ]}
                options={{
                  pageSize: 10,
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
          </Card>
        )}

        {!isListVisible && <GatewayConfig gatewayId={selectedGatewayId} backToList={backToList} />}
      </div>
    </div>
  );
}

// export default class GatewayList extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       list: [],
//       isLoading: true,
//       isListVisible: true,
//       selectedGatewayId: "",
//     };
//   }

//   componentDidMount() {
//     this.getList();
//   }

//   async getList() {
//     // const url = process.env.REACT_APP_HOST_ENDPOINT + "generategatewayslist";
//     // let accessToken = await getCurrentAccessToken();
//     // axios({
//     //   method: "put",
//     //   url: url,
//     //   headers: {
//     //     Authorization: accessToken,
//     //   },
//     // })
//     generateGatewaysList()
//       .then((res) => {
//         this.setState({ list: res.data, isLoading: false });
//       })
//       .catch((error) => {
//         // checkNetworkError(error);
//         this.setState({ isLoading: false });
//       });
//   }

//   backToList = () => this.setState({ isListVisible: true });

//   render() {
//     return (
//       <div style={{ width: "100%", height: "100%" }} className="relative">
//         {!!this.state.isLoading && <ComponentLoader />}
//         {this.state.isListVisible && (
//           <Card height="100%">
//             <div style={{ width: "100%" }}>
//               <MaterialTable
//                 title="Lista de Gateways"
//                 data={this.state.list}
//                 onRowClick={(event, rowData) => {
//                   this.setState({ selectedGatewayId: rowData.gateway_id }, () => {
//                     this.setState({ isListVisible: false });
//                   });
//                 }}
//                 columns={[
//                   {
//                     title: "ID",
//                     field: "gateway_id",
//                     cellStyle: { textAlign: "center" },
//                     headerStyle: { textAlign: "center" },
//                   },
//                   {
//                     title: "Nome",
//                     field: "gateway_name",
//                     cellStyle: { textAlign: "center" },
//                     headerStyle: { textAlign: "center" },
//                   },
//                   {
//                     title: "Sensores Cadastrados",
//                     field: "registeredSensors",
//                     cellStyle: { textAlign: "center" },
//                     headerStyle: { textAlign: "center" },
//                   },
//                   // {
//                   //   title: "Status Sensor",
//                   //   field: "sensorStatus",
//                   //   cellStyle: { textAlign: "center" },
//                   //   headerStyle: { textAlign: "center" },
//                   //   searchable: false,
//                   //   render: (rowData) =>
//                   //     rowData.sensorStatus === "OK" ? (
//                   //       <Tooltip title="Todos os sensores conectados ao Gateway estão enviando dados normalmente">
//                   //         <i style={{ color: "green" }} className="fa fa-circle"></i>
//                   //       </Tooltip>
//                   //     ) : rowData.sensorStatus === "NOK" ? (
//                   //       <Tooltip title="Nem todos os sensores conectados ao Gateway estão enviando dados. Verifique a conexão dos sensores ao Gateway.">
//                   //         <i style={{ color: "red" }} className="fa fa-circle"></i>
//                   //       </Tooltip>
//                   //     ) : rowData.sensorStatus === "NONE" ? (
//                   //       <Tooltip title="Sem informações disponíveis">
//                   //         <i style={{ color: "gray" }} className="fa fa-circle"></i>
//                   //       </Tooltip>
//                   //     ) : (
//                   //       <p>erro</p>
//                   //     ),
//                   // },
//                   {
//                     title: "Status Internet",
//                     field: "internetStatus",
//                     cellStyle: { textAlign: "center" },
//                     headerStyle: { textAlign: "center" },
//                     searchable: false,
//                     render: (rowData) =>
//                       rowData.internetStatus === "OK" ? (
//                         <Tooltip title="Conexão do Gateway com a internet OK.">
//                           <WifiTethering style={{ color: "green" }}></WifiTethering>
//                         </Tooltip>
//                       ) : rowData.internetStatus === "NOK" ? (
//                         <Tooltip title="Não existe conexão do Gateway com a internet. Verifique a conexão.">
//                           <PortableWifiOff style={{ color: "red" }}></PortableWifiOff>
//                         </Tooltip>
//                       ) : (
//                         <p>erro</p>
//                       ),
//                   },
//                 ]}
//                 options={{
//                   pageSize: 10,
//                   headerStyle: { padding: 2, textAlign: "center", fontFamily: "Montserrat" },
//                   cellStyle: { padding: 2, textAlign: "center", fontSize: 12 },
//                 }}
//                 localization={{
//                   header: {
//                     actions: "Ações",
//                   },
//                   toolbar: {
//                     searchPlaceholder: "Buscar",
//                     searchTooltip: "Buscar",
//                   },
//                   body: {
//                     emptyDataSourceMessage: "",
//                   },
//                   pagination: {
//                     firstTooltip: "Primeira Página",
//                     previousTooltip: "Página Anterior",
//                     lastTooltip: "Última Página",
//                     nextTooltip: "Próxima Página",
//                     labelRowsSelect: "linhas",
//                     labelDisplayedRows: "{from}-{to} a {count}",
//                   },
//                 }}
//               />
//             </div>
//           </Card>
//         )}

//         {!this.state.isListVisible && (
//           <GatewayConfig gatewayId={this.state.selectedGatewayId} backToList={this.backToList} />
//         )}
//       </div>
//     );
//   }
// }
