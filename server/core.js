const species = [{
    'id': 'homo_sapiens',
    'name': 'Homo sapiens',
    'common': 'Human'
},{
    'id': 'mus_musculus',
    'name': 'Mus musculus',
    'common': 'Mouse'
},{
    'id': 'danio_rerio',
    'name': 'Danio rerio',
    'common': 'Zebra fish'
}];

const proteins = {
    'homo_sapiens': ['HOM1', 'HOMO2', 'HOM3'],
    'mus_musculus': ['MUS1', 'MUS2'],
    'danio_rerio':  ['DAN1', 'DAN2', 'DAN3']
};

const complexes = {
    'homo_sapiens': {
        'COMPLEX I': ['HOM1', 'HOMO2'],
        'sample 1': ['HOM1', 'HOMO2']
    },
    'mus_musculus': {
        'COMPLEX I': ['HOM1', 'MUS2'],
        'sample 1': ['MUS1', 'MUS2']
    },
    'danio_rerio': {
        'COMPLEX I': ['DAN1', 'DAN2', 'DAN3'],
        'sample 1': ['DAN1', 'DAN2']
    },
};

/*
Retrieve the species report
*/
function getSpecies() {
    return species;
};


/*
Retrieve the proteins based on a list of species
*/
function getProteins(params) {
    let prots = [];
    for (let i=0; i<params.length; i++) {
        let species = params[i];
        if ( species in proteins ) {
            prots = prots.concat(proteins[species]);
        }
    }
    return prots;
};


/*
Retrieve the complexes based on a list of species
*/
function getComplexes(params) {
    let compls = [];
    for (let i=0; i<params.length; i++) {
        let species = params[i];
        if ( species in complexes ) {
            compls = compls.concat(complexes[species]);
        }
    }
    return compls;
};


module.exports = { getSpecies, getProteins, getComplexes };