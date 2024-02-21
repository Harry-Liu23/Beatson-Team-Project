import { useEffect, useState } from "react";

const DisplayStudy = ({studyData}) => {
    const [experiments, setExperiments] = useState([]);
    const [sampleData, setSampleData] = useState([])
    const accession = studyData.accession;
    // let experiments = null;
    // const [samples, setSamples] = ({});

    //Gets list of all experiments
    const getExpermentData = async () => {
        try {
          const response = await fetch(`http://127.0.0.1:2020/get_all_experiments/${accession}`);
          if (response.status !== 200) {
            throw new Error("Unable to fetch studies: ", data.message);
          }
          const experimentData = await response.json();
          console.log(experimentData);
          setExperiments(experiments.push(experimentData));
        } catch (error) {
          console.error("Unable to fetch experiment data: ", error);
        }
    };

    //Gets sample data for one experiment
    const getSampleData = async (experiment_id) => {
        try {
            const response = await fetch(`http://127.0.0.1:2020//get_all_samples/${experiment_id}`);
            if (response.status !== 200) {
              throw new Error("Unable to fetch studies: ", data.message);
            }
            const samples = await response.json();
            console.log(sampleData)
            
            setSampleData(sampleData.push(samples));
          } catch (error) {
            console.error("Unable to fetch sample data: ", error);
        }
    }

    //Gets all sample data for all experiments.
    const getAllSampleData = () => {
        const numberOfExperiments = sampleData.length;
        console.log(numberOfExperiments);
    }

    // Get experiments and samples data when DisplayStudy is first rendered
    useEffect(() => {
        getExpermentData();
        getAllSampleData();
    }, []);

    return (
        <div>
            {studyData.accession}
            {studyData.description}
        </div>

    );
};


export default DisplayStudy;