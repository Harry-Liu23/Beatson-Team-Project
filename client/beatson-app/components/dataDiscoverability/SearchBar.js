import React, { useState } from 'react';
import {
    Button,
    Grid,
    Typography,
    Card,
    TextField,
    spacing,
    Box,
  } from "@mui/material";
  import SearchIcon from '@mui/icons-material/Search';
import StudiesTable from "./StudiesTable";
import SamplesTable from "./SamplesTable";

//@app.route('/search_all_nodes/<search_string>',methods=['GET'])

const SearchBar = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [renderTable, setRenderTable] = useState(true);
    const [studySend, setStudySend] = useState([]);
    const [sampleSend, setSampleSend] = useState([]);
    const [change, setChange] = useState(false);

    const handleInputChange = (event) => {
        setSearchQuery(event.target.value);
    }

    const handleSearchSubmit = async () => {
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
                console.log(data["Study"]);
                console.log(data["Sample"]);
                
                //Data to populate study table
                if (data["Study"] !== undefined) {
                    setStudySend(data["Study"]);
                } else {
                    setStudySend([]);
                }

                //Data to populate sample table
                if (data["Sample"] !== undefined) {
                    setSampleSend(data["Sample"]);
                } else {
                    setSampleSend([]);
                }

                setChange(!change);
            }
            catch (error) {
                console.error("Unable to fetch data: ", error);
            }
        }
    }

    return (
        <div>
        <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '1em'}}>
            <SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
            <TextField
                id="input-with-sx" 
                label="Search" 
                variant="standard" 
                onChange={handleInputChange} 
                onKeyDown={(event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    handleSearchSubmit()
                }
            }}/>
            <Button type = "submit" onClick={handleSearchSubmit}>Search</Button>
        </Box>

        {renderTable && (<StudiesTable studies = {studySend} change = {change}/>)}
        {renderTable && (<SamplesTable samples = {sampleSend} change = {change} />)}
        </div>
    );
}

export default SearchBar;

