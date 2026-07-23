import { useEffect, useState } from "react";

export default function useDiagnosticCardCompleted(card) {
  const [author, setAuthor] = useState("");
  const [cardColor, setCardColor] = useState("");
  const [observation, setObservation] = useState("");
  const [relatedFailures, setRelatedFailures] = useState([]);
  const [feedbackModal, setFeedbackModal] = useState(false);
  const [cardInfo, setCardInfo] = useState({});
  const [cardStatus, setCardStatus] = useState("");

  const getDiagnosticContent = (card) => {
    const authorClosing = card.author_closing;
    const cardColor = card.status_color === "RED" ? "#FE5C66" : "#FFE032";
    const obs = card.observation;
    const relatedFailures = card.related_failures;
    const cardInfo = card;
    const cardStatus = card.card_status;

    setAuthor(authorClosing);
    setCardColor(cardColor);
    setObservation(obs);
    setRelatedFailures(relatedFailures);
    setCardInfo(cardInfo);
    setCardStatus(cardStatus);
  };

  useEffect(() => {
    getDiagnosticContent(card);
  }, [card]);

  return {
    author,
    cardColor,
    observation,
    relatedFailures,
    feedbackModal,
    setFeedbackModal,
    cardInfo,
    cardStatus,
  };
}
