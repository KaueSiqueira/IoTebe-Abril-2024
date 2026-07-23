import React from "react";
import { Slider } from "@mui/material";
import { styled } from "@mui/material/styles";

const CustomSlider = styled(Slider)(({ railColor, trackColor, markColor }) => ({
  "& .MuiSlider-track": {
    color: trackColor,
  },
  "& .MuiSlider-thumb": {
    display: "none",
  },
  "& .MuiSlider-rail": {
    color: railColor,
    opacity: 1,
  },
  "& .MuiSlider-mark": {
    width: 5,
    height: 20,
    backgroundColor: markColor,
    borderRadius: 5,
    opacity: 1,
  },
  "& .MuiSlider-markLabel": {
    color: "#777",
    fontSize: 14,
    fontWeight: "initial",
  },
}));

export default CustomSlider;
