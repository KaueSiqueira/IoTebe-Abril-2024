import React from "react";
import onlyLogo from "../assets/imgs/only_logo.png";

export default function FullPageLoader() {
  return (
    <>
      <div className="loading-main">
        <img src={onlyLogo} className="inside-loading-main" height={80} width={80} alt="logo-loading" />
      </div>
    </>
  );
}
