
// ---- require modules ---- //

require('dotenv').config();
const express= require('express');
const path = require('path');
const axios = require('axios');
const session = require('express-session');
const supabase = require('./config/supabase');
const SupabaseSessionStore = require('./config/supabaseSessionStore');

// ---- Initialize Routes ---- //

const indexRouter = require('./routes/index');
const loginRouter = require('./routes/backLogin.js');
const registerRouter = require('./routes/backRegister.js');
const giftsRouter = require('./routes/backGifts.js');
const secretValentinesRouter = require('./routes/backSecretValentines.js');
const profileRouter = require('./routes/backProfile.js');
const adminRouter = require('./routes/backAdmin.js');

// ---- Initialize express ---- //

const app = express();

// ---- Session Setup ---- //
app.set('trust proxy', 1);

app.use(session({
    store: new SupabaseSessionStore({
        supabase,
        tableName: 'sessions',
        ttl: 24 * 60 * 60 * 1000
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
         } 
}));

// ---- View Engine Setup ---- //

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// ---- Body Parsing ---- //

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ---- Serve Static Files ---- //

app.use(express.static(path.join(__dirname, 'public')));

// ---- Routes ---- //

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/gifts', giftsRouter);
app.use('/secret-valentines', secretValentinesRouter);
app.use('/profile', profileRouter);
app.use('/admin', adminRouter);

// Logout route
app.get('/logout', (req, res) => {
    if (!req.session) {
        return res.redirect('/');
    }

    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Error logging out');
        }
        res.clearCookie('connect.sid');
        return res.redirect('/');
    });
});

// ---- Start Server ---- //

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
})


