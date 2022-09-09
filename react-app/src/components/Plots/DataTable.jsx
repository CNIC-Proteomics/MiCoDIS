import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';


export default function DataTable(props) {
    return (
        <div style={{ height: 500, width: '100%' }}>
            <DataGrid
                rows={props.rows}
                columns={props.columns}
                components={{ Toolbar: GridToolbar }}
                //pageSize={5}
                //rowsPerPageOptions={[5]}
                //checkboxSelection
            />
        </div>
    );
}