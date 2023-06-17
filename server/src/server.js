require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger_output.json");
const swaggerDefinition = require("./swagger");

const hostname = "localhost";
const port = process.env.PORT || 3001;
const app = express();
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors(corsOptions));

// const options = {
//   swaggerDefinition,
//   apis: ["./routes/*.js"], // Path to your API routes
// };

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "My API",
      version: "1.0.0",
      description: "Description of my API",
    },
  },
  apis: ["./server.js", "./src/routes/*.js"], // Path to your route files
};

const specs = swaggerJsdoc(options);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);

app.use("/auth", require("./routes/auth"));
app.use("/notifications", require("./routes/notifications"));
app.use("/constraints", require("./routes/constraints"));
app.use("/monthlyShifts", require("./routes/monthlyShifts"));
app.use("/permanentShifts", require("./routes/permanentShifts"));
app.use("/schedule", require("./routes/schedule"));
app.use("/user", require("./routes/user"));
app.use("/roleTypes", require("./routes/roleTypes"));
app.use("/swapRequests", require("./routes/swapRequests"));
app.use("/insertData", require("./routes/data"));

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
    console.log("MongoDB connection open");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB: " + err);
  });
