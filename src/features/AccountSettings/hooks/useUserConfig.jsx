import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const useUserConfig = (userInfo) => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    criteriaMode: "all",
    mode: "onChange",
  });

  const [openEmailModal, setOpenEmailModal] = useState(false);
  const [openPhoneModal, setOpenPhoneModal] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);

  const toggleEmailModal = () => {
    setOpenEmailModal((prev) => !prev);
  };

  const togglePhoneModal = () => {
    setOpenPhoneModal((prev) => !prev);
  };

  const togglePasswordModal = () => {
    setOpenPasswordModal((prev) => !prev);
  };

  useEffect(() => {
    setValue("name", userInfo.name);
  }, [setValue, userInfo]);

  return {
    register,
    errors,
    watch,
    openEmailModal,
    toggleEmailModal,
    openPhoneModal,
    togglePhoneModal,
    openPasswordModal,
    togglePasswordModal,
  };
};

export default useUserConfig;
