import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { 
  Grid,
  Card,
 } from "@mui/material";

const StudiesTable = (prop) => {
  // rows for studies table where each row corresponds to a study
  const [rows, setRows] = useState([]);
  const [newChange, setNewChange] = useState(prop.change);


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

  // if change to search has changed then call get studies data

  // retrieve all studies from Neo4J via Flask
  const getStudiesData = () => {
    setRows(prop.studies);
  }

  // //get studies when the studies table is first rendered
  useEffect(() => {
    getStudiesData();
  }, []);

  if (newChange !== prop.change) {
    try {
      setRows(prop.studies);
      setNewChange(!newChange);
    }
    catch (error) {
      console.log("No studies found " + error);
    }
  }

  return (
    // display each study as a row on mui DataGrid
    <div>
      <Card variant="outlined" sx={{ padding:6 }} > 
        <Grid
          container
          rowGap={1}
          direction="column"
          alignItems="center"
          justifyContent="center"
          spacing={2}
        >
          <DataGrid
            getRowId={(row) => row.accession}
            rows={rows}
            columns={columns}
          />
        </Grid>
        </Card>
    </div>
  );
};

export default StudiesTable;
