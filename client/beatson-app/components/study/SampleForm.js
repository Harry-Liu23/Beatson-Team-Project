"use client";
import React, { useState, useEffect, use } from "react";
import { DataGrid, useGridApiRef  } from "@mui/x-data-grid";
import {
  DialogContent,
  DialogTitle,
  DialogActions,
  Dialog,
  Button,
  Grid,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import sendJsonToFlask from "../../services/BackendAPI";

const SampleForm = ({ samples, id }) => {
  const [rows, setRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [numSamples, setNumSamples] = useState(samples);
  const expId = id;
  const [sampleSubmitDialog, setSampleSubmitDialog] = useState(false);

  // Initalise empty rows
  useEffect(() => {
    setRows(
      Array.from({ length: numSamples }, (_, index) => createNewRow(index + 1))
    );
  }, [numSamples]);

  //Sample form additional columns var
  const additionalColumns = {
    cancer_type: {
      field: "cancer_type",
      headerName: "Cancer Type",
      editable: true,
    },
    weight: { field: "weight", headerName: "Weight", editable: true },
    control: { field: "control", headerName: "Control", editable: true },
    another_field: {
      field: "another_field",
      headerName: "Another Field",
      editable: true,
    },
    // add more optional colmns here as per Mayank's request
  };

  //Sample form column definitions
  const [columns, setColumns] = useState([
    {
      field: "sample_id",
      headerName: "Sample ID",
      width: 100,
    },
    {
      field: "group",
      headerName: "Sample Group",
      editable: true,
      width: 150,
    },
    {
      field: "project",
      headerName: "Sample Project",
      editable: true,
      width: 120,
    },
    {
      field: "description",
      headerName: "Description",
      editable: true,
      width: 100,
    },
    {
      field: "organism",
      headerName: "Organism",
      editable: true,
      width: 80,
    },
    {
      field: "tissue",
      headerName: "Tissue",
      editable: true,
      width: 90,
    },
    {
      field: "sex",
      headerName: "Sex",
      editable: true,
      width: 75,
    },
    {
      field: "cell_line",
      headerName: "Cell Line",
      editable: true,
      width: 100,
    },
    {
      field: "biometric_provider",
      headerName: "Biomaterial Provider",
      editable: true,
      width: 150,
    },
    {
      field: "mouse_model",
      headerName: "Mouse Model",
      editable: true,
      width: 100,
    },
    {
      field: "date",
      headerName: "Date",
      editable: true,
      width: 60,
      type: "date",
    },
    {
      field: "biological_repeat",
      headerName: "Biological Repeat",
      editable: true,
      width: 150,
    },
    {
      field: "fastq",
      headerName: "FASTQ",
      editable: true,
      width: 70,
    },
  ]);

  // SampleForm add/remove column and row logic
  const createNewRow = (idValue) => {
    const newRow = { sample_id : idValue };
    columns.forEach((column) => {
      if (column.field != "sample_id") {
        newRow[column.field] = null;
    }
  })
    return newRow;
  };

  const addNewRow = () => {
    setRows((rows) => [...rows, createNewRow(rows.length + 1)]);
  };

  const addCharaceristicToRow = (characteristic) => {
    const rowUpdate = [...rows];
    rowUpdate.forEach((row) => row[characteristic] = undefined);
    setRows(rowUpdate);
  }

  const removeCharacteristicFromRow = (characteristic) => {
    rows.forEach((row) => delete row[characteristic]);
  };

  //getFields returns an object where keys are the indices of additionalColumns
  //and the corresponding values are the column/characteristic name
  const getFields = () => {
    let additionalColumnValues = [];
    let fields = [];
    additionalColumnValues.push(Object.values(additionalColumns));
    additionalColumnValues.forEach((column) => fields.push(column));
    return fields[0];
  };

  //utility function, initialises all checkboxes variables to false i.e., unchecked
  //isChecked is array where 0th index is the column name and 1st index is the associated checked state
  const [isChecked, setIsChecked] = useState(() =>
    getFields().map((column) => [column.field, false])
  );

  const changeChecked = (index, key) => {
    const invertedCheckedValue = !isChecked[index][1];
    const newIsChecked = [...isChecked]; // copying isChecked
    newIsChecked[index] = [additionalColumns[key].field, invertedCheckedValue];
    setIsChecked(newIsChecked);
  };

  const submit = () => {
    const currentSampleCharacteristics = [];
    columns.forEach((column) =>
      currentSampleCharacteristics.push(column.field)
    );
    let newSampleCharacteristics = [...columns];

    // checks if all additionalCharacteristics have been checked or not
    // and records any changes made
    isChecked.forEach((column) => {
      const isCharacteristicChecked = column[1];
      const characteristicField = column[0];

      if (isCharacteristicChecked) {
        // characterstic is to be added as a new column
        if (!currentSampleCharacteristics.includes(characteristicField)) {
          newSampleCharacteristics.push(additionalColumns[characteristicField]);
          addCharaceristicToRow(additionalColumns[characteristicField].field);
        }
      } else {
        // characteristic is to be deleted from column
        if (currentSampleCharacteristics.includes(characteristicField)) {
          const newRemovedList = newSampleCharacteristics.filter(
            (column) => column.field !== characteristicField
          );
          removeCharacteristicFromRow(characteristicField);
          newSampleCharacteristics = newRemovedList;
        }
      }
    });
    setColumns(newSampleCharacteristics);
    setOpenDialog(false);
  };

  const processRowUpdate = (newRow) =>{
    console.log(newRow)
    var newRows = rows.slice();
    for(var i = 0; i < rows.length; i++){
      if(rows[i]['sample_id'] == newRow['sample_id']){
        newRows[i] = newRow;
      }
    }
    setRows(newRows);
  }

  const onProcessRowUpdateError = (params) => {
    // neccessary for processRowUpdate to work
  }

  // checks all samples in the form are complete and not undefined which is the default value.
  // it adds these to cellValidationErrors object which contains list of neccessary data.
  const validateRows = () => {
    let cellValidationErrors = { errors : [] };
    rows.forEach((row) => {
      const keys = Object.keys(row);
      keys.forEach((key) => {
        if( row[key] == undefined){
          const newError = '{ " ' + row['id'] + ' " : " Cell ' + key + '- Value is null " }';
          cellValidationErrors['errors'].push(JSON.parse(newError));
        }
      });
    });
    return cellValidationErrors
  }

  const submitSamples = () => {
    let cellValidateErrors = validateRows();
    // checks all samples have values
    if (cellValidateErrors['errors'].length != 0) {
      setSampleSubmitDialog(true);
    }
    else {
      rows.forEach((sample) => {
        let sampleFormJson = {};
        let sampleCopy = Object.assign({}, sample);
        sampleCopy["experiment_id"] = id;
        let sample_id = sampleCopy["sample_id"];
        sampleCopy["sample_id"] = `${id}-${sample_id}`  
        sampleFormJson["sample"] = sampleCopy;
        sendJsonToFlask(sampleFormJson, 'http://127.0.0.1:2020/create_sample')
      })
    }
  }

  return (
    <div>
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Grid item sx={{ m: 2 }}>
          <Typography variant="h4" color="blue-gray" align="center">
            Sample Details {expId}
          </Typography>
        </Grid>

        <Grid item>
          <Button onClick={addNewRow}>
            Add Sample
          </Button>
          <Button onClick={() => setOpenDialog(true)}>
            Add/Remove Characteristics
          </Button>
          <Button id={`submit-${expId}`} onClick={() => submitSamples()}>
            Submit
          </Button>

          <Dialog open={sampleSubmitDialog}>
            <DialogTitle>Submission Failed</DialogTitle>
            <DialogContent>You did not enter values for all samples.</DialogContent>
            <DialogActions>
              <Button onClick={() => setSampleSubmitDialog(false)}>Close</Button>
            </DialogActions>
          </Dialog>

          <Dialog open={openDialog}>
            <DialogTitle>Select characteristic to add or remove</DialogTitle>
            <DialogContent>
              {Object.keys(additionalColumns).map((key, index) => {
                return (
                  <FormControlLabel
                    key={key}
                    control={
                      <Checkbox
                        checked={isChecked[index][1]}
                        onClick={() => changeChecked(index, key)}
                      />
                    }
                    label={additionalColumns[key].headerName}
                  />
                );
              })}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
              <Button onClick={submit}>Update Sample Characteristics</Button>
            </DialogActions>
          </Dialog>

          <DataGrid 
          rows={rows} 
          columns={columns}
          getRowId = {(row) => row.sample_id}
          processRowUpdate={(newRow, oldRow) => processRowUpdate(newRow)}
          onProcessRowUpdateError={onProcessRowUpdateError}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default SampleForm;
