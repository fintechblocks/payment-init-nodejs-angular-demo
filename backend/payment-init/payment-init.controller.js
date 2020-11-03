const express = require('express');
const router = express.Router();
const _paymentService = require('./payment.service');
const authorizeJs = require('../_helpers/authorize');

// routes
router.get('/authorization-url', getAuthorizationUrl);
router.post('/authorization-callback', postAuthorizationCallback);
router.post('/open-banking/v3.1/pisp/domestic-payment-consents', createDomesticPaymentConsent);
router.post('/open-banking/v3.1/pisp/domestic-payments', createDomesticPayment);
router.post('/open-banking/v3.1/pisp/domestic-scheduled-payments', createDomesticScheduledPayment);
router.post('/open-banking/v3.1/pisp/domestic-scheduled-payment-consents', createDomesticScheduledPaymentConsent);
router.post('/open-banking/v3.1/pisp/domestic-standing-order-consents', createDomesticStandingOrderConsent);
router.post('/open-banking/v3.1/pisp/domestic-standing-orders', createDomesticStandingOrder);
router.post('/open-banking/v3.1/pisp/batch-domestic-payment-consents', createBatchDomesticPaymentConsent);
router.post('/open-banking/v3.1/pisp/batch-domestic-payments', createBatchDomesticPayment);
router.post('/open-banking/v3.1/pisp/batch-international-payment-consents', createBatchInternationalPaymentConsent);
router.post('/open-banking/v3.1/pisp/batch-international-payments', createBatchInternationalPayment);
router.post('/open-banking/v3.1/pisp/international-payment-consents', createInternationalPaymentConsent);
router.post('/open-banking/v3.1/pisp/international-payments', createInternationalPayment);
router.post('/open-banking/v3.1/pisp/international-scheduled-payment-consents', createInternationalScheduledPaymentConsent);
router.post('/open-banking/v3.1/pisp/international-scheduled-payments', createInternationalScheduledPayment);
router.get('/open-banking/v3.1/pisp/domestic-payment-consents/*', getDomesticPaymentConsents);
router.get('/open-banking/v3.1/pisp/domestic-payments/*', getDomesticPayment);
router.get('/open-banking/v3.1/pisp/domestic-scheduled-payment-consents/*', getDomesticScheduledPaymentConsents);
router.get('/open-banking/v3.1/pisp/domestic-scheduled-payments/*', getDomesticScheduledPayment);
router.get('/open-banking/v3.1/pisp/domestic-standing-order-consents/*', getDomesticStandingOrderConsents);
router.get('/open-banking/v3.1/pisp/domestic-standing-orders/*', getDomesticStandingOrder);
router.get('/open-banking/v3.1/pisp/batch-domestic-payment-consents/*', getBatchDomesticPaymentConsents);
router.get('/open-banking/v3.1/pisp/batch-domestic-payments/*', getBatchDomesticPayments);
router.get('/open-banking/v3.1/pisp/international-payment-consents/*', getInternationalPaymentConsents);
router.get('/open-banking/v3.1/pisp/international-payments/*', getInternationalPayment);
router.get('/open-banking/v3.1/pisp/batch-international-payment-consents/*', getBatchInternationalPaymentConsents);
router.get('/open-banking/v3.1/pisp/batch-international-payments/*', getBatchInternationalPayments);
router.get('/open-banking/v3.1/pisp/international-scheduled-payment-consents/*', getInternationalScheduledPaymentConsents);
router.get('/open-banking/v3.1/pisp/international-scheduled-payments/*', getInternationalScheduledPayment);

module.exports = router;

function getAuthorizationUrl(req, res, next) {
  authorizeJs.getAuthorizationUrl(req, res)
    .catch(err => next(err));
}

function postAuthorizationCallback(req, res, next) {
  authorizeJs.postAuthorizationCallback(req, res)
    .catch(err => next(err));
}

function createDomesticPaymentConsent(req, res, next) {
  _paymentService.createPaymentConsent(req, res)
    .catch(err => next(err));
}

function createDomesticPayment(req, res, next) {
  _paymentService.createPayment(req, res)
    .catch(err => next(err));
}

