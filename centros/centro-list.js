const makeCentro = require("./centro");

module.exports = function makeCentroList({ database }) {
  return Object.freeze({
    add,
    findByItems,
    getItems,
    remove,
    replace,
    update,
  });



  async function add(centroInfo, logger) {
    try {
      let centro = makeCentro(centroInfo);
      return await database.add("centro", centro);
    } catch (error) {
      logger.error("centros:centro-list:add", error);
      throw error;
    }
  }
  async function findByItems({ max, searchParams, fieldParams }, logger) {
    try {
      let centros = await database.findByItems("centro", max, searchParams, fieldParams, logger);

      return centros;
    } catch (error) {
      logger.error("centros:centro-list:findByItems",error);
      throw error;
    }
  }
  async function getItems({ max, fieldParams }, logger) {
    try {
      let centros = await database.getItems("centro", max, fieldParams, logger);
      return centros;
    } catch (error) {
      logger.error("centros:centro-list:getItems",error);
      throw error;
    }
  }
  async function remove(searchParams, logger) {
    try {
      return await database.remove("centro", searchParams, logger);
    } catch (error) {
      logger.error("centros:centro-list:remove",error);
      throw error;
    }
  }
  async function replace({ searchParams, centro }, logger) {
    try {
      return await database.replace("centro", centro, searchParams, logger);
    } catch (error) {
      logger.error("centros:centro-list:replace",error);
      throw error;
    }
  }
  async function update({ searchParams, centro }, logger) {
    try {
      return await database.update("centro", centro, searchParams, logger);
    } catch (error) {
      logger.error("centros:centro-list:update",error);
      throw error;
    }
  }
};
