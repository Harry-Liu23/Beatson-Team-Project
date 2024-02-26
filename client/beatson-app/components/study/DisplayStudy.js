import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";

const DisplayStudy = ({studyData}) => {
    const [experiments, setExperiments] = useState([]);
    const [sampleData, setSampleData] = useState([])
    const accession = studyData.accession;
    const [experimentWithSamples, setExperimentsWithSamples] = useState({});

    //Gets list of all experiments
    const getExperimentData = async () => {
      console.log("in getExperimentData function");
        try {
          const response = await fetch(`http://127.0.0.1:2020/get_all_experiments/${accession}`);
          if (response.status !== 200) {
            throw new Error("Unable to fetch studies: ", data.message);
          }
          const experimentData = await response.json();
          setExperiments(experimentData.experiments);
          // console.log(experimentData.experiments);
          // setExperiments(experiments.push(experimentData));
        } catch (error) {
          console.error("Unable to fetch experiment data: ", error);
        };
    };

    //Gets sample data for one experiment
    const getSampleData = async (experiment_id) => {
        try {
            const response = await fetch(`http://127.0.0.1:2020//get_all_samples/${experiment_id}`);
            if (response.status !== 200) {
              throw new Error("Unable to fetch studies: ", data.message);
            }
            const samples = await response.json();
            console.log("sampleData", samples);
            setSampleData([...sampleData, samples]);
          } catch (error) {
            console.error("Unable to fetch sample data: ", error);
        }
    }

    //Gets all sample data for all experiments.
    const getAllSampleData = () => {
        const numberOfExperiments = sampleData.length;
        console.log("in getAllSampleData");
        console.log(numberOfExperiments);
    }

    // Get experiments and samples data when DisplayStudy is first rendered
    // useEffect(() => {
    //     let tempExperimentAndSamples = {}
    //     getExperimentData();
    //     experiments.forEach(experiment => {
    //       getSampleData(experiment.experiment_id)
    //       tempExperimentAndSamples[experiment.experiment_id] = sampleData;
    //       setExperimentsWithSamples([...experimentWithSamples, tempExperimentAndSamples ])
    //       tempExperimentAndSamples = {};
    //     });
    //     // getAllSampleData();
    //     console.log("experiments and samples", experimentWithSamples);
    // }, []);

    useEffect(() => {
      getExperimentData();
      let experimentWithSamples = {};
      if(experiments){
        console.log("if experiments", experiments)
      experiments.forEach(experiment => {
        console.log("experiment in exper", experiment);
        getSampleData(experiment.experiment_id)
        if(sampleData){
          experimentWithSamples[experiment.experiment_id] = sampleData;
        };
      });
    };
      // getAllSampleData();
      console.log("experiments and samples", experimentWithSamples);
  }, []);


    const [columns, setColumns] = useState([
      {
        field: "accession",
        headerName: "Accession",
        width: 200,
      },
      {
        field: "description",
        headerName: "Description",
        width: 200,
      },
      {
        field: "experiment_id",
        headerName: "Experiment ID",
        width: 200,
      },
    ]);

    return (
        <div>
          {studyData.accession}

          {/* {experimentWithSamples && (
            <div>
              {experimentWithSamples.length}

            </div>
          )} */}
          <DataGrid
            getRowId={(row) => row.experiment_id}
            rows={experiments}
            columns={columns}
            />
        </div>


    );
};


export default DisplayStudy;