const express = require('express');
const session = require('express-session');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

const passport = require('./config/passport');

const appRoutes = require('./versions/app/routes/index');
// const callbackRoutes = require('./versions/callback/routes/index');

dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.APP_URL,
    credentials: true, 
}));
app.use(express.json()); 
app.use(morgan('dev'));

app.use(
    session({
        secret: process.env.SESSION_SECRET, 
        resave: false,
        saveUninitialized: false,
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/app', appRoutes);
// app.use('/api/callback', callbackRoutes);


module.exports = app;