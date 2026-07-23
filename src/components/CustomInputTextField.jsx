import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import { TextField } from "@material-ui/core";
import { placeholder } from "@babel/types";

const useStyles = makeStyles({
    customTextField: {
        "& .MuiOutlinedInput-root": {
            color: "#888888",
            "& fieldset": {
                borderColor: "#156284"
            },
            "&:hover fieldset": {
                borderColor: "#0D3C50"
            },
            "&.Mui-focused fieldset": {
                borderColor: "#1FC4AD",
                color: "#1FC4AD"
            }
        },
        "& .MuiFormLabel-root": {
            color: "#888888",
            "&.Mui-focused": {
                color: "#1FC4AD"
            }
        }
    }
});

export default function CustomInputTextField({name, labelInput, placeholderInput, rowsInput, valueInput, inputPropsInput, inputLabelPropsInput, handleChange, disabledTrue}) {
    const classes = useStyles();

    return (
        <TextField
            className={classes.customTextField}
            label={labelInput}
            variant="outlined"
            fullWidth
            margin="dense"
            multiline
            rows={rowsInput}
            placeholder={placeholderInput}
            name={name}
            value={valueInput}
            InputProps={inputPropsInput}
            InputLabelProps={inputLabelPropsInput}
            onChange={handleChange}
            disabled={disabledTrue}
        />
    );
}
