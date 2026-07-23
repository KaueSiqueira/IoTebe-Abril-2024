/* eslint-disable */
// Override para a demo — retorna isVisible:true após um microtick
// O setTimeout(0) garante que o DOM já montou antes de isVisible virar true
// Evita o "Cannot read properties of null (reading 'classList')" do SpecChart
import { useState, useEffect } from "react";

const useVisibility = (refElement, delay, options) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  return { isVisible };
};

export default useVisibility;
