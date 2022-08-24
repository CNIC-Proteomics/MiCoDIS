import React from 'react';
import { useState, useEffect } from 'react';
import styled from 'styled-components';

import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
//import Autocomplete from './mui/Autocomplete';
//import SelectMui from './mui/SelectMui';
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';


//import styled from 'styled-components';

function ProteinForm(props) {
    const specie = props.specie;
    const setSpecie = props.setSpecie;
    const setSamples = props.setSamples;
    const setGenes = props.setGenes;

    //const [specie, setSpecie] = useState(props.species[0]);
    //const [samples, setSamples] = useState([]);
    //const [genes, setGenes] = useState([]);
    const [sampleOptions, setSampleOptions] = useState([]);
    const [geneOptions, setGeneOptions] = useState([]);



    const handleSpecie = (e) => {
        setSpecie(e.target.value);
        console.log(e.target.value);
    }

    const handleSample = (value) => {
        setSamples(value.map((e) => e.title));
        console.log(value.map((e) => e.title));
    }

    const handleGene = (value) => {
        setGenes(value.map((e) => e.title));
        console.log(value.map((e) => e.title));
    }

    useEffect( () => {
        setGeneOptions(
            props.geneData[specie].genes.map( (e) => ({ title: e }) )
        );
        setSampleOptions(
            props.sampleData[specie].map( (e) => ({ title: e }) )
        );
    }, [specie] )


  return (
    <div className='mt-5'>

        <div style={{textAlign:'center'}}>
            <Box sx={{ minWidth: 120 }}>
                <FormControl>
                    <InputLabel id='select-specie-label'>Specie</InputLabel>
                    <Select
                        style={{width: '250px'}}
                        labelId='select-specie-label'
                        id='select-specie'
                        value={specie}
                        label='Specie'
                        onChange={handleSpecie}
                    >
                        <MenuItem value='mus_musculus'>Mouse</MenuItem>
                    </Select>
                </FormControl>
            </Box>
        </div>
        
        <div className='d-flex justify-content-around align-items-center mt-4 flex-wrap'>
            <div style={{ width: '40%', textAlign:'center'}}> 
                <Autocomplete
                    style={{margin:'auto'}}
                    onChange={(e,value)=>handleSample(value)}
                    multiple
                    //limitTags={2}
                    id="multiple-limit-tags"
                    options={sampleOptions}
                    getOptionLabel={(option) => option.title}
                    //defaultValue={[{title:'Brain'}]}
                    renderInput={(params) => (
                        <TextField {...params} label="Samples" placeholder="enter sample" />
                    )}
                    sx={{ width: '70%' }}
                />
            </div>
            <div style={{ width: '40%', textAlign:'center'}}> 
                <Autocomplete
                    style={{margin:'auto'}}
                    onChange={(e,value)=>handleGene(value)}
                    multiple
                    //limitTags={2}
                    id="multiple-limit-tags"
                    options={geneOptions}
                    getOptionLabel={(option) => option.title}
                    //defaultValue={[{title:'Brain'}]}
                    renderInput={(params) => (
                        <TextField {...params} label="Genes" placeholder="enter gene" />
                    )}
                    sx={{ width: '70%' }}
                    filterOptions={createFilterOptions({matchFrom: 'any', limit:100})}
                />
                
            </div>
        </div>

    </div>

    )
}

const Title = styled.h1`
    font-size:1.5rem;
    color:rgba(0,0,0,0.6);
    text-align:center
`

export default ProteinForm