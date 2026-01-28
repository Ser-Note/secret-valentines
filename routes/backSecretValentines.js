var express = require('express');
var router = express.Router();
const { secretValentinesDB, giftDB } = require('../database/db');

// Middleware to check if user is authenticated
const checkAuth = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    next();
};

// ---- Get secret valentine view ---- //
router.get('/', checkAuth, async (req, res) => {
    try {
        const today = new Date();
        const isRevealed = today.getMonth() === 1 && today.getDate() >= 1; // February 1st or later
        
        let valentine = null;
        let valentineGifts = [];
        
        if (isRevealed) {
            const assignment = await secretValentinesDB.getAssignedValentine(req.session.userId);
            if (assignment && assignment.to_user_id) {
                valentine = await secretValentinesDB.getValentineInfo(assignment.to_user_id);
                valentineGifts = await giftDB.getGiftsByUser(assignment.to_user_id);
            }
        }
        
        res.render('secret-valentines', {
            title: 'My Secret Valentine',
            username: req.session.username,
            isAdmin: req.session.isAdmin,
            isRevealed: isRevealed,
            valentine: valentine,
            gifts: valentineGifts
        });
    } catch (err) {
        console.error('Error getting secret valentine:', err);
        res.status(500).send('Error loading secret valentine');
    }
});

// ---- Admin trigger assignment (for testing) ---- //
router.post('/assign', checkAuth, async (req, res) => {
    try {
        // Check if user is admin
        if (!req.session.isAdmin) {
            return res.status(403).json({ success: false, message: 'Only admins can assign valentines' });
        }
        
        // Clear previous assignments
        await secretValentinesDB.clearAssignments();
        
        // Create new assignments
        const assignments = await secretValentinesDB.assignValentines();
        
        return res.json({ 
            success: true, 
            message: `Successfully assigned ${assignments.length} secret valentines`,
            count: assignments.length
        });
    } catch (err) {
        console.error('Error assigning valentines:', err);
        return res.status(500).json({ success: false, message: err.message || 'Server error' });
    }
});

module.exports = router;
