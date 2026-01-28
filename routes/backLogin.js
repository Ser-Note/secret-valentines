var express = require('express');
var router = express.Router();

const { userDB } = require('../database/db');

// ---- Login Route ---- //

router.post('/', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Login attempt:', { username, password: '***' });

        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Username and password required' });
        }

        const user = await userDB.login(username, password);
        console.log('User found:', user);

        if (user && (user.isAuthenticated || user.isauthenticated)) {
            req.session.username = user.user_name;
            req.session.userId = user.id;
            req.session.isAdmin = user.isAdmin || user.isadmin;
            console.log('User authenticated successfully');
            return res.json({ success: true, message: 'Login successful' });
        } else if (user) {
            console.log('User found but not authenticated');
            return res.status(403).json({ success: false, message: 'Your account is pending admin authentication' });
        }

        console.log('User not found with those credentials');
        return res.status(401).json({ success: false, message: 'Invalid username or password' });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ success: false, message: err.message || 'Server error during login' });
    }
});

module.exports = router;