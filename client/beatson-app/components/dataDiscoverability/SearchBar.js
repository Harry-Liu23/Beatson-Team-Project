import React, { useState } from 'react';
import {
    Button,
    Grid,
    Typography,
    Card,
    TextField,
    spacing,
  } from "@mui/material";

//@app.route('/search_all_nodes/<search_string>',methods=['GET'])

const SearchBar = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const handleInputChange = (event) => {
        setSearchQuery(event.target.value);
    }

    const handleSearchSubmit = async (event) => {
        event.preventDefault();
        if (searchQuery == "") {
            // do nothing there was no text field entered.
        }
        else {
            console.log(`Searching for : ${searchQuery}`);
            try {
                const response = await fetch("http://127.0.0.1:2020/search_all_nodes/" + searchQuery);
                if (response.status !== 200) {
                  throw new Error("Unable to fetch studies containing that text: ", data.message);
                }
                const data = await response.json();
                console.log(data);
                //setRows(data.study);
                //console.log(rows);
            }
            catch (error) {
                console.error("Unable to fetch data: ", error);
            }
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

