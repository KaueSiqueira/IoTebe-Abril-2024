import React, { useEffect } from "react";
import styles from "./styles/AccountSettings.module.css";
import { concatClassName } from "../../utilities";
import Input from "../../shared/components/Input";
import Button from "../../shared/components/Button";
import { InfoOutlined, KeyRounded, LaunchRounded } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import FeedbackToast from "../../components/FeedbackToast/FeedbackToast";

const ApiConfig = ({ apiKeyInfo, getApiKey, generateApiKey }) => {
  useEffect(() => {
    getApiKey();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.contentContainer}>
      <div className={styles.configSection}>
        <h1 className={styles.contentTitle}>Chave de API</h1>
        <div
          className={concatClassName(styles.configInputs, styles.apiKeyInput)}
        >
          <Input
            type={"password"}
            defaultValue={apiKeyInfo.api_key}
            placeholder={"Chave da API"}
            copyButton={true}
            readOnly
          />
          <Button size="sm" onClick={generateApiKey}>
            <KeyRounded /> Gerar nova chave
          </Button>
        </div>
      </div>
      <div className={`${styles.configSection} ${styles.apiSection}`}>
        <h1 className={styles.contentTitle}>Documentação</h1>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            // modo demonstração — não expõe a documentação real da API
            FeedbackToast.info("Documentação indisponível no modo demonstração.");
          }}
          className={styles.apiLink}
        >
          <LaunchRounded />
          <p>Documentação API IoTebe</p>
        </a>
      </div>
      {apiKeyInfo.api_key !== "" && (
        <div className={`${styles.configSection} ${styles.apiSection}`}>
          <h1 className={styles.contentTitle}>
            Quantidade de requisições disponíveis neste mês
            <Tooltip
              placement="top"
              title={
                <span className={styles.tooltipText}>
                  A quantidade de requisições é revertida ao total todo início
                  de mês, sem acumular requisições não utilizadas em meses
                  anteriores
                </span>
              }
              arrow
            >
              <InfoOutlined className={styles.tooltipIcon} />
            </Tooltip>
          </h1>
          <p
            className={concatClassName(
              styles.quota,
              apiKeyInfo.remaining_requests < 1 && styles.noRequestRemaining
            )}
          >
            {apiKeyInfo.remaining_requests} de {apiKeyInfo.limit_per_month}{" "}
            requisições disponíveis
            {apiKeyInfo.remaining_requests < 1 && (
              <>
                <br />
                <span>
                  Contate o{" "}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      // modo demonstração — não expõe canais de suporte reais (WhatsApp)
                      FeedbackToast.info("Suporte indisponível no modo demonstração.");
                    }}
                  >
                    suporte técnico
                  </a>{" "}
                  para obter mais requisições.
                </span>
              </>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default ApiConfig;
