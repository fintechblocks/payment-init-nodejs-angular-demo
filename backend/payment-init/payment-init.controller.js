const express = require('express');
const router = express.Router();
const paymentInit = require('./payment-init.service');
const authorizeJs = require('../_helpers/authorize');

// routes
router.post('/open-banking/v1.1/payments', createSingleImmediatePayment);
router.get('/authorization-url', getAuthorizationUrl);
router.post('/authorization-callback', createPaymentSubmission);
router.get('/open-banking/v1.1/payments/*', getSingleImmediatePayment);
router.get('/open-banking/v1.1/payment-submissions/*', getPaymentSubmission);


module.exports = router;

function createSingleImmediatePayment(req, res, next) {
  paymentInit.createPayment(req, res)
        .catch(err => next(err));
}

function getAuthorizationUrl(req, res, next) {
  authorizeJs.getAuthorizationUrl(req, res)
      .catch(err => next(err));
}

function createPaymentSubmission(req, res, next) {
  authorizeJs.createPaymentSubmission(req, res)
      .catch(err => next(err));
}

function getSingleImmediatePayment(req, res, next) {
  paymentInit.getPayment(req, res)
      .catch(err => next(err));
}

function getPaymentSubmission(req, res, next) {
  paymentInit.getSubmission(req, res)
      .catch(err => next(err));
}