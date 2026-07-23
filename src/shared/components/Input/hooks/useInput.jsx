import { useRef } from "react";
import { useState } from "react";

const useInput = (isFakePassword) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [openCopyTooltip, setOpenCopyTooltip] = useState(false);
  const [openCopyTooltipTimer, setOpenCopyTooltipTimer] = useState(null);
  const [isValueHide, setIsValueHide] = useState(!!isFakePassword);

  const inputRef = useRef(null);

  const togglePasswordVisibility = () => {
    if (isFakePassword) {
      if (isPasswordVisible) {
        setIsValueHide(true);
      } else {
        setIsValueHide(false);
      }
    }
    setIsPasswordVisible((prev) => !prev);
  };

  const handleCopy = (value) => {
    navigator.clipboard.writeText(value);
    clearTimeout(openCopyTooltipTimer);
    setOpenCopyTooltip(true);
    const timeout = setTimeout(() => setOpenCopyTooltip(false), 1000);
    setOpenCopyTooltipTimer(timeout);
  };

  const handleFocus = () => {
    inputRef.current.focus();
  };

  return {
    isPasswordVisible,
    togglePasswordVisibility,
    handleCopy,
    openCopyTooltip,
    inputRef,
    handleFocus,
    isValueHide,
  };
};

export default useInput;
