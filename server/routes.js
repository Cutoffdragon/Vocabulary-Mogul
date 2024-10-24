const User = require('./model.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

module.exports = (app) => {

    authenticateToken = (req, res, next) => {

        const token = req.headers['authorization']

        if (!token) {
            return res.status(403).json({ message: 'Token missing or malformed' });
        }

        try {
            jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
                if (err) {
                    return res.status(403).json({ message: 'Invalid or Expired Token' })
                }
                req.id = decodedToken.userId;
                next();
            });
        } catch (err) {
            return res.status(401).json({
                error: "Authentication Error"
            })
        }

    }

    app.post('/register', async (req, res) => {
        const { username, password, userVocab } = req.body;
        const currentVocabulary = []

        try {

            userVocab.map((vocab) => {
                currentVocabulary.push({id: vocab, correctGuesses: 0})
            })

            const findExistingUser = await User.findOne({ username });
            if (findExistingUser) {
                return res.status(400).json({ message: 'Sorry, that username is taken. Please try a different name.' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);  // Hash the password before saving
            const newUser = new User({ username, password: hashedPassword, currentVocabulary: currentVocabulary });
            await newUser.save();

            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return res.status(200).json({ token, username: newUser.username, user_id: newUser.id });

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

            bcrypt.compare(password, user.password, function (err, result) {
                if (err) return console.log(err);
                console.log(result);
            })

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

            return res.status(200).json({ token, username: user.username, user_id: user.id });

        } catch (err) {
            return res.status(500).json({ message: 'Log In failed.', error: err.message });
        }
    });

    app.post('/vocabulary', authenticateToken, async (req, res) => {

        const userVocabulary = req.body.userVocab;

        try {
            const user = await User.findById(req.id);

            if (!user) return res.status(404).send('User not found');

            for (let i = 0; i < userVocabulary.length; i++) {
                user.currentVocabulary.push({ id: userVocabulary[i], correctGuesses: 0 })
            }

            await user.save()
        } catch {
            if (!res.headersSent) {
                res.status(500).json({ error: 'Failed to update vocabulary' });
              }
        }
    })

    app.get('/vocabulary', authenticateToken, async (req, res) => {

        try {
            const user = await User.findById(req.headers.user_id);
            if (!user) return res.status(404).send('User not found');
            const vocabularyIdArray = user.currentVocabulary.map(obj => obj.id);
            res.json({
                userVocabulary: vocabularyIdArray
            })
        } catch {
            if (!res.headersSent) {
                res.status(500).json({ error: 'Failed to update vocabulary' });
              }
        }
    })

    app.patch('/vocabulary', authenticateToken, async (req, res) => {
        const wordId = req.body.id;
    
        // Helper function to generate a unique vocabulary number
        function generateVocabularyNumber(maxNumber, currentVocabulary, reviewVocabulary) {
            const currentVocabIds = currentVocabulary.map(item => item.id);
            const allUsedNumbers = new Set([...currentVocabIds, ...reviewVocabulary]);
    
            let randomNumber;
            do {
                randomNumber = Math.floor(Math.random() * (maxNumber + 1)); // Generate random number
            } while (allUsedNumbers.has(randomNumber)); // Check if the number is in current or review vocabulary
    
            return randomNumber;
        }
    
        try {
            // Fetch the user data first
            const user = await User.findOne({ _id: req.headers.user_id });
    
            if (!user) return res.status(404).send('User not found');
    
            // Call the function to generate the new word ID
            const newWordId = generateVocabularyNumber(500, user.currentVocabulary, user.reviewVocabulary);
    
            // Step 1: Update correct guesses
            const updatedUser = await User.findOneAndUpdate(
                { _id: req.headers.user_id, "currentVocabulary.id": wordId },
                {
                    $set: {
                        "currentVocabulary.$.correctGuesses": 
                            // Increment the correct guesses based on current value
                            user.currentVocabulary.find(word => word.id === wordId).correctGuesses + 1
                    }
                },
                { new: true } // Return the updated document
            );
    
            // Step 2: Check if correctGuesses has reached 10
            const updatedWord = updatedUser.currentVocabulary.find(word => word.id === wordId);
            if (updatedWord.correctGuesses >= 10) {
                // Move the completed word to reviewVocabulary
                await User.updateOne(
                    { _id: req.headers.user_id },
                    {
                        $pull: { currentVocabulary: { id: wordId } }, // Remove completed word
                        $push: {
                            reviewVocabulary: { id: wordId }, // Add to reviewVocabulary
                            currentVocabulary: { id: newWordId, correctGuesses: 0 } // Add new word to currentVocabulary
                        }
                    }
                );
            }
    
            res.status(200).send('Vocabulary updated');
        } catch (error) {
            console.error(error);
            res.status(500).send('An error occurred while updating vocabulary');
        }
    });
    



}