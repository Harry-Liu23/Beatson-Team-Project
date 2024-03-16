import { Card, Grid, Typography } from "@mui/material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

function ExportButtonDisplay() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

const DisplayExperimentAndSamples = (props) => {
  const experiment = props.experimentData;
  const samples = props.samplesData;
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    if (samples && samples.length > 0) {
      const samplesKeys = Object.keys(samples[0]);

      const columnsFormat = samplesKeys.map((sampleKeys) => ({
        field: sampleKeys,
        headerName:
          sampleKeys.charAt(0).toUpperCase() +
          sampleKeys.slice(1).replace("_", " "),
        width: 200,
      }));
      setColumns(columnsFormat);
    }
  }, [samples]);

  if (!samples || !experiment || columns.length < 1) {
    return <div>Loading Experiments and Samples...</div>;
  }

  return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="experiment-content"
          id="experiment-table-content"
          sx={{ flexDirection: "row-reverse", marginLeft: 12 }}
        >
          <Typography
            variant="h5"
            color="#008AAD"
            align="right"
            sx={{ padding: 2 }}
          >
            Experiment ID: {experiment.experiment_id}
          </Typography>
        </AccordionSummary>
        <Card
          variant="outlined"
          sx={{
            padding: 4,
            paddingBottom: 6,
            marginLeft: 15,
            marginRight: 15,
            marginBottom: 8,
            border: "groove",
          }}
        >
          <AccordionDetails>
            <Grid
              container
              rowGap={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              direction="column"
              alignItems="left"
              justifyContent="center"
              spacing={2}
            >
              <Grid item xs={6} paddingBottom={5}>
                <b>Experiment Details:</b>
                <br></br> {experiment.description}
              </Grid>
            </Grid>

            <DataGrid
              getRowId={(row) => row.sample_id}
              rows={samples}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10 },
                },
              }}
              pageSizeOptions={[10, 20, 25]}
              slots={{
                toolbar: ExportButtonDisplay,
              }}
            />
          </AccordionDetails>
        </Card>
      </Accordion>
    </div>
  );
};

export default DisplayExperimentAndSamples;
