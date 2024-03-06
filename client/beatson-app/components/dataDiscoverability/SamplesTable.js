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

 const SamplesTable = (prop) => {
    // rows for samples table where each row corresponds to a sample
    const [rows, setRows] = useState([]);
    const [newChange, setNewChange] = useState(prop.change);
  
  
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
  
    // if change to search has changed then call get studies data
  
    // retrieve all samples from Neo4J via Flask
    const getSamplesData = () => {
      setRows(prop.samples);
    }

    //add related study ID property to json sample objects
    const addRelatedStudy = async () => {
        const newSamples = prop.samples;
        const returnSamples = [];

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
        setNewChange(!newChange);
        return returnSamples;
    }
  
    // //get SamplesData when the samples table is first rendered
    useEffect(() => {
      getSamplesData();
      addRelatedStudy();
    }, []);
  
    if (newChange !== prop.change) {
      try {
        addRelatedStudy().then(samples => {;
        setRows(samples);
        //setNewChange(!newChange);
      })
      }
      catch (error) {
        console.log("No studies found " + error);
      }
    }
  
    return (
      // display each sample as a row on mui DataGrid
      <div>
        <Accordion style={{boxShadow:"none"}}>
          <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="samples-table-content"
          id="samples-table-accordion"
          sx={{flexDirection: "row-reverse", marginLeft:6}}>
          <Typography variant="h5" color="#008AAD" align="right" sx={{padding:2}}>Samples</Typography>
          
          </AccordionSummary>
        <Card variant="soft" sx={{ padding:6 }} > 
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
        </Card>
        </Accordion>
      </div>
    );
  };
  
  export default SamplesTable;
  