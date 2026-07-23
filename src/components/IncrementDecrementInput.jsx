import React from "react";
import Input from "./Input";
import { Add, Remove } from "@mui/icons-material";

const IncrementDecrementInput = ({
  name,
  label,
  placeholder,
  step,
  min,
  value,
  setValue,
  decrementBtnDisabled,
  resetPayload,
  resetPayloadField,
  style,
}) => {
  const handleChange = ({ target: { value } }) => {
    resetPayload && resetPayloadField(name);
    setValue((prevState) => {
      return {
        ...prevState,
        [name]: isNaN(parseInt(value.replace(/\D+/g, "")))
          ? ""
          : parseInt(value.replace(/\D+/g, "")),
      };
    });
  };

  const handleDecrement = () => {
    resetPayload && resetPayloadField(name);
    setValue((prevState) => {
      return {
        ...prevState,
        [name]: parseInt(--prevState[name]),
      };
    });
  };

  const handleIncrement = () => {
    resetPayload && resetPayloadField(name);
    setValue((prevState) => {
      return {
        ...prevState,
        [name]: parseInt(++prevState[name]),
      };
    });
  };

  return (
    <>
      <Input
        name={name}
        label={label}
        placeholder={placeholder}
        type="text"
        step={step}
        min={min}
        value={value}
        onChange={handleChange}
        style={{
          paddingInlineEnd: 61,
          ...style,
        }}
      />
      <div className="increment-decrement-controls">
        <button
          disabled={decrementBtnDisabled}
          onClick={handleDecrement}
          tabIndex="-1"
        >
          <Remove
            style={{
              fontSize: "16px",
              cursor: "pointer",
              color: "#777",
            }}
          />
        </button>

        <button onClick={handleIncrement} tabIndex="-1">
          <Add
            style={{
              fontSize: "16px",
              cursor: "pointer",
              color: "#777",
            }}
          />
        </button>
      </div>
    </>
  );
};

export default IncrementDecrementInput;
