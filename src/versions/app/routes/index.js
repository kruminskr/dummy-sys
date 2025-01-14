const express = require('express');

const passport = require('../../../config/passport')
const tokenMiddleware = require('../../../middlewares/token.middleware');

const router = express.Router();

const AuthController = require('../services/controllers/auth.controller');
const ConsentController = require('../services/controllers/consent.controller');
const AccountController = require('../services/controllers/account.controller');

//auth
router.post('/auth/methods', AuthController.getAuthMethods)
router.get('/auth/redirect', AuthController.redirectAuth);
router.post('/auth/decoupled/start', AuthController.initiateDecoupledAuth);
router.post('/auth/decoupled/status', AuthController.decoupledAuthStatus);
router.get('/auth/token', tokenMiddleware, AuthController.getRefreshToken);
// external auth
router.get('/auth/callback',  passport.authenticate('oauth2'), AuthController.handleAuthCallback);

//consent
router.post('/consent/redirect', tokenMiddleware, ConsentController.redirectConsent);
router.post('/consent/decoupled', tokenMiddleware, ConsentController.decoupledConsent);
router.post('/consent/decoupled/sca/start', tokenMiddleware, ConsentController.startSCA);
router.post('/consent/decoupled/sca/status', tokenMiddleware, ConsentController.checkScaStatus);
// external consent
router.get('/consent/callback', ConsentController.handleConsentCallback);
router.get('/consent/callback/fail', ConsentController.handleConsentCallbackFail);

//account
router.get('/accounts', tokenMiddleware, AccountController.getAccounts);
router.get('/accounts/:accountId', tokenMiddleware, AccountController.getAccount);
router.get('/accounts/:accountId/balance', tokenMiddleware, AccountController.getAccountBalance);
router.post('/accounts/:accountId/transactions', tokenMiddleware, AccountController.getAccountTransactions);

module.exports = router;