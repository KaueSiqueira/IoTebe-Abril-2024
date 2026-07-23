import React, { useEffect, useState } from "react";
import { PopupModal } from "../components";
import {
  updateAssociationRequest,
  deleteAssociationRequest,
  getAssociationRequest,
} from "../apis";

import {
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from "@material-ui/core";
import { Close, Check } from "@mui/icons-material";

export function Notification({ isPageLoading }) {
  const [modal, setModal] = useState(false);
  const [reload, setReload] = useState(false);
  const [users, setUsers] = useState([]);

  const deleteAssociation = async (group_id) => {
    const snapshot = [...users];
    const newUsers = users.filter((user) => user.spot_group_id !== group_id);
    setUsers(newUsers);

    try {
      await deleteAssociationRequest(group_id);
      if (!newUsers.length) setModal(false);
    } catch (err) {
      console.error(err);
      setUsers(snapshot);
    }
  };

  const acceptAssociation = async (group_id) => {
    const snapshot = [...users];

    const newUsers = users.filter((user) => user.spot_group_id !== group_id);
    setUsers(newUsers);

    try {
      await updateAssociationRequest(group_id);
      setReload(true);

      if (!newUsers.length) setModal(false);
    } catch (err) {
      console.log(err);
      setUsers(snapshot);
    }
  };

  const loadNotification = async () => {
    try {
      const res = await getAssociationRequest();
      if (res.data.length > 0) {
        setUsers(res.data);
        setModal(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadNotification();
  }, []);

  useEffect(() => {
    if (reload) window.location.reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modal]);

  return (
    <PopupModal
      showModal={modal && !isPageLoading}
      toggleModal={() => setModal((prev) => !prev)}
      title={"Solicitações para compartilhamento de grupos de pontos de coleta"}
    >
      <List dense={true}>
        {users.map((user) => (
          <ListItem key={user.spot_group_id}>
            <ListItemText
              primary={
                <>
                  <div>
                    {"Usuário: "}
                    <span
                      style={{ color: "rgba(0, 0, 0, 0.54)" }}
                    >{` ${user.username} / ${user.name}`}</span>
                  </div>

                  <div>
                    {"Grupo: "}
                    <span style={{ color: "rgba(0, 0, 0, 0.54)" }}>
                      {user.group_name}
                    </span>
                  </div>

                  <div>
                    {"Permissão: "}
                    <span style={{ color: "rgba(0, 0, 0, 0.54)" }}>
                      {user.permission === "COLLABORATOR" ? "Colaborador" : "Visualizador"}
                    </span>
                  </div>
                </>
              }
            />

            <ListItemSecondaryAction>
              <IconButton
                onClick={() => {
                  acceptAssociation(user.spot_group_id);
                }}
                edge="end"
                aria-label="check"
              >
                <Check
                  color="primary"
                  style={{ color: "rgba(28, 191, 33, 1)" }}
                />
              </IconButton>

              <IconButton
                onClick={() => {
                  deleteAssociation(user.spot_group_id);
                }}
                edge="end"
                aria-label="close"
              >
                <Close color="error" />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </PopupModal>
  );
}
