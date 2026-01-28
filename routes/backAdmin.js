var express = require('express');
var router = express.Router();
const { userDB, giftDB, secretValentinesDB } = require('../database/db');

// Middleware to check if user is admin
const checkAdmin = (req, res, next) => {
    if (!req.session.userId || !req.session.isAdmin) {
        return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    next();
};

// ---- Get admin dashboard ---- //
router.get('/', checkAdmin, async (req, res) => {
    try {
        const users = await userDB.getAllUsersWithDetails();
        res.render('admin', {
            title: 'Admin Dashboard',
            username: req.session.username,
            isAdmin: true,
            users: users
        });
    } catch (err) {
        console.error('Error loading admin dashboard:', err);
        res.status(500).send('Error loading admin dashboard');
    }
});

// ---- Get user gifts for admin ---- //
router.get('/user-gifts/:userId', checkAdmin, async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await userDB.getUserById(userId);
        const gifts = await giftDB.getGiftsByUser(userId);
        
        return res.json({ 
            success: true, 
            user: user,
            gifts: gifts 
        });
    } catch (err) {
        console.error('Error getting user gifts:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ---- Get user valentine for admin ---- //
router.get('/user-valentine/:userId', checkAdmin, async (req, res) => {
    try {
        const { userId } = req.params;
        const assignment = await secretValentinesDB.getAssignedValentine(userId);
        
        if (assignment && assignment.to_user_id) {
            const valentine = await secretValentinesDB.getValentineInfo(assignment.to_user_id);
            return res.json({ 
                success: true, 
                valentine: valentine 
            });
        }
        
        return res.json({ success: true, valentine: null });
    } catch (err) {
        console.error('Error getting user valentine:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ---- Authenticate user ---- //
router.put('/authenticate/:userId', checkAdmin, async (req, res) => {
    try {
        const { userId } = req.params;
        const { isAuthenticated } = req.body;
        
        const user = await userDB.setIsAuthenticatedById(userId, isAuthenticated);
        
        if (user) {
            return res.json({ 
                success: true, 
                message: `User ${isAuthenticated ? 'authenticated' : 'unauthenticated'} successfully` 
            });
        }
        
        return res.status(400).json({ success: false, message: 'Failed to update authentication status' });
    } catch (err) {
        console.error('Error authenticating user:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ---- Toggle admin status ---- //
router.put('/toggle-admin/:userId', checkAdmin, async (req, res) => {
    try {
        const { userId } = req.params;
        const { isAdmin } = req.body;
        
        // Prevent user from removing their own admin status
        if (userId === req.session.userId && !isAdmin) {
            return res.status(400).json({ success: false, message: 'Cannot remove your own admin status' });
        }
        
        const user = await userDB.setIsAdminById(userId, isAdmin);
        
        if (user) {
            return res.json({ 
                success: true, 
                message: `User ${isAdmin ? 'promoted to' : 'removed from'} admin successfully` 
            });
        }
        
        return res.status(400).json({ success: false, message: 'Failed to update admin status' });
    } catch (err) {
        console.error('Error toggling admin:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ---- Delete user ---- //
router.delete('/delete-user/:userId', checkAdmin, async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Prevent user from deleting themselves
        if (userId === req.session.userId) {
            return res.status(400).json({ success: false, message: 'Cannot delete yourself' });
        }
        
        const user = await userDB.deleteUserById(userId);
        
        if (user) {
            return res.json({ success: true, message: 'User deleted successfully' });
        }
        
        return res.status(400).json({ success: false, message: 'Failed to delete user' });
    } catch (err) {
        console.error('Error deleting user:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ---- Assign valentines (admin trigger) ---- //
router.post('/assign-valentines', checkAdmin, async (req, res) => {
    try {
        await secretValentinesDB.clearAssignments();
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
