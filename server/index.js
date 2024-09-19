const User = require('./model.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express');
const db = require('./db.js');
require('dotenv').config()
const cors = require('cors');

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Initialize the database
db.main();

app.use(cors({
    origin: 'http://localhost:4200'
  }));

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const findExistingUser = await User.findOne({ username });
        if (findExistingUser) {
            return res.status(400).json({ message: 'Sorry, that username is taken. Please try a different name.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);  // Hash the password before saving
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        return res.status(200).json({ message: 'Registration successful. Welcome to Vocabulary Mogul!' });
    } catch (err) {
        return res.status(500).json({ message: 'Registration failed.', error: err.message });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ message: 'Invalid Username or Password' });
        }

        const matchPass = await bcrypt.compare(password, user.password);

        if (!matchPass) {
            return res.status(400).json({ message: 'Invalid Username or Password' });
        }

        const jwtSecret = 'your_jwt_secret'; // Define your JWT secret here
        const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '1h' });

        return res.status(200).json({ token, user: { id: user._id, username: user.username } });

    } catch (err) {
        return res.status(500).json({ message: 'Log In failed.', error: err.message });
    }
});

function run() {
    const port = process.env['PORT'] || 4000;
    app.listen(port, () => {
        console.log(`Node Express server listening on http://localhost:${port}`);
    });
}

run();
