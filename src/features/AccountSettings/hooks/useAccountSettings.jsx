import { useEffect, useState } from "react";
import { readUserInfo } from "../apis/readUserInfo";
import { getApiKeyInfo } from "../apis/getApiKeyInfo";
import { parsePhoneNumber } from "react-phone-number-input";
import { getCountries } from "react-phone-number-input";
import en from "react-phone-number-input/locale/en";
import { configUserInfo } from "../../../apis";
import { Auth } from "aws-amplify";
import FeedbackToast from "../../../components/FeedbackToast/FeedbackToast";
import { getCountryCallingCode } from "react-phone-number-input";
import { createApiKey } from "../apis/createApiKey";

const useAccountSettings = () => {
  const [loadingUserInfo, setLoadingUserInfo] = useState(false);
  const [userInfo, setUserInfo] = useState({
    email: "",
    username: "",
    name: "",
    phone: "",
    phoneCountry: "BR",
  });
  const [companyInfo, setCompanyInfo] = useState({
    company_name: "",
    company_city: "",
    company_zipcode: "",
    company_address: "",
  });

  const [loadingApiKey, setLoadingApiKey] = useState(false);
  const [apiKeyInfo, setApiKeyInfo] = useState({
    api_key: "",
    remaining_requests: 0,
    limit_per_month: 0,
  });

  const countries = getCountries();

  const getUserInfo = async () => {
    setLoadingUserInfo(true);
    try {
      const { data } = await readUserInfo();
      const parsePhone =
        data?.phone && data?.phone !== ""
          ? parsePhoneNumber("+" + data.phone)
          : null;
      setUserInfo({
        email: data.email || "",
        username: data.username || "",
        name: data.name || "",
        phone: parsePhone?.nationalNumber || "",
        phoneCountry: parsePhone?.country || "BR",
      });

      setCompanyInfo({
        company_name: data.company_name || "",
        company_city: data.company_city || "",
        company_zipcode: data.company_zipcode || "",
        company_address: data.company_address || "",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingUserInfo(false);
    }
  };

  const getApiKey = async () => {
    setLoadingApiKey(true);
    try {
      const { data } = await getApiKeyInfo();
      setApiKeyInfo({
        api_key: data.api_key || "",
        remaining_requests: data.remaining_requests || 0,
        limit_per_month: data.limit_per_month || 0,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingApiKey(false);
    }
  };

  const saveUserInfo = async (payload) => {
    payload = {
      ...payload,
      phone: getCountryCallingCode(userInfo.phoneCountry) + payload.phone,
    };
    setLoadingUserInfo(true);
    try {
      await configUserInfo(payload);
      const user = await Auth.currentAuthenticatedUser();
      Auth.updateUserAttributes(user, { name: payload.name });
      getUserInfo();
      FeedbackToast.success();
    } catch (error) {
      console.error(error);
      FeedbackToast.error();
      setLoadingUserInfo(false);
    }
  };

  const saveCompanyInfo = async (payload) => {
    setLoadingUserInfo(true);
    try {
      await configUserInfo(payload);
      const user = await Auth.currentAuthenticatedUser();
      Auth.updateUserAttributes(user, { locale: payload.company_name });
      getUserInfo();
      FeedbackToast.success();
    } catch (error) {
      console.error(error);
      FeedbackToast.error();
      setLoadingUserInfo(false);
    }
  };

  const generateApiKey = async () => {
    setLoadingApiKey(true);
    try {
      await createApiKey();
      getApiKey();
      FeedbackToast.success();
    } catch (error) {
      FeedbackToast.error();
      console.error(error);
      setLoadingApiKey(false);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return {
    loading: loadingUserInfo || loadingApiKey,
    userInfo,
    companyInfo,
    apiKeyInfo,
    countryLabels: en,
    countries,
    saveUserInfo,
    getUserInfo,
    saveCompanyInfo,
    getApiKey,
    generateApiKey,
  };
};

export default useAccountSettings;
