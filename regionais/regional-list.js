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
  function formatOutput(items) {
    let regionals = [];

    if (items) {
      if (items.length > 0) {
        items.forEach((item) => {
          let regional = makeRegional(item);
          regionals.push(regional);
        });
      }
    }

    return regionals;
  }

  async function add(regionalInfo) {
    let regional = makeRegional(regionalInfo);
    return await database.add("regional", regional);
  }

  async function findByItems({ max, searchParams }) {
    let regional = await database.findByItems("regional", max, searchParams);
    const regionals = formatOutput(regional);

    return regionals;
  }
  async function getItems({ max }) {
    let items = await database.getItems("regional", max);

    const regionals = formatOutput(items);

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
