import { useState } from "react";
import { useForm } from "react-hook-form";
import { forgotPassword } from "../apis/forgotPassword";
import FeedbackToast from "../../../components/FeedbackToast/FeedbackToast";
import validate from "deep-email-validator";

const useForgotPassword = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm({ criteriaMode: "all" });

  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleSuccessModal = () => {
    setOpenSuccessModal((prev) => !prev);
  };

  const sendEmail = async (values) => {
    setLoading(true);
    try {
      await forgotPassword({ email: values.email });
      FeedbackToast.success();
      toggleSuccessModal();
    } catch (error) {
      if (error.response.data.message === "This e-mail was not found.") {
        setError("emailNotFound", {
          type: "emailNotFound",
          message: "emailNotFound",
        });
      }
      console.error(error);
      FeedbackToast.error();
    } finally {
      setLoading(false);
    }
  };

  return {
    openSuccessModal,
    toggleSuccessModal,
    register,
    handleSubmit,
    watch,
    sendEmail,
    loading,
    errors,
    validateEmail: validate,
    clearErrors,
  };
};

export default useForgotPassword;
