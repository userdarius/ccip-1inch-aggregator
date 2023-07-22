const express = require("express");
const axios = require("axios");
const { getQuote } = require("../utils/helpers/oneInch.helpers");

const router = express.Router();

const asyncMiddleware = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.get(
  "/optimism/",
  asyncMiddleware(async (req, res, next) => {
    await axios(getQuote(req.query.src, req.query.dst, req.query.amount, 10))
      .then(function (response) {
        res.send(response.data);
      })
      .catch(function (error) {
        console.log(error);
        res.send(error.response.data);
      });
  })
);

router.get(
  "/avalanche/",
  asyncMiddleware(async (req, res, next) => {
    await axios(getQuote(req.query.src, req.query.dst, req.query.amount, 43114))
      .then(function (response) {
        res.send(response.data);
      })
      .catch(function (error) {
        console.log(error);
        res.send(error.response.data);
      });
  })
);

router.get(
  "/polygon/",
  asyncMiddleware(async (req, res, next) => {
    await axios(getQuote(req.query.src, req.query.dst, req.query.amount, 137))
      .then(function (response) {
        res.send(response.data);
      })
      .catch(function (error) {
        console.log(error);
        res.send(error.response.data);
      });
  })
);

router.get(
  "/mainnet/",
  asyncMiddleware(async (req, res, next) => {
    await axios(getQuote(req.query.src, req.query.dst, req.query.amount, 1))
      .then(function (response) {
        res.send(response.data);
      })
      .catch(function (error) {
        console.log(error);
        res.send(error.response.data);
      });
  })
);

router.get(
  "/bnbChain/",
  asyncMiddleware(async (req, res, next) => {
    await axios(getQuote(req.query.src, req.query.dst, req.query.amount, 56))
      .then(function (response) {
        res.send(response.data);
      })
      .catch(function (error) {
        console.log(error);
        res.send(error.response.data);
      });
  })
);

router.get(
  "/hello/",
  asyncMiddleware(async (req, res, next) => {
    res.send("HI");
  })
);

module.exports = router;
