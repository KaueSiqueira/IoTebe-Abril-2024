import { useState } from "react";
import { useForm } from "react-hook-form";

import authService from '../../../shared/services/authService';

const useLogin = (isLoading, history) => {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({ criteriaMode: "all" });

  const [forgotPassword, setForgotPassword] = useState(false);

  const toggleForgotPassword = () => {
    setForgotPassword((prev) => !prev);
  };

  const handleSignIn = async (velues) => {
    isLoading(true);
    const { username, password } = velues;

    try {
      await authService.signIn(username, password);
      history.push("/dashboard");
    } catch (error) {
      setError("invalid");
      isLoading(false);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    clearErrors,
    toggleForgotPassword,
    forgotPassword,
    handleSignIn,
  };
};

export default useLogin;
