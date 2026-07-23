import { useEffect, useState } from "react";
import { updateEmail } from "../apis/updateEmail";

const useConfirmEmail = (location) => {
  const invalidToken = "O link de confirmação é inválido";
  const expiredToken = "O link de confirmação expirou";
  const validToken = "E-mail confirmado com sucesso";
  const invalidEmail = "Este e-mail já está em uso";

  const [isValid, setIsValid] = useState(false);
  const [message, setMessage] = useState(invalidToken);
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    const confirmEmail = async (token) => {
      try {
        await updateEmail(token);
        setMessage(validToken);
        setIsValid(true);
      } catch (error) {
        if (error.response?.data.message === "Expired token") {
          setMessage(expiredToken);
        }
        if (
          error.response?.data.message === "This e-mail is already being used"
        ) {
          setMessage(invalidEmail);
        }
        console.error(error);
      } finally {
        setIsPageLoading(false);
      }
    };
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");
    if (token) {
      confirmEmail(token);
    } else {
      setIsPageLoading(false);
    }
  }, [location.search]);

  return {
    isValid,
    message,
    isPageLoading,
  };
};

export default useConfirmEmail;
