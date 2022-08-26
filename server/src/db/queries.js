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
    }, 'gene organism tissue PSMs score');
    let qcorr = await query;
    qcorr = qcorr.map( e => e.toObject() );

    let corr = {};
    for (let i=0; i<specie.length; i++) {
        let si = specie[i];
        corr[si] = {};
        let fs_qcorr = qcorr.filter( e => si.toLowerCase() == e.organism.toLowerCase() );
        for (let j=0; j<gene.length; j++) {
            gj = gene[j];
            corr[si][gj] = {};
            let fg_fs_qcorr = fs_qcorr.filter( e => gj.toLowerCase() == e.gene.toLowerCase() );
            for (let k=0; k<tissue.length; k++) {
                tk = tissue[k];
                let ft_fg_fs_qcorr = fg_fs_qcorr.filter( e => tk.toLowerCase() == e.tissue.toLowerCase() );
                corr[si][gj][tk] = ft_fg_fs_qcorr.map( e => { return { PSMs: e.PSMs, score: e.score } } )[0];
            }
        }
    }

    return corr;
};

/*
Get counts
*/
async function getSCounts(g, s, t) {
    let query = myModels.qbands.find({
        $and: [
            { $or: g.map( e => { return { gene: new RegExp(`^${e}$`, 'i') } } ) },
            { $or: s.map( e => { return { organism: new RegExp(`^${e}$`, 'i') } } ) },
            { $or: t.map( e => { return { tissue: new RegExp(`^${e}$`, 'i') } } ) }
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
            scounts[si][tj] = {}
            let ft_fs_qscounts = fs_qscounts.filter( e => e.tissue.toLowerCase() == tj.toLowerCase() )

            for (let k=0; k<g.length; k++) {
                let gk = g[k];
                let fg_ft_fs_qscounts = ft_fs_qscounts.filter( e => gk.toLowerCase() == e.gene.toLowerCase() );
                scounts[si][tj][gk] = fg_ft_fs_qscounts.map( e => { return { bands: e.bands, PSMs: e.PSMs, score: e.score } } );
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
    getSCounts: getSCounts
};