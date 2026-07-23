import { useCallback, useContext, useEffect, useState } from "react";
import { DiagnosticContext, WhichRenderContext } from "../../contexts";
import {
  getMachineInfo,
  getOpenDiagnostic,
  getClosedDiagnostic,
} from "../../apis";

export default function useDiagnosticMenu() {
  const {
    diagnosticType,
    setDiagnosticType,
    setChartIds,
    setLoadingMachineInfo,
    setLoadingDiagnosticCards,
    loading,
    isUpdated,
    setIsUpdated,
    setChartFilter,
    cancelToken,
    specifcRedirect,
    setSpecifcRedirect,
  } = useContext(DiagnosticContext);

  const { selectedNode } = useContext(WhichRenderContext);

  const [diagnosticCards, setDiagnosticCards] = useState([]);
  const [machineInfo, setMachineInfo] = useState({});
  const [failureExpanded, setFailureExpanded] = useState(false);
  const [diagnosticExpanded, setDiagnosticExpanded] = useState({
    state: "",
    id: 0,
  });

  const handleGetMachineInfo = useCallback(
    async (spotId) => {
      setLoadingMachineInfo(true);
      setMachineInfo({});
      try {
        let res = await getMachineInfo(spotId, cancelToken);
        res = res.data;
        setMachineInfo(res);
        setLoadingMachineInfo(false);
      } catch (error) {
        console.error(error);
        setMachineInfo({});
      }
    },
    [cancelToken, setLoadingMachineInfo]
  );

  const sendChartIds = useCallback(
    (diagnosticCards) => {
      const uniqueChartIds = [];
      const currentTime = Date.now() / 1000;

      for (let card of diagnosticCards) {
        for (let failure of card.related_failures) {
          for (let chart of failure.related_graphics) {
            if (!uniqueChartIds.find((item) => item.chart_id === chart)) {
              uniqueChartIds.push({
                chart_id: chart,
                start_time: failure.start_time,
                end_time: failure.end_time ? failure.end_time : currentTime,
                start_diagnostic_time: card.start_diagnostic_time,
                end_diagnostic_time: card?.end_diagnostic_time || null,
                current_time: currentTime,
              });
            }
          }
        }
      }

      setChartIds(uniqueChartIds);
    },
    [setChartIds]
  );

  const handleGetCards = useCallback(
    async (diagnosticType, spotId, diagnostic_card_id) => {
      setLoadingDiagnosticCards(true);
      setDiagnosticCards([]);
      setFailureExpanded(false);
      setDiagnosticExpanded({
        state: "",
        id: 0,
      });
      setChartFilter([]);
      try {
        let res = [];
        if (diagnosticType === "pending") {
          res = await getOpenDiagnostic(spotId, cancelToken);
          res = res.data;
          res = JSON.stringify(res) === "{}" ? [] : res;
          res = Array.isArray(res) ? res : [res];
          sendChartIds(res);
        } else if (diagnosticType === "completed") {
          res = await getClosedDiagnostic(spotId, cancelToken);
          res = res.data;
          if (res.length > 0) {
            var card;

            if (diagnostic_card_id) {
              card = res.find(
                (obj) => obj.diagnostic_card_id === diagnostic_card_id
              );
            } else {
              card = res[0];
            }

            setDiagnosticExpanded({
              state: "open",
              id: card.diagnostic_card_id,
            });
            sendChartIds([card]);
          }
        }
        setDiagnosticCards(res);
        setLoadingDiagnosticCards(false);
      } catch (error) {
        console.error(error);
        setDiagnosticCards([]);
        sendChartIds([]);
      }
    },
    [cancelToken, sendChartIds, setChartFilter, setLoadingDiagnosticCards]
  );

  const loadDiagnostic = useCallback(
    (type, spot_id, specifcRedirect) => {
      if (specifcRedirect) {
        setDiagnosticType(specifcRedirect.diagnostic_type);
        handleGetCards(
          specifcRedirect.diagnostic_type,
          spot_id,
          specifcRedirect.diagnostic_card_id
        );
      } else {
        setDiagnosticType(type);
        handleGetCards(type, spot_id);
      }
    },
    [handleGetCards, setDiagnosticType]
  );

  useEffect(() => {
    handleGetMachineInfo(selectedNode.id);
    loadDiagnostic("pending", selectedNode.id, specifcRedirect);
    setSpecifcRedirect(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleGetMachineInfo, loadDiagnostic, selectedNode.id]);

  useEffect(() => {
    if (isUpdated) {
      setIsUpdated(false);
      loadDiagnostic(diagnosticType, selectedNode.id);
    }
  }, [
    diagnosticType,
    isUpdated,
    loadDiagnostic,
    selectedNode.id,
    setIsUpdated,
  ]);

  return {
    diagnosticType,
    loadDiagnostic,
    diagnosticCards,
    machineInfo,
    loading,
    setDiagnosticCards,
    failureExpanded,
    setFailureExpanded,
    sendChartIds,
    diagnosticExpanded,
    setDiagnosticExpanded,
    spot_id: selectedNode.id,
  };
}
