const swaggerAutogen = require('swagger-autogen')()

const swaggerDefinition = {
  openapi: "3.0.0",
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

const outputFile = './src/swagger_output.json';
const endpointsFiles = ['./src/routes/*.js'];

swaggerAutogen(outputFile, endpointsFiles)

module.exports = swaggerDefinition;
