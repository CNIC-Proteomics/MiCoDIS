// Import modules
const express = require('express');
const path = require('path');

// Import locals
const myModels = require(path.join(__dirname, '../db/models.js'));
const myQueries = require(path.join(__dirname, '../db/queries.js'));
const formatCorrelations = require(path.join(__dirname, 'lib/formatCorrelations.js'));
const MultiGeneCorrelations = require('./lib/MultiGeneCorrelations');

// Constants
const router = express.Router();

/*
Retrieve the species report
*/
router.get('/species', async (req, res, next) => {
    let species = await myQueries.getSpecies();
    res.send(species);
});


/*
Retrieve the proteins report
*/
router.get('/proteins', async (req, res, next) => {
    // get queries
    let params = req.query;
    // return all proteins from several species
    if ( 'species' in params ) {
        let s = params.species.split(/[, ]+/).filter(Boolean); // split by ',' discarding the spaces between them
        let prots = await myQueries.getProteins(s);
        res.send(prots);
    }
    else {
        let s = await myQueries.getSpecies();
        let prots = await myQueries.getProteins(s)
        res.send(prots);
    }
});

/*
Retrieve the samples report
*/
router.get('/samples', async (req, res, next) => {
    // get queries
    let params = req.query;
    // return all proteins from several species
    if ( 'species' in params ) {
        let s = params.species.split(/[, ]+/).filter(Boolean); // split by ',' discarding the spaces between them
        let samples = await myQueries.getSamples(s);
        res.send(samples);
    }
    else {
        let s = await myQueries.getSpecies();
        let samples = await myQueries.getSamples(s)
        res.send(samples);
    }
});

/*
Get correlations from gene
*/
router.get('/correlations', async (req, res, next) => {
    let params = req.query;

    let g = 'gene' in params ? params.gene.split(/[, ]+/).filter(Boolean) : []; // split by ',' discarding the spaces between them
    
    let s = 'specie' in params ? params.specie.split(/[, ]+/).filter(Boolean) : 
        await myQueries.getSpecies();

    let t = 'tissue' in params && params.tissue!='' ? params.tissue.split(/[, ]+/).filter(Boolean) : 
        [].concat.apply([], Object.values(await myQueries.getSamples(s)));;
    
    if ( g.length == 1 ) {
        let qcorr = await myQueries.getPairWiseCorrelations(g, s, t);
        let correlations = await formatCorrelations(g, s, t, qcorr);
        res.send(correlations);
    }
    else if ( g.length > 1 ) {
        let qcorr = await myQueries.getPairWiseMultiCorrelations(g, s, t);
        let missingT = t.filter( e => !qcorr.map( f => f.tissue ).includes(e) );
        if ( missingT.length > 0 ) {
            let missingQcorr = await MultiGeneCorrelations(g, s, missingT);
            myQueries.insertMultiCorrelations(missingQcorr);
            qcorr = qcorr.concat(missingQcorr);
        }
        let correlations = await formatCorrelations([g.sort().join('&')], s, t, qcorr);
        res.send(correlations);
        
    }
    else {
        res.status(404).send({message: 'gene not found in query'});
    }
    
});

/*
Get PSMs and scores
*/
router.get('/scounts', async (req, res, next) => {
    let params = req.query;
    
    let g = 'gene' in params ? params.gene.split(/[, ]+/).filter(Boolean) : []; // split by ',' discarding the spaces between them
    if ( g.length>=0 ) {
        let s = 'specie' in params ? params.specie.split(/[, ]+/).filter(Boolean) : 
            await myQueries.getSpecies();
        
        let t = 'tissue' in params ? params.tissue.split(/[, ]+/).filter(Boolean) : 
            [].concat.apply([], Object.values(await myQueries.getSamples(s)));;

        let scounts = await myQueries.getSCounts(g, s, t);
        res.send(scounts);
    }
    else {
        res.status(404).send({message: 'gene not found in query'});
    }
})

// Export router
module.exports = router;