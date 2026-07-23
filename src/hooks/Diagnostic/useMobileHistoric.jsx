import React, { useContext, useEffect, useState } from "react";
import { DiagnosticContext } from "../../contexts";

export default function useMobileHistoric(

) {
  const { setChartFilter, mobileHistoric, setMobileHistoric, showMobileHistoric, loading } = useContext(DiagnosticContext);
  const [show, setShow] = useState(showMobileHistoric);
  const [historic, setHistoric] = useState(mobileHistoric);
  const [failureExpanded, setFailureExpanded] = useState(false);

  const closeDescription = () => {
    setShow(false);
  }

  const changeSelectedFailure = (failure, index) => {
    const failureString = failure.title + index;
    setChartFilter(
      failureExpanded === failureString ? [] : [...failure.related_graphics]
    );

    setFailureExpanded((prevState) =>
      prevState === failureString ? false : failureString
    );
  };

  useEffect(() => {
    setShow(showMobileHistoric);
  }, [showMobileHistoric])

  useEffect(() => {
    setHistoric(mobileHistoric);
  }, [mobileHistoric])


  return {
    formattedFailure: historic.formattedFailure,
    causes: historic.causes,
    diagnosticTime: historic.diagnosticTime,
    plannedTime: historic.plannedTime,
    disruption: historic.disruption,
    wasEffective: historic.wasEffective,
    show,
    alarmColor: historic.alarmColor,
    closeDescription,
    setMobileHistoric,
    author: historic.author,
    observation: historic.observation,
    otherCause: historic.otherCause,
    loading,
    showMobileHistoric,
    failureExpanded,
    changeSelectedFailure
  };
}
