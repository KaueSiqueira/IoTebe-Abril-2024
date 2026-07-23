import React from "react";
import RadioInput  from "../../../../components/RadioGroup/RadioInput/RadioInput";
import RadioGroup from "../../../../components/RadioGroup/RadioGroup";

export function DynamicBand({ value, setCollectSettings, disabled }) {
    return (
        <div>
            <RadioGroup
                row
                aria-label="dynamicBand"
                name="dynamicBand"
                title="Faixa dinâmica"
                value={value}
                onChange={(e) => {
                    try {
                        setCollectSettings(prev => {
                            return {
                                ...prev,
                                dynamicBand: Number(e.target.value)
                            }
                        })
                    }
                    catch {
                        console.log("Error while updating dynamic band")
                    }
                }}
                style={{ height: "fit-content" }}
                disabled={disabled}
            >
                <RadioInput
                    style={{ height: 30 }}
                    value={2}
                    label="2g"
                />
                <RadioInput
                    style={{ height: 30 }}
                    value={4}
                    label="4g"
                />
                <RadioInput
                    style={{ height: 30 }}
                    value={8}
                    label="8g"
                />
                <RadioInput
                    style={{ height: 30 }}
                    value={16}
                    label="16g"
                />
            </RadioGroup>
        </div>
    )
}
