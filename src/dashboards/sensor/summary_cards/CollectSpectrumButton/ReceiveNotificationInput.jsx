import { Tooltip } from "@mui/material";
import React from "react";

const ReceiveNotificationTooltip = ({ children, userPhone }) => {
  return (
    <>
      {userPhone ? (
        <>{children}</>
      ) : (
        <>
          <Tooltip
            title={`Cadastre seu número do WhatsApp para habilitar esta opção`}
            placement="bottom"
            arrow
          >
            {children}
          </Tooltip>
        </>
      )}
    </>
  );
};

export default ReceiveNotificationTooltip;
