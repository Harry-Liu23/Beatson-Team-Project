"use client";
import React, { useState, useEffect } from "react";
import SampleForm from "./SampleForm";
import { Button, Grid, Typography, Card, TextField } from "@mui/material";
import { experimentFormat } from "../../services/JsonFormatting";
import sendJsonToFlask from "../../services/BackendAPI";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const ExperimentForm = ({ id }) => {
  //Experiment attribute vars
  const expId = id;
  const accession = expId.substring(0, expId.lastIndexOf("-"));
  const [expTitle, setExpTitle] = useState("");
  const [expDesc, setExpDesc] = useState("");
  const [numSamples, setNumSamples] = useState(0);
  const [renderSampleForm, setRenderSampleForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorDialog, setErrorDialog] = useState(false);

  const submitExperiment = () => {
    if (!validateInput()) {
      setErrorDialog(true);
    } else {
      setSubmitted(true);
      setRenderSampleForm(true);
      const experimentFormJson = experimentFormat(expTitle, expDesc, accession);
      sendJsonToFlask(
        experimentFormJson,
        "http://127.0.0.1:2020/create_experiment"
      );
    }
  };

  const validateInput = () => {
    let validationErrors = true;
    const fieldList = [expTitle, expDesc, numSamples];
    for (let i = 0; i < fieldList.length; i++) {
      if (fieldList[i] == "") {
        validationErrors = false;
        break;
      }
    }
    return validationErrors;
  };

  //Render form
  return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="experiment-content"
          id="experiment-table-content"
          sx={{ flexDirection: "row-reverse", marginLeft: 16 }}
        >
          <Grid item sx={{ mt: 1.5 }}>
            <Typography
              variant="h5"
              color="#008AAD"
              align="right"
              sx={{ padding: 1 }}
            >
              Experiment ID: {expId}
            </Typography>
          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          <Card
            variant="plain"
            sx={{
              padding: 1,
              marginLeft: 15,
              marginRight: 15,
            }}
          >
            <Grid
              container
              rowSpacing={2}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              alignItems="center"
              justifyContent="center"
              spacing={2}
            >
              {/* below grid items are the experiment attribute fields */}
              <Grid item xs={6} sm={6} md={6}>
                <TextField
                  id={`expTitle-${expId}`}
                  label="Title"
                  variant="outlined"
                  fullWidth
                  inputProps={{ readOnly: submitted }}
                  onChange={() => setExpTitle(event.target.value)}
                />
              </Grid>

              <Grid item xs={6} sm={6} md={6}>
                <TextField
                  id={`sampleNumber-${expId}`}
                  label="Number of Samples"
                  variant="outlined"
                  fullWidth
                  inputProps={{ readOnly: submitted }}
                  onChange={() => setNumSamples(+event.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <TextField
                  id={`expDesc-${expId}`}
                  label="Description"
                  variant="outlined"
                  fullWidth
                  inputProps={{ readOnly: submitted }}
                  onChange={() => setExpDesc(event.target.value)}
                />
              </Grid>
            </Grid>
          </Card>

          <Dialog open={errorDialog}>
            <DialogTitle>Submission Failed</DialogTitle>
            <DialogContent>
              You did not enter values for all fields.
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setErrorDialog(false)}>Close</Button>
            </DialogActions>
          </Dialog>

          {renderSampleForm && (
            <SampleForm samples={numSamples} id={expTitle} />
          )}
          {!submitted && (
            <Grid
              item
              sx={{
                padding: 2,
                marginLeft: 13,
                marginRight: 15,
                marginBottom: 8,
              }}
            >
              <Button onClick={() => submitExperiment()}>
                Create Sample Form
              </Button>
            </Grid>
          )}
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default ExperimentForm;
