import React, { useContext, useEffect, useState } from "react";
import { DiagnosticContext } from "../../contexts";

export default function useMobileDescription(

) {
  const { mobileDescription, setMobileDescription, showMobileDescription, setShowMobileDescription, loading, setChartFilter } = useContext(DiagnosticContext);
  const { whichPage } = useContext(DiagnosticContext);
  const [show, setShow] = useState(false);

  const closeDescription = () => {
    setShow(false);
    setChartFilter([]);
  }

  useEffect(() => {
    setShow(showMobileDescription);
  }, [showMobileDescription])

  useEffect(() => {
    if(loading){
      setShowMobileDescription(false)
    }
  }, [loading])

  useEffect(() => {
    setShow(false);
  }, [whichPage])



  return {
    description: mobileDescription.description,
    recommendations: mobileDescription.recommendations,
    show,
    alarmColor: mobileDescription.color,
    closeDescription,
    setMobileDescription,
    loading
  };
}
