"use client";
import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  DialogContent,
  DialogTitle,
  DialogActions,
  Dialog,
  Button,
  Grid,
  Typography,
  Card,
  FormControlLabel,
  Checkbox,
  TextField,
} from "@mui/material";

const SampleForm = (samples) => {
  const [rows, setRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [numSamples, setNumSamples] = useState(samples);

  //Sample form additional columns var
  const additionalColumns = {
    cancerType: {
      field: "cancerType",
      headerName: "Cancer Type",
      editable: true,
    },
    weight: { field: "weight", headerName: "Weight", editable: true },
    control: { field: "control", headerName: "Control", editable: true },
    anotherField: {
      field: "anotherField",
      headerName: "Another Field",
      editable: true,
    },
    // add more optional colmns here as per Mayank's request
  };

  //Sample form column definitions
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
  ]);

  // SampleForm add/remove column and row logic

  const createNewRow = () => {
    setNumSamples(numSamples + 1);
    return { id: numSamples };
  };

  const addNewRow = () => {
    setRows((rows) => [...rows, createNewRow()]);
  };

  const setInitialRows = () => {
    for (let i = 1; i <= numSamples; i++) {
      setRows((rows) => [...rows, { id: i }]);
    }
    setNumSamples(numSamples + 1);
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
        }
      } else {
        // characteristic is to be deleted from column
        if (currentSampleCharacteristics.includes(characteristicField)) {
          const newRemovedList = newSampleCharacteristics.filter(
            (column) => column.field !== characteristicField
          );
          newSampleCharacteristics = newRemovedList;
        }
      }
    });
    setColumns(newSampleCharacteristics);
    setOpenDialog(false);
  };

  setInitialRows();
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
            Sample Details
          </Typography>
        </Grid>

        <Grid item>
          <Button onClick={addNewRow}>Add Sample</Button>
          <Button onClick={() => setOpenDialog(true)}>
            Add/Remove Characteristics
          </Button>

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

          <DataGrid rows={rows} columns={columns} />
        </Grid>
      </Grid>
    </div>
  );
};

export default SampleForm;
