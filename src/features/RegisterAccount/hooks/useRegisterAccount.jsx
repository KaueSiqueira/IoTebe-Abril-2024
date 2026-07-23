import { useEffect, useState } from "react";
import { getEmailByToken } from "../apis";

const useRegisterAccount = (location) => {
  const [email, setEmail] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [numberToVerify, setNumberToVerify] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("BR");
  const [token, setToken] = useState("");
  const [endRegister, setEndRegister] = useState(false);

  const handleNumberToVerify = (value) => {
    setNumberToVerify(value);
  };

  const handleNumberCountry = (value) => {
    setSelectedCountry(value);
  };

  // Get email by token
  useEffect(() => {
    const getEmail = async (token) => {
      try {
        const { data } = await getEmailByToken(token, 1);
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

  const handleEndRegister = () => {
    setEndRegister(true);
  };

  return {
    email,
    isPageLoading,
    numberToVerify,
    handleNumberToVerify,
    selectedCountry,
    handleNumberCountry,
    token,
    endRegister,
    handleEndRegister,
  };
};

export default useRegisterAccount;
