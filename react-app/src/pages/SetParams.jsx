import { Button, TextField } from '@mui/material';
import React from 'react'
import { useEffect, useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from 'react-router-dom';

import ModeSelector from '../components/ModeSelector/ModeSelector'
import ProteinForm from '../components/ModeSelector/ProteinForm'
import PvalueSelector from '../components/PvalueSelector';

// import getData from '../lib/getData';

function SetParams() {

    const geneData = require('../data/genes.json');
    const sampleData = require('../data/samples.json');
    const c2g = require('../data/c2g.json');
    const classOptions = Object.keys(c2g).map( e => ({ title: e, type: 'Class' }) );

    const [ mode, setMode ] = useState('correlations');
    const [ specie, setSpecie ] = useState(Object.keys(sampleData)[0]);
    const [ samples, setSamples ] = useState([]);
    const [ genes, setGenes ] = useState([]);
    const [pval, setPval ] = useState(0.05);

    const [ geneError, setGeneError ] = useState(false);
    const navigate = useNavigate();

    const handleClick = () => {
        // Check that gene was selected
        if (genes.length===0){
            setGeneError(true);
            return;
        }

        let allGenes = genes.filter( e => !Object.keys(c2g).includes(e) );
        let classes = genes.filter( e => Object.keys(c2g).includes(e) );
        let classesGenes = classes.map( e => c2g[e].Gene ).flat();
        allGenes = allGenes.concat(classesGenes);

        // Blow up parameters and route
        navigate(`/${mode}`, { state: { mode, genes: allGenes, samples, specie, pval, defaultGenes:genes } });
        console.log({ mode, genes, samples, specie, pval });
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
                    mode={mode}
                    pval={pval}
                    setPval={setPval}
                    classOptions={classOptions}
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