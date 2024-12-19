const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2').Strategy;
const dotenv = require('dotenv');

dotenv.config();

const oauth2Options = {
  authorizationURL: `${process.env.SWEDBANK_API_URL}/psd2/authorize`,
  tokenURL: `${process.env.SWEDBANK_API_URL}/psd2/token`,
  clientID: process.env.SWEDBANK_CLIENT_ID,
  clientSecret: process.env.SWEDBANK_CLIENT_SECRET,
  callbackURL: process.env.SWEDBANK_CALLBACK_URL,
  scope: 'PSD2sandbox PSD2sandboxaccount_list',
};

const verifyCallback = (accessToken, refreshToken, profile, done) => {
  const user = { accessToken, profile };
  return done(null, user);
};

const strategy = new OAuth2Strategy(oauth2Options, verifyCallback);

strategy.authorizationParams = () => ({
    bic: process.env.SWEDBANK_BIC, 
    scope: 'PSD2sandbox PSD2sandboxaccount_list', 
});
strategy.tokenParams = () => ({
    bic: process.env.SWEDBANK_BIC, 
});

passport.use(strategy);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

module.exports = passport;