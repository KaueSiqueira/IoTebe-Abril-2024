import React, { useState, useContext } from "react";
import { Button, PopupModal, NotificationButton } from "../../components";
import { ManageAccounts, GroupRemove } from "@mui/icons-material";
import "bootstrap/dist/css/bootstrap.css";
import { SettingsUser } from "./SettingsUser/SettingsUser";
import { GroupView } from "./GroupView";
import { WhichRenderContext } from "../../contexts";
import { deleteSelfUserGroup } from "../../apis";
import NamePath from "../name_path/NamePath";
import { ProtectedFeature } from "../../components/ProtectedFeature/ProtectedFeature";

function DashGroup() {
  const { selectedNameFullPath, selectedNode } = useContext(WhichRenderContext);
  const [modal, setModal] = useState(false);

  const [page, setPage] = useState("dashgroup");

  const deleteUser = async (group_id) => {
    try {
      await deleteSelfUserGroup(group_id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ width: "100%", height: "100%" }} className="relative">
      <div
        id="dashHeader"
        style={
          window.innerWidth > 700 && page !== "dashgroup"
            ? {
                paddingBottom: 6,
                boxShadow: "0px 1px 0px 0px rgba(50, 50, 50, 0.3)",
              }
            : { margin: 0 }
        }
      >
        <NamePath fullPath={selectedNameFullPath} />
        <div>
          {page === "dashgroup" && (
            <>
              <NotificationButton />
              <ProtectedFeature requiredPermissions={["MANAGE_USERS"]}>
                <Button
                  onClick={() =>
                    setPage((prev) =>
                      prev === "dashgroup" ? "settings" : "dashgroup"
                    )
                  }
                  className="topSensorOptions rounded-button-with-icon"
                >
                  <ManageAccounts style={{ color: "white", fontSize: 16 }} />
                  Gerenciar Usuários
                </Button>
              </ProtectedFeature>
            </>
          )}
          {selectedNode.user_type !== "OWNER" && !selectedNode.parent && (
            <Button
              cancel
              onClick={() => setModal(true)}
              className="topSensorOptions rounded-button-with-icon"
            >
              <GroupRemove style={{ color: "white", fontSize: 16 }} /> Sair do
              grupo
            </Button>
          )}
        </div>
      </div>

      {page === "dashgroup" && <GroupView />}

      {page === "settings" && <SettingsUser setPage={setPage} />}

      <PopupModal
        showModal={modal}
        toggleModal={() => {
          setModal((prev) => !prev);
        }}
        title={"Você está se desvinculando deste grupo"}
        onDismissTitle="Não"
        onConfirm={() => {
          deleteUser(selectedNode.id)
            .then((res) => window.location.reload())
            .catch((err) => {});
        }}
        onConfirmTitle={"Sim"}
      >
        <div>{`Deseja mesmo sair do grupo`}</div>
      </PopupModal>
    </div>
  );
}

export default DashGroup;
