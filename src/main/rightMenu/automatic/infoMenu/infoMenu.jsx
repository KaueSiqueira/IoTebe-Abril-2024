import React from "react";
import "./infoMenu.css"
import { EletricMotor, CentrifugalPump, ExhaustFan, SteamTurbine, Reducer, Generator, Rotors } from "../../../../assets/customIcons/automaticDiagnostic";
import { AerodynamicFailure, Bearing, Cavitation, Clearance, ElectricalFault, Gear, HydrodynamicFailure, Lubrificant, Misalignment, SlidingBearingInstability, Unbalanced } from "../../../../assets/customIcons";

export default function InfoMenu() {

  return (
    <div className="infoMenu">
      <h1>Diagnóstico Automático</h1>
      <p>A ferramenta de diagnóstico automático cria alarmes após treinamento para identificar níveis normais de operação e detectar defeitos mecânicos, elétricos e hidráulicos.</p>
      <h2>As máquinas que o nosso algoritmo é capaz de diagnosticar falhas são apresentadas abaixo:</h2>
      <div className="equipmentWrap">
        <div className="equipment">
          <EletricMotor />
          <h3>Motor elétrico</h3>
        </div>
        <div className="equipment">
          <CentrifugalPump />
          <h3>Bomba centrífuga</h3>
        </div>
        <div className="equipment">
          <ExhaustFan />
          <h3>Ventilador exaustor</h3>
        </div>
        <div className="equipment">
          <SteamTurbine />
          <h3>Turbina a vapor</h3>
        </div>
        <div className="equipment">
          <Reducer />
          <h3>Redutor</h3>
        </div>
        <div className="equipment">
          <Generator />
          <h3>Gerador</h3>
        </div>
        <div className="equipment">
          <Rotors />
          <h3>Rotores em geral</h3>
        </div>
      </div>
      <h2>E os tipos de defeitos encontrados são listados abaixo:</h2>
      <div className="warningWrap">
        <div className="firstTwo">
          <div className="warning">
            <Unbalanced />
            <h3>Desbalanceamento</h3>
          </div>
          <div className="warning">
            <SlidingBearingInstability />
            <h3>Instabilidade em Mancais de Deslizamento</h3>
          </div>
        </div>
        <div className="warning">
          <Lubrificant />
          <h3>Lubrificação inadequada</h3>
        </div>
        <div className="warning">
          <ElectricalFault />
          <h3>Defeitos elétricos</h3>
        </div>
        <div className="warning">
          <HydrodynamicFailure />
          <h3>Defeitos hidrodinâmicos</h3>
        </div>
        <div className="warning">
          <Cavitation />
          <h3>Cavitação</h3>
        </div>
        <div className="warning">
          <AerodynamicFailure />
          <h3>Defeitos aerodinâmicos</h3>
        </div>
        <div className="warning">
          <Misalignment />
          <h3>Desalinhamento</h3>
        </div>
        <div className="warning">
          <Bearing />
          <h3>Defeitos em rolamentos</h3>
        </div>
        <div className="warning">
          <Gear />
          <h3>Defeitos em engrenamentos</h3>
        </div>
        <div className="warning">
          <Clearance />
          <h3>Folga</h3>
        </div>
      </div>
      <h2 className="finalMargin">Caso o tipo de máquina ou defeito não esteja listado acima, entre em contato com nosso <a onClick={() => window.open("https://wa.me/551931321442?text=Olá, gostaria de ajuda", "_blank")}>suporte técnico</a>.</h2>
    </div>
  );
}
