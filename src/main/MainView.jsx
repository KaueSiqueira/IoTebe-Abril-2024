import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import SpotManagement from "./SpotManagement";
import SelectedDashboard from "./SelectedDashboard";
import { FullPageLoader} from "../components";
import Tree from "./Tree";

import { Auth } from "aws-amplify";

import { RightSideMenuProvider, WhichRenderProvider, DiagnosticProvider } from "../contexts";
import { readUserInfo } from "../apis";

import Chart from "chart.js/auto";
import "chartjs-adapter-moment";
import zoomPlugin from "chartjs-plugin-zoom";
import annotationPlugin from "chartjs-plugin-annotation";

import "./GlobalStyles.css";
import "bootstrap-daterangepicker/daterangepicker.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap";
import { Notification } from "./Notification";
import RightMenu from "./rightMenu/RightMenu";

Chart.register(zoomPlugin);
Chart.register(annotationPlugin);
Chart.defaults.font.family = "Montserrat";

export default function MainView() {
  const [treeData, setTreeData] = useState([
    {
      id: "UNIQUE_COMPANY_ID",
      title: "Loading...",
      expanded: true,
      type: "GROUP",
      alarmLabel: "gray",
      children: [],
      sensor_id: null,
    },
  ]);

  const [flatTree, setFlatTree] = useState([])

  const [userFirstName, setUserFirstName] = useState("--");
  const [userPhone, setUserPhone] = useState(null);
  const [userName, setUserName] = useState("--");

  const [selectedNode, setSelectedNode] = useState({});
  const [selectedNodeFullPath, setSelectedNodeFullPath] = useState("");
  const [selectedNameFullPath, setSelectedNameFullPath] = useState("");
  const [selectedNodeChildren, setSelectedNodeChildren] = useState("");
  const [isDashboardVisible, setIsDashboardVisible] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [whichPage, setSpotPage] = useState("vibandtemp");
  const [alarmYellow, setAlarmYellow] = useState(0);
  const [alarmRed, setAlarmRed] = useState(1);
  const [warningAlarm, setWarningAlarm] = useState(false);
  const [spotView, setSpotView] = useState(false);
  const [whichClicked, setWhichClicked] = useState(
    sessionStorage.getItem("whichClicked")
      ? JSON.parse(sessionStorage.getItem("whichClicked"))
      : { tree_id: null }
  );

  const plotUser = async () => {
    try {
      const {
        data: { name, phone, username },
      } = await readUserInfo();
      setUserFirstName(name.replace(/ .*/, ""));
      setUserPhone(phone);
      setUserName(username);
    } catch (error) {
      console.error(error);
    }

    // readUserInfo().then(({ data: { name: firstName } }) => {
    //   setUserFirstName(firstName.replace(/ .*/, ""));
    // });
  };

  const handleSignOut = () => {
    Auth.signOut();
    window.location = "/login";
    sessionStorage.clear();
  };

  useEffect(() => {
    plotUser();
  }, []);

  return (
    <div id="ContainerMain" style={spotView ? {overflow: "hidden"} : {}} className="relative">
      {isPageLoading && <FullPageLoader />}

      {spotView ? 
        <SpotManagement 
          spotView={setSpotView} 
          setNode={setSelectedNode} 
          setPath={setSelectedNodeFullPath} 
          setTree={setTreeData}
          tree={treeData}
          setChildren={setSelectedNodeChildren}
          setWhichClicked={setWhichClicked}
          setSpotPage={setSpotPage}
        />
      : <>

      <WhichRenderProvider
          value={{
            treeData,
            setTreeData,
            selectedNode,
            setSelectedNode,
            selectedNodeFullPath,
            setSelectedNodeFullPath,
            selectedNodeChildren,
            setSelectedNodeChildren,
            isDashboardVisible,
            setIsDashboardVisible,
            isPageLoading,
            setIsPageLoading,
            whichPage,
            setSpotPage,
            flatTree,
            setFlatTree,
            alarmYellow,
            setAlarmYellow,
            alarmRed,
            setAlarmRed,
            warningAlarm,
            setWarningAlarm,
            whichClicked,
            setWhichClicked,
            selectedNameFullPath, 
            setSelectedNameFullPath,
            userPhone,
            setUserPhone,
            userName,
            setUserName
          }}
        >
        <Navbar setselectedNode={setSelectedNode} userFirstName={userFirstName} handleSignOut={handleSignOut} spotView={setSpotView} />
        <div id="bodyContainer">
          <Tree />

          <RightSideMenuProvider>
            <DiagnosticProvider>
              <div id={(selectedNode.type === "gateway" || selectedNode.type === "user") ? "#contentWrapperWithScroll" : "contentWrapper"} className="row" style={{overflow: "auto"}}>
                <div className="col-lg" id="mainContent">
                  {isDashboardVisible ? (
                    <SelectedDashboard type={selectedNode.type} selectedTreePath={selectedNodeFullPath} />
                  ) : (
                    <div className="height-100p width-100p center">
                      {/* <h4>Dashboard indisponível no momento</h4> */}
                    </div>
                  )}
                </div>

                <RightMenu/>
              </div>
            </DiagnosticProvider>
          </RightSideMenuProvider>
        </div>
      </WhichRenderProvider>
      

      <Notification isPageLoading={isPageLoading} />
      </> }
    </div>
  );
}
