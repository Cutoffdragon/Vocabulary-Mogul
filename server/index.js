
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
  const listener = app.listen(process.env.PORT, "0.0.0.0", function () {
    console.log('Your app is listening on port ' + listener.address().port);
  });
}

run();
