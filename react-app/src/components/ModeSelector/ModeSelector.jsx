import React from 'react';
import { FcScatterPlot } from 'react-icons/fc';
import { GiHistogram } from 'react-icons/gi';

// Local components
import FieldMode from './FieldMode'

function ModeSelector(props) {

    const mode = props.mode;
    const setMode = props.setMode;

    const handleClick = (e) => {
        setMode(e.currentTarget.id);
    }

  return (
    <div style={{width:'70%', margin:'auto', marginTop:'2%'}}>
        
        <h3 className='text-center'>Select Execution Mode</h3>

        <div className="d-flex justify-content-around mt-4">

            <FieldMode 
                id='correlations'
                name='Correlations'
                handleClick={handleClick} 
                mode={mode}
            ><FcScatterPlot size="140"/></FieldMode>

            <FieldMode 
                id='expression' 
                name='Expression Pattern'
                handleClick={handleClick} 
                mode={mode}
            ><GiHistogram size="140"/></FieldMode>

            {/* 
            <FieldMode 
                id='set' 
                name='Set Intersect'
                handleClick={handleClick} 
                mode={mode}
            ><BsIntersect size="140"/></FieldMode>
            */}

        </div>
    </div>
  )
}

export default ModeSelector