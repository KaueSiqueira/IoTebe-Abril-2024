import { useState, useEffect, useContext } from "react";
import { RightSideMenuContext, WhichRenderContext } from "../../../contexts";
import {
  activateAutomaticDiagnostic,
  disableAutomaticDiagnostic,
  getAutomaticDiagnostic,
} from "../../../apis";
import FeedbackToast from "../../../components/FeedbackToast/FeedbackToast";

const buttonText = ["Avançar", "Avançar", "Verificar", "Concluir"];

export default function useAutomaticDiagnostic() {
  const [page, setPage] = useState(0);
  const [lock, setLock] = useState(false);
  const [turnLock, setTurnLock] = useState(false);
  const [save, setSave] = useState(false);
  const [verifyFunction, setVerifyFunction] = useState(null);
  const [disableModal, setDisableModal] = useState(false);

  const {
    setTrainingPeriod,
    setValidLimit,
    setLimit,
    setPeriodOnList,
    loadingAutomatic,
    setLoadingAutomatic,
    validSpec,
    setValidSpec,
    setShowAllCharts,
    keepAlarm,
    isAutoEnabled,
    setIsAutoEnabled,
    setMetric,
    loadingAutomaticInfo,
    setLoadingAutomaticInfo,
    validLimit,
    setSavedData,
    hasDataChanges,
  } = useContext(RightSideMenuContext);

  const { selectedNodeChildren } = useContext(WhichRenderContext);

  const disableAutoDiagnostic = async () => {
    setLoadingAutomatic(true);
    try {
      await disableAutomaticDiagnostic(selectedNodeChildren[0]);
      setIsAutoEnabled(false);
      setPage(0);
      FeedbackToast.success();
    } catch (error) {
      console.error(error);
      setIsAutoEnabled(true);
      FeedbackToast.error();
    } finally {
      setLoadingAutomatic(false);
    }
  };

  const activateAutomDiagnostic = async () => {
    setLoadingAutomatic(true);
    try {
      await activateAutomaticDiagnostic(selectedNodeChildren[0], {
        keep_alarmed: keepAlarm === "true",
      });
      setIsAutoEnabled(true);
      setPage(0);
      FeedbackToast.success();
    } catch (error) {
      console.error(error);
      setIsAutoEnabled(false);
      FeedbackToast.error();
    } finally {
      setLoadingAutomatic(false);
    }
  };

  useEffect(() => {
    if (!isAutoEnabled) {
      if (page < 1) {
        setTurnLock(false);
        setLock(false);
        setValidSpec(false);
      }
      if (page === 2) {
        if (!validLimit && !validSpec) {
          setTurnLock(true);
          setLock(true);
          setSave(false);
        }
      } else {
        setVerifyFunction(null);
      }
      if (page >= 3) {
        setSave(false);
        setShowAllCharts(true);
      } else {
        setShowAllCharts(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    setLimit,
    setLock,
    setPeriodOnList,
    setSave,
    setTrainingPeriod,
    isAutoEnabled,
  ]);

  useEffect(() => {
    const loadAutomaticDiagnostic = async () => {
      setLoadingAutomaticInfo(true);
      try {
        const res = await getAutomaticDiagnostic(selectedNodeChildren[0]);

        setSavedData({ ...JSON.parse(JSON.stringify(res.data)) });

        setIsAutoEnabled(!!res.data.automatic_diag);

        if (
          res.data.automatic_diag_start_training_time &&
          res.data.automatic_diag_end_training_time
        ) {
          setTrainingPeriod({
            startDate: res.data.automatic_diag_start_training_time * 1000,
            endDate: res.data.automatic_diag_end_training_time * 1000,
            reload: true,
          });
        }

        if (res.data.automatic_diag_on_off_metric) {
          setMetric(res.data.automatic_diag_on_off_metric === "VEL" ? 1 : 2);
        }

        setLoadingAutomaticInfo(false);

        if (res.data.automatic_diag_on_off_limit) {
          setLimit(res.data.automatic_diag_on_off_limit);
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadAutomaticDiagnostic();

    return () => {
      setTrainingPeriod(false);
      setValidLimit(true);
      setLimit(null);
      setPeriodOnList([]);
      setLoadingAutomaticInfo(true);
      setSavedData({});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    setIsAutoEnabled,
    setLimit,
    setLoadingAutomaticInfo,
    setMetric,
    setPeriodOnList,
    setTrainingPeriod,
    setValidLimit,
    setValidSpec,
  ]);

  return {
    page,
    setPage,
    lock,
    setLock,
    turnLock,
    setTurnLock,
    save,
    setSave,
    buttonText,
    verifyFunction,
    setVerifyFunction,
    loadingAutomatic,
    loadingAutomaticInfo,
    validSpec,
    activateAutomDiagnostic,
    isAutoEnabled,
    disableAutoDiagnostic,
    disableModal,
    setDisableModal,
    hasDataChanges,
  };
}
