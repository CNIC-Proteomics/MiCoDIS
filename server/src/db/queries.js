// Import libraries
const mongoose = require('mongoose');
const path = require('path');

const myModels = require(path.join(__dirname, 'models.js'));


// Define queries

/*
Get species
*/
async function getSpecies() {
    let query = myModels.qbands.find({}, 'organism');
    let qspecies = await query;
    let species = [... new Set(qspecies.map( e => e.toObject().organism ))];
    return species;
};

/*
Get proteins
*/
async function getProteins(species) {
    let query = myModels.qbands.find({$or: species.map( e => { return { 'organism':e } } )}, 'organism gene protein');
    let qproteins = await query;
    qproteins = qproteins.map( e => e.toObject() );

    proteins = {};
    for (let i=0; i<species.length; i++) {
        let s = species[i];
        proteins[s] = {};
        let qpf = qproteins.filter( qp => qp.organism == s );

        let g_q = [... new Set(qpf.map( e => `${e.gene} // ${e.protein}` ))]
        g_q = g_q.map( (e) => e.split(' // ') );

        proteins[s].proteins = [];
        proteins[s].genes = [];

        for (let j=0; j<g_q.length; j++) {
            proteins[s].genes.push(g_q[j][0]);
            proteins[s].proteins.push(g_q[j][1]);
        }

        //proteins[s].proteins = qpf.map( e => e.protein );
        //proteins[s].genes =  qpf.map( e => e.gene );
    }
    return proteins;
};

/*
Get samples
*/
async function getSamples(species) {
    let query = myModels.qbands.find({$or: species.map( e => { return { 'organism':e } } )}, 'organism tissue');
    let qsamples = await query;
    qsamples = qsamples.map( e => e.toObject() )

    let samples = {}
    for (let i=0; i<species.length; i++) {
        let s = species[i];
        samples[s] = [... new Set(qsamples.filter( qp => qp.organism == s).map( qp => qp.tissue ))];
    }

    return samples;
};

/*
Get correlations
*/
async function getPairWiseCorrelations(gene, specie, tissue) {
    let query = myModels.correlations.find({
        $and: [
            {$or: gene.map( e => { return { gene: new RegExp(`^${e}$`, 'i') } } )},
            {$or: specie.map( e => { return { organism: new RegExp(`^${e}$`, 'i') } } )},
            {$or: tissue.map( e => { return { tissue: new RegExp(`^${e}$`, 'i') } } )},
        ]
    }, 'gene organism tissue values');// PSMs_pvalue score_pvalue');
    let qcorr = await query;
    qcorr = qcorr.map( e => e.toObject() );
    return qcorr;
}

/*
Get multi_correlations
*/
async function getPairWiseMultiCorrelations(gene, specie, tissue) {
    let query = myModels.multi_correlations.find({
        $and: [
            {$and: [
            { gene: gene.sort().join('&') },
            //{ $or: gene.map( e => { return { gene: new RegExp(`^${e}$`, 'i') } } ) },
            { $or: specie.map( e => { return { organism: new RegExp(`^${e}$`, 'i') } } ) },
            { $or: tissue.map( e => { return { tissue: new RegExp(`^${e}$`, 'i') } } ) },
            ] }
        ]
    }, 'gene organism tissue values');// PSMs_pvalue score_pvalue');
    let qcorr = await query;
    qcorr = qcorr.map( e => e.toObject() );
    return qcorr;
}


/*
Insert multi_correlations
*/
function insertMultiCorrelations(qcorr) {
    myModels.multi_correlations.insertMany(qcorr, (err) => {
        if (err) {
            console.error(err);
        } 
        else {
            qcorr.map(
                e => console.log(`Insert multi_correlations: {gene:${e.gene}, tissue:${e.tissue}, specie:${e.organism}}`) 
            );
        }
    })
}

/*
Get counts
*/
async function getSCounts(g, s, t) {
    
    let query = myModels.qbands.find({
        $and: [
            { $or: g.length>0 ? g.map( e => ({ gene: e })  ) : [{}] },
            { $or: s.map( e => ({ organism: e }) ) },
            { $or: t.map( e => ({ tissue: e }) ) }
        ]
    }, 'organism tissue gene bands PSMs score');

    let qscounts = await query;
    qscounts = qscounts.map( e => e.toObject() );

    scounts = {};
    for (let i=0; i<s.length; i++) {
        let si = s[i];
        scounts[si] = {};
        let fs_qscounts = qscounts.filter( e => e.organism.toLowerCase() == si.toLowerCase() );

        for (let j=0; j<t.length; j++) {
            let tj = t[j];
            let ft_fs_qscounts = fs_qscounts.filter( e => e.tissue.toLowerCase() == tj.toLowerCase() );
            scounts[si][tj] = {};

            for (let k=0; k<ft_fs_qscounts.length; k++) {
                scounts[si][tj][ft_fs_qscounts[k].gene] = {
                    bands: ft_fs_qscounts[k].bands,
                    score: ft_fs_qscounts[k].score,
                    PSMs: ft_fs_qscounts[k].PSMs
                }
            }
        }
    }
    
    return scounts;
};

// Export queries
module.exports = {
    getSpecies: getSpecies,
    getProteins: getProteins,
    getSamples: getSamples,
    getPairWiseCorrelations: getPairWiseCorrelations,
    getPairWiseMultiCorrelations: getPairWiseMultiCorrelations,
    insertMultiCorrelations: insertMultiCorrelations,
    getSCounts: getSCounts
};