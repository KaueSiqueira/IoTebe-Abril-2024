import React from "react";
import useRegisterAccount from "./hooks/useRegisterAccount";
import { FullPageLoader } from "../../components";
import { Redirect } from "react-router-dom";
import RegisterForm from "./components/RegisterForm";
import VerifyNumber from "./components/VerifyNumber";
import ValidTokenInfo from "../../shared/components/ValidTokenInfo";
import SimpleNavbar from "../../shared/components/SimpleNavbar";

const RegisterAccount = ({ location }) => {
  const {
    email,
    isPageLoading,
    numberToVerify,
    handleNumberToVerify,
    selectedCountry,
    handleNumberCountry,
    token,
    endRegister,
    handleEndRegister,
  } = useRegisterAccount(location);

  if (isPageLoading) {
    return <FullPageLoader />;
  }
  if (endRegister) {
    return (
      <Redirect
        to={{
          pathname: "/",
        }}
      />
    );
  }
  if (!email) {
    return (
      <>
        <SimpleNavbar />
        <ValidTokenInfo
          isValid={false}
          message={"O link de cadastro é inválido"}
        />
      </>
    );
  }

  return (
    <>
      <SimpleNavbar />
      {numberToVerify ? (
        <VerifyNumber
          numberToVerify={numberToVerify}
          handleNumberToVerify={handleNumberToVerify}
          selectedCountry={selectedCountry}
          handleNumberCountry={handleNumberCountry}
          handleEndRegister={handleEndRegister}
        />
      ) : (
        <RegisterForm
          email={email}
          handleNumberToVerify={handleNumberToVerify}
          selectedCountry={selectedCountry}
          handleNumberCountry={handleNumberCountry}
          token={token}
          handleEndRegister={handleEndRegister}
        />
      )}
    </>
  );
};

export default RegisterAccount;
