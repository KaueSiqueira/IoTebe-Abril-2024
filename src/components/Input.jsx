import { Tooltip } from "@material-ui/core";
import { InfoOutlined } from '@mui/icons-material';
import React from "react";

function RenderTooltip(props) {
  // { tooltip, hideTooltip, children }
  const showTooltip = !(!(props.tooltip)) && props.hideTooltip

  return (
    <>
      {showTooltip ?
        <Tooltip style={{ color: "gray" }} className="info" arrow placement="top" title={props.tooltip}>
          {props.children}
        </Tooltip>
        :
        props.children
      }
    </>
  )
}

export default function Input({
  id,
  label,
  labelError,
  tooltip,
  name,
  value,
  onChange,
  type,
  step,
  placeholder,
  min,
  max,
  disabled,
  options,
  pattern,
  style,
  selectStyle,
  unit,
  hideTooltip = false,
  required,
  onBlur,
  readOnly = false,
}) {
  return (
    <>
      <label className="iotebe-input-wrapper" style={selectStyle ? { width: "auto", fontSize: 14, margin: 0, marginRight: 8 } : { width: "100%", fontSize: 14, margin: 0 }}>
        {label && <div style={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
          marginBlockEnd: selectStyle ? 0 : '6px',
          fontSize: '14px',
          color: '#777',
          fontWeight: 600,
          width: selectStyle && 0
        }}>
          {label}
          {!!tooltip && !hideTooltip && (
            <div className="showTooltip">
              <Tooltip style={{ color: "gray" }} className="info" placement="top" title={<span style={{ display: "block", textAlign: "center" }}>{tooltip}</span>} arrow>
                <InfoOutlined style={{
                  fontSize: '16px',
                  cursor: 'pointer',
                  color: '#156284'
                }}
                />
              </Tooltip>
            </div>
          )}
          {required && <p style={{ fontSize: 14, color: "#FD0D1B" }}>*</p>}
        </div>}

        {!options ? (
          <RenderTooltip tooltip={tooltip} hideTooltip={hideTooltip}>
            <div className={`iotebe-input-${name}-wrapper`}>
              {unit ?
                <label
                  id={id}
                  className="iotebe-input"
                  name={name}
                  onChange={onChange}
                  type={type}
                  step={step}
                  placeholder={placeholder}
                  disabled={disabled}
                  pattern={pattern}
                  autoComplete={"off"}
                  style={selectStyle ? selectStyle : {
                    width: "100%",
                    borderRadius: 6,
                    paddingLeft: 14,
                    paddingBlock: 8,
                    backgroundColor: "white",
                    color: "#777",
                    borderColor: required && labelError && "#FD0D1B",
                    ...style,
                  }}
                ><input min={min}
                  max={max} className="iotebe-input-unitmode" value={value || ""} />{` ${unit}`}</label>
                :
                <input
                  id={id}
                  className="iotebe-input"
                  name={name}
                  value={value || ""}
                  onChange={onChange}
                  type={type}
                  step={step}
                  placeholder={placeholder}
                  min={min}
                  max={max}
                  disabled={disabled}
                  pattern={pattern}
                  autoComplete={"off"}
                  style={selectStyle ? selectStyle : {
                    width: "100%",
                    borderRadius: 6,
                    padding: 14,
                    backgroundColor: "white",
                    color: "#777",
                    borderColor: required && labelError && "#FD0D1B",
                    ...style,
                  }}
                  onBlur={onBlur}
                  readOnly={readOnly}
                />}
            </div>
          </RenderTooltip>
        ) : (
          <RenderTooltip tooltip={tooltip} hideTooltip={hideTooltip}>
            <div className={(selectStyle ? "iotebe-select-wrapper-spec" : "iotebe-select-wrapper") + (disabled ? " iotebe-select-wrapper-disabled" : "")} style={selectStyle && { width: "auto", position: "relative" }}>
              <select
                id={id}
                className={selectStyle ? "iotebe-select-spec" : "iotebe-select"}
                name={name}
                value={value || ""}
                onChange={onChange}
                disabled={disabled}
                style={selectStyle ? selectStyle :
                  {
                    opacity: 1,
                    width: "100%",
                    borderRadius: 6,
                    padding: 14,
                    backgroundColor: "white",
                    color: "#777",
                    borderColor: required && labelError && "#FD0D1B",
                    ...style,
                  }}
              >
                {options.map((option) => (
                  <option style={selectStyle && { cursor: "pointer" }} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </ RenderTooltip >
        )}
        {labelError && <div style={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
          marginTop: 5,
          fontSize: '12px',
          color: '#FD0D1B',
          fontWeight: 500,
          width: selectStyle && 0
        }}>{labelError}</div>}
      </label>
    </>
  );
}
