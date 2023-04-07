const makeDb = require("../db");
const makeCentroList = require("./centro-list");
const makeCentroEndpointHandler = require("./centro-endpoint");

let ModelFactory = require("../db/modelFactory");
const database = makeDb(ModelFactory);

const centroList = makeCentroList({
  database,
});

const contactsEndpointHandler = makeCentroEndpointHandler({
  centroList
});

module.exports = contactsEndpointHandler;
