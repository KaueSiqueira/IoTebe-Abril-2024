import { useEffect, useState } from "react";

export default function useRadioGroup(value, onChange) {
  // Usado para controlar o valor selecionado atualmente
  const [selectedValue, setSelectedValue] = useState(value);

  // Função atribuida para todos os radio
  const handleChange = (e) => {
    e.persist();
    // Se não for informado nenhum valor selecionado na prop do RadioGroup, a função seta o selectedValue de acordo com o valor do radio selecionado
    !value && setSelectedValue(e.target.value);

    // Se for informado uma função na prop onChange do RadioGroup, ela é executada aqui enviando o event
    if (onChange) {
      onChange(e);
    }
  };

  // Se um valor selecionado for informado na prop do RadioGroup, a cada vez que ele mudar será setado no selectedValue
  useEffect(() => {
    value !== undefined && setSelectedValue(value);
  }, [value]);

  return {
    selectedValue,
    setSelectedValue,
    handleChange,
  };
}
