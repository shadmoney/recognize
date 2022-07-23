import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ReactComponent as SearchIcon  } from "../../../assets/search.svg";
import classes from "./searchBar.module.css";

const SearchBar = ({ onSearch }) => {
  const location = useLocation();
  const [state, setState] = useState({
    searchValue: "",
  });

  const { searchValue } = state;
  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };
  useEffect(() => {
    const { search } = location;
    const name = new URLSearchParams(search).get("search");
    if (name) {
      handleSetState({ searchValue: name });
    }
  }, []);

  const seachHandler = (event) => {
    onSearch(event.target.value);
    handleSetState({ searchValue: event.target.value });
  };

  return (
    <div className={classes.searchInput}>
      <SearchIcon alt="" />
      <input type="search" onChange={seachHandler} value={searchValue} placeholder="Search Items" />
    </div>
  );
};

export default SearchBar;
