import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";

const DisplayStudy = ({studyData}) => {
    const [experiments, setExperiments] = useState([]);
    const [sampleData, setSampleData] = useState([])
    const accession = studyData.accession;
    // let experiments = null;
    // const [samples, setSamples] = ({});

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
      printExperiments(experiments);
    };

    const printExperiments = (experiments) => {
      experiments.forEach(element => {
        console.log(element)
      });
    }
    //Gets sample data for one experiment
    const getSampleData = async (experiment_id) => {
        try {
            const response = await fetch(`http://127.0.0.1:2020//get_all_samples/${experiment_id}`);
            if (response.status !== 200) {
              throw new Error("Unable to fetch studies: ", data.message);
            }
            const samples = await response.json();
            // console.log(sampleData)
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
    useEffect(() => {
        getExperimentData();
        let experimentWithSamples = {};
        experiments.forEach(experiment => {
          getSampleData(experiment.experiment_id)
          experimentWithSamples[experiment.experiment_id] = sampleData;
        });
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
            <DataGrid
              getRowId={(row) => row.experiment_id}
              rows={experiments}
              columns={columns}
            />
            {experiments.objects}
            {/* {experimentWithSamples} */}
        </div>


    );
};


export default DisplayStudy;