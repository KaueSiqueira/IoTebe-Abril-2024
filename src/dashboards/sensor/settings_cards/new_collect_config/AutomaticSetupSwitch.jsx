import React from "react";
import {
    FormControlLabel,
    Radio,
    RadioGroup,
    withStyles,
} from "@material-ui/core";

const TebeRadio = withStyles({
    root: {
        color: "rgba(21, 98, 132, 1)",
        "&$checked": {
            color: "rgba(21, 98, 132, 1)",
        },
    },
    checked: {},
})((props) => <Radio color="default" {...props} />);

export function AutomaticSetupSwitch({ handleRadioChange, setIsAuto, isAuto }) {
    return (
        <div>
            <h6 className="iotebe-label" style={{ paddingInline: 0 }}>Setup</h6>
            <RadioGroup
                row
                aria-label="permission"
                name="permission"
                defaultValue={"AUTO"}
                onChange={(event) => { handleRadioChange(event); setIsAuto(!isAuto) }}
                style={{ height: "fit-content" }}
            >
                <FormControlLabel
                    style={{ height: 30 }}
                    value="AUTO"
                    control={<TebeRadio size="small" />}
                    label="Automático"
                />
                <FormControlLabel
                    style={{ height: 30 }}
                    value="MANUAL"
                    control={<TebeRadio size="small" />}
                    label="Manual"
                />
            </RadioGroup>
        </div>
    )
}