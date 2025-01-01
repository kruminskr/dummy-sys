const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2').Strategy;
const dotenv = require('dotenv');

dotenv.config();

var state;

const oauth2Options = {
  authorizationURL: `${process.env.SWEDBANK_API_URL}/psd2/authorize`,
  tokenURL: `${process.env.SWEDBANK_API_URL}/psd2/token`,
  clientID: process.env.SWEDBANK_CLIENT_ID,
  clientSecret: process.env.SWEDBANK_CLIENT_SECRET,
  callbackURL: process.env.SWEDBANK_CALLBACK_URL,
  scope: process.env.SWEDBANK_API_SCOPE,
};

const verifyCallback = (accessToken, refreshToken, profile, done) => {
  const bic = state.bic
  const user = { accessToken, profile, refreshToken, bic };
  return done(null, user);
};

const strategy = new OAuth2Strategy(oauth2Options, verifyCallback);

strategy.authorizationParams = (req) => {
  state = JSON.parse(req.state)
  const bic = state.bic

  return {
    bic,
    scope: process.env.SWEDBANK_API_SCOPE, 
  };
};

strategy.tokenParams = (req) => {
  const bic = state.bic

  return {
    bic,
  };
};

passport.use(strategy);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

module.exports = passport;