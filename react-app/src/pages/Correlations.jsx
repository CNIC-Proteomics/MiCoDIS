import SendIcon from '@mui/icons-material/Send';
import { Button, Chip, Divider } from '@mui/material';
import React from 'react';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProteinForm from '../components/ModeSelector/ProteinForm';
import PlotCorrelations from '../components/Plots/PlotCorrelations';
import getData from '../lib/getData';


function Correlations() {
    
    const {state} = useLocation();
    
    const [geneData, setGeneData] = useState();
    const [sampleData, setSampleData] = useState();
    
    const [specie, setSpecie] = useState(state ? state.specie : undefined);
    const [samples, setSamples] = useState(state ? state.samples : []);
    const [genes, setGenes] = useState(state ? state.genes : []);

    const [defaultGenes, setDefaultGenes] = useState(genes);
    const [defaultSamples, setDefaultSamples] = useState(samples);

    const [geneError, setGeneError] = useState(false);
    
    const [search, setSearch] = useState(state ? state : {specie, samples, genes, mode:'correlations'});
    const [correlations, setCorrelations] = useState();


    /*
    useEffect
    */
    useEffect( () => {
        getData(setGeneData, setSampleData, setSpecie);
        /*if (state) {
            setGenes(state.genes);
            setSamples(state.samples);
            setSpecie(state.specie);
            setSearch(state);
        }*/
    }, [] )

    const getCorrelations = async () => {
        const s = `specie=${search.specie}`;
        const g = `gene=${search.genes[0]}`; // Currently only one gen 
        const t = search.samples.length>0 ? `tissue=${search.samples}` : ''
        const url = `${process.env.REACT_APP_SERVER}/correlations?${s}&${g}&${t}`
        console.log(url);
        const resCorr = await fetch(url);
        const corr = await resCorr.json();
        setCorrelations(corr);
    }

    useEffect( () => {
        console.log(search);

        if (search.specie && search.genes.length>0) {
            console.log('getCorrelations executed');
            getCorrelations()
        }
    }, [search] );

    const handleClick = () => {
        setSearch({specie, genes, samples})
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
        > 
            <div className='mt-1' style={{textAlign:'center'}}>
                <Button variant="contained" endIcon={<SendIcon />} color='info' size='large' onClick={handleClick}>
                    Search
                </Button>
            </div>
        </ProteinForm>

        <Divider style={{margin:'40px 0'}}>
            <Chip label='CORRELATIONS'/>
        </Divider>
        
        {
        correlations &&
        <PlotCorrelations correlations={correlations} genes={geneData[specie].genes} specie={specie}/>
        }
        </>
        }


    </div>
  )
}

export default Correlations;