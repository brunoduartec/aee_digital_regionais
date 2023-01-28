const makeRegional = require("./regional");
const { UniqueConstraintError } = require("../helpers/errors");

module.exports = function makeRegionalList({ database }) {
  return Object.freeze({
    add,
    findByItems,
    getItems,
    remove,
    replace,
    update,
  });


  async function add(regionalInfo) {
    let regional = makeRegional(regionalInfo);
    return await database.add("regional", regional);
  }

  async function findByItems({ max, searchParams }) {
    let regionals = await database.findByItems("regional", max, searchParams);

    return regionals;
  }
  async function getItems({ max }) {
    let regionals = await database.getItems("regional", max);

    return regionals;
  }
  async function remove(searchParams) {
    return await database.remove("regional", searchParams);
  }
  async function replace({ searchParams, regional }) {
    return await database.replace("regional", regional, searchParams);
  }
  async function update({ searchParams, regional }) {
    return await database.update("regional", regional, searchParams);
  }
};
