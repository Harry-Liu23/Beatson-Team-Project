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
          field: "study_type",
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

    // get all existing study nodes
    const getStudiesData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:2020/get_all_study");
        if (response.status!==200) {
          throw new Error("Unable to fetch studies: ", data.message);
        }
        const data = await response.json();
        setRows(data.study);
      }
      catch (error) {
        console.error("Unable to fetch data: ", error);
      }
    };

    // get studies when the studies table is first rendered
    useEffect (() => {
        getStudiesData();
    }, []);

    return (

        // display each study as a row on mui DataGrid
        <div> 
            <Grid 
                container
                direction="column"
                alignItems="center"
                justifyContent="center"
            >
                <DataGrid getRowId = {(row) => row.accession} rows={rows} columns={columns} />
            </Grid>
        </div>
    );
};

export default StudiesTable;