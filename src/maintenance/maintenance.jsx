import React from "react";
import "./assets/style/style.css"
import ilustration from "./assets/img/Maintenance.png"
import logo from "./assets/img/Logo_IoTebe.png"


function Maintenance(){
    return <div className="maintenance">
        <div className="maintenance-container">
            <div className="image-container">
                <img src={ilustration} alt="Sistema IoTebe em Manutenção"/>
            </div>
            <div className="text-container">
                <h1 id="title">Ops, estamos em manutenção</h1>
                <p id="second_title">Mas relaxa! Não é corretiva...<br/><span>Estamos aprimorando nosso sistema!</span></p>
                <p id="text">A <span id="iot">IoT</span><span id="ebe">ebe</span> está passando por uma atualização e ainda hoje estará de volta ao ar.  Agradecemos a compreensão.</p>
                <img className="logo" src={logo} alt="Logotipo azul IoTebe"/>
            </div>
        </div>
    </div>
};

export default Maintenance;