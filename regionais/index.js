const makeDb = require("../db");
const makeRegionalList = require("./regional-list");
const makeRegionalEndpointHandler = require("./regional-endpoint");

let ModelFactory = require("../db/modelFactory");
const database = makeDb(ModelFactory);

const regionalList = makeRegionalList({
  database,
});
const contactsEndpointHandler = makeRegionalEndpointHandler({
  regionalList,
});

module.exports = contactsEndpointHandler;
