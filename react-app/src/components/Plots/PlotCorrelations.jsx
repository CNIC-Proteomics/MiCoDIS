import React, { useEffect, useState } from 'react'
import { StyledEngineProvider } from '@mui/material/styles';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/themes/splide-default.min.css'

import DataTable from './DataTable.jsx';
import UpSetSection from './UpSetSection.jsx';

function PlotCorrelations(props) {

    console.log('Render plots');
    const [rowPSMs, setRowPSMs] = useState();
    const [rowScore, setRowScore] = useState();
    const [upSetElementsPSMs, setUpSetElementsPSMs] = useState();
    const [upSetElementsScore, setUpSetElementsScore] = useState();
    const [upSetGenesPSMs, setUpSetGenesPSMs] = useState({name:'', elems:[]});
    const [upSetGenesScore, setUpSetGenesScore] = useState({name:'', elems:[]});
    //const [correlations, setCorrelations] = useState();
    const [columns, setColumns] = useState([{width:200, label:'Gene', dataKey:'Gene'}]);

    /*
    const correlations = props.correlations;
    const pval = props.pval;
    const genes = props.genes;
    */

    useEffect( () => {
        let specie = Object.keys(props.correlations);
        let mainGene = Object.keys(props.correlations[specie]);
        let samples = Object.keys(props.correlations[specie][mainGene]).filter( e => props.correlations[specie][mainGene][e].length!==0 );
        //console.log(samples);
        //console.log(correlations);
        let tablePSM = [];
        let tableScore = [];
        let upSetPSM = [];
        let upSetScore = [];

        for (let i=0; i<props.genes.length; i++) {
            let rowP = {id: props.genes[i]};
            let rowS = {id: props.genes[i]};
            let upSetElemP = {name:props.genes[i], sets:[]} // name: name of the gene ; sets
            let upSetElemS = {name:props.genes[i], sets:[]} // name: name of the gene ; sets
            let includedP = false;
            let includedS = false;
            for (let j=0; j<samples.length; j++) {
                rowP[samples[j]] = null;
                rowS[samples[j]] = null;

                let values = props.correlations[specie][mainGene][samples[j]].values[props.genes[i]]
                if (values) {
                    if (values[2] && values[2] <= props.pval) { // PSMs
                        rowP[samples[j]] = values[0];
                        upSetElemP.sets.push(samples[j]);
                        includedP = true;
                    }
                    if (values[3] && values[3] <= props.pval) { // Score
                        rowS[samples[j]] = values[1];
                        upSetElemS.sets.push(samples[j]);
                        includedS = true;
                    }
                }

                /*
                rowP[samples[j]] = null;
                if (props.correlations[specie][mainGene][samples[j]].PSMs[0][genes[i]]) {
                    rowP[samples[j]] = parseFloat(correlations[specie][mainGene][samples[j]].PSMs[0][genes[i]]).toFixed(4);
                    upSetElemP.sets.push(samples[j]);
                    includedP = true;
                }
                
                rowS[samples[j]] = null;
                if (correlations[specie][mainGene][samples[j]].score[0][genes[i]]) {
                    rowS[samples[j]] = parseFloat(correlations[specie][mainGene][samples[j]].score[0][genes[i]]).toFixed(4);
                    upSetElemS.sets.push(samples[j]);
                    includedS = true;
                }
                */

            }

            if (includedP) {
                tablePSM.push(rowP);
                upSetPSM.push(upSetElemP);
            }
            
            if (includedS) {
                tableScore.push(rowS);
                upSetScore.push(upSetElemS)
            }
        }
        setRowScore(tableScore);
        setRowPSMs(tablePSM);
        setUpSetElementsPSMs(upSetPSM);
        setUpSetElementsScore(upSetScore);
        let cols = [{width:200, headerName:'Gene', field:'id'}];
        cols = cols.concat(samples.map( e => ({width:150, headerName:e, field:e, type:'number', flex:1}) ));
        setColumns(cols);
        setUpSetGenesPSMs({name:'', elems:[]});
        setUpSetGenesScore({name:'', elems:[]});
    }, [props] )

  return (
    <div>
        <StyledEngineProvider injectFirst>
            {
            rowScore && columns &&
            <>
            <Splide>
                <SplideSlide>
                    <div style={{ margin:'auto', width:'90%'}}>
                        <h3 className='text-center'>PSMs</h3>
                        <DataTable rows={rowPSMs} columns={columns}/>
                        {
                        upSetElementsPSMs.length>0 &&
                        <UpSetSection 
                            upSetElements={upSetElementsPSMs} 
                            upSetGenes={upSetGenesPSMs} 
                            setUpSetGenes={setUpSetGenesPSMs} 
                        />}

                    </div>
                </SplideSlide>
                <SplideSlide>
                    <div style={{ margin:'auto', width:'90%'}}>
                        <h3 className='text-center'>Scores</h3>
                        <DataTable rows={rowScore} columns={columns}/>
                        {
                        upSetElementsScore.length>0 &&
                        <UpSetSection 
                            upSetElements={upSetElementsScore} 
                            upSetGenes={upSetGenesScore} 
                            setUpSetGenes={setUpSetGenesScore} 
                        />}
                    </div>
                </SplideSlide>
            </Splide>
            </>
            }
        </StyledEngineProvider>
    </div>
  )
}

export default PlotCorrelations