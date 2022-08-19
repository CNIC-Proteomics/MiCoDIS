// Import modules
const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

console.log(path.dirname(require.main.filename));

// Declare instances and server configuration
const app = express();
const port = 5000;
const baseRoute = '/api';

app.use(cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Import local library
// const core = require('./core');

// Connect to database
(async () => {
    await mongoose.connect('mongodb://localhost/MiCoDIS');
})();


// Add routes
app.use(baseRoute, require(path.join(__dirname, 'routes', 'routes.js')));

/*
Init route
*/
app.get('/', (req, res) => {
    res.json({ message: `MiCoDIS REST server. Base route: ${baseRoute}` });
});


app.listen(port, () => console.log(`MiCoDIS REST services are listening on port ${port}!`));