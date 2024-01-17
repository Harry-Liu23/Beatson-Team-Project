"use client";

import React, {useState, useEffect} from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import Dialog from '@mui/material/Dialog';
import { DialogContent, DialogTitle } from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import Checkbox from '@mui/material/Checkbox';


const StudyFormCheckbox = () => {
    const [accession, setAccession] = useState("");
    const [studyType, setStudyType] = useState("");
    const [publication, setPublication] = useState("");
    const [organism, setOrganism] = useState("");
    const [description, setDescription] = useState("");
    const [sampleNumber, setSampleNumber] = useState("");
    const [sampleCount, setSampleCount] = useState(0);
    const [rows, setRows] = useState([]);
    const [state, setState] = useState("cancerType");
    const [openDialog, setOpenDialog] = useState(false);
    const [checked, setChecked] = useState(false);
    
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Accession: " + accession);
        console.log("Study Type: " + studyType);
        console.log("publication: " + publication);
        console.log("Organism: " + organism);
        console.log("Description: " + description);
        console.log("Number of Samples: " + sampleNumber);
    }

    const handleCheckedChange = (event) => {
        setChecked(event.target.value);
    };

    // js object that allows us to use key/value pairs (similar to dictionary in python)
    const additionalColumns = {
        cancerType: {field: "cancerType", headerName: "Cancer Type", editable: true},
        weight: {field: "weight", headerName: "Weight", editable: true},
        control: {field: "control", headerName: "Control", editable: true},
        anotherField: {field: "anotherField", headerName: "Another Field", editable: true}, // add more like this on mayanks request.
    }

    const [columns, setColumns] = useState([
    
    {
        field: "id",
        headerName: "Sample ID",
        width: 100,
    },
    {
        field: "sampleGroup",
        headerName: "Sample Group",
        editable: true,
        width: 150,
    },
    {
        field: "sampleProject",
        headerName: "Sample Project",
        editable: true,
        width: 120,
    },
    {
        field: "sampleDescription",
        headerName: "Description",
        editable: true,
        width: 100,
    },
    {
        field: "sampleOrganism",
        headerName: "Organism",
        editable: true,
        width: 80,
    },
    {
        field: "sampleTissue",
        headerName: "Tissue",
        editable: true,
        width: 90,
    },
    {
        field: "sampleSex",
        headerName: "Sex",
        editable: true,
        width: 75,
    },
    {
        field: "sampleCellLine",
        headerName: "Cell Line",
        editable: true,
        width: 100,
    },
    {
        field: "sampleBiomaterialProvider",
        headerName: "Biomaterial Provider",
        editable: true,
        width: 150,
    },
    {
        field: "sampleMouseModel",
        headerName: "Mouse Model",
        editable: true,
        width: 100,
    },
    {
        field: "sampleDatePrep",
        headerName: "Date",
        editable: true,
        width: 60,
        type: "date",
    },
    {
        field: "sampleRepeat",
        headerName: "Biological Repeat",
        editable: true,
        width: 150,
    },
    {
        field: "sampleFastQ",
        headerName: "FASTQ",
        editable: true,
        width: 70,
    },

    ])

    const createNewRow = () =>{
        //below is same as sampleCount = sampleCount+1
        setSampleCount(sampleCount+1);
        return {id: sampleCount};
     }


    const addNewRow = () =>{
        console.log("Sample Count" + sampleCount);
        setRows((rows) => [...rows, createNewRow()]);
    }

    let numSamples = 4;
    const setInitialRows = () => {
        console.log("IN INITIAL ROWS");
        for (let i = 1; i <= numSamples; i++) {
            setRows((rows) => [...rows, {id: i}]);
        };
        setSampleCount(numSamples+1);
     }

    // [TODO] find a nicer way of doing this, as in a way that .includes works with our object with out this function
    const getFields = () => {
        let additionalColumnValues = [];
        let fields = [];
        additionalColumnValues.push(Object.values(additionalColumns)) // .values makes a list so pushing is dumb
        additionalColumnValues.forEach( (column) => fields.push(column));
        return fields[0];
    }

    // // takes input from dropdown menu and checks to make sure that the new field has not already exists in table before adding to table
    // const addColumn = () => {
    //     const columnToBeAdded = additionalColumns[state]; 
    //     const columnFields = getFields(columns);
    //     const newColumnInExistingColumns = columnFields.includes(columnToBeAdded.field); 
        
    //     if (!newColumnInExistingColumns){
    //         setColumns([...columns, columnToBeAdded]);
    //     }
    //     else  {
    //         //[TODO] Remove from additional columns

    //         console.log("Already exists");
    //     }
    //     setOpenDialog(false);
    // };

    // TODO - checkbox when cheched should add column to datagrid
    // when checkbox is unchecked it should not add or remove from datagrid

    const [isChecked, setIsChecked] = useState(() =>
        getFields().map((value, i) => [value.field, false]) // better way for this i think
    );

    const changeChecked = (index, value) => {
        const newCheckedValue = !isChecked[index][1];
        const newIsChecked = [...isChecked]; // cerate copy to ensure isChecked isn't change before the setStateCall
        newIsChecked[index] = [additionalColumns[value].headerName, newCheckedValue];
        setIsChecked(newIsChecked);
    }

    const submit = () => { 
        // [true or false values] map to what aditionacolumns are checked or not
        // using fields
        
        //logic here to check if the checkbox is ticked, if its ticked it gets added to columns
        //if its not checked, we try to remove it
    }
    
    return(
        <div>
            
            <Card variant = "outlined" >
            <Grid container 
                rowGap={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                direction = "column"
                alignItems = "center"
                justifyContent = "center"
                spacing={2}
            >
            
            
            <Grid item sx = {{mt: 1.5}}>
                <Typography 
                    variant="h4" 
                    color="blue-gray" 
                    align = "center">
                    Study Details
                </Typography>
            </Grid>
            
            <Grid item xs={6}>
                <TextField
                    id="accession" 
                    label="Accession" 
                    variant="outlined" 
                />
            </Grid>

            <Grid item>
                <TextField  
                    id="studyType" 
                    label="Study Type" 
                    variant="outlined" 
                />
            </Grid>
            
            <Grid item>
                <TextField  
                    id="publication" 
                    label="Publication" 
                    variant="outlined" 
                />
            </Grid>

            <Grid item>
                <TextField 
                    id="organism" 
                    label="Organism" 
                    variant="outlined" 
                />
            </Grid>

            <Grid item>
                <TextField 
                    id="description" 
                    label="Description" 
                    variant="outlined" 
                />
            </Grid>
            
            <Grid item>
                <TextField 
                    id="sampleNumber"
                    label="Number of Samples" 
                    variant="outlined" 
                />
            </Grid>

            <Grid item>
                <Button onClick={setInitialRows}>Create Study</Button>
            </Grid>


            </Grid>
        
        </Card>
        
            
        <Grid container
        direction="column"
        alignItems="center"
        justifyContent="center"
        >
            <Grid item sx = {{m: 2}}>
                <Typography 
                    variant="h4" 
                    color="blue-gray" 
                    align = "center">
                    Sample Details
                </Typography>
            </Grid>
            <Grid item>
                <Button onClick={addNewRow}>Add Sample</Button>
                <Button onClick={() => setOpenDialog(true)}>Add Characteristic</Button>

                

                <Dialog open={openDialog}>
                    <DialogTitle>Select characteristic to add</DialogTitle>
                    <DialogContent>
                    {
                        Object.keys(additionalColumns).map((value,index) => {
                            return (<FormControlLabel control={<Checkbox checked={isChecked[index][1]} onClick={() => changeChecked(index, value)}/>} label={additionalColumns[value].headerName}/>);
                        })
                    }
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                        <Button>Add Sample Characteristics</Button>
                    </DialogActions>
                </Dialog>
                <DataGrid 
                    rows = {rows} 
                    columns = {columns}
                    />
            </Grid>
        </Grid>
        </div>
    );

}


export default StudyFormCheckbox;