import { useForm } from "react-hook-form";
import validate from "deep-email-validator";
import { sendChangeEmail } from "../apis/sendChangeEmail";
import FeedbackToast from "../../../components/FeedbackToast/FeedbackToast";
import { useState } from "react";

const useChangeEmail = (toggleEmailModal) => {
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
  const [emailSended, setEmailSended] = useState(false);

  const checkEmail = async (values) => {
    const emailIsValid = await validate({
      email: values.email,
      sender: values.email,
      validateRegex: true,
      validateMx: true,
      validateTypo: true,
      validateDisposable: true,
      validateSMTP: false,
    });

    if (emailIsValid.valid) {
      setLoading(true);
      try {
        await sendChangeEmail(values);
        setEmailSended(true);
        FeedbackToast.success();
      } catch (error) {
        if (error.response.data.message === "Wrong password") {
          setError("invalidPassword", {
            type: "invalidPassword",
            message: "Senha incorreta",
          });
        }
        if (
          error.response.data.message === "This e-mail is already being used"
        ) {
          setError("invalidEmail", {
            type: "invalidEmail",
            message: "Este e-mail já está em uso",
          });
        }
        console.error(error);
        FeedbackToast.error();
      } finally {
        setLoading(false);
      }
    } else {
      setError("invalidEmail", {
        type: "invalidEmail",
        message: "E-mail inválido",
      });
    }
  };

  const handleEmail = () => {
    clearErrors("invalidEmail");
  };

  const handlePassword = () => {
    clearErrors("invalidPassword");
  };

  return {
    register,
    errors,
    handleSubmit,
    checkEmail,
    handleEmail,
    handlePassword,
    loading,
    emailSended,
    watch,
  };
};

export default useChangeEmail;
