require("dotenv").config();

const baseURL = "https://api.1inch.dev/swap/v5.2/";

var config = {};
config.baseURL = baseURL;

const getQuote = (src, dst, amount, id) => {
  var method = "get";
  var url = `${id}/quote/`;

  var headers = {
    Accept: "application/json",
    Authorization: "Bearer Yv6vSSh7Wse4USkeNYVEHLFA13Hcz5hl",
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

const getSwap = (src, dst, amount, id) => {
  var method = "get";
  var url = `${id}/swap/`;

  var headers = {
    Accept: "application/json",
    Authorization: "Bearer Yv6vSSh7Wse4USkeNYVEHLFA13Hcz5hl",
  };
  var params = {
    src: src,
    dst: dst,
    amount: amount,
    from: "0x01738387092E007CcB8B5a73Fac2a9BA23cf91d3",
    slippage: 1,
    disableEstimate: true,
    allowPartialFill: true,
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
  getSwap,
};
