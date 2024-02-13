"use client";
import React, { useState, useEffect } from "react";
import SampleForm from "./SampleForm";
import {
  Button,
  Grid,
  Typography,
  Card,
  TextField,
} from "@mui/material";
import { experimentFormat } from "../../services/JsonFormatting";
import sendJsonToFlask from "../../services/BackendAPI";

const ExperimentForm = ({ id }) => {
  //Experiment attribute vars
  const expId = id;
  const accession = expId.substring(0, expId.lastIndexOf('-'));
  const [expTitle, setExpTitle] = useState("");
  const [expDesc, setExpDesc] = useState("");
  const [numSamples, setNumSamples] = useState(0);
  const [renderSampleForm, setRenderSampleForm] = useState(false);

  const submitExperiment = () => {
      setRenderSampleForm(true);
      const experimentJson = experimentFormat(expTitle, expDesc, accession)
      console.log(experimentJson)
      sendJsonToFlask(experimentJson, 'http://127.0.0.1:2020/create_experiment');
  }

  //Render form
  return (
    <div>
      <Card variant="outlined" sx={{ padding:2 }} >
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
              id={`expTitle-${expId}`}
              label="Title"
              variant="outlined"
              onChange={() => setExpTitle(+event.target.value)}
            />
          </Grid>

          <Grid item>
            <TextField
              id={`expDesc-${expId}`}
              label="Description"
              variant="outlined"
              onChange={() => setExpDesc(event.target.value)}
            />
          </Grid>

          <Grid item>
            <TextField
              id={`sampleNumber-${expId}`}
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
          <Button onClick={() => submitExperiment()}>
            Create Sample Form
          </Button>
        </Grid>
      }
    </div>
  );
};

export default ExperimentForm;
