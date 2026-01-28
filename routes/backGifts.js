var express = require('express');
var router = express.Router();
const { giftDB } = require('../database/db');

// Middleware to check if user is authenticated
const checkAuth = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    next();
};

// ---- Get gifts page ---- //
router.get('/', checkAuth, async (req, res) => {
    try {
        const gifts = await giftDB.getGiftsByUser(req.session.userId);
        res.render('gifts', {
            title: 'My Gifts',
            gifts: gifts,
            username: req.session.username,
            isAdmin: req.session.isAdmin
        });
    } catch (err) {
        console.error('Error getting gifts:', err);
        res.status(500).send('Error loading gifts');
    }
});

// ---- Add gift ---- //
router.post('/add', checkAuth, async (req, res) => {
    try {
        const { description, price } = req.body;
        
        // Get current gift count
        const giftCount = await giftDB.getGiftCount(req.session.userId);
        
        if (giftCount >= 5) {
            return res.status(400).json({ success: false, message: 'You can only have up to 5 gifts' });
        }
        
        const priceNum = parseFloat(price);
        
        // Validate price based on gift order
        const nextOrder = giftCount + 1;
        const validPrices = {
            1: 5,
            2: 10,
            3: 15
        };
        
        if (nextOrder <= 3) {
            if (priceNum !== validPrices[nextOrder]) {
                return res.status(400).json({ 
                    success: false, 
                    message: `Gift ${nextOrder} must be exactly $${validPrices[nextOrder]}` 
                });
            }
        } else {
            if (priceNum <= 0) {
                return res.status(400).json({ success: false, message: 'Price must be greater than 0' });
            }
        }
        
        const gift = await giftDB.addGift(
            req.session.userId,
            description,
            priceNum,
            nextOrder
        );
        
        if (gift) {
            return res.json({ success: true, message: 'Gift added successfully', gift: gift });
        }
        
        return res.status(400).json({ success: false, message: 'Failed to add gift' });
    } catch (err) {
        console.error('Error adding gift:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ---- Update gift ---- //
router.put('/edit/:id', checkAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { description, price } = req.body;
        
        const priceNum = parseFloat(price);
        
        if (priceNum <= 0) {
            return res.status(400).json({ success: false, message: 'Price must be greater than 0' });
        }
        
        const gift = await giftDB.updateGift(id, description, priceNum);
        
        if (gift) {
            return res.json({ success: true, message: 'Gift updated successfully', gift: gift });
        }
        
        return res.status(400).json({ success: false, message: 'Failed to update gift' });
    } catch (err) {
        console.error('Error updating gift:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ---- Delete gift ---- //
router.delete('/delete/:id', checkAuth, async (req, res) => {
    try {
        const { id } = req.params;
        
        const gift = await giftDB.deleteGift(id);
        
        if (gift) {
            return res.json({ success: true, message: 'Gift deleted successfully' });
        }
        
        return res.status(400).json({ success: false, message: 'Failed to delete gift' });
    } catch (err) {
        console.error('Error deleting gift:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
