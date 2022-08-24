import { Button } from '@mui/material';
import React from 'react'
import { useEffect, useState } from 'react';
import ModeSelector from '../components/ModeSelector/ModeSelector'
import ProteinForm from '../components/ProteinForm'
import SendIcon from '@mui/icons-material/Send';

function SetParams() {

    const [geneData, setGeneData] = useState();
    const [sampleData, setSampleData] = useState();

    const [ mode, setMode ] = useState('score');
    const [specie, setSpecie] = useState();
    const [samples, setSamples] = useState([]);
    const [genes, setGenes] = useState([]);

    const getData = async () => {

        let preGeneData = localStorage.getItem('geneData');
        if(!preGeneData) {
            const resProteins = await fetch(`${process.env.REACT_APP_SERVER}/proteins`);
            preGeneData = await resProteins.json();
            localStorage.setItem('geneData', JSON.stringify(preGeneData));
        } 
        else {
            preGeneData = JSON.parse(preGeneData);
        }
        setGeneData(preGeneData);

        let preSampleData = localStorage.getItem('samples');
        if (!preSampleData) {
            const resSample = await fetch(`${process.env.REACT_APP_SERVER}/samples`);
            preSampleData = await resSample.json();            
            localStorage.setItem('sampleData', JSON.stringify(preSampleData));
            
        }
        else {
            preSampleData = JSON.parse(preSampleData);
        }
        setSampleData(preSampleData);
        setSpecie(Object.keys(preSampleData)[0]);
    }

    useEffect( () => {
        getData();
    }, [] );

    const handleClick = () => {
        // Check that gene was selected
        // Blow up parameters and route
        console.log('Click!!');
    }

  return (
    <div>
        { 
            geneData && sampleData && 
            <>
                <ModeSelector mode={mode} setMode={setMode}/>
                <ProteinForm 
                    specie={specie}
                    setSpecie={setSpecie}
                    setSamples={setSamples}
                    setGenes={setGenes}
                    species={Object.keys(sampleData)} 
                    geneData={geneData}
                    sampleData={sampleData}
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