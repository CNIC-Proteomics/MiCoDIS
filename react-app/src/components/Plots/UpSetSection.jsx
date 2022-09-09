import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid'
import React from 'react'
import UpSetDiagram from './UpSetDiagram.jsx'

function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport printOptions={{ disableToolbarButton: true }} />
      </GridToolbarContainer>
    );
  }

function UpSetSection(props) {
    return (

        <div className='d-flex justify-content-around mt-4 pb-4 flex-wrap'>
            <div>
                <UpSetDiagram elems={props.upSetElements} setUpSetGenes={props.setUpSetGenes} />
            </div>
            {
                props.upSetGenes.elems.length === 0 ?
                <div style={{width:'20%', height:500, fontSize:'1.5em', padding:'200px 5px', color:'rgba(0,0,0,0.6)', textAlign:'center'}}>
                    Click on a set combination to see their genes
                </div>
                :
                <div style={{ width: '20%', height: 500 }}>
                    <DataGrid
                        rows={props.upSetGenes.elems}
                        columns={[
                            {
                                field: 'id',
                                headerName: `Selected genes: ${props.upSetGenes.name}`,
                                flex: 1,
                                align: 'center'
                            }
                        ]}
                        components={{ Toolbar: CustomToolbar }}
                    />
                </div>
            }
        </div>

    )
}

export default UpSetSection