"use client";
import React, { useState, useEffect } from "react";
import ExperimentForm from "./ExperimentForm";
import {
  Button,
  Grid,
  Typography,
  Card,
  TextField,
  spacing,
} from "@mui/material";
import { studyFormat } from "../../services/JsonFormatting";
import sendJsonToFlask from "../../services/BackendAPI";

const StudyForm = () => {
  //Study form vars
  const [accession, setAccession] = useState("");
  const [studyType, setStudyType] = useState("");
  const [publication, setPublication] = useState("");
  const [organism, setOrganism] = useState("");
  const [description, setDescription] = useState("");
  const [expNumber, setExpNumber] = useState(0);
  const [renderExpForm, setRenderExpForm] = useState(false);

  const generateExperimentForms = () => {
    const experimentForms = [];
    for (let i = 1; i <= expNumber; i++) {
      const combinedID = `${accession}-${i}`;
      experimentForms.push(<ExperimentForm id={combinedID} />);
    }
    return experimentForms
  };

  const createExperimentButton = () => {
    setRenderExpForm(true);
    console.log("starting json sending...")
    // return experimentForms;
    // Call some function that creates json to send.
    console.log(accession);
    const studyJson = studyFormat(accession, studyType, publication, organism, description);
    sendJsonToFlask(studyJson, 'http://127.0.0.1:2020/create_study');
    console.log("finished :)")
  }

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
              Study Details
            </Typography>
          </Grid>

          {/* below grid items are the study detail fields */}
          <Grid item xs={6}>
            <TextField
              id="accession"
              label="Accession"
              variant="outlined"
              onChange={() => setAccession(event.target.value)}
            />
          </Grid>

          <Grid item>
            <TextField
              id="studyType"
              label="Study Type"
              variant="outlined"
              onChange={() => setStudyType(event.target.value)}
            />
          </Grid>

          <Grid item>
            <TextField
              id="publication"
              label="Publication"
              variant="outlined"
              onChange={() => setPublication(event.target.value)}
            />
          </Grid>

          <Grid item>
            <TextField
              id="organism"
              label="Organism"
              variant="outlined"
              onChange={() => setOrganism(event.target.value)}
            />
          </Grid>

          <Grid item>
            <TextField
              id="description"
              label="Description"
              variant="outlined"
              onChange={() => setDescription(event.target.value)}
            />
          </Grid>

          <Grid item>
            <TextField
              id="expNumber"
              label="Number of Experiments"
              variant="outlined"
              onChange={() => setExpNumber(+event.target.value)}
            />
          </Grid>
        </Grid>
      </Card>

      {renderExpForm &&
        generateExperimentForms().map((form, index) => (
          <div key={index}>{form}</div>
        ))}
      {
        <Grid item>
          <Button
            onClick={() => {
              createExperimentButton();
            }}
          >
            Create Experiments
          </Button>
        </Grid>
      }
    </div>
  );
};

export default StudyForm;
