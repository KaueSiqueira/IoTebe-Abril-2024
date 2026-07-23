import React, { useState } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import styles from "./styles/TabPanel.module.css";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  indicator: {
    backgroundColor: "#156284",
  },
});

export default function TabPanel(props) {
  const { tabs } = props;

  const [value, setValue] = useState(0);

  const classes = useStyles();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (tabs?.length) {
    return (
      <div className={styles.tabPanelContainer}>
        <Tabs
          classes={{
            indicator: classes.indicator,
          }}
          className={styles.tabPanel}
          value={value}
          onChange={handleChange}
        >
          {tabs.map((tab, index) => {
            return (
              <Tab
                key={"tab" + index}
                label={tab.label}
                id={`tab-${index}`}
                aria-controls={`tabpanel-${index}`}
                className={styles.tabButton}
              />
            );
          })}
        </Tabs>
        {tabs.map((tab, index) => {
          return (
            <CustomTabPanel value={value} index={index} key={"panel" + index}>
              {tab.content}
            </CustomTabPanel>
          );
        })}
      </div>
    );
  }
}

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {children}
    </div>
  );
}

TabPanel.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      content: PropTypes.node.isRequired,
    })
  ).isRequired,
};

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};
