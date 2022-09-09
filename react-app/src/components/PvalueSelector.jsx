import { TextField } from '@mui/material'
import React from 'react'

function PvalueSelector(props) {
    return (
        <div className='mt-3 text-center'>
            <TextField
                id='outlined-basic'
                label='p-value'
                variant='outlined'
                type='number'
                inputProps={{ min: 0, max: 1, step: 0.01 }}
                value={props.pval}
                onChange={(e) => props.setPval(Math.max(Math.min(e.target.value, 1), 0))}
            />
        </div>
    )
}

export default PvalueSelector