import React, {
  createContext,
  useState,
  useMemo,
  useEffect,
  useContext,
} from "react";
import { WhichRenderContext } from "./WhichRender";
import axios from "axios";

const DiagnosticContext = createContext();

function DiagnosticProvider({ children }) {
  const { selectedNode } = useContext(WhichRenderContext);

  const [diagnosticType, setDiagnosticType] = useState("pending");
  const [chartIds, setChartIds] = useState(null);
  const [chartFilter, setChartFilter] = useState(null);

  const [loadingMachineInfo, setLoadingMachineInfo] = useState(false);
  const [loadingDiagnosticCards, setLoadingDiagnosticCards] = useState(false);
  const [loadingCharts, setLoadingCharts] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingAlarmedPeriods, setLoadingAlarmedPeriods] = useState(false);
  const [loading, setLoading] = useState(false);

  const [mobileDescription, setMobileDescription] = useState({});
  const [showMobileDescription, setShowMobileDescription] = useState(false);
  const [resetColor, setResetColor] = useState("Fechar");

  const [mobileHistoric, setMobileHistoric] = useState({});
  const [showMobileHistoric, setShowMobileHistoric] = useState(false);

  const [isUpdated, setIsUpdated] = useState(false);

  const [cancelToken, setCancelToken] = useState(null);

  const [specifcRedirect, setSpecifcRedirect] = useState(false);

  useEffect(() => {
    setLoading(true);
    cancelToken && cancelToken.cancel();
    setCancelToken(axios.CancelToken.source());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNode.id]);

  useEffect(() => {
    if (diagnosticType !== "pending") {
      setShowMobileDescription(false);
      setMobileDescription({});
    }
  }, [diagnosticType]);

  useEffect(() => {
    if (
      loadingCharts ||
      loadingDiagnosticCards ||
      loadingMachineInfo ||
      loadingUpdate ||
      loadingAlarmedPeriods
    ) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [
    loadingAlarmedPeriods,
    loadingCharts,
    loadingDiagnosticCards,
    loadingMachineInfo,
    loadingUpdate,
  ]);

  const value = useMemo(() => {
    return {
      diagnosticType,
      setDiagnosticType,
      chartIds,
      setChartIds,
      chartFilter,
      setChartFilter,
      loadingMachineInfo,
      setLoadingMachineInfo,
      loadingDiagnosticCards,
      setLoadingDiagnosticCards,
      loadingCharts,
      setLoadingCharts,
      loading,
      setLoading,
      loadingUpdate,
      setLoadingUpdate,
      isUpdated,
      setIsUpdated,
      loadingAlarmedPeriods,
      setLoadingAlarmedPeriods,
      mobileDescription,
      setMobileDescription,
      showMobileDescription,
      setShowMobileDescription,
      mobileHistoric,
      setMobileHistoric,
      showMobileHistoric,
      setShowMobileHistoric,
      resetColor,
      setResetColor,
      cancelToken,
      specifcRedirect,
      setSpecifcRedirect,
    };
  }, [
    diagnosticType,
    chartIds,
    chartFilter,
    loadingMachineInfo,
    loadingDiagnosticCards,
    loadingCharts,
    loading,
    loadingUpdate,
    isUpdated,
    loadingAlarmedPeriods,
    mobileDescription,
    showMobileDescription,
    mobileHistoric,
    showMobileHistoric,
    resetColor,
    cancelToken,
    specifcRedirect,
  ]);

  return (
    <DiagnosticContext.Provider value={value}>
      {children}
    </DiagnosticContext.Provider>
  );
}

export { DiagnosticContext, DiagnosticProvider };
