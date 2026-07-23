import React from "react";
import "./RadioInput.css";

export default function RadioInput({
  id, // id do input radio
  name, // name do input radio.
  value, // Valor do input radio
  checked, // Define se esse radio está checado
  onChange, // Função para ser executada ao selecionar esse radio
  label, // Texto do radio
  selectedValue, // Valor selecionado atualmente. Usado para controlar se o radio está checado ou não na ausencia da prop checked
  disabled,
}) {
  // Existem dois casos para o controle de check

  // Primeiro caso: Controle externo
  // Nesse caso, quem define se o input está checado ou não é alguma fonte externa, utilizando "checked" ou "selectedValue" + "value"

  // Segundo caso: idependente
  // Nesse caso, os RadioInputs se comportam como inputs normais, se guiando pelo "name".
  // É usado assim quando não é envolto de RadioGroup e não é atribuído "checked" e "selectedValue" nas props

  // Caso isChecked for undefined, significa que o controle de checagem dos radio é feito de forma padrão pelo HTML, como inputs normais
  let isChecked;
  if (checked !== undefined) {
    isChecked = checked;
  } else if (selectedValue !== undefined) {
    isChecked = selectedValue === value;
  }

  // Caso isChecked for undefined, é necessário a atribuição de um name, pois o controle é feito pelo HTML
  if (isChecked === undefined) {
    name = name || "RadioInput";
  }

  return (
    <label htmlFor={id} className="radio-label-container">
      <input
        type="radio"
        {...(name !== undefined ? { name } : {})}
        {...(id !== undefined ? { id } : {})}
        {...(value !== undefined ? { value } : {})}
        {...(isChecked !== undefined ? { checked: isChecked } : {})}
        {...(onChange !== undefined && !disabled ? { onChange } : {})}
        {...(disabled !== undefined ? { disabled } : {})}
      />
      <span className={`radioCircle`}>
        <div className={`${isChecked ? "checked" : ""}`}></div>
      </span>
      {label}
    </label>
  );
}
