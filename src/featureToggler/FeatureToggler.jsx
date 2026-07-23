import { ContactsTwoTone } from "@mui/icons-material";
import React from "react";

export function activateFeature(featureName){
    let items = JSON.parse(sessionStorage.getItem("IOTEBE_ACTIVE_FEATURES"))
    if (!items) items = []

    items.push(featureName)
    sessionStorage.setItem("IOTEBE_ACTIVE_FEATURES", JSON.stringify(items));
    document.location.reload();
}

export function resetActiveFeatures(){
    sessionStorage.removeItem("IOTEBE_ACTIVE_FEATURES");
    document.location.reload();
}

export function FeatureToggler({children, featureName}) {
    const session_data = sessionStorage.getItem("IOTEBE_ACTIVE_FEATURES");
    const featureToggleEnabled = session_data ? JSON.parse(session_data).includes(featureName) : false

    const toggledChildren = React.Children.map(children, child => React.cloneElement(child, {
        featureToggleEnabled,
    }));

    return <>{toggledChildren}</>;

}

export function On({children, featureToggleEnabled}){
    return (
        <>
            {featureToggleEnabled && children}
        </>
    )
}

export function Off({children, featureToggleEnabled}){
    return (
        <>
            {!featureToggleEnabled && children}
        </>
    )
}