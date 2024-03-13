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
import {Accordion, AccordionSummary, AccordionDetails} from "@mui/material";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const ExperimentForm = ({ id }) => {
  //Experiment attribute vars
  const expId = id;
  const accession = expId.substring(0, expId.lastIndexOf('-'));
  const [expTitle, setExpTitle] = useState("");
  const [expDesc, setExpDesc] = useState("");
  const [numSamples, setNumSamples] = useState(0);
  const [renderSampleForm, setRenderSampleForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const submitExperiment = () => {
      setRenderSampleForm(true);
      const experimentFormJson = experimentFormat(expTitle, expDesc, accession)
      sendJsonToFlask(experimentFormJson, 'http://127.0.0.1:2020/create_experiment');
  }

  const handleSubmission = () => {
    setSubmitted(true);
  }

  //Render form
  return (
    <div>
      <Accordion>
      <AccordionSummary
        expandIcon={<ArrowDropDownIcon/>}
        aria-controls="experiment-content"
        id="experiment-table-content"
        sx={{flexDirection: "row-reverse", marginLeft:12}}
        >
        <Grid item sx={{ mt: 1.5 }}>
            <Typography variant="h5" color="#008AAD" align="right" sx={{padding:2}}>
              Experiment ID: {expId}
            </Typography>
          </Grid>
        </AccordionSummary>

      <Card variant="outlined" sx={{ padding: 4, paddingBottom:6, marginLeft:15, marginRight:15, marginBottom:8, border:"groove" }}>
      <AccordionDetails>
        <Grid
          container
          rowGap={1}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          direction="column"
          alignItems="center"
          justifyContent="center"
          spacing={2}
        >
          

          {/* below grid items are the experiment attribute fields */}
          <Grid item xs={6}>
            <TextField
              id={`expTitle-${expId}`}
              label="Title"
              variant="outlined"
              inputProps={
                { readOnly: submitted }
              }
              onChange={() => setExpTitle(event.target.value)}
            />
          </Grid>

          <Grid item>
            <TextField
              id={`expDesc-${expId}`}
              label="Description"
              variant="outlined"
              inputProps={
                { readOnly: submitted }
              }
              onChange={() => setExpDesc(event.target.value)}
            />
          </Grid>

          <Grid item>
            <TextField
              id={`sampleNumber-${expId}`}
              label="Number of Samples"
              variant="outlined"
              inputProps={
                { readOnly: submitted }
              }
              onChange={() => setNumSamples(+event.target.value)}
            />
          </Grid>
        </Grid>
      
      
       
      {renderSampleForm && <SampleForm samples={numSamples} id={expTitle} />}
      {
        <Grid item>
          <Button onClick={() => submitExperiment()}>
            Create Sample Form
          </Button>
        </Grid>
      }
    </AccordionDetails>
    </Card>
    </Accordion>
    </div>
  );
};

export default ExperimentForm;