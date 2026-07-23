import React, { useContext, useState } from "react";
import { DiagnosticContext } from "../../contexts";
import { useEffect } from "react";


const FAILURE_OPTION = [
  {
    name: "Aerodinâmico",
    checked: false, failure: "AERODYNAMIC_FAILURE"
  },
  {
    name: "Aumento de aceleração",
    checked: false, failure: "ACCELERATION_FAILURE"
  },
  {
    name: "Aumento de velocidade",
    checked: false, failure: "VELOCITY_FAILURE"
  },
  {
    name: "Aumento de temperatura",
    checked: false, failure: "TEMPERATURE_FAILURE"
  },
  {
    name: "Aumento de envelope",
    checked: false, failure: "ENVELOPE_FAILURE"
  },
  { name: "Cavitação", checked: false, failure: "CAVITATION" },
  { name: "Desalinhamento", checked: false, failure:  "MISALIGNMENT"},
  { name: "Desbalanceamento", checked: false, failure: "UNBALANCE" }, 
  {
    name: "Elétrico",
    checked: false, failure: "ELECTRICAL_FAULT"
  },
  { name: "Engrenamento", checked: false, failure: "GEAR_FAILURE"}, 
  { name: "Folga", checked: false, failure:  "LOOSENESS"},
  {
    name: "Fragilidade estrutural",
    checked: false, failure: "STRUCTURAL_FRAGILITY"
  },
  {
    name: "Hidrodinâmico",
    checked: false, failure: "HYDRODYNAMIC_FAILURE"
  },
  {
    name: "Instabilidade do mancal de deslizamento",
    checked: false, failure: "SLIDING_BEARING_INSTABILITY"
  },
  {
    name: "Lubrificação",
    checked: false, failure: "LUBRICATION_FAILURE"
  },
  {
    name: "Outros",
    checked: false, failure: "OTHERS"
  },
  { name: "Rolamento", checked: false, failure: "BEARING_FAILURE"  },
  {
    name: "Variação do processo",
    checked: false, failure: "PROCESS_VARIATION"
  },
];

export default function useFilterModal(card, setCards) {
  const [defaultCards, setDefaultCards] = useState({});
  const [filteredCards, setFilteredCards] = useState({});
  const [failures, setFailures] = useState(FAILURE_OPTION);
  const [filterOn, setFilterOn] = useState(false);
  const [show, setShow] = useState(false);

  const updateFunc = () => {
    let tempFilter = [], tempId = [], cardArray = [];
    if(defaultCards === null || JSON.stringify(defaultCards) === '{}'){
      setDefaultCards(card);
      cardArray = card;
    }
    else
      cardArray = defaultCards;
    setFilterOn(false);
    failures.map((failure) => {
      if(failure.checked === true){
        setFilterOn(true);
        cardArray.map((cards) => {
          cards.causes.map((cause) => {
            if(cause === failure.failure){
              if(!tempId.includes(cards.diagnostic_card_id)){
                tempFilter = [...tempFilter,{...cards}];
                tempId = [...tempId, cards.diagnostic_card_id];
              }
            }
          })
          cards.related_failures.map((rFailure) => {
            if(rFailure?.related_failure === failure.failure){
              if(!tempId.includes(cards.diagnostic_card_id)){
                tempFilter = [...tempFilter,{...cards}];
                tempId = [...tempId, cards.diagnostic_card_id];
              }
            }
          })
          tempFilter.sort(function(a, b) {
            return b.diagnostic_card_id - a.diagnostic_card_id;
          });
        })
      }
    })
      
    setFilteredCards(tempFilter);
  }
  
  useEffect(() => {
    if(JSON.stringify(card) !== "{}" && defaultCards === null)
      setDefaultCards(card)
  }, [card])

  useEffect(() => {
    filterOn ? setCards(filteredCards) : setCards(defaultCards)
  },[filteredCards])

  useEffect(() => {
    setFailures(FAILURE_OPTION);
  }, [])



  return {
    failures,
    setFailures,
    updateFunc,
    show,
    setShow
  };
}
