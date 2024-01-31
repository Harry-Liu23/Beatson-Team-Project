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

const ExperimentForm = ({ id }) => {
  //Experiment attribute vars
  const expId = id;
  const [expTitle, setExpTitle] = useState("");
  const [expDesc, setExpDesc] = useState("");
  const [numSamples, setNumSamples] = useState(0);
  const [renderSampleForm, setRenderSampleForm] = useState(false);

  console.log(expId);

  //Render form
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
              Experiment {expId}
            </Typography>
          </Grid>

          {/* below grid items are the experiment attribute fields */}
          <Grid item xs={6}>
            <TextField
              id="expTitle"
              label="Title"
              variant="outlined"
              onChange={() => setExpTitle(+event.target.value)}
            />
          </Grid>

          <Grid item>
            <TextField
              id="expDesc"
              label="Description"
              variant="outlined"
              onChange={() => setExpDesc(event.target.value)}
            />
          </Grid>

          <Grid item>
            <TextField
              id="sampleNumber"
              label="Number of Samples"
              variant="outlined"
              onChange={() => setNumSamples(+event.target.value)}
            />
          </Grid>
        </Grid>
      </Card>

      {renderSampleForm && <SampleForm samples={numSamples} id={expId} />}
      {
        <Grid item>
          <Button onClick={() => setRenderSampleForm(true)}>
            Create Sample Form
          </Button>
        </Grid>
      }
    </div>
  );
};

export default ExperimentForm;
