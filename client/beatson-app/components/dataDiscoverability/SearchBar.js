import React, { useState } from 'react';
import {
    Button,
    Grid,
    Typography,
    Card,
    TextField,
    spacing,
  } from "@mui/material";

const SearchBar = () => {
    const [searchQuery, setSearchQuery] = useState(null);

    const handleInputChange = (event) => {
        setSearchQuery(event.target.value);
    }

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        if (searchQuery == null) {
            // do nothing there was no text field entered.
        }
        else {
            console.log(`Searching for : ${searchQuery}`);
        }
    }

    return (
        <form onSubmit={handleSearchSubmit}>
            <input 
            type="text" 
            placeholder="Search"
            value={searchQuery}
            onChange={handleInputChange}
            />
            <button type = "submit" onClick={handleSearchSubmit}>Search</button>
        </form>
    );
}

export default SearchBar;

