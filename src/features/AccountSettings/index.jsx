import React from "react";
import styles from "./styles/AccountSettings.module.css";
import TabPanel from "../../shared/components/TabPanel";
import useAccountSettings from "./hooks/useAccountSettings";
import ComponentLoader from "../../components/ComponentLoader";
import UserConfig from "./UserConfig";
import CompanyConfig from "./CompanyConfig";
import ApiConfig from "./ApiConfig";
import {
  Allowed,
  NotAllowed,
  ProtectedFeature,
} from "../../components/ProtectedFeature/ProtectedFeature";

const AccountSettings = () => {
  const {
    loading,
    userInfo,
    companyInfo,
    apiKeyInfo,
    countryLabels,
    countries,
    saveUserInfo,
    getUserInfo,
    saveCompanyInfo,
    getApiKey,
    generateApiKey,
  } = useAccountSettings();

  const defaultTabs = [
    {
      label: "Usuário",
      content: (
        <UserConfig
          userInfo={userInfo}
          countryLabels={countryLabels}
          countries={countries}
          saveUserInfo={saveUserInfo}
          getUserInfo={getUserInfo}
        />
      ),
    },
    {
      label: "Empresa",
      content: (
        <CompanyConfig
          companyInfo={companyInfo}
          saveCompanyInfo={saveCompanyInfo}
          userInfo={userInfo}
        />
      ),
    },
  ];

  return (
    <>
      {loading && <ComponentLoader className={styles.loaderComponent} />}
      <div className={styles.accountSettings}>
        <div className={styles.mainTitle}>
          <h1>Configurações do Perfil</h1>
        </div>
        <ProtectedFeature requiredPermissions={["API_ACCESS"]} verifyEntireTree>
          <Allowed>
            <TabPanel
              tabs={[
                ...defaultTabs,
                {
                  label: "API",
                  content: (
                    <ApiConfig
                      apiKeyInfo={apiKeyInfo}
                      getApiKey={getApiKey}
                      generateApiKey={generateApiKey}
                    />
                  ),
                },
              ]}
            />
          </Allowed>
          <NotAllowed>
            <TabPanel tabs={defaultTabs} />
          </NotAllowed>
        </ProtectedFeature>
      </div>
    </>
  );
};

export default AccountSettings;
