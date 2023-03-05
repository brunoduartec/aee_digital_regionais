const Cache = require("../helpers/cache");
const cache = new Cache();
const logger = require("../helpers/logger");


module.exports = function makeDb(ModelFactory) {
  return Object.freeze({
    add,
    findByItems,
    getItems,
    remove,
    replace,
    update,
  });

  function getParamsParsed(params) {
    let paramsParsed = "";

    let keys = Object.keys(params);

    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];
      const value = params[key];

      if (value) {
        paramsParsed = paramsParsed.concat(
          `&${key}=${decodeURIComponent(value)}`
        );
      }
    }

    logger.info("getParamsParsed", paramsParsed.substring(1));

    return paramsParsed.substring(1);
  }

  function formatParams(searchParams) {
    let items = Object.keys(searchParams);
    let values = Object.values(searchParams);

    searchParams = {};
    for (let index = 0; index < items.length; index++) {
      let item = items[index];
      const value = values[index];
      if (item == "ID" || item == "id") {
        item = "_id";
      }

      if (item.toLocaleLowerCase().includes("_id")) {
        searchParams[item] = value;
      } else {
        searchParams[item] = { $regex: value };
      }
    }

    return searchParams;
  }

  function formatFieldParams(fieldParams){
    const params = fieldParams.split(",")
    let paramsParsed = {}

    for (let index = 0; index < params.length; index++) {
      const element = params[index];
      paramsParsed[element] = 1
    }

    return paramsParsed
  }

  function populateItems(populateInfo) {
    let populateConcatTrimed;
    if (populateInfo && populateInfo.length > 0) {
      let populateConcat = "";

      for (let index = 0; index < populateInfo.length; index++) {
        const element = populateInfo[index];
        populateConcat = populateConcat.concat(` ${element}`);
      }

      populateConcatTrimed = populateConcat.trim();
    }
    return populateConcatTrimed;
  }

  async function add(modelName, itemInfo) {
    try {
      const Model = ModelFactory.getModel(modelName).model;
      item = new Model(itemInfo);

      await cache.remove(`${modelName}*`)

      return await item.save();
    } catch (error) {
      throw error;
    }
  }
  async function findByItems(modelName, max, params, fieldParams) {
    try {
      logger.info("findByItems=>", {params});

      let paramsParsed = getParamsParsed(params);
      let cachedItem

      if(fieldParams){
        cachedItem = await cache.get(`${modelName}:${paramsParsed}:${fieldParams}`);
        if(cachedItem)return JSON.parse(cachedItem)
      }else{
        cachedItem = await cache.get(`${modelName}:${paramsParsed}`);
        if (cachedItem){
          let  cacheParsed = JSON.parse(cachedItem);
          if(fieldParams){
            let fieldParamsParsed = formatFieldParams(fieldParams)
            cacheParsed = cacheParsed.map((m)=>{
              const item = {}
  
              fieldParamsParsed.forEach(field => {
                item[field] = m[field]
              });
              return item
            })

            cache.set(`${modelName}:${paramsParsed}:${fieldParams}`, cacheParsed);
            return cacheParsed

          }else{
            return cacheParsed
          }
        }
      }

      const modelInfo = ModelFactory.getModel(modelName);
      const Model = modelInfo.model;
      const populate = modelInfo.populate;

      let items = Object.keys(params);
      let values = Object.values(params);

      let populateTags = populateItems(populate);

      let item

      if(fieldParams){
        let fieldParamsParsed = formatFieldParams(fieldParams)
        item = await Model.find({}).populate(populateTags).select(fieldParamsParsed).lean();
      }else{
        item = await Model.find({}).populate(populateTags).lean();
      }


      item = item.filter((m) => {
        let validate = true;

        for (let index = 0; index < items.length; index++) {
          const it = items[index];

          let paramsSplited = it.split(".");

          itemToSearch = m[paramsSplited[0]];

          if (paramsSplited.length > 1) {
            itemToSearch = itemToSearch[paramsSplited[1]];
          }

          validate = validate && itemToSearch?.toString() === values[index];
        }

        return validate;
      });

      if(fieldParams){
        cache.set(`${modelName}:${paramsParsed}:${fieldParams}`, item);
      }
      else{
        cache.set(`${modelName}:${paramsParsed}`, item);
      }

      return item;
    } catch (error) {
      throw error;
    }
  }
  async function getItems(modelName, max, fieldParams) {
    try {
      const modelInfo = ModelFactory.getModel(modelName);

      let cachedItem;

      if(fieldParams){
        cachedItem = await cache.get(`${modelName}:${fieldParams}`);
        if(cachedItem)return JSON.parse(cachedItem)
      }else{
        cachedItem = await cache.get(`${modelName}`);
        if (cachedItem){
          let  cacheParsed = JSON.parse(cachedItem);
          if(fieldParams){
            let fieldParamsParsed = formatFieldParams(fieldParams)
            cacheParsed = cacheParsed.map((m)=>{
              const item = {}
  
              fieldParamsParsed.forEach(field => {
                item[field] = m[field]
              });
              return item
            })

            cache.set(`${modelName}:${fieldParams}`, cacheParsed);
            return cacheParsed

          }else{
            return cacheParsed
          }
        }
      }

      const Model = modelInfo.model;
      const populate = modelInfo.populate;

      
      let populateTags = populateItems(populate);
      let items 
      
      if(fieldParams){
        let fieldParamsParsed = formatFieldParams(fieldParams)
        items = await Model.find().populate(populateTags).select(fieldParamsParsed);
      }
      else{
        items = await Model.find().populate(populateTags);
      }
      
      if (items && items.length > 0) {
        cache.set(`${modelName}`, items);
        return items;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  }
  async function remove(modelName, conditions) {
    try {
      const ModelInfo = ModelFactory.getModel(modelName);
      const Model = ModelInfo.model;
      conditions = formatParams(conditions);

      await cache.remove(`${modelName}*`)

      const result = await Model.deleteOne(conditions);
      return result;
    } catch (error) {
      throw error;
    }
  }
  async function replace(modelName, item, conditions) {
    try {
      const ModelInfo = ModelFactory.getModel(modelName);
      const Model = ModelInfo.model;
      conditions = formatParams(conditions);

      await cache.remove(`${modelName}*`)
      const result = await Model.replaceOne(conditions, item);
      return result;
    } catch (error) {
      throw error;
    }
  }
  async function update(modelName, item, conditions) {
    try {
      const ModelInfo = ModelFactory.getModel(modelName);
      const Model = ModelInfo.model;
      conditions = formatParams(conditions);

      await cache.remove(`${modelName}*`)
      const result = await Model.updateOne(conditions, item);

      if(result.acknowledged)
        if(result.modifiedCount>0){
          return {modified: result.modifiedCount};
        }
        else{
          return {
            "message" : "No item modified"
          }
        }

        else{
          return {"message": "Query parameter not found"}
        }
    } catch (error) {
      throw error;
    }
  }
};
