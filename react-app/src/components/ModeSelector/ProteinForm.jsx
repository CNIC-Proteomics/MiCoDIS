import React from 'react';
import { useState, useEffect } from 'react';

import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';

// Constants
const specie2Name = {
    'mus_musculus': 'Mouse'
};


function ProteinForm(props) {

    const [specie, setSpecie] = useState(props.species[0]);
    const [sampleOptions, setSampleOptions] = useState();
    const [geneOptions, setGeneOptions] = useState();
    //const [inputDefault, setInputDefault] = useState([true]);

    const handleSpecie = (e) => {
        setSpecie(e.target.value);
        props.setSpecie(e.target.value);
        console.log(e.target.value);
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
    <>
    {
    geneOptions && sampleOptions &&
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
                        {props.species.map( e => <MenuItem key={e} value={e}>{specie2Name[e]}</MenuItem> )}
                    </Select>
                </FormControl>
            </Box>
        </div>
        
        <div className='d-flex justify-content-around align-items-center mt-4 flex-wrap'>
            <div style={{ width: '40%', textAlign:'center'}}> 
                <Autocomplete
                    style={{margin:'auto'}}
                    onChange={(e,value)=> props.setSamples(value.map(v=>v.title)) }
                    multiple
                    //limitTags={2}
                    id="multiple-limit-tags-sample"
                    options={sampleOptions}
                    getOptionLabel={(option) => option.title}
                    defaultValue = {sampleOptions.filter( e => props.defaultSamples.includes(e.title) )}
                    renderInput={(params) => (
                        <TextField {...params} label="Samples" placeholder="enter sample" />
                    )}
                    sx={{ width: '70%' }}
                />
            </div>
            <div style={{ width: '40%', textAlign:'center'}}> 
                <Autocomplete
                    style={{margin:'auto'}}
                    onChange={(e,value)=> props.setGenes(value.map(v=>v.title)) }
                    multiple
                    //limitTags={2}
                    id="multiple-limit-tags-gene"
                    options={geneOptions}
                    getOptionLabel={(option) => option.title}
                    defaultValue = {geneOptions.filter( e => props.defaultGenes.includes(e.title) )}
                    renderInput={(params) => (
                        <TextField 
                            {...params} 
                            label="Genes" 
                            placeholder="enter gene"
                            error={props.geneError ? true : false}
                            onChange={ () => props.setGeneError(false) }
                            onClick={ () => props.setGeneError(false) }
                        />
                    )}
                    sx={{ width: '70%' }}
                    filterOptions={createFilterOptions({matchFrom: 'any', limit:100})}
                />
                
            </div>
        </div>

        {props.children}

    </div>
    }
    </>
    )
}

export default ProteinForm