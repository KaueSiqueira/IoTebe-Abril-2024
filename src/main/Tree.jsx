import React, { useContext, useEffect, useState, useRef } from "react";
import SortableTree, {
  addNodeUnderParent,
  changeNodeAtPath,
  find,
  walk,
  getTreeFromFlatData,
  removeNode,
  getFlatDataFromTree
} from "react-sortable-tree";
import { GroupWork, AddBox, Delete, Edit, Tab, Business, DomainAdd, RadioButtonUnchecked, SurroundSound, AddCircleOutline, RadioButtonChecked } from "@mui/icons-material";

import { Button, OptionsModal, PopupModal, AssociationModal, IoTebeModal } from "../components";

import { WhichRenderContext } from "../contexts";

import { readAssetsTree, updateAssetsTree } from "../apis";
import { getGroupChildren, mountFullPath, namePath, findNode } from "../utilities";

import { Tooltip } from "@material-ui/core";

import "react-sortable-tree/style.css";
import { ProtectedFeature, hasPermission } from "../components/ProtectedFeature/ProtectedFeature";
import FeedbackToast from "../components/FeedbackToast/FeedbackToast";

const color = {
  RED: "rgba(253, 13, 27)",
  GREEN: "rgba(28, 191, 33)",
  GRAY: "rgba(145, 145, 145)",
  YELLOW: "rgba(255, 224, 50)",
};

