const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Express API for JSONPlaceholder',
    version: '1.0.0',
    description:
      'This is a REST API application made with Express. It retrieves data from JSONPlaceholder.',
  },
  servers: [
    {
      url: process.env.URL,
      description: 'Long Development server',
    },
  ],

};
const options = {
  swaggerDefinition,
  apis: ['./src/utils/*.js', './src/router/*.js'],
  explorer: true,

};
const swaggerSpec = swaggerJSDoc(options);

function swaggerDocs(app) {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get('/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  })
}

module.exports = swaggerDocs;