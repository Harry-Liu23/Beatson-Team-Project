import { Card, Grid, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";

const DisplayExperimentAndSamples = (props) => {
  const experiment = props.experimentData;
  const samples = props.samplesData;
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    if (samples && samples.length > 0) {
      console.log("First sample", samples[0]);
      const samplesKeys = Object.keys(samples[0]);
      console.log("Keys from first sample", samplesKeys);

      const columnsFormat = samplesKeys.map((sampleKeys) => ({
        field: sampleKeys,
        headerName:
          sampleKeys.charAt(0).toUpperCase() +
          sampleKeys.slice(1).replace("_", " "),
        width: 200,
      }));
      console.log("Formatted Columns", columnsFormat);
      setColumns(columnsFormat);
    }
  }, [samples]);

  console.log("Experiment Data inside Display E+S", experiment);
  console.log("Samples Data inside E+S", samples);
  console.log("columnNames", columns);

  if (!samples || !experiment || columns.length < 1) {
    return <div>Loading Experiments and Samples...</div>;
  }

  return (
    <div>
      <Card variant="outlined" sx={{ padding: 2 }}>
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
              Experiment ID: {experiment.experiment_id}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            Experiment Details: {experiment.description}
          </Grid>
        </Grid>

        <DataGrid
          getRowId={(row) => row.sample_id}
          rows={samples}
          columns={columns}
        />
      </Card>
    </div>
  );
};

export default DisplayExperimentAndSamples;
