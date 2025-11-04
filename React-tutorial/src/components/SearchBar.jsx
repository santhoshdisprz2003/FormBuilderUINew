import React from "react";
import "../styles/SearchBar.css";
import SearchIcon from "../assets/SearchIcon.png";
import FilterIcon from "../assets/FilterIcon.png";

export default function SearchBar({ search, setSearch, onFilterClick }) {
  return (
    <div className="searchbar">
      <div className="search-input-wrapper">
        <img src={SearchIcon} alt="Search" className="search-icon" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
          className="search-input"
        />
      </div>
      <button className="filter-btn" onClick={onFilterClick}>
        <img src={FilterIcon} alt="Filter" /><p>Filter</p>
      </button>
    </div>
  );
}
