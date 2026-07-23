import { LinearProgress, makeStyles } from "@material-ui/core";
import React from "react";
import styles from "./ProcessPastData.module.css";

const useStyles = makeStyles({
  colorPrimary: {
    backgroundColor: "#d6e8ef",
  },
  barColorPrimary: {
    backgroundColor: "#156284",
  },
});

const ProcessPastData = ({
  processedDataCount,
  nonProcessedDataCount,
  processPastDataFunction,
  isProcessingData,
  canProcessData,
}) => {
  const classes = useStyles();

  return (
    <div
      className={`${styles.processPastData} ${
        canProcessData ? styles.active : ""
      }`}
    >
      <button
        onClick={() => {
          processPastDataFunction();
        }}
        className={`${styles.processPastDataButton} ${
          isProcessingData ? styles.loading : ""
        }`}
      >
        {nonProcessedDataCount > 0
          ? isProcessingData
            ? processedDataCount > 0
              ? "Carregando..."
              : "Aguarde..."
            : "Carregar dados"
          : "Dados carregados!"}
      </button>
      <div
        className={`${styles.progressBar} ${
          isProcessingData || processedDataCount > 0
            ? styles.activeProgress
            : ""
        }`}
      >
        <div className={styles.progress}>
          <LinearProgress
            variant="determinate"
            value={
              nonProcessedDataCount > 0
                ? Math.floor((processedDataCount / nonProcessedDataCount) * 100)
                : 100
            }
            classes={{
              colorPrimary: classes.colorPrimary,
              barColorPrimary: classes.barColorPrimary,
            }}
          />
        </div>
        <span className={styles.percentage}>
          {nonProcessedDataCount > 0
            ? Math.floor((processedDataCount / nonProcessedDataCount) * 100)
            : 100}
          %
        </span>
      </div>
    </div>
  );
};

export default ProcessPastData;
