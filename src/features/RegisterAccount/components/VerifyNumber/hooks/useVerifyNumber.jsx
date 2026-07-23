import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  formatPhoneNumber,
  isValidPhoneNumber,
} from "react-phone-number-input";
import { getCountryCallingCode } from "react-phone-number-input";
import { getCountries } from "react-phone-number-input";
import en from "react-phone-number-input/locale/en";
import { confirmVerificationCode, sendVerificationCode } from "../../../apis";
import FeedbackToast from "../../../../../components/FeedbackToast/FeedbackToast";

const useVerifyNumber = (
  numberToVerify,
  handleNumberToVerify,
  selectedCountry,
  handleNumberCountry,
  handleEndRegister
) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    setFocus,
    setError,
    clearErrors,
    watch,
  } = useForm({ criteriaMode: "all", mode: "onChange" });

  const [verifyCode, setVerifyCode] = useState({
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
    6: "",
  });
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [time, setTime] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [phoneModel, setPhoneModal] = useState(false);
  const [tempSelectedCountry, setTempSelectedCountry] =
    useState(selectedCountry);

  const countries = getCountries();

  const countryCode = "+" + getCountryCallingCode(selectedCountry);

  const formattedNumber =
    countryCode + " " + formatPhoneNumber(countryCode + numberToVerify);

  const sendWhatsappCode = async (country, number) => {
    startTimer();
    try {
      await sendVerificationCode({
        phone_number:
          getCountryCallingCode(country || selectedCountry) +
          (number || numberToVerify),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const confirmWhatsappCode = async (data) => {
    setLoadingVerify(true);
    const code = Object.keys(data).map((key) => {
      if (key !== "verifyPhone") {
        return data[key];
      }
      return "";
    });
    try {
      await confirmVerificationCode({
        phone_number: getCountryCallingCode(selectedCountry) + numberToVerify,
        verification_code: code.join(""),
      });
      FeedbackToast.success();
      handleEndRegister();
    } catch (error) {
      console.error(error);
      setError("invalidCode", { type: "invalidCode", message: "invalidCode" });
      FeedbackToast.error();
    } finally {
      setLoadingVerify(false);
    }
  };

  const handleChangeValue = (input, value) => {
    input !== "verifyPhone" && clearErrors("invalidCode");
    setValue(input, value);
  };

  const handleChangeFocus = (input) => {
    setFocus(input);
  };

  const validatePhoneNumber = (phoneNumber) => {
    const isValid = isValidPhoneNumber(
      "+" + getCountryCallingCode(tempSelectedCountry) + phoneNumber
    );

    return isValid;
  };

  const handleCodeInput = (e, digit) => {
    let value = e.target.value.replace(/[^\d]+/g, "");

    if (value.length > 1) {
      if (verifyCode[digit] === value.charAt(0)) {
        value = value.charAt(1);
      } else {
        value = value.charAt(0);
      }
    }

    handleChangeValue(`digit-${digit}`, value);
    setVerifyCode((prev) => {
      const newValue = { ...prev, [digit]: value };
      return newValue;
    });

    if (value.length === 1 && digit < 6) {
      handleChangeFocus(`digit-${digit + 1}`);
    }
  };

  const handleKeyDown = (e, digit) => {
    if (/[.,\-+]/.test(e.key)) {
      e.preventDefault();
      return;
    }

    if (e.key === "ArrowRight") {
      if (digit < 6) {
        handleChangeFocus(`digit-${digit + 1}`);
      } else {
        handleChangeFocus(`digit-1`);
      }
      return;
    }

    if (e.key === "ArrowLeft") {
      if (digit > 1) {
        handleChangeFocus(`digit-${digit - 1}`);
      } else {
        handleChangeFocus(`digit-6`);
      }
      return;
    }

    if (e.key === "Backspace") {
      e.preventDefault();
      if (verifyCode[digit] === "" && digit > 1) {
        handleChangeFocus(`digit-${digit - 1}`);
        handleCodeInput({ target: { value: "" } }, digit - 1);
      } else {
        handleCodeInput({ target: { value: "" } }, digit);
      }
      return;
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const values = (e.clipboardData || window.clipboardData)
      .getData("text")
      .split("");
    const codeLength = values.length > 6 ? 6 : values.length;
    for (let i = 0; i < codeLength; i++) {
      handleCodeInput({ target: { value: values[i] } }, i + 1);
    }
  };

  const startTimer = () => {
    setTime(60);
    setIsRunning(true);
  };

  const formatTime = () => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? "0" + minutes : minutes}:${
      seconds < 10 ? "0" + seconds : seconds
    }`;
  };

  const handleTempCountry = (value) => {
    handleChangeValue("verifyPhone", "");
    setTempSelectedCountry(value);
  };

  const togglePhoneModal = () => {
    setPhoneModal((prev) => {
      if (!prev) {
        handleTempCountry(selectedCountry);
        handleChangeValue("verifyPhone", numberToVerify);
      }
      return !prev;
    });
  };

  const handleNewPhone = () => {
    if (
      watch("verifyPhone") !== numberToVerify ||
      tempSelectedCountry !== selectedCountry
    ) {
      if (validatePhoneNumber(watch("verifyPhone"))) {
        handleNumberCountry(tempSelectedCountry);
        handleNumberToVerify(watch("verifyPhone"));
        sendWhatsappCode(tempSelectedCountry, watch("verifyPhone"));
        togglePhoneModal();
        handleChangeValue("digit-1", "");
        handleChangeValue("digit-2", "");
        handleChangeValue("digit-3", "");
        handleChangeValue("digit-4", "");
        handleChangeValue("digit-5", "");
        handleChangeValue("digit-6", "");
      }
    } else {
      togglePhoneModal();
    }
  };

  useEffect(() => {
    let timer;
    if (isRunning && time > 0) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      clearInterval(timer);
      setIsRunning(false);
    }

    return () => clearInterval(timer);
  }, [isRunning, time]);

  useEffect(() => {
    sendWhatsappCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    countries,
    countryLabels: en,
    register,
    validatePhoneNumber,
    handleChangeValue,
    errors,
    handleCodeInput,
    handleKeyDown,
    handlePaste,
    handleSubmit,
    confirmWhatsappCode,
    formattedNumber,
    loadingVerify,
    sendWhatsappCode,
    formatTime,
    isRunning,
    phoneModel,
    togglePhoneModal,
    handleNewPhone,
    tempSelectedCountry,
    handleTempCountry,
  };
};

export default useVerifyNumber;
