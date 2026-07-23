import React from "react";
import styles from "../styles/Input.module.css";
import { concatClassName } from "../../../../utilities";

const RequirementsInfo = ({ requirementsInfo }) => {
  return (
    <>
      <div className={styles.requirementsTitle}>{requirementsInfo.title}</div>
      <div className={styles.inputRequirements}>
        {requirementsInfo.requirements.map((requirement, key) => {
          return (
            <div
              className={concatClassName(
                styles.requirement,
                (requirement.isValid === true ||
                  requirement.isValid === false) &&
                  (requirement.isValid
                    ? styles.validRequirement
                    : styles.invalidRequirement)
              )}
              key={key}
            >
              <div className={styles.circleLabel}></div>
              {requirement.label}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default RequirementsInfo;
