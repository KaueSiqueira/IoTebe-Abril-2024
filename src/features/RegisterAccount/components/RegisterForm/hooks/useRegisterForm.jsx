import { useState } from "react";
import en from "react-phone-number-input/locale/en";
import { getCountries } from "react-phone-number-input";
import { useForm } from "react-hook-form";
import { isValidPhoneNumber } from "react-phone-number-input";
import { getCountryCallingCode } from "react-phone-number-input";
import { registerUser } from "../../../apis";
import FeedbackToast from "../../../../../components/FeedbackToast/FeedbackToast";
import { Auth } from "aws-amplify";

const useRegisterAccount = (
  handleNumberToVerify,
  selectedCountry,
  handleNumberCountry,
  token,
  handleEndRegister
) => {
  // Form validation
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm({
    criteriaMode: "all",
    mode: "onChange",
  });
  const [loadingRegistration, setLoadingRegistration] = useState(false);

  const countries = getCountries();

  const handleChangeValue = (input, value) => {
    setValue(input, value, { shouldValidate: true });
  };

  const validatePhoneNumber = (phoneNumber) => {
    if (phoneNumber !== "") {
      const countryCode = "+" + getCountryCallingCode(selectedCountry);
      return isValidPhoneNumber(countryCode + phoneNumber);
    }
    return true;
  };

  const handleSelectCountry = (value) => {
    handleNumberCountry(value);
    handleChangeValue("phone", "");
  };

  const onSubmit = async (data) => {
    const countryCode = getCountryCallingCode(selectedCountry);
    const phoneNumber = data.phone !== "" ? countryCode + data.phone : "";
    setLoadingRegistration(true);
    try {
      await registerUser({ ...data, phone: phoneNumber }, token);
      await Auth.signIn(data.username, data.password);
      data.phone !== "" && validatePhoneNumber(data.phone)
        ? handleNumberToVerify(data.phone)
        : handleEndRegister();
      FeedbackToast.success();
    } catch (error) {
      console.error(error);
      FeedbackToast.error();
    } finally {
      setLoadingRegistration(false);
    }
  };

  return {
    selectedCountry,
    countryLabels: en,
    countries,
    onSubmit,
    register,
    handleSubmit,
    errors,
    validatePhoneNumber,
    handleSelectCountry,
    handleChangeValue,
    watch,
    loadingRegistration,
  };
};

export default useRegisterAccount;
