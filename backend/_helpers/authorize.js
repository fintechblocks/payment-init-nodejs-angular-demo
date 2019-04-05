const jose = require('node-jose');
const fs = require('fs');
/*sdk*/
const jwt = require('jsonwebtoken');
const PRIVATE_KEY = process.env.PRIVATE_KEY || fs.readFileSync('./test/private_key.txt');
const API_URL = process.env.API_URL;
var paymentInitClientId = process.env.CLIENT_ID || 'ftb-demo-app@payment-init';
var paymentInitScope = 'payments';
var tokenEndpointUri = API_URL + '/auth/realms/ftb-sandbox/protocol/openid-connect/token';
var authEndpointUri = API_URL + '/auth/realms/ftb-sandbox/protocol/openid-connect/auth';
const paymentInitRedirectUri = process.env.REDIRECT_URL;
const privateKey = process.env.PRIVATE_KEY || fs.readFileSync('./test/private_key.txt');
const OpenBankingAuth = require('./sdk/OpenBankingAuth').OpenBankingAuth;
const utils = require('./sdk/utils');
var paymentInitAuth;
var exchangeToken;

initDemoapp(privateKey).catch(function (error) {
  console.log('Generate key ID error: ', error);
});

module.exports = {
  authorize,
  getAuthorizationUrl,
  postAuthorizationCallback,
  getCreatedAuthorizationTokens,
  createJWSSignatureHeader
};

async function initDemoapp(privateKey) {
  const keyID = await generateKeyId(privateKey);
  paymentInitAuth = new OpenBankingAuth(paymentInitClientId, privateKey, keyID, paymentInitRedirectUri, tokenEndpointUri, authEndpointUri, paymentInitScope);
}

async function generateKeyId(privateKey) {
  var keystore = jose.JWK.createKeyStore();
  return await keystore.add(privateKey, 'pem');
}

async function authorize() {
  return await paymentInitAuth.getAccessToken();
}

async function getAuthorizationUrl(req, res) {
  const consentId = req.query.ConsentId;
  const authUrl = await paymentInitAuth.generateAuthorizationUrl(consentId, consentId, '')
  res.json(authUrl);
}

async function postAuthorizationCallback(req, res) {
  const params = req.body;
  exchangeToken = await paymentInitAuth.exchangeToken(params.code);
  res.json({
    "ConsentId": params.state
  });
}

async function getCreatedAuthorizationTokens() {
  return exchangeToken;
}

async function createJWSSignatureHeader(body) {
  return await paymentInitAuth.createSignatureHeader(body);
}