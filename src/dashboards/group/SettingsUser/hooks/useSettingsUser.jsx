import { useContext, useEffect, useState } from "react";
import { WhichRenderContext } from "../../../../contexts";
import {
  addAdmin,
  addUserGroup,
  deleteAdmin,
  deleteUserGroup,
  getUsersGroup,
  updateUserGroup,
} from "../../../../apis";
import FeedbackToast from "../../../../components/FeedbackToast/FeedbackToast";

const useSettingsUser = (setPage) => {
  const {
    selectedNode: { id },
    userName: currentUsername,
  } = useContext(WhichRenderContext);

  const [tableData, setTableData] = useState([]);

  const [selectedPermission, setSelectedPermission] = useState("Visualizador");
  const [username, setUsername] = useState("");
  const [newUserEmail, setNewUserEmail] = useState(null);

  const [createModal, setCreateModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [permissionModal, setPermissionModal] = useState(false);

  const [contentUpdate, setContentUpdate] = useState({
    permission: "",
    index: null,
  });
  const [contentDelete, setContentDelete] = useState(null);

  const loadData = async (id) => {
    try {
      const { data } = await getUsersGroup(id);
      const currentUserindex = data.findIndex(
        (user) => user.username === currentUsername
      );
      if (currentUserindex !== -1) {
        const movedData = data.splice(currentUserindex, 1)[0];
        data.unshift(movedData);
      }
      setTableData(data);
    } catch (error) {
      console.error(error);
    }
  };

  const selectChange = async (permission, index) => {
    const {
      email,
      spot_group_id: group_id,
      permission: old_permission,
    } = tableData[index];

    try {
      if (old_permission !== "ADMIN") {
        await updateUserGroup(group_id, {
          email: email,
          permission: permission,
        });
        loadData(id);
        FeedbackToast.success();
      }
    } catch (err) {
      console.error(err);
      FeedbackToast.error();
    }
  };

  const deleteUser = async (index) => {
    const { email, spot_group_id: group_id, permission } = tableData[index];

    try {
      if (permission !== "ADMIN") {
        await deleteUserGroup(group_id, email);
      } else {
        await deleteAdmin(id, email);
      }

      loadData(id);
      FeedbackToast.success();
    } catch (err) {
      console.error(err);
      FeedbackToast.error();
    }
  };

  const handleEmailChange = (e) => {
    setNewUserEmail(e.target.value);
  };

  const handlePermissionChange = (e) => {
    setSelectedPermission(e.target.value);
  };

  const handleSelectChange = (username, selectedPermission) => {
    const userIndex = tableData.findIndex((user) => user.username === username);
    if (userIndex !== -1) {
      const permission =
        selectedPermission === "Colaborador" ? "COLLABORATOR" : "VIEWER";
      setUsername(tableData[userIndex].username);
      setContentUpdate({ permission: permission, index: userIndex });
      setUpdateModal(true);
    }
  };

  const handleDeleteUser = (username) => {
    const userIndex = tableData.findIndex((user) => user.username === username);
    if (userIndex !== -1) {
      setUsername(tableData[userIndex].username);
      setContentDelete(userIndex);
      setDeleteModal(true);
    }
  };

  const handleAddUser = async () => {
    try {
      const reqPermission =
        selectedPermission === "Visualizador"
          ? "VIEWER"
          : selectedPermission === "Colaborador"
          ? "COLLABORATOR"
          : "ADMIN";

      if (reqPermission !== "ADMIN") {
        await addUserGroup(id, {
          email: newUserEmail,
          permission: reqPermission,
        });
      } else {
        await addAdmin(id, { email: newUserEmail });
      }

      loadData(id);
      FeedbackToast.success();
    } catch (err) {
      console.error(err);
      FeedbackToast.error();
    }
  };

  useEffect(() => {
    loadData(id);
    return () => {
      setPage("dashgroup");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return {
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
  };
};

export default useSettingsUser;
