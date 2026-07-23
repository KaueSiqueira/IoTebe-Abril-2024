import React, { useContext, useState } from "react";
import { DiagnosticContext, WhichRenderContext } from "../../contexts";
import { updateDiagnosticCard, readAssetsTree } from "../../apis";
import { find, getTreeFromFlatData } from "react-sortable-tree";
import FeedbackToast from "../../components/FeedbackToast/FeedbackToast";

function clickSupport() {
  const phoneNumber = "551931321442";
  const message = "Olá, gostaria de ajuda";
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;
  window.open(url, "_blank");
}

const RECCOMENDATION = {
  "Alarme mal configurado":
    "considere mudar os limites de alarme ou a condição de disparo.",
  "Problemas com o sensor": (
    <>
      entre em contato com o{" "}
      <span
        onClick={clickSupport}
        style={{
          textDecoration: "underline",
          color: "#156284",
          cursor: "pointer",
        }}
      >
        Suporte da TEBE.
      </span>
    </>
  ),
  "Variação do processo":
    "considere mudar os limites de alarme ou a condição de disparo.",
};

const FAILURES = {
  Desbalanceamento: 1,
  Desalinhamento: 2,
  Folga: 3,
  Engrenamento: 4,
  Rolamento: 5,
  Lubrificação: 6,
  "Mancal de deslizamento": 7,
  Cavitação: 8,
  Aerodinâmico: 9,
  Hidrodinâmico: 10,
  "Fragilidade estrutural": 12,
  Elétrico: 14,
  Outro: 15,
  VELOCITY_FAILURE: 16,
  ACCELERATION_FAILURE: 17,
  TEMPERATURE_FAILURE: 18,
  "Alarme mal configurado": 20,
  "Problemas com o sensor": 21,
  "Variação de processo": 22,
  ENVELOPE_FAILURE: 23,
  NOT_FOUND: 0,
};

const NOT_EFFECTIVE_FAILURES = [
  "Selecione",
  "Alarme mal configurado",
  "Problemas com o sensor",
  "Variação de processo",
  "Outro",
];

const EFFECTIVE_FAILURES = [
  "Aerodinâmico",
  "Cavitação",
  "Desalinhamento",
  "Desbalanceamento",
  "Elétrico",
  "Engrenamento",
  "Folga",
  "Fragilidade estrutural",
  "Hidrodinâmico",
  "Mancal de deslizamento",
  "Lubrificação",
  "Rolamento",
  "Variação de processo",
  "Outro",
];