export default function Tree() {
  const [snapshot, setSnapshot] = useState([]);
  const [isEditable, setEditable] = useState(false);
  const [rmOrderList, setRmOrderList] = useState({"removed_spots":[], "removed_groups": []});
  const [negativeId, setNegativeId] = useState(-1);
  const [modal, setModal] = useState(false);
  const [delSpot, setDelSpot] = useState(null);
  const [canEdit, setCanEdit] = useState(null);
  const [groupSelector, setGroupSelector] = useState("");
  const [globalPath, setGlobalPath] = useState("");
  const [treeIdx, setTreeIdx] = useState("");
  const [modalSpot, setModalSpot] = useState(false);
  const [tempPath, setTempPath] = useState("");
  const [sensorUpdate, setSensorUpdate] = useState(null);
  const [bakcupFlatTree, setBakcupFlatTree] = useState([]);
  const [flatData, setFlatData] = useState([]);
  const [mobileNode, setMobileNode] = useState("");
  const cRef = useRef(); 

  const {
    treeData,
    setTreeData,
    selectedNode,
    setSelectedNode,
    setSelectedNodeFullPath,
    selectedNameFullPath,
    setSelectedNameFullPath,
    setSelectedNodeChildren,
    setIsDashboardVisible,
    setIsPageLoading,
    flatTree,
    setFlatTree,
    whichClicked,
    setWhichClicked
  } = useContext(WhichRenderContext);

  const addParent = (path, treeIndex, group) => {
    setNegativeId(negativeId - 1);
    let titleWithType = ""

    switch (group) {
      case "PLANT" :
        titleWithType = "Nova Planta"
        break;
      case "SECTOR" :
        titleWithType = "Novo setor"
        break;
      case "GROUP" :
        titleWithType = "Novo conjunto"
        break;
      case "EQUIPMENT" :
        titleWithType = "Novo equipamento"
        break;
      case "SPOT" :
        titleWithType = "Novo ponto"
        break;
      default :
        titleWithType = "Novo"
        break;
    }

    setGroupSelector("");
    const newNode = {
      id: negativeId,
      title: titleWithType,
      type: group,
      children: [],
      permission: ["CONFIG_ASSETS_TREE"],
      parent: true,
      sensor_id: null
    };

    const tree = addNodeUnderParent({
      treeData: treeData,
      newNode: newNode,
      parentKey: path[path.length - 1],
      getNodeKey: ({ treeIndex }) => treeIndex,
      expandParent: true,
      addAsFirstChild: true,
    });

    setTreeData(tree.treeData);
    setGlobalPath("");
    setTreeIdx("");
  };

  const rmNode = (path, children) => {
    if (!(children && children.length)) {
      const node = removeNode({
        treeData: treeData,
        path: path,
        getNodeKey: ({ treeIndex }) => treeIndex,
      });

      if (node.node.id > 0) { 
        let new_deleted_list
        if (node.node.type === "SPOT"){
          new_deleted_list = {
            "removed_spots":[...rmOrderList.removed_spots, parseInt(node.node.id)],
            "removed_groups": [...rmOrderList.removed_groups]
          }
        }else{
          new_deleted_list = {
            "removed_spots":[...rmOrderList.removed_spots],
            "removed_groups": [...rmOrderList.removed_groups, parseInt(node.node.id)]
          }
        }
        setRmOrderList(new_deleted_list);
      }
      setTreeData(node.treeData);
    } else {
      alert("Não é possivel deletar um grupo com elementos");
    }
  };

  const changeNode = (node, path, { value: title }) => {
    const changedTreeData = changeNodeAtPath({
      treeData: treeData,
      path: path,
      getNodeKey: ({ treeIndex }) => treeIndex,
      newNode: { ...node, title },
    });

    setTreeData(changedTreeData);
  };

  const changeSensor = (nodeSpot, sensorId ) => {
    let tempNodeTree = [];
    let tempNodeFlatTree = [];

    if (sensorId === "Nenhum") {
      sensorId = null;
    };

    const tempFlatData = getFlatDataFromTree({
      treeData: treeData,
      getNodeKey: ({ treeIndex }) => treeIndex,
      ignoreCollapsed: false,
    });

    tempFlatData.forEach(n => {
      if(n.node.sensor_id === sensorId) n.node.sensor_id = null;
      tempNodeTree.push(n.node)
    });

    /* 
      Method getTreeFromFlatData is removing new plants 
      during a sensor association.
      Uncomment this line and remove :188 in case of 
      any possible bug related to this change.

      const tempTreeData = getTreeFromFlatData({
        flatData: tempNodeTree,
        getKey: (node) => node.id,
        getParentKey: (node) => node.parent,
        rootKey: null,
      });
    */

    const tempTreeData = treeData;
    const { treeData: tree, matches } = find({
      getNodeKey: ({ treeIndex }) => treeIndex,
      treeData: tempTreeData,
      searchQuery: {id: nodeSpot.id, children: nodeSpot.children},
      searchMethod: ({ node, searchQuery }) => (node.id === searchQuery.id && node.children === searchQuery.children),
      searchFocusOffset: 0,
      expandFocusMatchPaths: true,
    });

    const path = matches[0]['path'];
    const changedTreeData = changeNodeAtPath({
      treeData: tree,
      path: path,
      getNodeKey: ({ treeIndex }) => treeIndex,
      newNode: { ...nodeSpot, sensor_id: sensorId },
      expandParent: true,
    });

    const tempFlatDataToTree = getFlatDataFromTree({
      treeData: changedTreeData,
      getNodeKey: ({ treeIndex }) => treeIndex,
      ignoreCollapsed: false,
    });

    tempFlatDataToTree.forEach(n => {
      tempNodeFlatTree = [...tempNodeFlatTree, n.node]
    });

    setTreeData(changedTreeData);
    setFlatTree(tempNodeFlatTree);
    setFlatData(tempNodeFlatTree);
    setTempPath("");
  };


  const handleEdit = () => {
    setEditable(true);
    setSnapshot(treeData);
    setIsDashboardVisible(false);
  };

  const handleSaveTree = async () => {
    setIsPageLoading(true);

    try {
      await updateAssetsTree(treeData, rmOrderList);
      loadTree();
      setNegativeId(-1);
      setRmOrderList({"removed_spots":[], "removed_groups": []});
      FeedbackToast.success();
    } catch (error) {
      console.error(error);
      setIsPageLoading(false);
      FeedbackToast.error();
    }
  };

  const handleCancelSave = () => {
    setTreeData(snapshot);
    setFlatTree(bakcupFlatTree)
    setEditable(false);
    setNegativeId(-1);
    setSnapshot([]);
    setRmOrderList({"removed_spots":[], "removed_groups": []});
    setIsDashboardVisible(true);
    setGroupSelector("");
    setGlobalPath("");
    setTreeIdx("");
  };

  const loadTree = async () => {
    const { tree_id } = sessionStorage.getItem("whichClicked")
      ? JSON.parse(sessionStorage.getItem("whichClicked"))
      : { tree_id: null };

    try {
      const res = await readAssetsTree();      

      const validation = res.data.some((node) => hasPermission(["CONFIG_ASSETS_TREE"], node.permission));

      setCanEdit(validation);

      setFlatTree(res.data);
      setBakcupFlatTree(res.data);

      for(let node of res.data){
        node["tree_id"] = node["type"] === "SPOT" ? node["id"]+"_spot" : node["id"]+"_group"
        node["parent"] = node["parent"] !== null ? node["parent"]+"_group" : null
      }

      setFlatData(res.data);

      const treeData = getTreeFromFlatData({
        flatData: res.data,
        getKey: (node) => node.tree_id,
        getParentKey: (node) => node.parent,
        rootKey: null,
      }).map((node) => {
        node.expanded = false;
        return node;
      });

      const { treeData: tree, matches } = find({
        getNodeKey: ({ treeIndex }) => treeIndex,
        treeData: treeData,
        searchQuery: tree_id,
        searchMethod: ({ node, searchQuery }) => node.tree_id === searchQuery,
        searchFocusOffset: 0,
        expandFocusMatchPaths: true,
      });
      
      const node = !!matches.length ? matches[0].node : tree[0];

      setTreeData(tree);
      setSelectedNode(node);
      setSelectedNodeFullPath(mountFullPath(tree, node.tree_id, false));
      setSelectedNameFullPath(namePath(tree, node.tree_id));
      setSelectedNodeChildren(getGroupChildren(node));
      setEditable(false);
      setIsDashboardVisible(true);
      setIsPageLoading(false);
      setModal(false);
    } catch (error) {
      // console.error(error)
    } 
  };

  const closeSelector = (e) => {
    setGroupSelector("")
  }

  useEffect(() => {
    loadTree();
    const handleClick = (event) => {
      if (cRef.current && !cRef.current.contains(event.target)) {
        closeSelector();
      }
    };

    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, []);

  useEffect(() => {
    /* 
      Rearrange the assets tree when the navigation 
      comes from breadcrumbs path 
    */
    if (whichClicked.tree_id) {
      const currentNode = findNode(
        treeData,
        whichClicked.tree_id
      );

      if (currentNode) {
        const node = currentNode["node"];
        setSelectedNode(node);
        setSelectedNameFullPath(namePath(treeData, node.tree_id));
        setSelectedNodeFullPath(
          mountFullPath(treeData, node.tree_id, false)
        );
        setSelectedNodeChildren(getGroupChildren(node));
      }
    }

    /* 
      Expand nodes until the current selected
      Ignores the first node (if it's the only one) 
      Ignores the last node (current selected)
    */
    const { matches } = find({
      getNodeKey: ({ treeIndex }) => treeIndex,
      treeData: treeData,
      searchQuery: selectedNode.tree_id,
      searchMethod: ({ node, searchQuery }) =>
        node.tree_id === searchQuery,
      searchFocusOffset: 0,
      expandFocusMatchPaths: true,
    });

    if (!matches[0]) return;

    const treePath = matches[0].path;
    if (treePath.length > 1) {
      treePath.forEach((index) => {
        if (index !== treePath[treePath.length - 1]) {
          walk({
            treeData: treeData,
            getNodeKey: ({ treeIndex }) => treeIndex,
            ignoreCollapsed: true,
            callback: (node) => {
              if (node.treeIndex === index) {
                node.node.expanded = true;
              }
            },
          });
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [whichClicked]);

  return (
    <div id="treeView" data-parent="#ContainerMain" className={`col-12 col-lg-${window.screen.width < 992 ? "2" : (!isEditable ? "2" : "4")} transition_smooth d-lg-block sidebar collapse navbar-collapse`}
      // style={{"margin-top": "10px"}}
    >
      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "row",
          height: `calc(100% - ${isEditable ? "90" : "45"}px)`,
          width: "100%",
        }}
      >
        <div style={{ height: "100%", width: "100%" }}>
          <div id="treeViewTitle">
            <p style={{whiteSpace: "nowrap"}}>ÁRVORE DE ATIVOS</p>
            <div className="button-tree">
                {isEditable && (
                  <>
                    <div className="button-tree">
                      <Button onClick={handleCancelSave} className="rounded-button-outlined" cancel>
                        Cancelar
                      </Button>
                      
                      <Button onClick={() => setModal(!modal)} className="rounded-button" >
                        Salvar
                      </Button>
                    </div>
                  </>
                )}
                
                {!isEditable && canEdit && (
                  <button onClick={handleEdit} className="editTree-button" style={{float: "right"}}>
                    <Tooltip title="Editar Arvore" placement="top" arrow>
                      <Edit style={{ color: "rgb(21, 98, 132)" }} />
                    </Tooltip>
                  </button>
                )}
            </div>
          </div>

          <div className="add-new-plant">                    
            {isEditable && (
              <Button className="rounded-button-with-icon" onClick={() => {addParent(0, 0, "PLANT")}}>
                <DomainAdd style={{ color: "white", fontSize: 16 }} /> <span>Adicionar Planta</span>
              </Button>
            )}
          </div>

          <PopupModal
            showModal={modal}
            toggleModal={() => setModal(!modal)}
            title="Alteração na Árvore"
            onDismissTitle="Cancelar"
            onConfirm={() => {
              handleSaveTree();
              setModal(false);
            }}
            onConfirmTitle="Sim"
          >
            Você deseja confirmar as alterações na árvore de ativos?
          </PopupModal>
          
          {delSpot !== null && <IoTebeModal
            showModal={delSpot !== null}
            toggleModal={() => setDelSpot(null)}
            title="Atenção! Os dados deste ponto serão perdidos"
            onDismissTitle="Não"
            onConfirm={() => {
              rmNode(delSpot.path, delSpot.node);
              setDelSpot(null);
            }}
            onConfirmTitle="Sim"
          >
            Ao deletar este ponto de coleta,
            todos os dados que ele contém serão excluídos e você não poderá acessá-los novamente.
            <br/>
            <br/>
            Deseja prosseguir?
          </IoTebeModal>}

          {window.screen.width < 992 && isEditable && <OptionsModal
            showModal={groupSelector !== "" }
            toggleModal={() => setGroupSelector("")}
            title="Criar"
            className="typeModal"
          >
            {(mobileNode.type === "PLANT") && (<li className="textTreeGroupInput" onClick={() => {addParent(tempPath, treeIdx, "SECTOR"); setModal(false); setMobileNode("")}}>Setor</li>)}
                        {/* <hr style={{margin: 0}}/> */}
                        {(mobileNode.type === "SECTOR") && (<>
                          <li className="textTreeGroupInput" onClick={() => {addParent(tempPath, treeIdx, "GROUP"); setModal(false); setMobileNode("")}}>Conjunto</li>
                          <hr style={{margin: 0}}/>
                          <li className="textTreeGroupInput" onClick={() => {addParent(tempPath, treeIdx, "EQUIPMENT"); setModal(false); setMobileNode("")}}>Equipamento</li>
                          </>)}
                        {(mobileNode.type === "GROUP") && <li className="textTreeGroupInput" onClick={() => {addParent(tempPath, treeIdx, "EQUIPMENT"); setModal(false); setMobileNode("")}}>Equipamento</li>}
                        {/* <hr style={{margin: 0}}/> */}
                        {(mobileNode.type === "EQUIPMENT") && (<li className="textTreeGroupInput" onClick={() => {addParent(tempPath, treeIdx, "SPOT"); setModal(false); setMobileNode("")}}>Ponto</li>)}
          </OptionsModal>}

          {modalSpot && <AssociationModal
            showModal={modalSpot}
            className="modalSpot"
            setSensorUpdate={setSensorUpdate}
            isOnTree={true}
            flatData={flatTree}
            treeUpdate={() => changeSensor(selectedNode, sensorUpdate)}
            dismissFunc={() => setModalSpot(!modalSpot)}
            sensorId={selectedNode.sensor_id}
            newSpotId={selectedNode.id}
            style={window.screen.width < 992 ? {width: "95%"} : {width: "45vw"}}
          >
          </AssociationModal>}

          <div id="treeWrapper">
            <SortableTree
              treeData={treeData}
              onChange={(treeData) => setTreeData(treeData)}
              rowHeight={40}
              getNodeKey={({ treeIndex }) => treeIndex}
              scaffoldBlockPxWidth={16}
              isVirtualized={true}
              canNodeHaveChildren={({ type }) => type !== "SPOT"}
              slideRegionSize={100}
              canDrag={({ parentNode, node: { permission } }) =>
                hasPermission(["CONFIG_ASSETS_TREE"], permission) && isEditable && "" === groupSelector
              }
              canDrop={({ node, prevParent, nextParent }) => {
                  if (!!nextParent && hasPermission(["CONFIG_ASSETS_TREE"], nextParent.permission) && !!prevParent) {
                    const prevPermission = JSON.stringify(prevParent.permission.slice().sort())
                    const nextPermission = JSON.stringify(nextParent.permission.slice().sort())
                    return (
                      prevPermission === nextPermission
                      && node.type === "SECTOR" ? nextParent.type === "PLANT" : true
                      && node.type === "GROUP" ? nextParent.type === "SECTOR" : true
                      && node.type === "EQUIPMENT" ? nextParent.type === "GROUP" || nextParent.type === "SECTOR" : true
                      && node.type === "SPOT" ? nextParent.type === "EQUIPMENT" : true
                    )
                  }
                  if (node.type === "PLANT" && !prevParent && !nextParent) return true
                  return false
                }
              }
              generateNodeProps={({ node, path, treeIndex }) => ({
                onClick: ({ target: { className } }) => {
                  if (
                    className !== "rst__collapseButton" &&
                    className !== "rst__expandButton" &&
                    className !== "rst__moveHandle" &&
                    !isEditable
                  ) {
                    sessionStorage.setItem(
                      "whichClicked",
                      JSON.stringify({
                        tree_id: node.tree_id
                      })
                    );
                    setWhichClicked({
                      tree_id: node.tree_id,
                    });
                    setSelectedNode(node);
                    setSelectedNodeFullPath(mountFullPath(treeData, node.tree_id, false));
                    setSelectedNodeChildren(getGroupChildren(node));
                  }
                },

                title: (
                  <div
                    className="nodeWrapper"
                    data-toggle={(window.screen.width < 992 && !isEditable) ? "collapse" : ""}
                    data-target="#treeView"
                  >
                    <div className="nodeIcon">
                      {/*(() => {switch(node.type) {
                        case "plan":
                          return <Business style={{ color: "white", fontSize: 18 }} />
                        case "sector":
                          return <Tab style={{ color: "white", fontSize: 18 }} />
                        case "set":
                          return <GroupWork style={{ color: "white", fontSize: 18 }} />
                        case "equipament":
                          return <SurroundSound style={{ color: "white", fontSize: 18 }} />
                        case "point":
                          return <RadioButtonUnchecked style={{ color: "white", fontSize: 18 }} />
                        default:
                          return <Business style={{ color: "white", fontSize: 18 }} />
                      }*/
                      (node.type === "PLANT") ? (
                        <Tooltip title={"Planta"} style={{ color: "gray" }} className="info" placement="top" arrow>
                          <Business style={{ color: "white", fontSize: 18 }} />
                        </Tooltip>
                      ) : (node.type === "SECTOR" ? (
                        <Tooltip title={"Setor"} style={{ color: "gray" }} className="info" placement="top" arrow>
                          <Tab style={{ color: "white", fontSize: 18 }} />
                        </Tooltip>
                        ) : (node.type === "GROUP" || node.type === "set" ? (
                          <Tooltip title={"Conjunto"} style={{ color: "gray" }} className="info" placement="top" arrow>
                            <GroupWork style={{ color: "white", fontSize: 18 }} />
                          </Tooltip>
                          ) : (node.type === "EQUIPMENT" ? (
                            <Tooltip title={"Equipamento"} style={{ color: "gray" }} className="info" placement="top" arrow>
                              <SurroundSound style={{ color: "white", fontSize: 18 }} />
                          </Tooltip>
                            ) : (
                              <Tooltip title={"Ponto de Coleta"} style={{ color: "gray" }} className="info" placement="top" arrow>
                                {node.sensor_id !== null ? 
                                <RadioButtonChecked style={{ color: "white", fontSize: 18 }} /> : (
                                <RadioButtonUnchecked style={{ color: "white", fontSize: 18 }} /> )}
                              </Tooltip>)
                              ))
                      )}
                      {node.connectionLabel === "NOK" && (
                        <p
                          style={{
                            position: "relative",
                            color: color["RED"],
                            fontWeight: 700,
                            fontSize: "20px",
                            lineHeight: "100%",
                            margin: 0,
                            padding: 0,
                          }}
                        >
                          !
                        </p>
                      )}
                    </div>
                    <div
                      className="labelColor"
                      style={{
                        backgroundColor: color[node.alarmLabel],
                      }}
                    ></div>
                    <Tooltip
                      title={
                        <div className="textSize-thin-16 p-1">
                          <b>{node.title}</b>
                        </div>
                      }
                      enterNextDelay={1500}
                      placement="right"
                      arrow
                    >
                      <input
                        value={node.title}
                        className="pointer"
                        id={node.id}
                        style={{
                          fontWeight: node.tree_id === selectedNode.tree_id ? 700 : 500,
                          textDecorationLine: isEditable ? "underline" : "none",
                        }}
                        onChange={({ target }) => {
                          changeNode(node, path, target);
                        }}
                        readOnly={!(isEditable && hasPermission(["CONFIG_ASSETS_TREE"], node.permission))}
                        maxlength="35"
                      />
                    </Tooltip>
                  </div>
                ),

                buttons: [
                  isEditable && (
                    <ProtectedFeature 
                      requiredPermissions={["CONFIG_ASSETS_TREE"]} 
                      userPermissions={node.permission}
                    >
                      <button
                        className="button"
                        onClick={() => {
                          if (node.type === "SPOT"){
                            setDelSpot({"path": path, "node": node.children});
                          }else{
                            rmNode(path, node.children);
                          }
                        }}
                      >
                        <Delete fontSize="small" style={{ color: "#1D6D8B" }} />
                      </button>
                    </ProtectedFeature>
                  ),
                  isEditable && (node.type === "GROUP" || node.type === "SECTOR" || node.type === "PLANT" || node.type === "EQUIPMENT") && node.id !== groupSelector && (
                    <ProtectedFeature 
                      requiredPermissions={["CONFIG_ASSETS_TREE"]} 
                      userPermissions={node.permission}
                    >
                      <button
                        className="button mr-1"
                        ref={cRef}
                        onClick={() => {
                          //addParent(path, treeIndex, "spot");
                          setGroupSelector(node.id);
                          setTreeIdx(treeIndex);
                          setMobileNode(node);
                          setTempPath(path);
                        }}
                      >
                        <AddBox fontSize="small" style={{ color: "#1D6D8B" }} />
                      </button>
                    </ProtectedFeature>
                  ),
                  isEditable && node.type === "SPOT" && node.id !== groupSelector && (
                    <ProtectedFeature 
                      requiredPermissions={["CONFIG_ASSETS_TREE"]} 
                      userPermissions={node.permission}
                    >
                      <button
                        className="button mr-1"
                        ref={cRef}
                        onClick={() => {
                          setSelectedNode(node);
                          setModalSpot(true);
                          setTempPath(path);
                        }}
                      >
                        <AddCircleOutline fontSize="small" style={{ color: "#1D6D8B" }} />
                      </button>
                    </ProtectedFeature>
                  ),
                  (window.screen.width > 992 && isEditable && (node.type === "GROUP" || node.type === "SECTOR" || node.type === "EQUIPMENT" || node.type === "PLANT") && node.id === groupSelector && (
                      <ProtectedFeature
                        requiredPermissions={["CONFIG_ASSETS_TREE"]} 
                        userPermissions={node.permission}
                      >
                        <ul className="treeGroups" ref={cRef}>
                          {(node.type === "PLANT") && (<li className="textTreeGroupInput" onClick={() => {addParent(path, treeIndex, "SECTOR")}}>Setor</li>)}
                          {/* <hr style={{margin: 0}}/> */}
                          {(node.type === "SECTOR") && (<>
                            <li className="textTreeGroupInput" onClick={() => {addParent(path, treeIndex, "GROUP")}}>Conjunto</li>
                            <hr style={{margin: 0}}/>
                            <li className="textTreeGroupInput" onClick={() => {addParent(path, treeIndex, "EQUIPMENT")}}>Equipamento</li>
                            </>)}
                          {(node.type === "GROUP") && <li className="textTreeGroupInput" onClick={() => {addParent(path, treeIndex, "EQUIPMENT")}}>Equipamento</li>}
                          {/* <hr style={{margin: 0}}/> */}
                          {(node.type === "EQUIPMENT") && (<li className="textTreeGroupInput" onClick={() => {addParent(path, treeIndex, "SPOT")}}>Ponto</li>)}
                        </ul>
                      </ProtectedFeature>
                  )),
                ],

                style: (node.id === groupSelector ? ({
                  backgroundColor: node.tree_id === selectedNode.tree_id ? "rgba(0, 0, 0, 0.1)" : "white",
                  cursor: "pointer",
                  width: "100%",
                  maxWidth: "300px",
                  zIndex: "15",
                  position: "sticky",
                }) : ({
                  backgroundColor: node.tree_id === selectedNode.tree_id ? "rgba(0, 0, 0, 0.1)" : "white",
                  cursor: "pointer",
                  width: "100%",
                  maxWidth: "300px",
                })),
              })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
