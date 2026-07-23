import React from "react";
import styles from "./styles/Input.module.css";
import {
  ContentCopyRounded,
  SaveRounded,
  VisibilityOffRounded,
  VisibilityRounded,
} from "@mui/icons-material";
import { concatClassName } from "../../../utilities";
import useInput from "./hooks/useInput.jsx";
import CountrySelector from "./CountrySelector/index.jsx";
import RequirementsInfo from "./RequirementsInfo/index.jsx";
import PropTypes from "prop-types";
import { IconButton, Tooltip } from "@mui/material";

const Input = React.forwardRef(
  (
    {
      // Input props
      type = "text",
      required,
      className,

      // Titles and styles
      label,
      subLabel,
      info,
      errorMessages,
      isValid = !errorMessages?.length,
      requirementsInfo,

      // Props for input type telephone
      countries,
      countryLabels,
      selectedCountry,
      onChangeCountry,

      // Rest
      wrapperClassName,
      inputAction,
      copyButton,
      saveButton,
      isFakePassword,
      ...otherProps
    },
    ref
  ) => {
    const {
      isPasswordVisible,
      togglePasswordVisibility,
      handleCopy,
      openCopyTooltip,
      inputRef,
      handleFocus,
      isValueHide,
    } = useInput(isFakePassword);

    return (
      // Input wrapper
      <div
        className={concatClassName(
          styles.inputWrapper,
          !isValid && styles.invalidInput,
          wrapperClassName
        )}
        onClick={handleFocus}
      >
        {/* Input label/title */}
        {label && (
          <div className={styles.inputLabel}>
            <div className={styles.labelText}>
              {label} {required && <span>*</span>}
            </div>
            {(saveButton?.isActive || inputAction) && (
              <div className={styles.inputLabelFuncs}>
                {saveButton?.isActive && (
                  <div
                    className={concatClassName(
                      styles.saveButton,
                      !isValid && styles.unableToSave
                    )}
                    onClick={() => {
                      if (saveButton?.action && isValid) {
                        saveButton.action();
                      }
                    }}
                  >
                    <SaveRounded />
                  </div>
                )}
                {inputAction && (
                  <div
                    className={styles.inputAction}
                    onClick={inputAction?.action}
                  >
                    {inputAction.label}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Input sub-label/sub-title */}
        {subLabel && <div className={styles.inputSubLabel}>{subLabel}</div>}

        {/* Input field */}
        <div className={styles.inputDiv}>
          {copyButton && (
            <Tooltip open={openCopyTooltip} title="Copiado!" arrow>
              <IconButton
                className={styles.copyButton}
                onClick={() => {
                  handleCopy(
                    otherProps?.value || otherProps?.defaultValue || ""
                  );
                }}
              >
                <ContentCopyRounded className={styles.copyIcon} />
              </IconButton>
            </Tooltip>
          )}
          {type === "tel" && (
            <CountrySelector
              countries={countries}
              labels={countryLabels}
              selectedCountry={selectedCountry}
              onChangeCountry={onChangeCountry}
              readOnly={otherProps?.readOnly}
              disable={otherProps?.disable}
            />
          )}
          <input
            className={concatClassName(
              styles.customInput,
              type === "password" && styles.passwordInput,
              type === "tel" && styles.telInput,
              isValueHide && styles.hideValue,
              className
            )}
            type={isFakePassword ? "text" : isPasswordVisible ? "text" : type}
            {...otherProps}
            ref={(el) => {
              inputRef.current = el;
              if (ref) {
                if (typeof ref === "function") {
                  ref(el);
                } else {
                  ref.current = el;
                }
              }
            }}
          />
          {type === "password" && (
            <div
              className={styles.passwordVisibility}
              onClick={togglePasswordVisibility}
            >
              {isPasswordVisible ? (
                <VisibilityOffRounded />
              ) : (
                <VisibilityRounded />
              )}
            </div>
          )}
        </div>

        {/* Input information */}
        {info && <div className={styles.inputInfo}>{info}</div>}

        {/* Input requirements view */}
        {requirementsInfo && (
          <RequirementsInfo requirementsInfo={requirementsInfo} />
        )}

        {/* Input error messages */}
        {!isValid &&
          errorMessages?.map(
            (feedback, key) =>
              feedback !== "" && (
                <div key={key} className={styles.errorMessage}>
                  {feedback}
                </div>
              )
          )}
      </div>
    );
  }
);

Input.propTypes = {
  type: PropTypes.string,
  required: PropTypes.bool,
  className: PropTypes.string,
  label: PropTypes.string,
  subLabel: PropTypes.string,
  info: PropTypes.string,
  errorMessages: PropTypes.arrayOf(PropTypes.string),
  isValid: PropTypes.bool,
  requirementsInfo: PropTypes.shape({
    title: PropTypes.string,
    requirements: PropTypes.arrayOf(
      PropTypes.shape({
        isValid: PropTypes.bool,
        label: PropTypes.string.isRequired,
      })
    ),
  }),
  countries: PropTypes.arrayOf(PropTypes.string),
  countryLabels: PropTypes.objectOf(PropTypes.string),
  selectedCountry: PropTypes.string,
  onChangeCountry: PropTypes.func,
  wrapperClassName: PropTypes.string,
  inputAction: PropTypes.shape({
    label: PropTypes.string.isRequired,
    action: PropTypes.func,
  }),
  copyButton: PropTypes.bool,
  saveButton: PropTypes.shape({
    isActive: PropTypes.bool.isRequired,
    action: PropTypes.func,
  }),
  isFakePassword: PropTypes.bool,
};

export default Input;
