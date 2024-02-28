
import { DataGrid } from "@mui/x-data-grid";

const SamplesDataGrid = (samples) => {

    // use set of possible keys as column values as this can change for different sample sets
  const [columns, setColumns] = UseState([samples.Object.keys()]);
    return (
        <div>
            <DataGrid
            getRowId={(row) => row.accession}
            rows={samples}
            columns={columns}
            />
        </div>
    );
};

export default SamplesDataGrid;