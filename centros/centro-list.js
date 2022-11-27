const makeCentro = require("./centro");
const { UniqueConstraintError } = require("../helpers/errors");

module.exports = function makeCentroList({ database }) {
  return Object.freeze({
    add,
    findByItems,
    getItems,
    remove,
    replace,
    update,
  });

  function formatOutput(items) {
    let centros = [];

    if (items) {
      if (items.length > 0) {
        items.forEach((item) => {
          // let centro = makeCentro(item);
          let centro = item
          centros.push(centro);
        });
      }
    }

    return centros;
  }

  async function add(centroInfo) {
    try {
      let centro = makeCentro(centroInfo);
      return await database.add("centro", centro);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async function findByItems({ max, searchParams, fieldParams }) {
    try {
      let centro = await database.findByItems("centro", max, searchParams, fieldParams);

      const centros = formatOutput(centro);
      return centros;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async function getItems({ max, fieldParams }) {
    try {
      let items = await database.getItems("centro", max, fieldParams);
      const centros = formatOutput(items);
      return centros;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async function remove(searchParams) {
    try {
      return await database.remove("centro", searchParams);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async function replace({ searchParams, centro }) {
    try {
      return await database.replace("centro", centro, searchParams);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async function update({ searchParams, centro }) {
    try {
      return await database.update("centro", centro, searchParams);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
};
