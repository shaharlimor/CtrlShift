const swaggerAutogen = require("swagger-autogen")();

const swaggerDefinition = {
  openapi: "3.1.0",
  info: {
    title: "My API",
    version: "1.0.0",
    description: "Description of my API",
  },
  schemes: ["http"],
  host: "localhost:3001",
  basePath: "/api",
  servers: [
    {
      url: "http://localhost:3001",
      description: "Development server",
    },
  ],
};

const outputFile = "./src/swagger_output.json";
const endpointsFiles = ["./src/routes/*.js", "./src/server.js"];
const swaggerFile = "./swagger.yaml";

swaggerAutogen(outputFile, endpointsFiles, swaggerFile);

module.exports = swaggerDefinition;
