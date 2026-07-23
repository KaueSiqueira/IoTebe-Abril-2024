import React from "react";
import { activateFeature, resetActiveFeatures } from "../featureToggler/FeatureToggler";

export function NavbarFeatureMenu({children, featureName}) {
    return <>
        <li className="sb-item nav-item my-3 my-lg-auto mx-auto order-1 order-lg-1" 
        style={{
            "marginLeft": "5px"
        }} 
        onClick={() => {
            const featureName = prompt("Habilitar função:");
            if (!(featureName === null || featureName === "")) {
            activateFeature(featureName.toLocaleLowerCase())
            }
        }}>
        <button className="spot-management-button rounded-button"><span>+</span></button>
        </li>
        <li className="sb-item nav-item my-3 my-lg-auto mx-auto order-1 order-lg-1" 
        style={{
            "marginLeft": "5px"
        }} 
        onClick={() => {
            resetActiveFeatures();
        }}>
        <button className="spot-management-button rounded-button"><span>R</span></button>
        </li>
    </>;
}