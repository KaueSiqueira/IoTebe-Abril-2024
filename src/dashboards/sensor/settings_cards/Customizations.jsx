import React from "react";
import { Slider, Switch, Tooltip, withStyles } from "@material-ui/core";
import { colors } from "../../../utilities";
import PropTypes from "prop-types";

const MyCustomSwitch = withStyles((theme) => ({
  root: {
    width: 28,
    height: 16,
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
        backgroundColor: colors.greenLogo,
        borderColor: colors.greenLogo,
      },
    },
  },
  thumb: {
    width: 12,
    height: 12,
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


const MyCustomSlider = withStyles({
  root: {
    color: colors.greenLogo,
    height: 8,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: colors.greenLogo,
    marginTop: -8,
    marginLeft: -12,
    "&:focus, &:hover, &$active": {
      boxShadow: "inherit",
    },
    '&$disabled': {
      backgroundColor: '#a4a4a4',
      height: 24,
      width: 24,
      marginTop: -8,
      marginLeft: -12,
    },
  },
  active: {},
  disabled: {
  },
  valueLabel: {
    left: "calc(-50% + 8px)",
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
  mark: {
    display: "none",
  }
})(Slider);

const ZindexTooltip = withStyles((theme) => ({
  popper: {
    zIndex: 1,
  },
}))(Tooltip);

function ValueLabelComponent({ children, open, value}) {
  return (
    <ZindexTooltip
      arrow
      disableInteractive
      disableFocusListener
      disableHoverListener
      disableTouchListener
      open={open}
      placement="top"
      title={value + " min"}
      PopperProps={{
        disablePortal: true,
        modifiers: {
          flip: {
            enabled: false,
          },
          preventOverflow: {
            enabled: false,
            boundariesElement: 'scrollParent',
          },
          }
    }}
    >
      {children}
    </ZindexTooltip>
  );
}

function AltValueLabelComponent({ children, open, value}) {
  return (
    <ZindexTooltip
      arrow
      disableInteractive
      disableFocusListener
      disableHoverListener
      disableTouchListener
      open={open}
      placement="top"
      title={value + "h"}
      PopperProps={{
        disablePortal: true,
        modifiers: {
          flip: {
            enabled: false,
          },
          preventOverflow: {
            enabled: false,
            boundariesElement: 'scrollParent',
          },
          }
    }}
    >
      {children}
    </ZindexTooltip>
  );
}

export { ValueLabelComponent, AltValueLabelComponent, MyCustomSlider, MyCustomSwitch };

ValueLabelComponent.propTypes = {
  children: PropTypes.element.isRequired,
  open: PropTypes.bool.isRequired,
  value: PropTypes.number.isRequired,
};
