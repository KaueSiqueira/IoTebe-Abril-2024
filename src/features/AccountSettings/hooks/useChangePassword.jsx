import { useForm } from "react-hook-form";
import FeedbackToast from "../../../components/FeedbackToast/FeedbackToast";
import { useState } from "react";
import { updatePassword } from "../apis/updatePassword";

const useChangePassword = (togglePasswordModal, getUserInfo) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    setError,
    clearErrors,
  } = useForm({
    criteriaMode: "all",
    mode: "onChange",
  });

  const [loading, setLoading] = useState(false);

  const changePassword = async (values) => {
    setLoading(true);
    try {
      await updatePassword({
        old_password: values.currentpassword,
        new_password: values.password,
      });
      FeedbackToast.success();
      togglePasswordModal();
      getUserInfo();
    } catch (error) {
      if (error.response.data.message === "Wrong password") {
        setError("invalidPassword", {
          type: "invalidPassword",
          message: "Senha incorreta",
        });
      }
      console.error(error);
      FeedbackToast.error();
    } finally {
      setLoading(false);
    }
  };

  const handlePassword = () => {
    clearErrors("invalidPassword");
  };

  return {
    register,
    errors,
    handleSubmit,
    changePassword,
    handlePassword,
    loading,
    watch,
  };
};

export default useChangePassword;
