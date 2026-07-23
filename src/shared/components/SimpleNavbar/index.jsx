import React from "react";
import styles from "./styles/SimpleNavbar.module.css";
import logo from "../../../assets/imgs/logo_iotebe.svg";
import { SupportAgentRounded } from "@mui/icons-material";
import Button from "../Button";
import { blockExternalLink } from "../../../utilities";

const SimpleNavbar = () => {
  return (
    <nav className={styles.navbar}>
      <a className={styles.logo} href="./">
        <img
          className={styles.logoImage}
          alt="TebeLogo"
          src={logo}
          loading="lazy"
        ></img>
      </a>
      <div className={styles.support}>
        <Button outline onClick={blockExternalLink}>
          <SupportAgentRounded />
        </Button>
      </div>
    </nav>
  );
};

export default SimpleNavbar;
