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
      } catch (error) {
        console.error("Unable to fetch experiment data: ", error);
      };
    };

    //Gets sample data for one experiment
    const getSampleData = async () => {
      let experimentWithSamples = {};
      for (const experiment of experiments) {
        try {
            const response = await fetch(`http://127.0.0.1:2020//get_all_samples/${experiment.experiment_id}`);
            if (response.status !== 200) {
              throw new Error("Unable to fetch sample data for the experiment: ", response.message);
            }
            const samples = await response.json();
            experimentWithSamples[experiment.experiment_id] = samples;
            console.log("sampleData", samples)
          } catch (error) {
            console.error("Unable to fetch sample data: ", error);
        }
      }
      setExperimentsWithSamples(experimentWithSamples);
      console.log("ExeprimentsWithSamples now set", experimentWithSamples);
    };

    //Gets all sample data for all experiments.
    const getAllSampleData = () => {
        const numberOfExperiments = sampleData.length;
        console.log("in getAllSampleData");
        console.log(numberOfExperiments);
    }

    // ensure experiment data is retrieved first before getting sample data
    useEffect(() => {
      getExperimentData();
    },[]);

    // get sample data for each experiment after experiments are retrieved
    useEffect(() => {
      if (experiments.length > 0) {
        getSampleData();
      }
    }, [experiments]);

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
          <DataGrid
            getRowId={(row) => row.experiment_id}
            rows={experiments}
            columns={columns}
            />
        </div>


    );
};


export default DisplayStudy;