import { useEffect, useState } from "react";
import { Card, Grid, Typography, Paper } from "@mui/material";
import DisplayExperimentAndSamples from "./DisplayExperimentAndSamples";

const DisplayStudy = ({ studyData }) => {
  const [experiments, setExperiments] = useState([]);
  const [sampleData, setSampleData] = useState([]);
  const accession = studyData.accession;
  const study = studyData;
  const [experimentWithSamples, setExperimentsWithSamples] = useState({});

  //Gets list of all experiments
  const getExperimentData = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:2020/get_all_experiments/${accession}`
      );
      if (response.status !== 200) {
        throw new Error("Unable to fetch studies: ", data.message);
      }
      const experimentData = await response.json();
      setExperiments(experimentData.experiments);
    } catch (error) {
      console.error("Unable to fetch experiment data: ", error);
    }
  };

  //Gets sample data for one experiment
  const getSampleData = async () => {
    let experimentWithSamples = {};
    try {
      await Promise.all(
        experiments.map(async (experiment) => {
          const response = await fetch(
            `http://127.0.0.1:2020//get_all_samples/${experiment.experiment_id}`
          );
          if (response.status !== 200) {
            throw new Error(
              "Unable to fetch sample data for the experiment: ",
              response.message
            );
          }
          const samples = await response.json();
          experimentWithSamples[experiment.experiment_id] = samples;
        })
      );
    } catch (error) {
      console.error("Unable to fetch sample data: ", error);
    }
    return experimentWithSamples;
  };

  //Gets all sample data for all experiments.
  const getAllSampleData = () => {
    const numberOfExperiments = sampleData.length;
  };

  // ensure experiment data is retrieved first before getting sample data
  useEffect(() => {
    getExperimentData();
  }, []);

  // get sample data for each experiment after experiments are retrieved
  useEffect(() => {
    if (experiments.length > 0) {
      getSampleData().then((experimentWithSamples) => {
        setExperimentsWithSamples(experimentWithSamples);
      });
    }
  }, [experiments]);

  const displayData = () => {
    const experimentAndSamplesComponents = [];
    experiments.forEach((experiment) => {
      const expID = experiment.experiment_id;
      const samples = experimentWithSamples[expID];
      experimentAndSamplesComponents.push(
        <DisplayExperimentAndSamples
          experimentData={experiment}
          samplesData={samples}
        />
      );
    });
    return experimentAndSamplesComponents;
  };

  return (
    <div>
      <Card variant="outlined" sx={{ padding:4, marginRight:15, marginLeft:15, marginBottom:5, marginTop:5, border:"groove"}}>
        <Grid
          container
          rowGap={1}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          direction="column"
          alignItems="left"
          justifyContent="center"
          spacing={2}
        >
          <Grid item sx={{ mt: 1.5 }} >
            <Typography variant="h4" color="#008AAD" align="left" >
              Study Accession: {study.accession}
            </Typography>
          </Grid>
          <Grid item xs={6} >
          <b>Description:</b> 
          <br></br> {study.description}
          </Grid>
          <Grid item xs={6}>
            <b>Organism:</b> <br></br>{study.organism}
          </Grid>
          <Grid item xs={6}>
            <b>Publication:</b> 
            <br></br> {study.publication}
          </Grid>
        </Grid>
      </Card>
      {displayData().map((form, index) => (
        <div key={index}>{form}</div>
      ))}
    </div>
  );
};

export default DisplayStudy;
