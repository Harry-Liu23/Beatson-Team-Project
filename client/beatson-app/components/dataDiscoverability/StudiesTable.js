import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { 
  Grid,
  Card,
} from "@mui/material";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
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

  //Generate studies table and add number of experiments to each row
  const populateTable = async () => {
    const newStudies = prop.studies;
    const returnStudies = [];

        //API call to add number of experiments to each study
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

            //update each table entry with retrieved number of experiments
            addStudy["expNumber"] = data["num_experiments"];
            returnStudies.push(addStudy);
        }));
        
        //newChange switch used to trigger re-render
        setNewChange(!newChange);
        return returnStudies;
  }

  //get studies & calculate numExperiments when the table is first rendered
  useEffect(() => {
    populateTable().then(studies => {
      setRows(studies); })
  }, []);

  //handle re-render of table upon new search
  if (newChange !== prop.change) {
    try {
      populateTable().then(studies => {
      setRows(studies);
    });
    }
    catch (error) {
      console.log("No studies found " + error);
    }
  }

  return (
    // display each study as a row on mui DataGrid
    <div>
      <Accordion defaultExpanded style={{boxShadow:"none"}}>
          <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="studies-table-content"
          id="studies-table-accordion"
          sx={{flexDirection: "row-reverse", marginLeft:6}}>
          <Typography variant="h5" color="#008AAD" align="right" sx={{padding:2}}>Studies</Typography>
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
