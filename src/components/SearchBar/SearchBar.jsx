import "./SearchBar.css";
import React from "react";
import useSearchBar from "../../hooks/SearchBar/useSearchBar";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import SearchResultItem from "./SearchResultItem/SearchResultItem";

function SearchBar({ mobileMode = false }) {
  const {
    activeSearchBar,
    toggleSearchBarState,
    showResults,
    searchTerm,
    updateSearchTerm,
    clearSearchTerm,
    inputRef,
    activateInputFocus,
    searchResult,
    resultItemAction,
    searchBarRef,
    searching,
  } = useSearchBar(mobileMode);

  return (
    <>
      {mobileMode && (
        <button
          className="mobileSearchBarIcon"
          type="button"
          onClick={() => {
            toggleSearchBarState(true);
          }}
        >
          <span>
            <SearchRoundedIcon />
          </span>
        </button>
      )}

      <div
        ref={searchBarRef}
        className={`searchBar ${activeSearchBar ? "activeSearchBar" : ""} ${
          mobileMode ? "mobileSearchBar" : ""
        }`}
        onFocus={() => {
          !mobileMode && toggleSearchBarState(true);
        }}
      >
        {mobileMode && (
          <button
            className="mobileCloseSearchBarIcon"
            type="button"
            onClick={() => {
              toggleSearchBarState(false);
              clearSearchTerm();
            }}
          >
            <span>
              <ArrowBackRoundedIcon />
            </span>
          </button>
        )}

        <div className="searchInput" onFocus={activateInputFocus}>
          <div className="searchIcon">
            <SearchRoundedIcon />
          </div>
          <input
            ref={inputRef}
            type="text"
            placeholder="Pesquisar..."
            value={searchTerm}
            onChange={updateSearchTerm}
          />
          <div
            className={`clearSearchIcon ${
              searchTerm.length > 0 && "activeClearSearchIcon"
            }`}
            onClick={clearSearchTerm}
          >
            <CloseRoundedIcon />
          </div>
        </div>
        {showResults && (
          <div className={`searchResults activeSearchResults`}>
            {searchResult.length > 0 && !searching
              ? searchResult.map((item, index) => {
                  return (
                    <SearchResultItem
                      key={"searchResultItem" + toString(index)}
                      onClick={() => {
                        resultItemAction(item.tree_id);
                      }}
                      icon={item.icon}
                      topText={item.path}
                      title={item.title}
                      rightText={item.sensor_id}
                      mobileMode={mobileMode}
                    />
                  );
                })
              : searchTerm.length > 0 && (
                  <SearchResultItem
                    noData={true}
                    noDataSearchTerm={searchTerm}
                    mobileMode={mobileMode}
                    searching={searching}
                  />
                )}
          </div>
        )}
      </div>
    </>
  );
}

export default SearchBar;
