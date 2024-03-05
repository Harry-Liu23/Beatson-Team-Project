import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { 
  Grid,
  Card,
} from "@mui/material";
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

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

  const addNumExperiments = async () => {
    const newStudies = prop.studies;
    const returnStudies = [];

        await Promise.all(newStudies.map(async (study) => {
            let addStudy = study;
            let data = "";
            try {
                const response = await fetch("http://127.0.0.1:2020/count_experiments/" + study.accession);
                if (response.status !== 200) {
                  throw new Error("Unable to fetch study containing that text: ", data.message);
                }
                data = await response.json();
            }
            catch (error) {
                console.log("error" + error);
            }

            addStudy["expNumber"] = data["num_experiments"];
            returnStudies.push(addStudy);
        }));
        return returnStudies;
  }

  // //get studies when the studies table is first rendered
  useEffect(() => {
    getStudiesData();
  }, []);

  if (newChange !== prop.change) {
    try {
      addNumExperiments().then(studies => {
      setRows(studies);
      setNewChange(!newChange);
    });
    }
    catch (error) {
      console.log("No studies found " + error);
    }
  }

  return (
    // display each study as a row on mui DataGrid
    <div>
      <Accordion defaultExpanded>
          <AccordionSummary
          expandIcon={<ArrowDownwardIcon />}
          aria-controls="studies-table-content"
          id="studies-table-accordion">
          <Typography>Studies</Typography>
          </AccordionSummary>
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
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10, 15, 20, 25]}
          />
        </Grid>
        </Card>
      </Accordion>
    </div>
  );
};

export default StudiesTable;
