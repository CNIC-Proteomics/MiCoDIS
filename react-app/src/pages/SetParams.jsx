import { Button } from '@mui/material';
import React from 'react'
import { useEffect, useState } from 'react';
import ModeSelector from '../components/ModeSelector/ModeSelector'
import ProteinForm from '../components/ModeSelector/ProteinForm'
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from 'react-router-dom';

import getData from '../lib/getData';

function SetParams() {

    const [geneData, setGeneData] = useState();
    const [sampleData, setSampleData] = useState();

    const [ mode, setMode ] = useState('correlations');
    const [specie, setSpecie] = useState();
    const [samples, setSamples] = useState([]);
    const [genes, setGenes] = useState([]);

    const [geneError, setGeneError] = useState(false);
    const navigate = useNavigate();

    useEffect( () => {
        getData(setGeneData, setSampleData, setSpecie);
    }, [] );

    const handleClick = () => {
        // Check that gene was selected
        if (genes.length===0){
            setGeneError(true);
            return;
        }

        // Blow up parameters and route
        navigate(`/${mode}`, { state: { mode, genes, samples, specie } });
        console.log('Click!!');
    }

  return (
    <div>
        { 
            geneData && sampleData && 
            <>
                <ModeSelector mode={mode} setMode={setMode}/>
                <ProteinForm 
                    setSpecie={setSpecie}
                    setSamples={setSamples}
                    setGenes={setGenes}
                    species={Object.keys(sampleData)} 
                    geneData={geneData}
                    sampleData={sampleData}
                    geneError={geneError}
                    setGeneError={setGeneError}
                    defaultGenes={[]}
                    defaultSamples={[]}
                    //defaultSpecie={specie}
                />
                <div className='mt-5' style={{textAlign:'center'}}>
                    <Button variant="contained" endIcon={<SendIcon />} color='info' size='large' onClick={handleClick}>
                        Search
                    </Button>
                </div>

            </>
        }
    </div>
  )
}

export default SetParams