import React from "react";

import { colors } from "../../../utilities";
import { ArrowBackRounded, InfoOutlined } from "@mui/icons-material";

import { Button, Input } from "../../../components";
import { IconButton } from "@material-ui/core";
import { Delete, CheckCircle, Help } from "@mui/icons-material";
import MaterialTable, { MTableToolbar } from "material-table";
import { makeStyles } from "@material-ui/core/styles";
import styles from "./styles/SettingsUser.module.css";
import PermissionModal from "./PermissionModal";
import ActionModal from "./ActionModal";
import useSettingsUser from "./hooks/useSettingsUser";

function StatusUser({ status }) {
  return (
    <div
      style={{
        backgroundColor:
          status === "ACTIVE"
            ? "rgba(28, 191, 33, 0.2)"
            : "rgba(255, 224, 50, 0.2)",
      }}
      className="status-user"
    >
      {status === "ACTIVE" ? (
        <CheckCircle style={{ color: colors.alarmOk, fontSize: 20 }} />
      ) : (
        <Help style={{ color: colors.alarmAlert, fontSize: 20 }} />
      )}
      <span>{status === "ACTIVE" ? "Ativo" : "Pendente"}</span>
    </div>
  );
}

export function SettingsUser({ setPage }) {
  const {
    username,
    createModal,
    setCreateModal,
    deleteModal,
    updateModal,
    permissionModal,
    setPermissionModal,
    contentUpdate,
    contentDelete,
    tableData,
    handleSelectChange,
    handleDeleteUser,
    setUsername,
    setNewUserEmail,
    setSelectedPermission,
    handleAddUser,
    newUserEmail,
    handleEmailChange,
    selectedPermission,
    handlePermissionChange,
    setUpdateModal,
    selectChange,
    setDeleteModal,
    deleteUser,
    currentUsername,
  } = useSettingsUser(setPage);

  const useStyles = makeStyles({
    toolbarWrapper: {
      "& .MuiToolbar-gutters": {
        paddingLeft: 0,
      },
    },
  });

  const classes = useStyles();

  return (
    <>
      <div className={styles.settingsUserContainer}>
        <h4
          onClick={() => setPage("dashgroup")}
          className={styles.backToDashboard}
        >
          <ArrowBackRounded />
          Voltar para o Dashboard
        </h4>

        {!!tableData.length ? (
          <>
            <MaterialTable
              title={<h1 className={styles.tableTitle}>Usuários Associados</h1>}
              data={tableData}
              style={{ boxShadow: "none", paddingInline: 14 }}
              columns={[
                {
                  title: "Pasta",
                  field: "group_name",
                  render: (rowData) =>
                    rowData.group_name ? rowData.group_name : "Tudo",
                },
                {
                  title: "Usuário",
                  field: "username",
                  render: (rowData) =>
                    rowData.username === currentUsername ? (
                      <>
                        {rowData.username} <i>(Você)</i>
                      </>
                    ) : (
                      rowData.username
                    ),
                },
                {
                  title: "Nome",
                  field: "name",
                },
                {
                  title: "Status",
                  field: "status",
                  searchable: false,
                  render: (rowData) => <StatusUser status={rowData.status} />,
                },
                {
                  title: (
                    <>
                      Perfil de Usuário{" "}
                      <InfoOutlined
                        style={{
                          fontSize: "16px",
                          cursor: "pointer",
                          color: "#156284",
                        }}
                        onClick={() => setPermissionModal(true)}
                      />
                    </>
                  ),
                  field: "permission",
                  searchable: false,
                  render: (rowData) => (
                    <Input
                      value={
                        rowData.permission === "ADMIN"
                          ? "Administrador"
                          : rowData.permission === "COLLABORATOR"
                          ? "Colaborador"
                          : "Visualizador"
                      }
                      onChange={(e) =>
                        handleSelectChange(rowData.username, e.target.value)
                      }
                      options={
                        rowData.permission === "ADMIN"
                          ? ["Administrador"]
                          : ["Colaborador", "Visualizador"]
                      }
                      disabled={rowData.permission === "ADMIN"}
                      style={{ minWidth: "150px" }}
                      tooltip={
                        rowData.permission === "ADMIN" ? (
                          <p style={{ textAlign: "center" }}>
                            Para alterar o perfil de administrador é necessário
                            excluir e associar novamente.
                          </p>
                        ) : (
                          ""
                        )
                      }
                      hideTooltip={true}
                    ></Input>
                  ),
                },
                {
                  title: "",
                  field: "delete",
                  searchable: false,
                  render: (rowData) =>
                    rowData.username === currentUsername ? (
                      ""
                    ) : (
                      <IconButton
                        onClick={() => {
                          handleDeleteUser(rowData.username);
                        }}
                        edge="end"
                        aria-label="delete"
                        className={styles.deleteButton}
                      >
                        <Delete />
                      </IconButton>
                    ),
                },
              ]}
              options={{
                paging: false,
                headerStyle: {
                  textAlign: "center",
                  fontFamily: "Inter",
                  padding: "12px",
                  fontWeight: "600",
                  zIndex: 1,
                  backgroundColor: "#FAFAFA",
                  fontSize: 13,
                },
                cellStyle: {
                  fontFamily: "Inter",
                  textAlign: "center",
                  fontWeight: "400",
                  fontSize: 13,
                  width: "232.8px",
                  padding: 8,
                  color: "#000",
                },
                sorting: false,
                draggable: false,
                maxBodyHeight: "calc(100vh - 283px)",
              }}
              localization={{
                header: {
                  actions: "Ações",
                },
                toolbar: {
                  searchPlaceholder: "Buscar Usuário",
                  searchTooltip: "Buscar Usuário",
                },
                body: {
                  emptyDataSourceMessage: "",
                },
              }}
              components={{
                Toolbar: (props) => (
                  <div className={classes.toolbarWrapper}>
                    <MTableToolbar {...props} />
                  </div>
                ),
                Pagination: () => null,
              }}
            />
          </>
        ) : (
          <div className={styles.noData}>
            <h5>Não há nenhum usuário associado</h5>
          </div>
        )}

        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
            paddingBlock: 10,
            paddingInline: 14,
          }}
        >
          <Button
            onClick={() => {
              setUsername("");
              setCreateModal(true);
              setNewUserEmail(null);
              setSelectedPermission("Visualizador");
            }}
            className="rounded-button"
          >
            Associar Usuário
          </Button>
        </div>
      </div>
      <>
        <ActionModal
          showModal={createModal}
          size={"sm"}
          toggleModal={() => {
            setCreateModal((prev) => !prev);
            setNewUserEmail(null);
            setSelectedPermission("Visualizador");
          }}
          onConfirm={() => {
            handleAddUser();
            setCreateModal(false);
          }}
          title="Adicionar novo usuário"
          subTitle="Convide novos usuários para monitorar seus ativos"
          bodyContent={
            <>
              <Input
                name="email"
                value={newUserEmail}
                onChange={handleEmailChange}
                label={"E-mail"}
                type="text"
                placeholder="usuario@email.com"
                hideTooltip={true}
              />
              <div>
                <Input
                  value={selectedPermission}
                  onChange={handlePermissionChange}
                  label={"Perfil de Usuário"}
                  options={["Visualizador", "Colaborador", "Administrador"]}
                  hideTooltip={true}
                ></Input>
                {selectedPermission === "Administrador" && (
                  <p className={styles.permissionInputInfo}>
                    O perfil de administrador terá acesso à árvore de ativos
                    inteira.
                  </p>
                )}
              </div>
            </>
          }
          modalLine={false}
          centeredFooter={true}
          dismissButton={false}
          confirmButtonText="Enviar Convite"
        />

        <ActionModal
          showModal={updateModal}
          toggleModal={() => {
            setUpdateModal((prev) => !prev);
          }}
          onConfirm={() => {
            selectChange(contentUpdate.permission, contentUpdate.index);
            setUpdateModal(false);
          }}
          title="Você está alterando a permissão de um usuário"
          bodyText={
            <>
              Deseja mesmo alterar a permissão de <span>{username}</span>?
            </>
          }
        />

        <ActionModal
          showModal={deleteModal}
          toggleModal={() => {
            setDeleteModal((prev) => !prev);
          }}
          onConfirm={() => {
            deleteUser(contentDelete);
            setDeleteModal(false);
          }}
          title="Você está deletando um usuário"
          bodyText={
            <>
              Deseja mesmo deletar o usuário <span>{username}</span> de sua
              associação?
            </>
          }
        />

        {permissionModal && (
          <PermissionModal
            showModal={true}
            toggleModal={() => {
              setPermissionModal((prev) => !prev);
            }}
          />
        )}
      </>
    </>
  );
}
