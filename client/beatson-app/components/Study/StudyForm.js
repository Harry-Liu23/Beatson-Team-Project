"use client";
import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import SampleForm from "./SampleForm";
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

const StudyForm = () => {
  //Study form vars
  const [accession, setAccession] = useState("");
  const [studyType, setStudyType] = useState("");
  const [publication, setPublication] = useState("");
  const [organism, setOrganism] = useState("");
  const [description, setDescription] = useState("");
  const [sampleNumber, setSampleNumber] = useState(1);
  const [renderSampleForm, setRenderSampleForm] = useState(false);

//   const setInitialRows = () => {
//     for (let i = 1; i <= sampleNumber; i++) {
//       setRows((rows) => [...rows, { id: i }]);
//     }
//     setSampleNumber(sampleNumber + 1);
//   };

  return (
    <div>
      <Card variant="outlined">
        <Grid
          container
          rowGap={1}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          direction="column"
          alignItems="center"
          justifyContent="center"
          spacing={2}
        >
          <Grid item sx={{ mt: 1.5 }}>
            <Typography variant="h4" color="blue-gray" align="center">
              Study Details
            </Typography>
          </Grid>

          {/* below grid items are the study detail fields */}
          <Grid item xs={6}>
            <TextField id="accession" label="Accession" variant="outlined" />
          </Grid>

          <Grid item>
            <TextField id="studyType" label="Study Type" variant="outlined" />
          </Grid>

          <Grid item>
            <TextField
              id="publication"
              label="Publication"
              variant="outlined"
            />
          </Grid>

          <Grid item>
            <TextField id="organism" label="Organism" variant="outlined" />
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

        </Grid>
      </Card>

      {renderSampleForm && <SampleForm samples={sampleNumber} />}
      {<Grid item>
            <Button onClick={() => setRenderSampleForm(true)}>Create Study</Button>
        </Grid>}
    </div>
  );
};

export default StudyForm;
