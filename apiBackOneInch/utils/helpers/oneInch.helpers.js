require("dotenv").config();

const baseURL = "https://api.1inch.dev/swap/v5.2/";

var config = {};
config.baseURL = baseURL;

const getQuote = (src, dst, amount, id) => {
  var method = "get";
  var url = `${id}/quote/`;

  var headers = {
    Accept: "application/json",
    Authorization: "Bearer lTHFv4CuD1Dspa9VoULCF46OcjHCWDNa",
  };
  var params = {
    src: src,
    dst: dst,
    amount: amount,
    includeTokensInfo: true,
    includeProtocols: true,
    includeGas: true,
  };

  config.method = method;
  config.url = url;
  config.headers = headers;
  config.data = null;
  config.params = params;

  return config;
};

module.exports = {
  getQuote,
};
