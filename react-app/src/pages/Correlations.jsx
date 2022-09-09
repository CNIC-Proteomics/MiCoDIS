import SendIcon from '@mui/icons-material/Send';
import { Box, Button, Chip, Divider, LinearProgress } from '@mui/material';
import React from 'react';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProteinForm from '../components/ModeSelector/ProteinForm';
import PlotCorrelations from '../components/Plots/PlotCorrelations';
import PvalueSelector from '../components/PvalueSelector';


function Correlations() {
    
    const geneData = require('../data/genes.json');
    const sampleData = require('../data/samples.json');
    const c2g = require('../data/c2g.json');
    const classOptions = Object.keys(c2g).map( e => ({ title: e, type: 'Class' }) );

    const {state} = useLocation();
    
    const [specie, setSpecie] = useState(state ? state.specie : Object.keys(sampleData)[0]);
    const [samples, setSamples] = useState(state ? state.samples : []);
    const [genes, setGenes] = useState(state ? state.genes : []);
    const [pval, setPval] = useState(state ? state.pval : 0.05);

    const [defaultGenes, setDefaultGenes] = useState(state ? state.defaultGenes : []);
    const [defaultSamples, setDefaultSamples] = useState(samples);

    const [geneError, setGeneError] = useState(false);
    
    const [search, setSearch] = useState(state ? state : {specie, samples, genes, pval, mode:'correlations'});
    const [correlations, setCorrelations] = useState();


    const getCorrelations = async () => {
        const s = `specie=${search.specie}`;
        const g = `gene=${search.genes.join(',')}`; // Currently only one gen 
        const t = search.samples.length>0 ? `tissue=${search.samples}` : ''
        const url = `${process.env.REACT_APP_SERVER}/correlations?${s}&${g}&${t}`
        console.log(url);
        console.log(encodeURI(url));
        const resCorr = await fetch(url);
        const corr = await resCorr.json();
        setCorrelations(corr);
    }

    useEffect( () => {
        console.log(`Search: ${search}`);
        console.log(search.genes);

        if (search.specie && search.genes.length>0) {
            console.log('getCorrelations executed');
            getCorrelations()
        }
    }, [search] );

    const handleClick = () => {
        let allGenes = genes.filter( e => !Object.keys(c2g).includes(e) );
        let classes = genes.filter( e => Object.keys(c2g).includes(e) );
        let classesGenes = classes.map( e => c2g[e].Gene ).flat();
        allGenes = allGenes.concat(classesGenes);
        setCorrelations();
        setSearch({specie, genes:allGenes, samples, pval})
    }

    useEffect( () => {
        console.log('Changes in correlations...');
    }, [correlations])

    /*
    render
    */

  return (
    <div>
        {
        geneData && sampleData &&
        <>
        <ProteinForm 
            setSpecie={setSpecie}
            setSamples={setSamples}
            setGenes={setGenes}
            species={Object.keys(sampleData)} 
            geneData={geneData}
            sampleData={sampleData}
            geneError={geneError}
            setGeneError={setGeneError}
            defaultGenes={defaultGenes}
            defaultSamples={defaultSamples}
            defaultSpecie={specie}
            mode='correlations'
            pval={pval}
            setPval={setPval}
            classOptions={classOptions}
        > 
            <div className='mt-1' style={{textAlign:'center'}}>
                <Button className='mt-4' variant="contained" endIcon={<SendIcon />} color='info' size='large' onClick={handleClick}>
                    Search
                </Button>
            </div>
        </ProteinForm>

        <Divider style={{margin:'40px 0'}}>
            <Chip label='CORRELATIONS'/>
        </Divider>
        
        {
        correlations ?
        <PlotCorrelations correlations={correlations} genes={geneData[specie].genes} specie={specie} pval={pval} /> 
        :
        <div style={{ width:'80%', paddingTop:'5%', margin:'auto'}}>
            {
            search.genes.length > 0 &&
            <Box sx={{ width: '100%' }}>
                <LinearProgress />
            </Box>
            }
        </div>
        }
        </>
        }


    </div>
  )
}

export default Correlations;