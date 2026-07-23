import { ListItemText, Menu, MenuItem, withStyles } from "@material-ui/core";
import { ExpandMore } from "@mui/icons-material";
import React, { useState } from "react";
import { Button } from "../../../components";

const options = [
  { type: "velocity", title: "Velocidade" },
  { type: "acceleration", title: "Aceleração" },
  { type: "envelope", title: "Envelope" },
];

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    height: "30px",
    // fontFamily: "'Montserrat', sans-serif",
    // "&:selected": { backgroundColor: "rgb(21, 98, 132)" },
    "&:focus": {
      backgroundColor: "rgb(21, 98, 132)",
      "& .MuiListItemText-primary": {
        color: theme.palette.common.white,
        fontFamily: "'Montserrat', sans-serif",
      },
      "&:hover": {
        backgroundColor: "rgb(21, 98, 132)",
      },
    },
  },
}))(MenuItem);

export function SpectrumButtons({ setSpectrumType }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setAnchorEl(null);
    setSpectrumType(options[index].type);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <div className="select-button-align">
        <Button
          small
          className="buttonSpectrumType envelopeButton row-center"
          aria-controls="customized-menu"
          aria-haspopup="true"
          variant="contained"
          color="primary"
          onClick={handleClick}
          style={{ border: "1px solid #156284" }}
          buttonType="select-button"
        >
          {options[selectedIndex].title}
          <ExpandMore style={{ color: "white", fontSize: 16 }} disableGutters fontSize="small" />
        </Button>
      </div>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {options.map((option, index) => (
          <StyledMenuItem
            key={option.type}
            selected={index === selectedIndex}
            onClick={(event) => handleMenuItemClick(event, index)}
            dense
          >
            <ListItemText primary={option.title} />
          </StyledMenuItem>
        ))}
      </StyledMenu>
    </>
  );
}
