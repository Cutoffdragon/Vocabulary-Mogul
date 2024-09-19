const { MongoClient } = require('mongodb');
require ('dotenv').config()

const uri = process.env.MONGO_URI
async function main() {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } finally {
        await client.close();
    }
}

module.exports = { main }
