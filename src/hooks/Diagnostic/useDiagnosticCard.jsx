import { useContext, useEffect, useState } from "react";
import { WhichRenderContext } from "../../contexts";

export default function useDiagnosticCard(card) {
  const { selectedNode } = useContext(WhichRenderContext);

  const [isPlannedIntervention, setIsPlannedIntervention] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [cardColor, setCardColor] = useState("");
  const [relatedFailures, setRelatedFailures] = useState([]);
  const [feedbackModal, setFeedbackModal] = useState(false);
  const [inProgress, setInProgress] = useState(false);

  const getDiagnosticContent = (card) => {
    const isPlannedIntervention = card.status === "PLANNED_INTERVENTION";
    const isCompleted = card.status !== "PENDING" && !isPlannedIntervention;
    const cardColor = card.status_color === "RED" ? "#FFCED1" : "#FFF3AD";
    const relatedFailures = card.related_failures;
    const inProgress = !!card.related_failures.find(
      (failure) => failure.end_time === null
    );

    setIsPlannedIntervention(isPlannedIntervention);
    setIsCompleted(isCompleted);
    setCardColor(cardColor);
    setRelatedFailures(relatedFailures);
    setInProgress(inProgress);
  };

  useEffect(() => {
    getDiagnosticContent(card);
  }, [card]);

  return {
    isPlannedIntervention,
    isCompleted,
    cardColor,
    relatedFailures,
    feedbackModal,
    setFeedbackModal,
    hasSensor: !!selectedNode.sensor_id,
    inProgress,
  };
}
