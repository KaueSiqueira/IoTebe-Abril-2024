import React from "react";
import styles from "./styles/Button.module.css";
import { concatClassName } from "../../../utilities";
import PropTypes from "prop-types";

const Button = ({
  children = "Button Text",
  className,
  outline,
  href,
  size = "full",
  ...otherProps
}) => {
  const buttonType = href ? "a" : "button";

  return React.createElement(
    buttonType,
    {
      href,
      className: concatClassName(
        styles.customButton,
        outline ? styles.outlineButton : styles.filledButton,
        styles[size],
        className
      ),
      ...otherProps,
    },
    children
  );
};

Button.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  outline: PropTypes.bool,
  href: PropTypes.string,
  size: PropTypes.oneOf(["sm", "md", "lg", "full"]),
};

export default Button;
