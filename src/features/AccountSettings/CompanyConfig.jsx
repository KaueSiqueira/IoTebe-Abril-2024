import React from "react";
import styles from "./styles/AccountSettings.module.css";
import Input from "../../shared/components/Input";
import useCompanySettings from "./hooks/useCompanySettings";
import { formatErrorList } from "../../utilities";

const CompanyConfig = ({ companyInfo, saveCompanyInfo, userInfo }) => {
  const { register, errors, watch } = useCompanySettings(companyInfo);

  return (
    <div className={styles.contentContainer}>
      <div className={styles.configSection}>
        <h1 className={styles.contentTitle}>Configurações da Empresa</h1>
        <div className={styles.configInputs}>
          <Input
            label={"Nome"}
            placeholder={"Nome da empresa"}
            {...register("company_name", {
              required: true,
              minLength: { value: 3, message: "Mínimo 3 caracteres" },
              maxLength: { value: 255, message: "Máximo 255 caracteres" },
            })}
            saveButton={{
              isActive: watch("company_name") !== companyInfo.company_name,
              action: () => {
                saveCompanyInfo({
                  update: "company",
                  company_name: watch("company_name"),
                  company_city: companyInfo.company_city,
                  company_zipcode: companyInfo.company_zipcode,
                  company_address: companyInfo.company_address,
                  username: userInfo.username,
                });
              },
            }}
            errorMessages={formatErrorList(errors["company_name"])}
          />
          <Input
            label={"Cidade"}
            placeholder={"Nome da cidade"}
            {...register("company_city", {
              minLength: { value: 3, message: "Mínimo 3 caracteres" },
              maxLength: { value: 255, message: "Máximo 255 caracteres" },
            })}
            saveButton={{
              isActive: watch("company_city") !== companyInfo.company_city,
              action: () => {
                saveCompanyInfo({
                  update: "company",
                  company_name: companyInfo.company_name,
                  company_city: watch("company_city"),
                  company_zipcode: companyInfo.company_zipcode,
                  company_address: companyInfo.company_address,
                  username: userInfo.username,
                });
              },
            }}
            errorMessages={formatErrorList(errors["company_city"])}
          />
          <Input
            label={"CEP"}
            placeholder={"CEP do endereço"}
            {...register("company_zipcode", {
              minLength: { value: 3, message: "Mínimo 3 caracteres" },
              maxLength: { value: 255, message: "Máximo 255 caracteres" },
            })}
            saveButton={{
              isActive:
                watch("company_zipcode") !== companyInfo.company_zipcode,
              action: () => {
                saveCompanyInfo({
                  update: "company",
                  company_name: companyInfo.company_name,
                  company_city: companyInfo.company_city,
                  company_zipcode: watch("company_zipcode"),
                  company_address: companyInfo.company_address,
                  username: userInfo.username,
                });
              },
            }}
            errorMessages={formatErrorList(errors["company_zipcode"])}
          />
          <Input
            label={"Endereço"}
            placeholder={"Endereço da empresa"}
            {...register("company_address", {
              minLength: { value: 3, message: "Mínimo 3 caracteres" },
              maxLength: { value: 255, message: "Máximo 255 caracteres" },
            })}
            saveButton={{
              isActive:
                watch("company_address") !== companyInfo.company_address,
              action: () => {
                saveCompanyInfo({
                  update: "company",
                  company_name: companyInfo.company_name,
                  company_city: companyInfo.company_city,
                  company_zipcode: companyInfo.company_zipcode,
                  company_address: watch("company_address"),
                  username: userInfo.username,
                });
              },
            }}
            errorMessages={formatErrorList(errors["company_address"])}
          />
        </div>
      </div>
    </div>
  );
};

export default CompanyConfig;
