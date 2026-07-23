import { useCallback, useEffect, useState } from "react";
import { readSpotSummaryInfo } from "../../../../../apis";

const useConfigStatus = (props) => {
  const [defaultData] = useState({
    rmstemp_sampling_period: null,
    gateway_rmstemp_synchronization: null,
    spectrum_sampling_time: null,
    machine_type: null,
    bearing_type: null,
    rotation_speed: null,
    power: null,
  });
  const [data, setData] = useState(defaultData);
  const [imagesModal, setImagesModal] = useState(false);
  const [uploadImagesModal, setUploadImagesModal] = useState(false);

  const handleOpen = () => {
    setImagesModal(true);
  };

  const handleClose = () => {
    setImagesModal(false);
  };

  const loadData = useCallback(async (spotId) => {
    try {
      const { data } = await readSpotSummaryInfo(spotId);
      setData(data);
    } catch (error) {
      console.error(error);
    } finally {
      props.setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!!props.spotId) {
      props.setLoading(true);
      loadData(props.spotId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.spotId, loadData]);

  return {
    data,
    imagesModal,
    setImagesModal,
    handleClose,
    setUploadImagesModal,
    handleOpen,
    uploadImagesModal,
  };
};

export default useConfigStatus;
