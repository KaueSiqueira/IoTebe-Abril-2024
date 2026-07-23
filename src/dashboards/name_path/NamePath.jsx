import React, { useState, useContext } from "react";
import { WhichRenderContext } from "../../contexts";
import { ClickAwayListener, Tooltip } from "@material-ui/core";
import {
  NavigateNextRounded,
  MoreHorizRounded,
  Business,
  Tab,
  GroupWork,
} from "@mui/icons-material";

const NamePath = ({ fullPath }) => {
  /* Pegando a função que atualiza o contexto */
  const { setWhichClicked } = useContext(WhichRenderContext);

  /*  Variaveis useState para controlar estado do menu de nomes */
  const [expandNamePath, setExpandNamePath] = useState(false);

  const handlePathChange = (tree_id) => {
    setExpandNamePath(false);
    setWhichClicked({
      tree_id: tree_id,
    });
  };

  if (fullPath.length > 2) {
    // Identifica os primeiros elementos do array
    const firstNamesPath = fullPath.slice(0, fullPath.length - 2);

    // Identifica os dois ultimos elementos do array
    const lastNamesPath = fullPath.slice(-2);

    return (
      <div className="name-path" id="name-path-mobile">
        {/* Componente que identifica o click pra fora e fecha o sub-menu */}
        <ClickAwayListener onClickAway={() => setExpandNamePath(false)}>
          <div className="name-path-menu name-path-mobile">
            {/* Lógica para mudar background quando estiver clicado */}
            <button
              className={expandNamePath ? "expand-name-paths-active" : ""}
              onClick={() => setExpandNamePath(!expandNamePath)}
            >
              <MoreHorizRounded style={{ fontSize: 17 }} />
            </button>
            {/* Lógica para ver se esta aberto ou fechado */}
            <nav
              className={expandNamePath ? "expand-name-nav" : "display-none"}
            >
              <ul>
                {firstNamesPath.map(
                  (path, index) =>
                    path.type === "PLANT" && (
                      <Tooltip
                        key={index}
                        title={"Planta"}
                        style={{ color: "gray" }}
                        className="info"
                        placement="left"
                        arrow
                      >
                        <li
                          onClick={() => {
                            handlePathChange(path.id, path.tree_index);
                          }}
                        >
                          <span className="expand-name-paths-icon">
                            <Business
                              style={{ color: "white", fontSize: 18 }}
                            />
                          </span>
                          <button>{path.path}</button>
                        </li>
                      </Tooltip>
                    )
                )}
                {firstNamesPath.map(
                  (path, index) =>
                    path.type === "SECTOR" && (
                      <Tooltip
                        key={index}
                        title={"Setor"}
                        style={{ color: "gray" }}
                        className="info"
                        placement="left"
                        arrow
                      >
                        <li
                          onClick={() => {
                            handlePathChange(path.id, path.tree_index);
                          }}
                        >
                          <span className="expand-name-paths-icon">
                            <Tab style={{ color: "white", fontSize: 18 }} />
                          </span>
                          <button>{path.path}</button>
                        </li>
                      </Tooltip>
                    )
                )}
                {firstNamesPath.map(
                  (path, index) =>
                    path.type === "GROUP" && (
                      <Tooltip
                        key={index}
                        title={"Conjunto"}
                        style={{ color: "gray" }}
                        className="info"
                        placement="left"
                        arrow
                      >
                        <li
                          onClick={() => {
                            handlePathChange(path.id, path.tree_index);
                          }}
                        >
                          <span className="expand-name-paths-icon">
                            <GroupWork
                              style={{ color: "white", fontSize: 18 }}
                            />
                          </span>
                          <button>{path.path}</button>
                        </li>
                      </Tooltip>
                    )
                )}
              </ul>
            </nav>
          </div>
        </ClickAwayListener>
        {lastNamesPath.map((path, index) => (
          <div key={index} className="name-path-btn-wrapper">
            <NavigateNextRounded style={{ fontSize: 12, color: "#072531" }} />
            <button
              onClick={() => {
                handlePathChange(path.id, path.tree_index);
              }}
            >
              {path.path}
            </button>
          </div>
        ))}
      </div>
    );
  } else {
    return (
      <div className="name-path" id="name-path-mobile">
        {fullPath.map((path, index) => (
          <div key={index} className="name-path-btn-wrapper name-path-mobile">
            {index !== 0 && (
              <NavigateNextRounded style={{ fontSize: 12, color: "#072531" }} />
            )}
            <button
              onClick={() => {
                handlePathChange(path.id, path.tree_index);
              }}
            >
              {path.path}
            </button>
          </div>
        ))}
      </div>
    );
  }
};

export default NamePath;
