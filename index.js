const http = require("http");

const api = require("./api")();
const logger = require("./helpers/logger");


const env = process.env.NODE_ENV ? process.env.NODE_ENV : "local";
logger.info("ENVIRONMENT: "+ env)


const config = require("./env.json")[env];

const port = process.env.PORT || config.port;

let server_http = http.Server(api);
server_http.listen(port, "0.0.0.0", function () {
  logger.info("API is running on port: " + port);
});
