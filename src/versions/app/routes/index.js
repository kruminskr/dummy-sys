const express = require('express');

const passport = require('../../../config/passport')

const tokenMiddleware = require('../../../middlewares/token.middleware');

const router = express.Router();

const AuthController = require('../services/controllers/auth.controller');
const ConsentController = require('../services/controllers/consent.controller');
const AccountController = require('../services/controllers/account.controller');

//auth
router.get('/auth', passport.authenticate('oauth2'));
// external
router.get('/auth/callback',  passport.authenticate('oauth2'), AuthController.handleAuthCallback);

//consent
router.post('/consent/create',tokenMiddleware, ConsentController.createConsent);
// external
router.get('/consent/callback', ConsentController.handleConsentCallback);

//account
router.get('/accounts', tokenMiddleware, AccountController.getAccounts);
router.get('/accounts/:accountId', tokenMiddleware, AccountController.getAccount);
router.get('/accounts/:accountId/balance', tokenMiddleware, AccountController.getAccountBalance);
router.post('/accounts/:accountId/transactions', tokenMiddleware, AccountController.getAccountTransactions);

module.exports = router;