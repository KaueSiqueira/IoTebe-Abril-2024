/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useRef, useState } from "react";
import { Tooltip } from "@material-ui/core";
import { CSVLink } from "react-csv";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";

export function DownloadButton({
  filename,
  data,
  headers,
  className,
  cancel,
  small,
  style,
  ...rest
}) {
  const buttonRef = useRef(null);
  const [renderCsvLink, setRenderCsvLink] = useState(false);

  useEffect(() => {
    if (renderCsvLink && buttonRef.current) {
      buttonRef.current.link.click();
    }
  }, [buttonRef, renderCsvLink]);

  return (
    <>
      <a
        className={` ${!!className && className}`}
        style={{
          backgroundColor: !!cancel ? "#fd0d1b" : "#156284",
          color: "white",
          borderRadius: 3,
          outline: "none",
          border: 0,
          height: 17,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingRight: 6,
          paddingLeft: 6,
          margin: 0,
          fontSize: !!small ? 10 : 14,
          whiteSpace: "nowrap",
          ...style,
        }}
        {...rest}
        onClick={() => {
          setRenderCsvLink(true);
        }}
      >
        <Tooltip title="Baixar dados">
          <CloudDownloadIcon fontSize={"inherit"} style={{ fontSize: 18 }} />
        </Tooltip>
      </a>
      {renderCsvLink && (
        <CSVLink
          filename={filename}
          data={data}
          headers={headers}
          ref={buttonRef}
          style={{
            display: "none",
          }}
          onClick={() => {
            setRenderCsvLink(false);
          }}
        ></CSVLink>
      )}
    </>
  );
}
