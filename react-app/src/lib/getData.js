const getData = async (setGeneData, setSampleData, setSpecie) => {

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

export default getData;