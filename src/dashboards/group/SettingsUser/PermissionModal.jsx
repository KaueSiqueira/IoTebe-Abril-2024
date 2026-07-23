import React from "react";
import { Modal } from "reactstrap";
import styles from "./styles/PermissionModal.module.css";
import {
  CheckCircleOutlineRounded,
  CloseRounded,
  HighlightOffRounded,
} from "@mui/icons-material";
import MaterialTable from "material-table";

const tableData = [
  {
    permission: "Gerenciar Usuários",
    viewer: false,
    collaborator: false,
    admin: true,
  },
  {
    permission: "Configurar Árvore de Ativos",
    viewer: false,
    collaborator: false,
    admin: true,
  },
  {
    permission: "Configurar Pontos de Coleta",
    viewer: false,
    collaborator: false,
    admin: true,
  },
  {
    permission: "Configurar Gateways",
    viewer: false,
    collaborator: false,
    admin: true,
  },
  {
    permission: "Configurar Alarmes",
    viewer: false,
    collaborator: false,
    admin: true,
  },
  {
    permission: "Configurar Dados Técnicos de Equipamentos",
    viewer: false,
    collaborator: false,
    admin: true,
  },
  {
    permission: "Configurar Coleta",
    viewer: false,
    collaborator: false,
    admin: true,
  },
  {
    permission: "Configurar Gráficos",
    viewer: false,
    collaborator: false,
    admin: true,
  },
  {
    permission: "Acesso à API",
    viewer: false,
    collaborator: false,
    admin: true,
  },
  {
    permission: "Gerenciar Diagnósticos",
    viewer: false,
    collaborator: true,
    admin: true,
  },
  {
    permission: "Concluir Diagnósticos",
    viewer: false,
    collaborator: true,
    admin: true,
  },
  {
    permission: "Fazer Anotações",
    viewer: false,
    collaborator: true,
    admin: true,
  },
];

function PermissionModal({ showModal, toggleModal }) {
  return (
    <>
      <Modal
        backdrop
        isOpen={showModal}
        toggle={toggleModal}
        centered
        contentClassName={styles.modalContent}
        className={styles.modal}
      >
        <div className={styles.modalContainer}>
          <>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Perfis de Usuário</h3>
              <CloseRounded onClick={toggleModal} />
            </div>
            <div className={styles.modalBody}>
              <MaterialTable
                data={tableData}
                style={{ boxShadow: "none" }}
                columns={[
                  {
                    title: "",
                    field: "permission",
                  },
                  {
                    title: "Visualizador",
                    field: "viewer",
                    render: (rowData) =>
                      !rowData.viewer ? (
                        <HighlightOffRounded className={styles.notAllowed} />
                      ) : (
                        <CheckCircleOutlineRounded className={styles.allowed} />
                      ),
                  },
                  {
                    title: "Colaborador",
                    field: "collaborator",
                    render: (rowData) =>
                      !rowData.collaborator ? (
                        <HighlightOffRounded className={styles.notAllowed} />
                      ) : (
                        <CheckCircleOutlineRounded className={styles.allowed} />
                      ),
                  },
                  {
                    title: "Administrador",
                    field: "admin",
                    render: (rowData) =>
                      !rowData.admin ? (
                        <HighlightOffRounded className={styles.notAllowed} />
                      ) : (
                        <CheckCircleOutlineRounded className={styles.allowed} />
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
                    padding: 14,
                    paddingInline: 60,
                    color: "#000",
                  },
                  sorting: false,
                  draggable: false,
                }}
                localization={{
                  header: {
                    actions: "Ações",
                  },
                  body: {
                    emptyDataSourceMessage: "",
                  },
                }}
                components={{
                  Pagination: () => null,
                  Toolbar: () => null,
                }}
              />
            </div>
          </>
        </div>
      </Modal>
    </>
  );
}

export default PermissionModal;
