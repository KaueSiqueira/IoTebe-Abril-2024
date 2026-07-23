/* eslint-disable */
// Override de useVisibility para a demo — retorna sempre isVisible: true sem delay
// O SpecChart usa useVisibility para lazy-load: só busca dados quando está na viewport
// O IntersectionObserver com delay=500ms + skeleton layer causa deadlock:
// o skeleton cobre o gráfico → observer não dispara → loadData nunca roda → skeleton nunca some

import { useState } from "react";

const useVisibility = (refElement, delay, options) => {
  // Na demo, todos os gráficos são sempre "visíveis" — sem lazy load
  const [isVisible] = useState(true);
  return { isVisible };
};

export default useVisibility;
