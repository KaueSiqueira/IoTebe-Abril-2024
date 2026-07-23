import { useEffect, useReducer, useState } from "react";

export default function useGroupView() {
  const initVal = {
    isLoading: true,
    criticalLoading: true,
    insightsLoading: true,
    alarmTrendLoading: true,
  };

  const loadingReducer = (state, action) => {
    switch (action.type) {
      case "critical":
        return {
          ...state,
          isLoading:
            action.payload || state.insightsLoading || state.alarmTrendLoading,
          criticalLoading: action.payload,
        };
      case "insight":
        return {
          ...state,
          isLoading:
            state.criticalLoading || action.payload || state.alarmTrendLoading,
          insightsLoading: action.payload,
        };
      case "alarmTrend":
        return {
          ...state,
          isLoading:
            state.criticalLoading || state.insightsLoading || action.payload,
          alarmTrendLoading: action.payload,
        };
      default:
        throw new Error("INVALID ACTION");
    }
  };

  const [load, setLoad] = useReducer(loadingReducer, initVal);

  const [childrenFunction, setChildrenFunction] = useState([]);

  // Função para executar as chamadas dos itens da tela de grupos ao mesmo tempo
  // Ele atualiza o estado de funções, para que as funções sejam executadas no useEffect, uma por vez.
  // É chamado sempre que é adicionado/atualizado uma função
  const updateChildrenFunctionLoop = (newFunction) => {
    const existingFunction = childrenFunction.findIndex(
      (obj) => obj.id === newFunction.id
    );

    if (existingFunction !== -1) {
      const newArray = [...childrenFunction];
      newArray[existingFunction] = newFunction;
      setChildrenFunction(newArray);
    } else {
      setChildrenFunction((prevArray) => [...prevArray, newFunction]);
    }
  };

  useEffect(() => {
    const execFunctions = () => {
      childrenFunction.forEach((child) => {
        child.childFunction();
      });
    };

    const interval = setInterval(() => {
      execFunctions();
    }, 10 * 60 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, [childrenFunction]);

  return {
    load,
    setLoad,
    updateChildrenFunctionLoop,
  };
}
