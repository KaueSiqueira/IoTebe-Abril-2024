import { useContext, useEffect, useState } from "react";
import { DiagnosticContext, WhichRenderContext } from "../../contexts";
import { updateDiagnosticCard } from "../../apis";
import FeedbackToast from "../../components/FeedbackToast/FeedbackToast";

export default function useDiagnosticOptions(
  diagnosticId,
  isPlannedIntervention
) {
  const [show, setShow] = useState(false);
  const [checkPlannedIntervention, setCheckPlannedIntervention] = useState(
    isPlannedIntervention
  );
  const { setLoadingUpdate, setIsUpdated } = useContext(DiagnosticContext);
  const { selectedNode } = useContext(WhichRenderContext);

  const handlePlannedIntervention = async () => {
    setLoadingUpdate(true);

    const payload = {
      status: isPlannedIntervention ? "PENDING" : "PLANNED_INTERVENTION",
      causes: null,
      other_cause: null,
      observation: null,
    };

    try {
      await updateDiagnosticCard(selectedNode.id, diagnosticId, payload);
      FeedbackToast.success();
    } catch (error) {
      console.error(error);
      FeedbackToast.error();
    } finally {
      setIsUpdated(true);
      setLoadingUpdate(false);
      setCheckPlannedIntervention(!isPlannedIntervention);
      setShow(false);
    }
  };

  useEffect(() => {
    setCheckPlannedIntervention(isPlannedIntervention);
  }, [isPlannedIntervention]);

  return {
    show,
    setShow,
    handlePlannedIntervention,
    checkPlannedIntervention,
  };
}
