// Import modules
const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');

// Declare instances and server configuration
const app = express();
const port = 5000;

app.use(cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Import local library
const core = require('./core');

/*
Init route
*/
app.get('/', (req, res) => {
    res.json({ message: 'MiCoDIS REST server' });
});

/*
Retrieve the species report
*/
app.get('/species', function (req, res, next) {
    let species = core.getSpecies
    res.send(species);
});

/*
Retrieve the proteins based on a list of species
*/
app.get('/proteins', function (req, res, next) {
    // get queries
    let params = req.query;
    // return all proteins from several species
    if ( 'species' in params ) {
        let p = params.species.split(/[, ]+/).filter(Boolean); // split by ',' discarding the spaces between them
        let prots = core.getProteins(p);
        res.send(prots);
    }
    else {
        // Sending 404 when not found something
        res.status(404).send('Species not found');
    }
});

/*
Retrieve the complexes based on a list of species
*/
app.get('/complexes', function (req, res, next) {
    // get queries
    let params = req.query;
    // return all complexes from several species
    if ( 'species' in params ) {
        let p = params.species.split(/[, ]+/).filter(Boolean); // split by ',' discarding the spaces between them
        let compls = core.getComplexes(p);
        res.send(compls);
    }
    else {
        // Sending 404 when not found something
        res.status(404).send('Complexes not found');
    }
});

app.listen(port, () => console.log(`MiCoDIS REST services are listening on port ${port}!`));