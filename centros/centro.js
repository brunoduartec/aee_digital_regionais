const requiredParam = require("../helpers/required-param");

const { InvalidPropertyError } = require("../helpers/errors");

module.exports = function makeCentro(centroInfo = requiredParam("centroInfo")) {
  validate(centroInfo);
  const normalCentro = normalize(centroInfo);
  return Object.freeze(normalCentro);

  function validate({
    NOME_CENTRO = requiredParam("NOME_CENTRO"),
    NOME_CURTO = requiredParam("NOME_CURTO"),
    CEP,
    CNPJ_CENTRO,
    ENDERECO,
    _id,
  } = {}) {
    validateName("NOME_CENTRO", NOME_CENTRO);
    validateName("NOME_CURTO", NOME_CURTO);
    validateName("CEP", CEP);
    validateName("CNPJ_CENTRO", CNPJ_CENTRO);
    validateName("ENDERECO", ENDERECO);

    return {
      NOME_CENTRO,
      NOME_CURTO,
      CEP,
      CNPJ_CENTRO,
      ENDERECO,
    };
  }

  function validateName(label, name) {
    if (name.length < 2) {
      throw new InvalidPropertyError(
        `O nome ${label} tem que ter mais de 2 caracteres`
      );
    }
  }

  function normalizeText(text) {
    if (text) {
      return text.replace("'", "´");
    } else {
      return "";
    }
  }

  function normalizeDate(date) {
    let charToSplit = "/";
    // if (typeof date == "object") {
    //   date = date.toISOString();
    // }

    if (
      date.match(/^([0-9]*-[0-9]*-[0-9]*T[0-9]*:[0-9]*:[0-9]*.[0-9]*Z)$/) ||
      date.match(/^([0-9]{4}-[0-9]{2}-[0-9]{2})$/)
    ) {
      charToSplit = "-";
      let dateSplited = date.split("T")[0];
      dateSplited = dateSplited.split(charToSplit);

      return `${dateSplited[0]}-${dateSplited[1]}-${dateSplited[2]}`;
    } else {
      if (date.split("-").length > 0) {
        charToSplit = "-";
      } else {
        charToSplit = "/";
      }
      let dateSplited = date.split(charToSplit);

      return `${dateSplited[2]}-${dateSplited[1]}-${dateSplited[0]}`;
    }
  }

  //metodo usado para caso queiramos deixa alguma coisa tudo minusculo por exemplo
  function normalize({
    NOME_CENTRO,
    NOME_CURTO,
    CNPJ_CENTRO,
    DATA_FUNDACAO,
    REGIONAL,
    ENDERECO,
    NUMERO_ENDERECO,
    COMPLEMENTO,
    CEP,
    BAIRRO,
    CIDADE,
    ESTADO,
    PAIS,
    PRESIDENTE_ID,
    ASSISTIDOS,
    VOLUNTARIOS,
    PRELETORES,
    ENTREVISTADORES,
    FUNCIONAMENTO,
    _id,
  }) {
    // DATA_FUNDACAO = normalizeDate(DATA_FUNDACAO);
    NOME_CENTRO = normalizeText(NOME_CENTRO);
    BAIRRO = normalizeText(BAIRRO);
    CIDADE = normalizeText(CIDADE);
    ESTADO = normalizeText(ESTADO);
    PAIS = normalizeText(PAIS);

    if (REGIONAL && REGIONAL.NOME_REGIONAL) {
      REGIONAL = {
        NOME_REGIONAL: REGIONAL ? REGIONAL.NOME_REGIONAL : "",
        PAIS: REGIONAL ? REGIONAL.PAIS : "",
      };
    } else {
      REGIONAL = REGIONAL;
    }
    return {
      NOME_CENTRO,
      NOME_CURTO,
      CNPJ_CENTRO,
      DATA_FUNDACAO,
      REGIONAL,
      ENDERECO,
      NUMERO_ENDERECO,
      COMPLEMENTO,
      CEP,
      BAIRRO,
      CIDADE,
      ESTADO,
      PAIS,
      PRESIDENTE_ID,
      FUNCIONAMENTO,
      ASSISTIDOS,
      VOLUNTARIOS,
      PRELETORES,
      ENTREVISTADORES,
      ID: _id,
    };
  }
};
