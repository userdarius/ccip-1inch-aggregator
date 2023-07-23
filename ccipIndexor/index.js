const {
  listenTokenRouter,
} = require("./utils/helpers/ethers.helper/event.helper");

require("dotenv").config();

async function main() {
  listenTokenRouter();
}

main();