function createDomesticScheduledPaymentConsent(req, res, next) {
  _paymentService.createPaymentConsent(req, res)
    .catch(err => next(err));
}

function createDomesticStandingOrderConsent(req, res, next) {
  _paymentService.createPaymentConsent(req, res)
    .catch(err => next(err));
}

function createDomesticScheduledPayment(req, res, next) {
  _paymentService.createPayment(req, res)
    .catch(err => next(err));
}

function createDomesticStandingOrder(req, res, next) {
  _paymentService.createPayment(req, res)
    .catch(err => next(err));
}

function createBatchDomesticPaymentConsent(req, res, next) {
  _paymentService.createPaymentConsent(req, res)
    .catch(err => next(err));
}

function createBatchDomesticPayment(req, res, next) {
  _paymentService.createPayment(req, res)
    .catch(err => next(err));
}

function createBatchInternationalPaymentConsent(req, res, next) {
  _paymentService.createPaymentConsent(req, res)
    .catch(err => next(err));
}

function createInternationalScheduledPaymentConsent(req, res, next) {
  _paymentService.createPaymentConsent(req, res)
    .catch(err => next(err));
}

function createBatchInternationalPayment(req, res, next) {
  _paymentService.createPayment(req, res)
    .catch(err => next(err));
}

function createInternationalScheduledPayment(req, res, next) {
  _paymentService.createPayment(req, res)
    .catch(err => next(err));
}

function createInternationalPaymentConsent(req, res, next) {
  _paymentService.createPaymentConsent(req, res)
    .catch(err => next(err));
}

function createInternationalPayment(req, res, next) {
  _paymentService.createPayment(req, res)
    .catch(err => next(err));
}

function getDomesticScheduledPaymentConsents(req, res, next) {
  _paymentService.getPaymentConsent(req, res)
    .catch(err => next(err));
}

function getDomesticStandingOrderConsents(req, res, next) {
  _paymentService.getPaymentConsent(req, res)
    .catch(err => next(err));
}

function getDomesticPaymentConsents(req, res, next) {
  if (req.url.includes('funds-confirmation')) {
    _paymentService.getFundConfirmation(req, res)
      .catch(err => next(err));
  } else {
    _paymentService.getPaymentConsent(req, res)
      .catch(err => next(err));
  }
}

function getInternationalPaymentConsents(req, res, next) {
  if (req.url.includes('funds-confirmation')) {
    _paymentService.getFundConfirmation(req, res)
      .catch(err => next(err));
  } else {
    _paymentService.getPaymentConsent(req, res)
      .catch(err => next(err));
  }
}

function getInternationalPayment(req, res, next) {
  _paymentService.getPayment(req, res)
    .catch(err => next(err));
}

function getDomesticPayment(req, res, next) {
  _paymentService.getPayment(req, res)
    .catch(err => next(err));
}

function getDomesticScheduledPayment(req, res, next) {
  _paymentService.getPayment(req, res)
    .catch(err => next(err));
}

function getDomesticStandingOrder(req, res, next) {
  _paymentService.getPayment(req, res)
    .catch(err => next(err));
}

function getBatchDomesticPaymentConsents(req, res, next) {
  _paymentService.getPaymentConsent(req, res)
    .catch(err => next(err));
}

function getBatchDomesticPayments(req, res, next) {
  _paymentService.getPayment(req, res)
    .catch(err => next(err));
}

function getBatchInternationalPaymentConsents(req, res, next) {
  _paymentService.getPaymentConsent(req, res)
    .catch(err => next(err));
}

function getBatchInternationalPayments(req, res, next) {
  _paymentService.getPayment(req, res)
    .catch(err => next(err));
}

function getInternationalScheduledPaymentConsents(req, res, next) {
    if (req.url.includes('funds-confirmation')) {
      _paymentService.getFundConfirmation(req, res)
        .catch(err => next(err));
    } else {
      _paymentService.getPaymentConsent(req, res)
        .catch(err => next(err));
    }
}

function getInternationalScheduledPayment(req, res, next) {
  _paymentService.getPayment(req, res)
    .catch(err => next(err));
}