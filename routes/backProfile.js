var express = require('express');
var router = express.Router();
const { userDB } = require('../database/db');

// Middleware to check if user is authenticated
const checkAuth = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    next();
};

// ---- Get profile page ---- //
router.get('/', checkAuth, async (req, res) => {
    try {
        res.render('profile', {
            title: 'My Profile',
            username: req.session.username,
            isAdmin: req.session.isAdmin
        });
    } catch (err) {
        console.error('Error loading profile:', err);
        res.status(500).send('Error loading profile');
    }
});

// ---- Update username ---- //
router.put('/update-name', checkAuth, async (req, res) => {
    try {
        const { newName } = req.body;
        
        if (!newName || newName.trim() === '') {
            return res.status(400).json({ success: false, message: 'Name cannot be empty' });
        }
        
        // Check if new name is already taken
        const existingUser = await userDB.getUserByName(newName);
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Name already taken' });
        }
        
        const user = await userDB.updateUsername(req.session.username, newName);
        
        if (user) {
            req.session.username = newName; // Update session
            return res.json({ success: true, message: 'Name updated successfully', username: newName });
        }
        
        return res.status(400).json({ success: false, message: 'Failed to update name' });
    } catch (err) {
        console.error('Error updating name:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ---- Update password ---- //
router.put('/update-password', checkAuth, async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;
        
        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ success: false, message: 'All fields required' });
        }
        
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ success: false, message: 'New passwords do not match' });
        }
        
        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
        }
        
        // Verify current password
        const user = await userDB.login(req.session.username, currentPassword);
        if (!user) {
            return res.status(401).json({ success: false, message: 'Current password is incorrect' });
        }
        
        // Update to new password
        const updated = await userDB.updatePassword(req.session.username, newPassword);
        
        if (updated) {
            return res.json({ success: true, message: 'Password updated successfully' });
        }
        
        return res.status(400).json({ success: false, message: 'Failed to update password' });
    } catch (err) {
        console.error('Error updating password:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ---- Logout ---- //
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Error logging out');
        }
        res.redirect('/');
    });
});

module.exports = router;
