const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');


const env = process.env.NODE_ENV ? process.env.NODE_ENV : "development";
const config = require('../env.json')[env]

swaggerDocument.host = `${config.host}:${config.port}`

module.exports = (app) => {
    app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
}