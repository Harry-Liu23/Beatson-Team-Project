"use client";
import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import ExperimentForm from "./ExperimentForm";
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
  const [expNumber, setExpNumber] = useState(0);
  const [renderExpForm, setRenderExpForm] = useState(false);

  const generateExperimentForms = () => {
    const experimentForms = [];
    for (let i = 1; i <= expNumber; i++) {
      const combinedID = `${accession}-${i}`;
      experimentForms.push(<ExperimentForm id={combinedID} />);
    }
    return experimentForms;
  };

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
              setRenderExpForm(true);
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
