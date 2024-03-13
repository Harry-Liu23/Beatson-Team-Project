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
  Item,
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
  const [submitted, setSubmitted] = useState(false);

  const generateExperimentForms = () => {
    const experimentForms = [];
    for (let i = 1; i <= expNumber; i++) {
      const combinedID = `${accession}-${i}`;
      experimentForms.push(<ExperimentForm id={combinedID} />);
    }
    return experimentForms
  };

  const handleSubmission = () => {
    setSubmitted(true);
  }

  const createExperimentButton = () => {
    handleSubmission();
    setRenderExpForm(true);
    const studyFormJson = studyFormat(accession, studyType, publication, organism, description);
    sendJsonToFlask(studyFormJson, 'http://127.0.0.1:2020/create_study');
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
            <Typography variant="h4" color="#008AAD" align="center" >
              Study Details
            </Typography>
          </Grid>
          
          <Grid 
            container
            item
            direction="row"
            alignItems="center"
            justifyContent="center"  
          >
            {/* below grid items are the study detail fields */}
            <Grid item p={1}>
              <TextField
                id="accession"
                label="Accession"
                variant="outlined"
                inputProps={
                  { readOnly: submitted }
                }
                onChange={() => setAccession(event.target.value)}
              />
            </Grid>
            <Grid item p={1}>
            <TextField
              id="studyType"
              label="Study Type"
              variant="outlined"
              inputProps={
                { readOnly: submitted }
              }
              onChange={() => setStudyType(event.target.value)}
            />
            </Grid>
          </Grid>

          
          <Grid 
            container
            item
            direction="row"
            alignItems="center"
            justifyContent="center"  
          >
            <Grid item p={1}>
              <TextField
                id="publication"
                label="Publication"
                variant="outlined"
                inputProps={
                  { readOnly: submitted }
                }
                onChange={() => setPublication(event.target.value)}
              />
            </Grid>

            <Grid item p={1}>
              <TextField
                id="organism"
                label="Organism"
                variant="outlined"
                inputProps={
                  { readOnly: submitted }
                }
                onChange={() => setOrganism(event.target.value)}
              />
            </Grid>
          </Grid>
          
          <Grid item xs={6}>
              <TextField
                id="description"
                label="Description"
                variant="outlined"
                multiline={true}
                inputProps={
                  { readOnly: submitted,
                    // basing this off size of grid containers size would be better but no solution can be found
                    style: {
                      height: '10vh',
                      width: '30vw',
                    } 
                  }
                }
                onChange={() => setDescription(event.target.value)}
              />
          </Grid>

          <Grid item>
            <TextField
              id="expNumber"
              label="Number of Experiments"
              variant="outlined"
              inputProps={
                { readOnly: submitted }
              }
              onChange={() => setExpNumber(+event.target.value)}
            />
          </Grid>

          {renderExpForm &&
        generateExperimentForms().map((form, index) => (
          <div key={index}>{form}</div>
        ))}
        {!submitted &&
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
        </Grid>

      </Card>
    </div>
  );
};

export default StudyForm;
