import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Grid, Card, Box } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Router from 'next/router';

const SamplesTable = (prop) => {
  // rows for samples table where each row corresponds to a sample
  const [rows, setRows] = useState([]);
  const [newChange, setNewChange] = useState(prop.change);
  const samples = prop.samples;
  const [study, setStudy] = useState();
  let results = false;

  // define columns for samples table
  const [columns, setColumns] = useState([
    {
      field: "sample_id",
      headerName: "Sample ID",
      flex: 1,
    },
    {
      field: "related_study",
      headerName: "Related Study",
      flex: 1,
    },
    {
      field: "group",
      headerName: "Group",
      flex: 1,
    },
    {
      field: "project",
      headerName: "Project",
      flex: 1,
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
    },
    {
      field: "organism",
      headerName: "Organism",
      flex: 1,
    },
    {
      field: "tissue",
      headerName: "Tissue",
      flex: 1,
    },
    {
      field: "sex",
      headerName: "Sex",
      flex: 1,
    },
    {
      field: "cell_line",
      headerName: "Cell Line",
      flex: 1,
    },
  ]);

  //Generate samples table and add related study to each row
  const populateTable = async () => {
    const returnSamples = [];
    //API call to add related study to each row
    await Promise.all(
      samples.map(async (sample) => {
        let addSample = sample;
        let data = "";
        try {
          const response = await fetch(
            `http://127.0.0.1:2020/get_parent_node/Experiment/${sample.experiment_id}`
          );
          if (response.status !== 200) {
            throw new Error(
              "Unable to fetch studies containing that text: ",
              data.message
            );
          }
          data = await response.json();
        } catch (error) {
          console.log("error" + error);
        }
        addSample["related_study"] = data["s"]["accession"];
        returnSamples.push(addSample);
      })
    );

    //newChange used to trigger re-render
    setNewChange(!newChange);
    return returnSamples;
  };

  //Deciding results flag
  const checkResults = (r) => {
    if (r.length === 0) {
      results = false;
    } else {
      results = true;
    }
  };

  const getStudyDetails = async (sample) => {
    const studyAccession = sample.row.related_study;
    let data = "";
    try {
      const response = await fetch(
        `http://127.0.0.1:2020/get_study/${studyAccession}`
      );
      if (response.status !== 200) {
        throw new Error(
          "Unable to fetch studies containing that text: ",
          data.message
        );
      }
      data = await response.json();
    } catch (error) {
      console.log("error" + error);
    }
    const studyDetails = JSON.parse(data).s;
    return studyDetails;
  }

  useEffect(() => {
    //get samples data when the samples table is first rendered
    populateTable().then((samples) => {
      setRows(samples);
    });
  }, []);

  //handle re-render of table upon new search
  if (newChange !== prop.change) {
    try {
      populateTable().then((samples) => {
        setRows(samples);
      });
    } catch (error) {
      console.log("No samples found " + error);
    }
  }
  checkResults(rows);

  return (
    // display each sample as a row on mui DataGrid
    <div>
      <Accordion style={{ boxShadow: "none" }} defaultExpanded>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="samples-table-content"
          id="samples-table-accordion"
          sx={{ flexDirection: "row-reverse", marginLeft: 6 }}
        >
          <Typography
            variant="h5"
            color="#008AAD"
            align="right"
            sx={{ padding: 2 }}
          >
            Samples
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
                rowGap={2}
                direction="column"
                alignItems="center"
                justifyContent="center"
                spacing={2}
              ></Grid>
            )}

            {results && (
              <DataGrid
                getRowId={(row) => row.sample_id}
                rows={rows}
                columns={columns}
                onRowClick={async (row) => {
                  const study = await getStudyDetails(row);
                  if(study){
                    Router.push({
                      pathname: `/study/${study.accession}`,
                      query: { study: JSON.stringify(study) },
                      }, `study/${study.accession}`);                  
                    }
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

export default SamplesTable;
