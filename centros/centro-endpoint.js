const {
  UniqueConstraintError,
  InvalidPropertyError,
  RequiredParameterError,
} = require("../helpers/errors");
const makeHttpError = require("../helpers/http-error");
const makeCentro = require("./centro");

module.exports = function makeCentroEndpointHandler({ centroList }) {
  return async function handle(httpRequest, logger) {
    switch (httpRequest.method) {
      case "POST":
        return post(httpRequest, logger);
        break;
      case "GET":
        return get(httpRequest, logger);
        break;
      case "DELETE":
        return remove(httpRequest, logger);
        break;
      case "PUT":
        return update(httpRequest, logger);
        break;

      default:
        let errorMessage = `${httpRequest.method} method not allowed.`;
        return makeHttpError({
          statusCode: 405,
          errorMessage: errorMessage,
        });
        break;
    }
  };

  function formatSearchParam(id, params) {
    let searchParams;
    if (id) {
      searchParams = {
        id: id,
      };
    } else if (Object.keys(params).length > 0) {
      searchParams = params;
    }

    return searchParams;
  }

  async function get(httpRequest, logger) {
    const { id } = httpRequest.pathParams || {};
    const { max, ...params } = httpRequest.queryParams || {};

    let searchParams = formatSearchParam(id, params);

    let fieldParams = searchParams?.fields ?JSON.parse(JSON.stringify(searchParams.fields)):null;
    if(searchParams?.fields)
      delete searchParams.fields

    let hasParams =searchParams ? Object.keys(searchParams).length > 0 : false
    let result = [];

    if (hasParams) {
      result = await centroList.findByItems({
        max,
        searchParams,
        fieldParams
      }, logger);
    } else {
      result = await centroList.getItems({
        max,
        fieldParams
      }, logger);
    }

    return {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 200,
      data: JSON.stringify(result),
    };
  }

  async function post(httpRequest, logger) {
    let centroInfo = httpRequest.body;
    if (!centroInfo) {
      return makeHttpError({
        statusCode: 400,
        errorMessage: "Bad request. No POST body",
      });
    }

    if (typeof httpRequest.body == "string") {
      try {
        centroInfo = JSON.parse(centroInfo);
      } catch {
        return makeHttpError({
          statusCode: 400,
          errorMessage: "Bad request. POST body must be valid JSON.",
        });
      }
    }

    try {
      const itemAdded = await centroList.add(centroInfo, logger);
      const result = makeCentro(itemAdded);
      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 201,
        data: JSON.stringify(result),
      };
    } catch (e) {
      return makeHttpError({
        errorMessage: e.message,
        statusCode:
          e instanceof UniqueConstraintError
            ? 409
            : e instanceof InvalidPropertyError ||
              e instanceof RequiredParameterError
            ? 400
            : 500,
      });
    }
  }

  async function remove(httpRequest, logger) {
    const { id } = httpRequest.pathParams || {};
    const { max, ...params } = httpRequest.queryParams || {};

    let searchParams = formatSearchParam(id, params);

    const result = await centroList.remove(searchParams, logger);
    return {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 200,
      data: JSON.stringify(result),
    };
  }

  async function update(httpRequest, logger) {
    const { id } = httpRequest.pathParams || {};
    const { max, ...params } = httpRequest.queryParams || {};

    let searchParams = formatSearchParam(id, params);

    let centroInfo = httpRequest.body;
    if (!centroInfo) {
      return makeHttpError({
        statusCode: 400,
        errorMessage: "Bad request. No PUT body",
      });
    }

    if (typeof httpRequest.body == "string") {
      try {
        centroInfo = JSON.parse(centroInfo);
      } catch {
        return makeHttpError({
          statusCode: 400,
          errorMessage: "Bad request. PUT body must be valid JSON.",
        });
      }
    }

    try {
      centroInfo.centroId = id;
      const result = await centroList.update({
        searchParams: searchParams,
        centro: centroInfo,
      }, logger);
      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 200,
        data: JSON.stringify(result),
      };
    } catch (e) {
      return makeHttpError({
        errorMessage: e.message,
        statusCode:
          e instanceof UniqueConstraintError
            ? 409
            : e instanceof InvalidPropertyError ||
              e instanceof RequiredParameterError
            ? 400
            : 500,
      });
    }
  }
};
