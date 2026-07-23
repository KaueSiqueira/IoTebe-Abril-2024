import React from "react";
import styles from "./styles/RegisterNavbar.module.css";
import logo from "../../../../assets/imgs/logo_iotebe.svg";
import { SupportAgentRounded } from "@mui/icons-material";
import Button from "../../../../shared/components/Button";
import { blockExternalLink } from "../../../../utilities";

const RegisterNavbar = () => {
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

export default RegisterNavbar;
