import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
    Grid,
} from "@mui/material";

const StudiesTable = () => {

    // retrieve all studies from Neo4J via Flask
    const [rows, setRows] = useState([]);

    // define columns for studies table
    const [columns, setColumns] = useState([
        {
          field: "accession",
          headerName: "Accession",
          width: 200,
        },
        {
          field: "studyType",
          headerName: "Study Type",
          width: 200,
        },
        {
          field: "organism",
          headerName: "Organism",
          width: 200,
        },
        {
          field: "publication",
          headerName: "Publication",
          width: 200,
        },
        {
          field: "description",
          headerName: "Description",
          width: 200,
        },
        {
          field: "expNumber",
          headerName: "Number of Experiments",
          width: 300,
        },
    ]);

    // create a row populated by properties of a study

    return (

        // display each study as a row on mui DataGrid
        <div> 
            <Grid 
                container
                direction="column"
                alignItems="center"
                justifyContent="center"
            >
                <DataGrid rows={rows} columns={columns} />
                
            </Grid>
        </div>
    );
};

export default StudiesTable;