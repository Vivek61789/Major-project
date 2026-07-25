const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");


// let db = 'mongodb://127.0.0.1:27017/GANESH-TICKETS-DB';
let db = 'mongodb+srv://ganesh:Vana9989@cluster0.goicckf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';


const port = 5050;
const fs = require("fs");
const https = require("https");

mongoose.connect(db, (err) => {
  console.log("Connecting to mongodb");
  if (err) {
    console.log("Error!" + err);
  } else {
    console.log("Connected to mongodb");
  }
});

//cronController.run()
const loggerName = "[Server]: ";
app.use(bodyParser.urlencoded({ extended: true, limit: "100mb" }));
app.use(bodyParser.json({ limit: "100mb" }));
const corsOptions = {
  optionsSuccessStatus: 200,
  methods: "GET,POST,PUT",
};
app.use(cors(corsOptions));
app.disable("x-powered-by");

app.on("uncaughtException", function (err) {
  logger.error(loggerName, "UNCAUGHT EXCEPTION: " + err);
});

app.on("error", function (err) {
  logger.error(loggerName, "ERROR: " + err);
});

app.get("/", (req, res) => {
  res.status(200).send({ message: "Hello World from Node.JS" });
});

//Set Headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", true);
  return next();
});

let routes = require("./api/routes");
routes(app);

app.listen(port);
//.info("server started at port :3000");
console.log("server started at port :" + port);
