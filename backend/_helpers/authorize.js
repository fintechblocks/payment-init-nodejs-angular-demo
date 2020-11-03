const jose = require('node-jose');
const fs = require('fs');
/*sdk*/
const AUTH_SERVER_BASE_PATH = process.env.AUTH_SERVER_BASE_PATH;
const cert = process.env.HTTPS_CLIENT_CERT;
const key = process.env.HTTPS_CLIENT_KEY;

var paymentInitClientId = process.env.CLIENT_ID || 'ftb-demo-app@payment-init-1.0';
var paymentInitScope = 'payments';
var tokenEndpointUri = `${AUTH_SERVER_BASE_PATH}/protocol/openid-connect/token`;
var authEndpointUri = `${AUTH_SERVER_BASE_PATH}/protocol/openid-connect/auth`;
const paymentInitRedirectUri = process.env.REDIRECT_URL;
const OpenBankingAuth = require('./sdk/OpenBankingAuth').OpenBankingAuth;
var paymentInitAuth;
var exchangeToken;

const privateKey = process.env.PRIVATE_KEY || fs.readFileSync('./keys/private_key.txt');
const publicKey = process.env.PUBLIC_KEY || fs.readFileSync('./keys/public_key.txt');

initDemoapp(privateKey, publicKey).catch(function (error) {
  console.log('Initialization error: ', error);
});

module.exports = {
  authorize,
  getAuthorizationUrl,
  postAuthorizationCallback,
  getCreatedAuthorizationTokens,
  createJWSSignatureHeader
};

async function initDemoapp(privateKey, publicKey) {
  //console.log(`"${privateKey.substring(0, 50)}...\n...${privateKey.substr(privateKey.length - 50)}"`);
  const keyID = await generateKeyId(publicKey);
  console.log(`Generated key id: ${keyID}`);
  paymentInitAuth = new OpenBankingAuth(paymentInitClientId, privateKey, keyID, paymentInitRedirectUri, tokenEndpointUri, authEndpointUri, paymentInitScope, cert, key);
  await paymentInitAuth.createClient();
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