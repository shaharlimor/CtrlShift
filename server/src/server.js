require("dotenv").config();
const express = require("express");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerDefinition = require("./swagger");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const hostname = "localhost";
const port = process.env.PORT || 3001;
const app = express(bodyParser.urlencoded({ extended: false }));
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

const options = {
  swaggerDefinition,
  apis: ["./routes/*.js"], // Path to your API routes
};

const swaggerSpec = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use("/auth", require("./routes/auth"));
app.use("/notifications", require("./routes/notifications"));
app.use("/constraints", require("./routes/constraints"));
app.use("/monthlyShifts", require("./routes/monthlyShifts"));
app.use("/permanentShifts", require("./routes/permanentShifts"));
app.use("/schedule", require("./routes/schedule"));
app.use("/user", require("./routes/user"));
app.use("/roleTypes", require("./routes/roleTypes"));
app.use("/swapRequests", require("./routes/swapRequests"));

app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

const mongoDB =
  "mongodb+srv://guest_user:Aa123456@cluster0.emt0ekc.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "CtrlShift",
  })
  .then(() => {
    console.log("mongo connection open");
  })
  .catch((err) => {
    console.log("error connecting to mongo: " + err);
  });
