import React from "react";
import { Tooltip } from "@material-ui/core";
import { InfoOutlined } from '@mui/icons-material';

const InfoTooltip = ({ content }) => {
    return (
    <Tooltip style={{ color: "#777", textAlign: "center" }} className="info" title={content} arrow placement="top">
        <InfoOutlined style={{ 
            fontSize: '16px', 
            cursor: 'pointer',
            color: '#156284'
        }} 
        />
    </Tooltip>
  );
};

export default InfoTooltip;
