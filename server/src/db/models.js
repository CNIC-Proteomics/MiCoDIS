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
    values: Object
});

correlations = model('correlations', correlationsSchema);

/*
multi_correlations
*/
multi_correlationsSchema = new Schema({
    gene: String,
    tissue: String,
    organism: String,
    values: Object
});

multi_correlations = model('multi_correlations', multi_correlationsSchema);

// Export models
module.exports = {
    'qbands': qbands,
    'correlations': correlations,
    'multi_correlations': multi_correlations
};