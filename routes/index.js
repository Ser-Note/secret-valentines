var express = require('express');
var router = express.Router();

// Home Route

router.get('/', function(req, res, next)  {
    // If user is already logged in, redirect to gifts page
    if (req.session.userId) {
        return res.redirect('/gifts');
    }
    
    res.render('index', 
        { 
            title: 'Sign In',
        });
});

module.exports = router;