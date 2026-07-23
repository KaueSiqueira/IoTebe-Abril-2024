import { useContext, useEffect, useState } from "react";
import { getInstantSpectrum } from "../apis/getInstantSpectrum";
import { WhichRenderContext } from "../../../../../contexts";
import { updateInstantSpectrum } from "../apis/updateInstantSpectrum";
import FeedbackToast from "../../../../../components/FeedbackToast/FeedbackToast";

const useCollectSpectrumModal = (spotId, showModal, toggleModal) => {
  const [receiveNotification, setReceiveNotification] = useState(true);
  const [lastInstantSpectrum, setLastInstantSpectrum] = useState({
    name: null,
    last_instant_collect: null,
  });
  const [canInstantCollect, setCanInstantCollect] = useState(false);
  const [loading, setLoading] = useState(false);
  const { selectedNodeFullPath, userPhone } = useContext(WhichRenderContext);

  const handleReceiveNotification = () => {
    setReceiveNotification((prev) => !prev);
  };

  const resetLastInstantSpectrum = () => {
    setLastInstantSpectrum({
      name: null,
      last_instant_collect: null,
    });
  };

  const formatDateForDatetimeLocal = (date) => {
    let formattedDate;

    if (date !== "") {
      const year = date.getFullYear();
      const month = `0${date.getMonth() + 1}`.slice(-2);
      const day = `0${date.getDate()}`.slice(-2);
      const hours = `0${date.getHours()}`.slice(-2);
      const minutes = `0${date.getMinutes()}`.slice(-2);

      formattedDate = `${day}-${month}-${year} às ${hours}:${minutes}`;
    } else {
      formattedDate = "";
    }

    return formattedDate;
  };

  const formatPath = (text) => {
    const parts = text.split(" / ");
    const sensorPart = parts.pop();
    const formattedText = parts.join(" | ") + " - Sensor " + sensorPart;
    return formattedText;
  };

  const handleCollectSpectrum = async () => {
    setLoading(true);
    try {
      await updateInstantSpectrum(spotId, {
        receive_notification: receiveNotification,
      });
      FeedbackToast.success();
    } catch (error) {
      console.error(error);
      FeedbackToast.error();
    } finally {
      toggleModal();
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const { data } = await getInstantSpectrum(spotId);
        setLastInstantSpectrum({
          name: data.name,
          last_instant_collect: data.last_instant_collect * 1000,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (showModal) {
      resetLastInstantSpectrum();
      loadData();
    }
  }, [spotId, showModal]);

  useEffect(() => {
    if (!lastInstantSpectrum.last_instant_collect) {
      setCanInstantCollect(true);
    } else {
      const currentTimestamp = new Date().getTime();
      const differByHours =
        (currentTimestamp - lastInstantSpectrum.last_instant_collect) / 1000;
      if (differByHours < 3600) {
        setCanInstantCollect(false);
      } else {
        setCanInstantCollect(true);
      }
    }
  }, [lastInstantSpectrum.last_instant_collect]);

  useEffect(() => {
    if (userPhone) {
      setReceiveNotification(true);
    } else {
      setReceiveNotification(false);
    }
  }, [userPhone]);

  return {
    receiveNotification,
    handleReceiveNotification,
    lastInstantSpectrum,
    loading,
    canInstantCollect,
    formatDateForDatetimeLocal,
    selectedNodeFullPath,
    formatPath,
    userPhone,
    handleCollectSpectrum,
  };
};

export default useCollectSpectrumModal;
