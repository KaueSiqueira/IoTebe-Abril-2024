import { useState } from "react";

const useCollectSpectrumButton = () => {
  const [openModal, setOpenModal] = useState(false);

  const handleModal = () => {
    setOpenModal((prev) => {
      return !prev;
    });
  };

  return {
    openModal,
    handleModal,
  };
};

export default useCollectSpectrumButton;
