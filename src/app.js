const express = require('express');
const session = require('express-session');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

const axios = require('axios'); 

const passport = require('./config/passport');

const appRoutes = require('./versions/app/routes/index');

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

axios.interceptors.request.use((config) => {
    console.log(`OUTGOING ${config.method} ${config.url}`);
    return config; 
  });

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/app', appRoutes);

module.exports = app;