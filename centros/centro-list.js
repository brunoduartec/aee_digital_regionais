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
      searchParams.IS_ACTIVE = searchParams.IS_ACTIVE || "true"
      let centros = await database.findByItems("centro", max, searchParams, fieldParams);

      return centros;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async function getItems({ max, fieldParams }) {
    try {
      let searchParams = {
        IS_ACTIVE:"true"
      }
      let centros = await database.findByItems("centro", max, searchParams, fieldParams);
      // let centros = await database.getItems("centro", max, fieldParams);
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
