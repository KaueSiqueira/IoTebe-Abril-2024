import React from "react";
import PropTypes from "prop-types";
import styles from "./styles/SliderItem.module.css";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { concatClassName, blockExternalLink } from "../../../../utilities";

const SliderItem = ({ title, subtitle, image, link, className }) => {
  return (
    <div className={concatClassName(styles.sliderItem, className)}>
      <div className={styles.sliderTitle}>
        <div className={styles.sliderItemTitle}>{title}</div>
        <div className={styles.sliderItemSubTitle}>{subtitle}</div>
        {link && (
          <a
            href="#"
            className={styles.sliderLink}
            onClick={blockExternalLink}
          >
            Saiba mais
            <OpenInNewIcon />
          </a>
        )}
      </div>
      <div className={styles.sliderItemImage}>
        <img src={image} alt={title} draggable="false" />
      </div>
    </div>
  );
};

SliderItem.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
};

export default SliderItem;
