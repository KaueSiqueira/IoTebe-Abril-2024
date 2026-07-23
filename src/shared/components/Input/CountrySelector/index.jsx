import React from "react";
import styles from "../styles/Input.module.css";
import { concatClassName } from "../../../../utilities";
import { ArrowDropDown } from "@mui/icons-material";
import { getCountryCallingCode } from "react-phone-number-input";
import useCountrySelector from "../hooks/useCountrySelector";

const CountrySelector = ({
  countries,
  labels,
  selectedCountry,
  onChangeCountry,
  readOnly,
  disable,
}) => {
  const {
    isCountrySelectorOpen,
    toggleCountrySelector,
    countryButtonRef,
    countrySelectorRef,
  } = useCountrySelector();

  return (
    <>
      <div
        ref={countryButtonRef}
        className={concatClassName(
          styles.countryList,
          (readOnly || disable) && styles.disable
        )}
        onClick={() => {
          !readOnly && !disable && toggleCountrySelector();
        }}
      >
        <div className={styles.countryFlag}>
          <img
            src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${selectedCountry}.svg`}
            alt="flag"
          />
          {!readOnly && !disable && <ArrowDropDown />}
        </div>
      </div>
      <div
        ref={countrySelectorRef}
        className={concatClassName(
          styles.countrySelector,
          isCountrySelectorOpen && styles.openSelector
        )}
      >
        {countries
          .map((country) => {
            return { label: labels[country], country: country };
          })
          .sort()
          .map((obj, key) => (
            <div
              className={styles.countryOption}
              onClick={() => {
                toggleCountrySelector();
                onChangeCountry && onChangeCountry(obj.country);
              }}
              key={key}
            >
              <img
                src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${obj.country}.svg`}
                alt="flag"
              />
              <p className={styles.countryLabel}> {obj.label}</p>
              <p className={styles.countryCode}>
                +{getCountryCallingCode(obj.country)}
              </p>
            </div>
          ))}
      </div>
    </>
  );
};

export default CountrySelector;