export default function useDiagnosticModal(setChangeModal, diagnosticId) {
  const { selectedNode, setTreeData } = useContext(WhichRenderContext);

  const { setLoadingUpdate, setIsUpdated } = useContext(DiagnosticContext);

  const [feedback, setFeedback] = useState({
    isEffective: "",
    notEffectiveAlarmCause: "",
    notEffectiveOtherCause: "",
    effectiveAlarmCause: [],
    effectiveOtherCause: "",
    observation: "",
  });

  const [validationFields, setValidationFields] = useState({});
  const [reccomendation, setReccomendation] = useState(false);
  const [otherCauseCount, setOtherCauseCount] = useState(0);
  const [observationCount, setObservationCount] = useState(0);
  const [controlOtherCauseError, setControlOtherCauseError] = useState(0);

  const resetValidationField = (field) => {
    setValidationFields((prevState) => {
      const payloadCopy = { ...prevState };
      delete payloadCopy[field];
      return payloadCopy;
    });
  };

  const resetAllValidationField = (ignore = []) => {
    const keys = Object.keys(feedback);
    for (let key of keys) {
      !ignore?.find((ignoreKey) => ignoreKey === key) &&
        resetValidationField(key);
    }
  };

  const handleInputChange = ({ target: { name, value } }) => {
    resetValidationField(name);

    setFeedback((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const resetOtherCauseValues = () => {
    setOtherCauseCount(0);
    handleInputChange({ target: { name: "effectiveOtherCause", value: "" } });
    handleInputChange({
      target: { name: "notEffectiveOtherCause", value: "" },
    });
  };

  const handleObservationChange = (e) => {
    let text = e.target.value;
    if (text.length > 120) {
      text = text.slice(0, 120);
      e.target.value = text;
    }
    setObservationCount(text.length);
    handleInputChange(e);
  };

  const handleOtherCause = (e) => {
    let text = e.target.value;
    if (text.length > 20) {
      text = text.slice(0, 20);
      e.target.value = text;
    }
    setOtherCauseCount(text.length);
    handleInputChange(e);
  };

  const handleEffectiveCauseReset = (key) => {
    resetValidationField(key);
  };

  const handleNotEffectiveAlarmCauseChange = (e) => {
    handleInputChange(e);
    setReccomendation(
      RECCOMENDATION[e.target.value] ? RECCOMENDATION[e.target.value] : false
    );
  };

  const handleIsEffectiveChange = (e) => {
    handleInputChange(e);
    resetAllValidationField([e.target.name]);
    resetOtherCauseValues();
  };

  const validateFields = () => {
    let validation = {};

    validation = {
      isEffective: feedback.isEffective !== "" ? "valid" : "invalid",

      notEffectiveAlarmCause:
        feedback.isEffective === "false"
          ? feedback.notEffectiveAlarmCause !== "Selecione" &&
            feedback.notEffectiveAlarmCause !== ""
            ? "valid"
            : "invalid"
          : "notused",

      notEffectiveOtherCause:
        feedback.isEffective === "false" &&
        feedback.notEffectiveAlarmCause === "Outro"
          ? feedback.notEffectiveOtherCause !== ""
            ? "valid"
            : "invalid"
          : "notused",

      effectiveAlarmCause:
        feedback.isEffective === "true"
          ? feedback.effectiveAlarmCause.length > 0 &&
            !feedback.effectiveAlarmCause.includes("Selecione")
            ? "valid"
            : "invalid"
          : "notused",

      effectiveOtherCause:
        feedback.isEffective === "true" &&
        feedback.effectiveAlarmCause.includes("Outro")
          ? feedback.effectiveOtherCause !== ""
            ? "valid"
            : "invalid"
          : "notused",

      observation:
        feedback.isEffective === "true"
          ? feedback.observation !== ""
            ? "valid"
            : "notused"
          : "notused",
    };

    setValidationFields(validation);

    if (validation.effectiveOtherCause === "invalid") {
      setControlOtherCauseError((prev) => prev + 1);
    }

    const isValid = Object.values(validation).every(
      (value) => value !== "invalid"
    );

    if (isValid) {
      return validation;
    }

    return isValid;
  };

  const loadTree = async () => {
    const { tree_id } = sessionStorage.getItem("whichClicked")
      ? JSON.parse(sessionStorage.getItem("whichClicked"))
      : { tree_id: null };

    try {
      const res = await readAssetsTree();

      for (let node of res.data) {
        node["tree_id"] =
          node["type"] === "SPOT"
            ? node["id"] + "_spot"
            : node["id"] + "_group";
        node["parent"] =
          node["parent"] !== null ? node["parent"] + "_group" : null;
      }

      const treeData = getTreeFromFlatData({
        flatData: res.data,
        getKey: (node) => node.tree_id,
        getParentKey: (node) => node.parent,
        rootKey: null,
      }).map((node) => {
        node.expanded = false;
        return node;
      });

      const { treeData: tree } = find({
        getNodeKey: ({ treeIndex }) => treeIndex,
        treeData: treeData,
        searchQuery: tree_id,
        searchMethod: ({ node, searchQuery }) => node.tree_id === searchQuery,
        searchFocusOffset: 0,
        expandFocusMatchPaths: true,
      });

      setTreeData(tree);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    let validatedFields = validateFields();
    if (validatedFields) {
      setLoadingUpdate(true);

      let payload = {};

      if (feedback.isEffective === "false") {
        payload = {
          status: "NOT_EFFECTIVE",
          causes: [FAILURES[feedback.notEffectiveAlarmCause]],
          other_cause:
            validatedFields.notEffectiveOtherCause !== "notused"
              ? feedback.notEffectiveOtherCause
              : null,
          observation: null,
        };
      }

      if (feedback.isEffective === "true") {
        const causes = feedback.effectiveAlarmCause.map((cause) => {
          return FAILURES[cause];
        });
        payload = {
          status: "CLOSED",
          causes: causes,
          other_cause:
            validatedFields.effectiveOtherCause !== "notused"
              ? feedback.effectiveOtherCause
              : null,
          observation:
            validatedFields.observation !== "notused"
              ? feedback.observation
              : null,
        };
      }

      try {
        setChangeModal(false);
        await updateDiagnosticCard(selectedNode.id, diagnosticId, payload);
        await loadTree();
        FeedbackToast.success();
      } catch (error) {
        console.error(error);
        FeedbackToast.error();
      } finally {
        setIsUpdated(true);
        setLoadingUpdate(false);
      }
    }
  };

  return {
    feedback,
    setFeedback,
    handleSubmit,
    validationFields,
    reccomendation,
    handleIsEffectiveChange,
    handleNotEffectiveAlarmCauseChange,
    handleOtherCause,
    otherCauseCount,
    NOT_EFFECTIVE_FAILURES,
    EFFECTIVE_FAILURES,
    handleEffectiveCauseReset,
    controlOtherCauseError,
    observationCount,
    handleObservationChange,
  };
}
