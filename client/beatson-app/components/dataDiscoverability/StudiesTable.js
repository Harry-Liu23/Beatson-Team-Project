import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Router from 'next/router';
import { Grid, Card, Box } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const StudiesTable = (prop) => {
  // rows for studies table where each row corresponds to a study
  const [rows, setRows] = useState([]);
  const [newChange, setNewChange] = useState(prop.change);
  let results = false;

  // define columns for studies table
  const [columns, setColumns] = useState([
    {
      field: "accession",
      headerName: "Accession",
      flex: 1,
    },
    {
      field: "study_type",
      headerName: "Study Type",
      flex: 1,
    },
    {
      field: "organism",
      headerName: "Organism",
      flex: 1,
    },
    {
      field: "publication",
      headerName: "Publication",
      flex: 1,
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
    },
    {
      field: "expNumber",
      headerName: "Number of Experiments",
      flex: 1,
    },
  ]);

  //Generate studies table and add number of experiments to each row
  const populateTable = async () => {
    const newStudies = prop.studies;
    const returnStudies = [];

    //API call to add number of experiments to each study
    await Promise.all(
      newStudies.map(async (study) => {
        let addStudy = study;
        let data = "";
        try {
          const response = await fetch(
            `http://127.0.0.1:2020/count_experiments/${study.accession}`
          );
          if (response.status !== 200) {
            throw new Error(
              "Unable to fetch study containing that text: ",
              data.message
            );
          }
          data = await response.json();
        } catch (error) {
          console.log("error" + error);
        }

        //update each table entry with retrieved number of experiments
        addStudy["expNumber"] = data["num_experiments"];
        returnStudies.push(addStudy);
      })
    );

    //newChange switch used to trigger re-render
    setNewChange(!newChange);
    return returnStudies;
  };

  //Deciding results flag
  const checkResults = (r) => {
    if (r.length === 0) {
      results = false;
    } else {
      results = true;
    }
  };

  //get studies & calculate numExperiments when the table is first rendered
  useEffect(() => {
    populateTable().then((studies) => {
      setRows(studies);
    });
  }, []);

  //handle re-render of table upon new search
  if (newChange !== prop.change) {
    try {
      populateTable().then((studies) => {
        setRows(studies);
      });
    } catch (error) {
      console.log("No studies found " + error);
    }
  }
  checkResults(rows);

  return (
    // display each study as a row on mui DataGrid
    <div>
      <Accordion defaultExpanded style={{ boxShadow: "none" }}>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="studies-table-content"
          id="studies-table-accordion"
          sx={{ flexDirection: "row-reverse", marginLeft: 6 }}
        >
          <Typography
            variant="h5"
            color="#008AAD"
            align="right"
            sx={{ padding: 2 }}
          >
            Studies
          </Typography>
        </AccordionSummary>

        <Card
          variant="outlined"
          sx={{
            padding: 4,
            paddingBottom: 6,
            marginLeft: 10,
            marginRight: 10,
            border: "None",
          }}
        >
          <AccordionDetails>
            {/* If results found, display table */}
            {results && (
              <Grid
                container
                rowGap={1}
                direction="column"
                alignItems="center"
                justifyContent="center"
                spacing={2}
              ></Grid>
            )}

            {results && (
              <DataGrid
                getRowId={(row) => row.accession}
                rows={rows}
                columns={columns}
                onRowClick={(row) => {
                  const accession = row.id;
                  Router.push({
                    pathname: `/study/${accession}`,
                    query: { study: JSON.stringify(row.row) },
                },`study/${accession}` );
                }}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 10 },
                  },
                }}
                pageSizeOptions={[5, 10, 15, 20, 25]}
              />
            )}

            {/* If no results found, display message */}
            {!results && (
              <div>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "center",
                    padding: "1em",
                  }}
                >
                  <Typography color="#696969">
                    <InfoOutlinedIcon /> No results found.
                  </Typography>
                </Box>
              </div>
            )}
          </AccordionDetails>
        </Card>
      </Accordion>
    </div>
  );
};

export default StudiesTable;
