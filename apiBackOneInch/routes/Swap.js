const express = require("express");
const axios = require("axios");
const { getSwap } = require("../utils/helpers/oneInch.helpers");

const router = express.Router();

const asyncMiddleware = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.get(
  "/mainnet/",
  asyncMiddleware(async (req, res, next) => {
    await axios(getSwap(req.query.src, req.query.dst, req.query.amount, 1))
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
    res.send("HISwap");
  })
);
module.exports = router;
