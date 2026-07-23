import { Slider, Switch, withStyles } from "@material-ui/core";
import { colors } from "../../../utilities";


const MyCustomSwitchAlarm = withStyles((theme) => ({
  root: {
    width: 25,
    height: 13,
    padding: 0,
    display: "flex",
  },
  switchBase: {
    padding: 2,
    color: theme.palette.grey[500],
    "&$checked": {
      transform: "translateX(12px)",
      color: theme.palette.common.white,
      "& + $track": {
        opacity: 1,
        backgroundColor: "#67C6BA",
        borderColor: "#67C6BA" ,
      },
    },
  },
  thumb: {
    width: 8,
    height: 8,
    boxShadow: "none",
  },
  track: {
    border: `1px solid ${theme.palette.grey[500]}`,
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: theme.palette.common.white,
  },
  checked: {},
}))(Switch);

const MyCustomSwitchAlarmMobile = withStyles((theme) => ({
  root: {
    width: 49,
    height: 25,
    padding: 0,
    display: "flex",
  },
  switchBase: {
    padding: 2,
    color: theme.palette.grey[500],
    "&$checked": {
      transform: "translateX(24px)",
      color: theme.palette.common.white,
      "& + $track": {
        opacity: 1,
        backgroundColor: "#67C6BA",
        borderColor: "#67C6BA" ,
      },
    },
  },
  thumb: {
    width: 20,
    height: 20,
    boxShadow: "none",
  },
  track: {
    border: `1px solid ${theme.palette.grey[500]}`,
    borderRadius: 40,
    opacity: 1,
    backgroundColor: theme.palette.common.white,
  },
  checked: {},
}))(Switch);

const MyCustomSliderAlarm = withStyles({
  root: {
    color: colors.greenLogo,
    height: 8,
  },
  thumb: {
    height: 10,
    width: 10,
    backgroundColor: "#67C6BA",
    marginTop: -2,
    marginLeft: -3,
    "&:focus, &:hover, &$active": {
      boxShadow: "inherit",
    },
  },
  active: {},
  valueLabel: {
    left: "calc(-50% + 8px)",
  },
  track: {
    height: 5,
    borderRadius: 4,
    backgroundColor: "#67C6BA",
  },
  rail: {
    height: 5,
    borderRadius: 4,
    backgroundColor: "#D6F0EC",
  },
})(Slider);


export { MyCustomSliderAlarm, MyCustomSwitchAlarm, MyCustomSwitchAlarmMobile };
