
const express = require('express');
const db = require('./db.js');
require('dotenv').config()
const cors = require('cors');
const routes = require('./routes.js')

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cors());

// Initialize the database
db.connect();

//Initialize Routes
routes(app);


function run() {
    const port = process.env['PORT'] || 4000;
    app.listen(port, () => {
        console.log(`Node Express server listening on http://localhost:${port}`);
    });
}

run();
