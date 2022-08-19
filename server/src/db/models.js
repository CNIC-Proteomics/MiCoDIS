// Import modules
const { Schema, model } = require('mongoose');

// Define Schemas, compile Models

/*
qbands
*/
qbandsSchema = new Schema({
    organism: String,
    tissue: String,
    gene: String,
    bands: Array,
    PSMs: Array,
    score: Array
})

qbands = model('qbands', qbandsSchema);

/*
correlations
*/
correlationsSchema = new Schema({
    gene: String,
    tissue: String,
    organism: String,
    PSMs: Array,
    score: Array
});

correlations = model('correlations', correlationsSchema);

// Export models
module.exports = {
    'qbands': qbands,
    'correlations': correlations
};