import { useEffect, useState } from "react";
import { getEmailByToken } from "../../RegisterAccount/apis";
import { useForm } from "react-hook-form";
import updateForgottenPassword from "../apis/updateForgottenPassword";
import FeedbackToast from "../../../components/FeedbackToast/FeedbackToast";
import { Auth } from "aws-amplify";

const useForgottenPasswordReset = (location) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    criteriaMode: "all",
    mode: "onChange",
  });

  const [email, setEmail] = useState(false);
  const [token, setToken] = useState("");
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await updateForgottenPassword(
        { email: email, new_password: data.password },
        token
      );
      await Auth.signOut();
      sessionStorage.clear();
      FeedbackToast.success();
      setPasswordChanged(true);
    } catch (error) {
      console.error(error);
      FeedbackToast.error();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getEmail = async (token) => {
      try {
        const { data } = await getEmailByToken(token, 4);
        setEmail(data.email);
      } catch (error) {
        console.error(error);
      } finally {
        setIsPageLoading(false);
      }
    };
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");
    if (token) {
      getEmail(token);
      setToken(token);
    } else {
      setIsPageLoading(false);
    }
  }, [location.search]);

  return {
    isPageLoading,
    email,
    register,
    handleSubmit,
    watch,
    errors,
    onSubmit,
    loading,
    passwordChanged,
  };
};

export default useForgottenPasswordReset;
