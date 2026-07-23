import { useContext, useEffect, useState } from "react";
import useDashSpot from "../DashSpot/useDashSpot";
import { readSpectrumList, updateAutomaticDiagnostic } from "../../apis";
import { RightSideMenuContext } from "../../contexts";
import { haveChanges } from "../../utilities";
import FeedbackToast from "../../components/FeedbackToast/FeedbackToast";

export default function useTrainingData({
  setLock,
  setVerifyFunction,
  setSave,
  page,
  setPage,
}) {
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [dateError, setDateError] = useState(false);
  const [limitError, setLimitError] = useState(false);
  const [specError, setSpecError] = useState(false);
  const [specList, setSpecList] = useState([]);
  const [specOnList, setSpecOnList] = useState(null);

  const {
    metric,
    setMetric,
    limit,
    setLimit,
    trainingPeriod,
    setTrainingPeriod,
    validLimit,
    periodOnList,
    pageDate,
    setLoadingAutomatic,
    validSpec,
    setValidSpec,
    isAutoEnabled,
    loadingAutomaticInfo,
    savedData,
    setSavedData,
    setHasDataChanges,
  } = useContext(RightSideMenuContext);
  const { selectedNodeChildren } = useDashSpot();

  const handleLimit = (value) => {
    !value.includes("-") && setLimit(value);
  };

  function formatDateForDatetimeLocal(date) {
    let formattedDate;

    if (date !== "") {
      const year = date.getFullYear();
      const month = `0${date.getMonth() + 1}`.slice(-2);
      const day = `0${date.getDate()}`.slice(-2);
      const hours = `0${date.getHours()}`.slice(-2);
      const minutes = `0${date.getMinutes()}`.slice(-2);

      formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;
    } else {
      formattedDate = "";
    }

    return formattedDate;
  }

  const verifyDate = (e, picker) => {
    let startDate = picker.startDate._d;
    let endDate = picker.endDate._d;
    let reload = false;

    setDateRange({
      startDate: startDate,
      endDate: endDate,
    });

    if (
      startDate < pageDate.startDate ||
      startDate > pageDate.endDate ||
      endDate > pageDate.endDate ||
      endDate < pageDate.startDate
    ) {
      reload = true;
    }

    setTrainingPeriod({
      startDate: Date.parse(startDate),
      endDate: Date.parse(endDate),
      reload: reload,
    });
  };

  const verifySpec = async (start, end) => {
    setLoadingAutomatic(true);
    try {
      const { data } = await readSpectrumList(selectedNodeChildren[0]);

      let tempSpecList = [];

      if (data.res.spectrumList.length > 0) {
        data.res.spectrumList.forEach((spec) => {
          if (spec.time * 1000 >= start && spec.time * 1000 <= end) {
            tempSpecList = [...tempSpecList, spec];
          }
        });

        setSpecList(tempSpecList);
      } else setSpecList([]);

      setVerifyFunction(null);
    } catch (error) {
      console.error(error);
      setSpecList([]);
    } finally {
      setLoadingAutomatic(false);
    }
  };

  const saveSettings = async () => {
    setLoadingAutomatic(true);
    try {
      await updateAutomaticDiagnostic(selectedNodeChildren[0], {
        automatic_diag_start_training_time: trainingPeriod.startDate / 1000,
        automatic_diag_end_training_time: trainingPeriod.endDate / 1000,
        automatic_diag_on_off_metric: metric === 1 ? "VEL" : "ACC",
        automatic_diag_on_off_limit: parseFloat(limit),
      });
      setSavedData({
        automatic_diag_start_training_time:
          trainingPeriod?.startDate / 1000 || false,
        automatic_diag_end_training_time:
          trainingPeriod?.endDate / 1000 || false,
        automatic_diag_on_off_metric: metric === 1 ? "VEL" : "ACC",
        automatic_diag_on_off_limit: parseFloat(limit),
        automatic_diag: isAutoEnabled ? 1 : 0,
      });
      setVerifyFunction(null);
      setPage(page + 1);
      FeedbackToast.success();
    } catch (error) {
      console.error(error);
      FeedbackToast.error();
    } finally {
      setLoadingAutomatic(false);
    }
  };

  useEffect(() => {
    let tempSpec = [];

    specList.forEach((data) => {
      periodOnList.forEach((interval) => {
        let startTime = interval.startTime / 1000;
        let endTime = interval.endTime / 1000;
        if (startTime <= data.time && data.time <= endTime) {
          tempSpec = [...tempSpec, data];
        }
      });
    });

    const filtered = tempSpec.filter(
      (item, index) => tempSpec.indexOf(item) === index
    );

    setSpecOnList(filtered);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [specList]);

  useEffect(() => {
    if (!trainingPeriod) {
      setDateRange({
        startDate: "",
        endDate: "",
      });
    }
  }, [trainingPeriod]);

  useEffect(() => {
    setLimit(0);
  }, [metric, setLimit]);

  useEffect(() => {
    if (trainingPeriod) {
      if (
        trainingPeriod.endDate - trainingPeriod.startDate >
          60 * 60 * 24 * 30 * 1000 ||
        trainingPeriod.endDate - trainingPeriod.startDate <
          60 * 60 * 24 * 7 * 1000
      ) {
        setDateError(true);
      } else {
        setDateError(false);
      }
    }
  }, [trainingPeriod]);

  useEffect(() => {
    if (validLimit) {
      setLimitError(false);
    } else {
      setLimitError(true);
    }
  }, [validLimit]);

  useEffect(() => {
    setSpecList([]);
    setSpecOnList(null);
    setSpecError(false);
  }, [trainingPeriod, limit]);

  useEffect(() => {
    if (specOnList !== null && specList?.length > 0 && trainingPeriod) {
      if (specOnList.length < 5) {
        setSpecError(true);
      } else {
        setSpecError(false);
      }
    } else {
      setSpecError(false);
    }
  }, [specList, specOnList, trainingPeriod]);

  useEffect(() => {
    if (page === 2) {
      if (validSpec) {
        setSave(true);
      } else {
        setSave(false);
      }
    }
  }, [page, setSave, validSpec]);

  useEffect(() => {
    if (page === 2) {
      if (
        trainingPeriod &&
        validLimit &&
        periodOnList.length > 0 &&
        !dateError &&
        !limitError
      ) {
        if (specOnList?.length >= 5 && !specError) {
          setVerifyFunction(() => {
            return () => {
              saveSettings();
            };
          });
          setValidSpec(true);
        } else {
          setVerifyFunction(() => {
            return () => {
              verifySpec(
                periodOnList[0].startTime,
                periodOnList[periodOnList.length - 1].endTime
              );
            };
          });
          setValidSpec(false);
        }
        setLock(false);
      } else {
        setVerifyFunction(null);
        setLock(true);
        setValidSpec(false);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dateError,
    limitError,
    periodOnList,
    setLock,
    setVerifyFunction,
    trainingPeriod,
    validLimit,
    specOnList,
    specError,
    page,
  ]);

  useEffect(() => {
    if (loadingAutomaticInfo && trainingPeriod.reload) {
      setDateRange({
        startDate: new Date(trainingPeriod.startDate),
        endDate: new Date(trainingPeriod.endDate),
      });
    }
  }, [loadingAutomaticInfo, trainingPeriod]);

  useEffect(() => {
    const currentData = {
      automatic_diag_start_training_time:
        trainingPeriod?.startDate / 1000 || false,
      automatic_diag_end_training_time: trainingPeriod?.endDate / 1000 || false,
      automatic_diag_on_off_metric: metric === 1 ? "VEL" : "ACC",
      automatic_diag_on_off_limit: parseFloat(limit),
      automatic_diag: isAutoEnabled ? 1 : 0,
    };

    setHasDataChanges(haveChanges(savedData, currentData));
  }, [
    isAutoEnabled,
    limit,
    metric,
    savedData,
    setHasDataChanges,
    setValidSpec,
    setVerifyFunction,
    trainingPeriod,
  ]);

  return {
    dateRange,
    metric,
    setMetric,
    limit,
    dateError,
    specError,
    limitError,
    specOnList,
    handleLimit,
    verifyDate,
    validSpec,
    isAutoEnabled,
    formatDateForDatetimeLocal,
  };
}
