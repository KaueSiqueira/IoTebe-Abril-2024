import React from "react";
import useConfirmEmail from "./hooks/useConfirmEmail";
import FullPageLoader from "../../components/FullPageLoader";
import ValidTokenInfo from "../../shared/components/ValidTokenInfo";
import SimpleNavbar from "../../shared/components/SimpleNavbar";

const ConfirmEmail = ({ location }) => {
  const { isValid, message, isPageLoading } = useConfirmEmail(location);

  if (isPageLoading) {
    return <FullPageLoader />;
  }

  return (
    <>
      <SimpleNavbar />
      <ValidTokenInfo isValid={isValid} message={message} />
    </>
  );
};

export default ConfirmEmail;
