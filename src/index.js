require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT;

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));
app.use(bodyParser.json());

const Router = require("./router/index");
Router(app);

const dbConnection = require("./config/Database");
dbConnection;

app.listen(PORT, () => {
  console.log(`Server listening ${PORT}`);
});
