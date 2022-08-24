import React from 'react';
import { useState } from 'react';
import { FcScatterPlot } from 'react-icons/fc';
import { GiHistogram } from 'react-icons/gi';
import { BsIntersect } from 'react-icons/bs'

// Local components
import FieldMode from './FieldMode'

function ModeSelector(props) {

    const mode = props.mode;
    const setMode = props.setMode;

    const handleClick = (e) => {
        setMode(e.currentTarget.id);
    }

  return (
    <div style={{paddingTop:'16px', width:'70%', margin:'auto', marginTop:'5%'}}>
        
        <h3 className='text-center'>Select Execution Mode</h3>

        <div className="d-flex justify-content-around mt-4">

            <FieldMode 
                id='corr'
                name='Correlations'
                handleClick={handleClick} 
                mode={mode}
            ><FcScatterPlot size="140"/></FieldMode>

            <FieldMode 
                id='score' 
                name='Scores'
                handleClick={handleClick} 
                mode={mode}
            ><GiHistogram size="140"/></FieldMode>

            <FieldMode 
                id='set' 
                name='Set Intersect'
                handleClick={handleClick} 
                mode={mode}
            ><BsIntersect size="140"/></FieldMode>

        </div>
    </div>
  )
}

export default ModeSelector