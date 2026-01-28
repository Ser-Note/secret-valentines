var express = require('express');
var router = express.Router();
const {userDB} = require('../database/db');

// ---- Register Router ---- //

router.get('/', function(req, res, next)  {
    res.render('register', 
        {
            title: 'Sign Up',
        });
});

router.post('/', async (req, res, next) => {
    try {
        const {username, password} = req.body;
        console.log('Register attempt:', { username, password: '***' });
        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Username and password required' });
        }
        
        // Check if user already exists
        const existingUser = await userDB.getUserByName(username);
        console.log('Checking if user exists:', existingUser);
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Username already taken' });
        }

        const user = await userDB.register(username, password);
        console.log('User registered:', user);

        if (user) {
            // Don't auto-login, user must wait for admin authentication
            return res.json({ success: true, message: 'Registration successful! Wait for admin to authenticate.' });
        }
        else
        {
            return res.status(401).json({ success: false, message: 'Registration failed' });
        }
    }catch (err) {
        console.error('Registration error:', err);
        return res.status(500).json({ success: false, message: err.message || 'Server error during registration' });
    }
});

module.exports = router;