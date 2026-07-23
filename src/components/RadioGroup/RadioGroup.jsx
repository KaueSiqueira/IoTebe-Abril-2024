import React from "react";
import useRadioGroup from "../../hooks/RadioGroup/useRadioGroup";
import "./RadioGroup.css";

export default function RadioGroup({
  children, // Deve conter RadioInputs ou semelhantes
  value, // Valor atual dentre todos os inputs. Usado para controlar qual radio está selecionado
  onChange, // onChange padrão que é atribuído a todos os inputs.
  title, // Título com os estilos e estrutura padrão do RadioGroup
  customTitle, // Deve conter elementos/componentes que formam um título
  required, // Mostra o asterisco input obrigatório
  disabled,
}) {
  // Hook para controlar qual é o valor selecionado atualmente e a ação ao clicar em um radio
  const { selectedValue, handleChange } = useRadioGroup(value, onChange);

  return (
    <div className={`radio-group-container`}>
      {customTitle}
      {!customTitle && title && (
        <p className="radio-group-title">
          {title} {required && <span>*</span>}
        </p>
      )}
      {children && (
        <div className="radio-group">
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, {
                selectedValue,
                onChange: handleChange,
                name: "GroupedRadioInput",
                disabled: disabled,
              });
            }
            return child;
          })}
        </div>
      )}
    </div>
  );
}
