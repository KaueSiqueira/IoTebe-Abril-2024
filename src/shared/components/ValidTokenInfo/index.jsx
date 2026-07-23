import React from "react";
import styles from "./styles/ValidTokenInfo.module.css";
import { CancelRounded, CheckCircleRounded } from "@mui/icons-material";
import Button from "../Button";

const ValidTokenInfo = ({ isValid, message }) => {
  return (
    <div className={styles.confirmContainer}>
      {isValid ? (
        <CheckCircleRounded className={styles.valid} />
      ) : (
        <CancelRounded className={styles.invalid} />
      )}

      <h1>{message}</h1>

      <Button href="./" size="lg">
        Acessar IoTebe
      </Button>
    </div>
  );
};

export default ValidTokenInfo;
