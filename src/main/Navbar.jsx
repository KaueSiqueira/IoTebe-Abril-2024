import React, { useEffect, useState } from "react";
import {
  AccountTree,
  AssignmentInd,
  ExitToApp,
  Menu,
  Router,
  QueryStats
} from "@mui/icons-material";
import { Tooltip } from "@material-ui/core";
import logo from "../assets/imgs/logo_iotebe.svg";
import user from "../assets/imgs/avatar.svg";
import { colors } from "../utilities";
import { SearchBar, SuportButton } from "../components";
import { NavbarFeatureMenu } from "./NavbarFeaturesMenu";

function Navbar(props) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => { 
    const mutationCallback = (mutationsList) => {
      const containerMain = document.getElementById('ContainerMain');    
      const lastMutationTargetClasslist = (mutationsList[mutationsList.length -1].target.classList);
  
      if (lastMutationTargetClasslist.contains('show')) {
        containerMain.style.overflow = "hidden";
      } else {
        containerMain.style.overflowY = "auto";
      }
    }
    
    const mutationObserver = new MutationObserver(mutationCallback);
    mutationObserver.observe(document.getElementById("treeView"), { attributes: true });
  }, []);

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light"
      style={{ backgroundColor: "#fff" }}
    >
      {/* toggle-button to trigger the tree view on navbar breakpoint */}
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#treeView"
        aria-controls="treeView"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span>
          <AccountTree />
        </span>
      </button>

      {/* responsive logo */}
      <a className="navbar-brand" href="./">
        <img
          alt="TebeLogo"
          src={logo}
          width="auto"
          height="40"
          loading="lazy"
        ></img>
      </a>

      {windowWidth < 992 && (
        <SearchBar mobileMode={true} />
      )}

      {/* toggle-button to trigger the tree view on navbar breakpoint */}
      <button
        id="navbarMenuToggler"
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#topNavbar"
        aria-controls="topNavbar"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span>
          <Menu />
        </span>
      </button>

      {/* stuck content on the top navigation bar */}
      <div
        id="topNavbar"
        className="collapse navbar-collapse"
        data-parent="#ContainerMain"
      >
        {/* content list aligned to the right*/}
        <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
          <div className="alignNavbar">
            {windowWidth > 991 && (
              <li className="sb-item nav-item my-3 my-lg-auto mx-auto order-1 order-lg-1">
                <SearchBar />
              </li>
            )}

            {windowWidth > 992 && <li className="sb-item nav-item my-3 my-lg-auto mx-auto order-1 order-lg-1" onClick={() => {props.spotView(true)}}>
              <button className="spot-management-button rounded-button"><QueryStats style={{ color: "white", fontSize: 16 }} /> <span>Gestão à vista</span></button>
            </li>}

            {(process.env.REACT_APP_ENVIRONMENT === "development" 
              || process.env.REACT_APP_ENVIRONMENT === "stage"
            ) && <NavbarFeatureMenu/>}

            <Tooltip title="Suporte" arrow>
              <li className="sb-item nav-item my-3 my-lg-auto mx-auto order-1 order-lg-1">
                <SuportButton
                  className="nav-link"
                  phoneNumber="551931321442"
                  message="Olá, gostaria de ajuda"
                />
              </li>
            </Tooltip>

            <Tooltip title="Lista de Gateways" arrow>
              <li className="gb-item nav-item my-3 my-lg-auto mx-auto order-1 order-lg-1">
                <button
                  className="nav-link"
                  style={{
                    padding: 0,
                    background: "none",
                    border: "none",
                    display: "flex",
                  }}
                  onClick={
                    () => props.setselectedNode({ type: "gateway" })
                  }
                >
                  <Router style={{ color: "rgb(21, 98, 132)", fontSize: 32 }} />
                </button>
              </li>
            </Tooltip>
          </div>

          <div
            className="border my-auto mx-3 d-none d-lg-block order-0 order-lg-2"
            style={{ height: 30 }}
          ></div>

          <li
            id="userName"
            className="nav-item my-auto mx-auto order-3 order-lg-3"
          >
            <p>{props.userFirstName.replace(/ .*/, "")}</p>
          </li>

          <li
            id="userImg"
            className="nav-item mt-3 mt-lg-0 mx-auto order-2 order-lg-4"
          >
            <img src={user} alt="user"></img>
          </li>

          <li className="nav-item dropleft my-auto mx-auto order-4 order-lg-5">
            <button
              id="dropdownMenu"
              className="d-none d-lg-block"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i
                style={{ color: "rgb(21, 98, 132)" }}
                className="fa fa-chevron-down"
              ></i>
            </button>
            <div className="dropdown-menu" aria-labelledby="dropdownMenu">
              <button
                className="dropdown-item order-2"
                type="button"
                onClick={() => {
                  props.setselectedNode({ type: "account" });
                }}
              >
                <span style={{ fontSize: 14 }}>
                  Editar Perfil
                  <AssignmentInd />
                </span>
              </button>
              <div className="dropdown-divider order-1"></div>
              <button
                className="dropdown-item"
                type="button"
                onClick={props.handleSignOut}
              >
                <span style={{ fontSize: 14, color: colors.alarmCritical }}>
                  Sair
                  <ExitToApp />
                </span>
              </button>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
