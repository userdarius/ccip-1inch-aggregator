const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

const port = process.env.PORT || 6002;

const userRouterOneInch = require("./routes/OneInch");
const userRouterTwoInch = require("./routes/Swap");

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/quote", userRouterOneInch);
app.use("/swap", userRouterTwoInch);

app.listen(port);
