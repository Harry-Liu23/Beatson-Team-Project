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
import { ColorLensOutlined } from '@mui/icons-material';


const StudyFormCheckbox = () => {
    const [accession, setAccession] = useState("");
    const [studyType, setStudyType] = useState("");
    const [publication, setPublication] = useState("");
    const [organism, setOrganism] = useState("");
    const [description, setDescription] = useState("");
    const [sampleNumber, setSampleNumber] = useState(0);
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
        setSampleNumber(sampleNumber+1);
        return {id: sampleNumber};
     }


    const addNewRow = () =>{
        console.log("Sample Count" + sampleNumber);
        setRows((rows) => [...rows, createNewRow()]);
    }

    const setInitialRows = () => {
        console.log("IN INITIAL ROWS");
        for (let i = 1; i <= sampleNumber; i++) {
            setRows((rows) => [...rows, {id: i}]);
        };
        setSampleNumber(sampleNumber+1);
     }

    const getFields = () => {
        let additionalColumnValues = [];
        let fields = [];
        additionalColumnValues.push(Object.values(additionalColumns));
        additionalColumnValues.forEach( (column) => fields.push(column));
        return fields[0];
    }

    const [isChecked, setIsChecked] = useState(() =>
        getFields().map((column, i) => [column.field, false])
    );

    const changeChecked = (index, key) => {
        const newBooleanValue = !isChecked[index][1];
        const newIsChecked = [...isChecked]; // copying isChecked
        newIsChecked[index] = [additionalColumns[key].field, newBooleanValue];
        setIsChecked(newIsChecked);
    }

    const submit = () => {
        const fields = [];
        columns.forEach( (column) => fields.push(column.field));
        let removeList = [...columns];

        isChecked.forEach((column) => {
            const bool = column[1];
            const columnKey = column[0];

            if (bool) {
                if (fields.includes(columnKey)) {
                }
                else {
                    removeList.push(additionalColumns[columnKey])
                }
            }

            else {
                if (fields.includes(columnKey)) {
                    const newRemovedList = removeList.filter(column => column.field !== columnKey);
                    removeList = newRemovedList;
                }
            }
        });
        setColumns(removeList);
        setOpenDialog(false);
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
                    onChange={() => setSampleNumber(+event.target.value)}
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
                        Object.keys(additionalColumns).map((key,index) => {
                            return (<FormControlLabel key={key} control={<Checkbox checked={isChecked[index][1]} onClick={() => changeChecked(index, key)}/>} label={additionalColumns[key].headerName}/>);
                        })
                    }
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                        <Button onClick={submit}>Add Sample Characteristics</Button>
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