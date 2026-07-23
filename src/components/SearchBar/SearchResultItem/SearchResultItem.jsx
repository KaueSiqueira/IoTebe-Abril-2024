import React from "react";
import "./SearchResultItem.css";
import Marquee from "react-fast-marquee";
import SearchOffRoundedIcon from "@mui/icons-material/SearchOffRounded";
import useSearchResultItem from "../../../hooks/SearchBar/useSearchResultItem";

const SearchResultItem = ({
  customClass = "",
  key = "",
  onClick = "",
  icon = "",
  topText = "",
  title = "",
  rightText = "",
  noData = false,
  noDataSearchTerm = "",
  mobileMode = false,
  searching = false,
}) => {
  const { pRef, canSlide, handleHover } = useSearchResultItem();

  return (
    <div
      className={`searchResultItem ${mobileMode ? "mobileMode" : ""} ${
        noData ? "noResultItems" : ""
      } ${customClass}`}
      key={key}
      onClick={onClick}
      onMouseEnter={handleHover}
      onTouchStart={handleHover}
    >
      <div className="resultItemIcon">
        {noData ? <SearchOffRoundedIcon /> : icon}
      </div>

      {searching && (
        <div className="chart-loading">
          <div className="chart-loading-animation" />
        </div>
      )}

      {noData ? (
        <p>
          Nenhum resultado encontrado para “<span>{noDataSearchTerm}</span>”
        </p>
      ) : (
        <div className="resultItemText">
          {canSlide && (
            <Marquee className="slidingText">
              <p className="resultItemPath">
                {topText}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </p>
            </Marquee>
          )}
          <p
            ref={pRef}
            className={`resultItemPath ${canSlide ? "fixedText" : ""}`}
          >
            {topText}
          </p>
          <div className="resultItemLoc">
            <p className="resultItemTitle">{title}</p>
            <span>{rightText}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResultItem;
