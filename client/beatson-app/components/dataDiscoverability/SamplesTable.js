import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { 
  Grid,
  Card,
  Box,
} from "@mui/material";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';


 const SamplesTable = (prop) => {
    // rows for samples table where each row corresponds to a sample
    const [rows, setRows] = useState([]);
    const [newChange, setNewChange] = useState(prop.change);
    const [results, setResults] = useState(false);
  
  
    // define columns for samples table
    const [columns, setColumns] = useState([
      {
        field: "sample_id",
        headerName: "Sample ID",
        width: 130,
      },
      {
        field: "related_study",
        headerName: "Related Study",
        width: 130,
      },
      {
        field: "group",
        headerName: "Group",
        width: 100,
      },
      {
        field: "project",
        headerName: "Project",
        width: 130,
      },
      {
        field: "description",
        headerName: "Description",
        width: 200,
      },
      {
        field: "organism",
        headerName: "Organism",
        width: 130,
      },
      {
        field: "tissue",
        headerName: "Tissue",
        width: 100,
      },
      {
        field: "sex",
        headerName: "Sex",
        width: 100,
      },
      {
        field: "cell_line",
        headerName: "Cell Line",
        width: 100,
      },
    ]);

    //Generate samples table and add related study to each row
    const populateTable = async () => {
        const newSamples = prop.samples;
        const returnSamples = [];

        //API call to add related study to each row
        await Promise.all(newSamples.map(async (sample) => {
            let addSample = sample;
            let data = "";
            try {
                const response = await fetch("http://127.0.0.1:2020/get_parent_node/Experiment/" + sample.experiment_id);
                if (response.status !== 200) {
                  throw new Error("Unable to fetch studies containing that text: ", data.message);
                }
                data = await response.json();
            }
            catch (error) {
                console.log("error" + error);
            }
            addSample["related_study"] = data["s"]["accession"];
            returnSamples.push(addSample);
        }));

        //newChange used to trigger re-render
        setNewChange(!newChange);
        return returnSamples;
    }
    
    //function to handle no results
    const checkResults = () => {
      if (rows == []) {
        setResults(true);
      } else {
        setResults(false);
      }
    }

    useEffect(() => {
    //get samples data when the samples table is first rendered
      populateTable().then(samples => {;
        setRows(samples);})
      }, []
    );
  
    //handle re-render of table upon new search
    if (newChange !== prop.change) {
      try {
        populateTable().then(samples => {;
        setRows(samples);
        // checkResults();
      })
      }
      catch (error) {
        console.log("No studies found " + error);
      }
    }

  
    return (
      // display each sample as a row on mui DataGrid
      <div>
        <Accordion style={{boxShadow:"none"}} defaultExpanded>
          <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="samples-table-content"
          id="samples-table-accordion"
          sx={{flexDirection: "row-reverse", marginLeft:6}}>
          <Typography variant="h5" color="#008AAD" align="right" sx={{padding:2}}>Samples</Typography>
          
          </AccordionSummary>
        <Card variant="soft" sx={{ padding:6 }}>
          {results && 
          <Grid
            container
            rowGap={2}
            direction="column"
            alignItems="center"
            justifyContent="center"
            spacing={2}
          >
            <DataGrid 
              getRowId={(row) => row.sample_id}
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
        }

          {/* If no results found, display message */}
          {!results && 
              <div>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '1em', }}>
                <Typography color="#696969">
                <InfoOutlinedIcon/> No results found.
                </Typography>
                </Box>    
              </div>
          }
        </Card>
        </Accordion>
      </div>
    );
  };
  
  export default SamplesTable;
  