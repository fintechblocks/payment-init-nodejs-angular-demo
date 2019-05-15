const jose = require('node-jose');
const fs = require('fs');
/*sdk*/
const OIDC_SERVER_URL = process.env.OIDC_SERVER_URL;
const OIDC_REALM = process.env.OIDC_REALM;

var paymentInitClientId = process.env.CLIENT_ID || 'ftb-demo-app@payment-init';
var paymentInitScope = 'payments';
var tokenEndpointUri = `${OIDC_SERVER_URL}/auth/realms/${OIDC_REALM}/protocol/openid-connect/token`;
var authEndpointUri = `${OIDC_SERVER_URL}/auth/realms/${OIDC_REALM}/protocol/openid-connect/auth`;
const paymentInitRedirectUri = process.env.REDIRECT_URL;
const OpenBankingAuth = require('./sdk/OpenBankingAuth').OpenBankingAuth;
var paymentInitAuth;
var exchangeToken;

const privateKey = process.env.PRIVATE_KEY || fs.readFileSync('./keys/private_key.txt');
const publicKey = process.env.PUBLIC_KEY || fs.readFileSync('./keys/public_key.txt');

initDemoapp(privateKey, publicKey).catch(function (error) {
  console.log('Generate key ID error: ', error);
});

module.exports = {
  authorize,
  getAuthorizationUrl,
  postAuthorizationCallback,
  getCreatedAuthorizationTokens,
  createJWSSignatureHeader
};

async function initDemoapp(privateKey, publicKey) {
  const keyID = await generateKeyId(publicKey);
  paymentInitAuth = new OpenBankingAuth(paymentInitClientId, privateKey, keyID, paymentInitRedirectUri, tokenEndpointUri, authEndpointUri, paymentInitScope);
}

async function generateKeyId(publicKey) {
  const keystore = jose.JWK.createKeyStore();
  const generatedKeystoreKey = await keystore.add(publicKey, 'pem');
  return generatedKeystoreKey.kid;
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