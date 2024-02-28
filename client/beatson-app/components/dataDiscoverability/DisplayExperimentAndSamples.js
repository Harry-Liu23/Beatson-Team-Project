import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";

const DisplayExperimentAndSamples = (props) => {
    const experiment = props.experimentData;
    const samples = props.samplesData;
    const [columnNames, setColumnNames] = useState([]);

    if (!samples && !experiment) {
        return <div>Loading Experiments and Samples...</div>; 
    }
    // const columnNames = Object.keys(samples[0]);
    // console.log(samplesData);
    
    useEffect(() => {
        if (samples && samples.length > 0) {
            console.log("First sample", samples[0]);
            const keys = Object.keys(samples[0]);
            console.log("Keys from first sample", keys);
            setColumnNames(Object.keys(samples[0]));
        }
    }, [samples]);

    console.log("Experiment Data inside Display E+S", experiment);
    console.log("Samples Data inside E+S", samples);
    console.log("columnNames", columnNames);
    // const columns = columnNames.map(columnName => ({
    // field: columnName,
    // headerName: columnName.charAt(0).toUpperCase + columnName.slice(1).replace('_', ' '),
    // width: 200
    // }));

    // const [columns, setColumns] = useState([
    //   {
    //     field: "accession",
    //     headerName: "Accession",
    //     width: 200,
    //   },
    //   {
    //     field: "description",
    //     headerName: "Description",
    //     width: 200,
    //   },
    //   {
    //     field: "experiment_id",
    //     headerName: "Experiment ID",
    //     width: 200,
    //   },
    // ]);

    return (
        <div>
             {/* <DataGrid
                getRowId={(row) => row.sample_id}
                rows={samples}
                // rows={[experiment]}
                columns={columnNames}
            /> */}
        </div>
    )
};

export default DisplayExperimentAndSamples;