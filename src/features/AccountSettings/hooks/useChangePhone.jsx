import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { getCountryCallingCode } from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";

const useChangePhone = (togglePhoneModal, userInfo, getUserInfo) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
  } = useForm({
    criteriaMode: "all",
    mode: "onChange",
  });

  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(userInfo.phoneCountry);
  const [validPhone, setValidPhone] = useState(false);
  const [isCodeValid, setIsCodeValid] = useState(false);

  const verifyCodeRef = useRef(null);

  const handleNumberCountry = (value) => {
    setSelectedCountry(value);
  };

  const validatePhoneNumber = (phoneNumber) => {
    if (phoneNumber !== "") {
      if (userInfo.phone === phoneNumber) {
        return false;
      }
      const countryCode = "+" + getCountryCallingCode(selectedCountry);
      return isValidPhoneNumber(countryCode + phoneNumber);
    }
    return true;
  };

  const handleSelectCountry = (value) => {
    console.log(value);
    handleNumberCountry(value);
    setValue("phone", "");
  };

  const validateCodeSubmit = () => {
    verifyCodeRef.current.dispatchEvent(
      new Event("submit", { cancelable: true })
    );
  };

  const nextStep = () => {
    setValidPhone(true);
  };

  const prevStep = () => {
    setValidPhone(false);
  };

  useEffect(() => {
    if (isCodeValid) {
      getUserInfo();
      togglePhoneModal();
    }
  }, [getUserInfo, isCodeValid, togglePhoneModal]);

  return {
    register,
    errors,
    handleSubmit,
    loading,
    setLoading,
    watch,
    handleSelectCountry,
    validatePhoneNumber,
    setValue,
    validPhone,
    selectedCountry,
    nextStep,
    prevStep,
    verifyCodeRef,
    setIsCodeValid,
    validateCodeSubmit,
  };
};

export default useChangePhone;
