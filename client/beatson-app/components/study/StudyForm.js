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
    return experimentForms;
  };

  const handleSubmission = () => {
    setSubmitted(true);
  };

  const createExperimentButton = () => {
    handleSubmission();
    setRenderExpForm(true);
    const studyFormJson = studyFormat(
      accession,
      studyType,
      publication,
      organism,
      description
    );
    sendJsonToFlask(studyFormJson, "http://127.0.0.1:2020/create_study");
  };

  return (
    <div>
      <Card variant="plain" sx={{           
          padding: 2,
          marginRight: 15,
          marginLeft: 15,
          marginTop:2, }}>
        <Grid
          container
          rowSpacing={2}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          alignItems="center"
          justifyContent="center"
          spacing={2}
        >
          <Grid item xs={12} sm={12} md={12} marginBottom={2}>
            <Typography variant="h4" color="#008AAD" align="center">
              Study Details
            </Typography>
          </Grid>

            {/* below grid items are the study detail fields */}
            <Grid item xs={6} sm={6} md={6} align="right">
              <TextField
                id="accession"
                label="Accession"
                variant="outlined"
                fullWidth
                inputProps={{ readOnly: submitted }}
                onChange={() => setAccession(event.target.value)}
              />
            </Grid>
            <Grid item xs={6} sm={6} md={6}>
              <TextField
                id="studyType"
                label="Study Type"
                variant="outlined"
                fullWidth
                inputProps={{ readOnly: submitted }}
                onChange={() => setStudyType(event.target.value)}
              />
            </Grid>

          <Grid item xs={6} sm={6} md={6} align="right">
            <TextField
              id="publication"
              label="Publication"
              variant="outlined"
              fullWidth
              inputProps={{ readOnly: submitted }}
              onChange={() => setPublication(event.target.value)}
            />
          </Grid>

          <Grid item xs={6} sm={6} md={6}>
            <TextField
              id="organism"
              label="Organism"
              variant="outlined"
              fullWidth
              inputProps={{ readOnly: submitted }}
              onChange={() => setOrganism(event.target.value)}
            />
          </Grid>

          
          <Grid item xs={12}>
            <TextField
              id="description"
              label="Description"
              variant="outlined"
              multiline={true}
              fullWidth
              inputProps={{
                readOnly: submitted,
              }}
              onChange={() => setDescription(event.target.value)}
            />
          </Grid>
          <Grid item xs={12} align="left" >
            <TextField
              id="expNumber"
              label="Number of Experiments"
              variant="outlined"
              fullWidth
              inputProps={{ readOnly: submitted }}
              onChange={() => setExpNumber(+event.target.value)}
            />
          </Grid>
          </Grid>
      </Card>

      {renderExpForm &&
        generateExperimentForms().map((form, index) => (
          <div key={index}>{form}</div>
        ))}
      {!submitted && (
        <Grid
          container
          rowGap={1}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          direction="column"
          alignItems="left"
          justifyContent="left"
          spacing={2}
        >
          <Grid item sx={{
              padding: 2,
              marginLeft: 16,
              marginRight: 15,
              marginBottom: 8,
            }}>
            <Button
              onClick={() => {
                createExperimentButton();
              }}
            >
              Create Experiments
            </Button>
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default StudyForm;
