const makeDb = require("../db");
const makeCentroList = require("./centro-list");
const makeRegionalList = require("../regionais/regional-list");

const makeCentroEndpointHandler = require("./centro-endpoint");

let ModelFactory = require("../db/modelFactory");
const database = makeDb(ModelFactory);

const centroList = makeCentroList({
  database,
});

const regionalList = makeRegionalList({
  database,
});

const contactsEndpointHandler = makeCentroEndpointHandler({
  centroList,
  regionalList,
});

module.exports = contactsEndpointHandler;
