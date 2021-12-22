const requiredParam = require("../helpers/required-param");

const { InvalidPropertyError } = require("../helpers/errors");

module.exports = function makeRegional(
  regionalInfo = requiredParam("regionalInfo")
) {
  validate(regionalInfo);
  const normalRegional = normalize(regionalInfo);
  return Object.freeze(normalRegional);

  function validate({
    NOME_REGIONAL = requiredParam("NOME_REGIONAL"),
    PAIS,
    COORDENADOR_ID,
    _id,
  } = {}) {
    validateName("NOME_REGIONAL", NOME_REGIONAL);
    validateName("PAIS", PAIS);

    return {
      NOME_REGIONAL,
      PAIS,
      COORDENADOR_ID
    };
  }

  function validateName(label, name) {
    if (name.length < 2) {
      throw new InvalidPropertyError(
        `O nome ${nome} tem que ter mais de 2 caracteres`
      );
    }
  }

  //metodo usado para caso queiramos deixa alguma coisa tudo minusculo por exemplo
  function normalize({ NOME_REGIONAL, PAIS, COORDENADOR_ID, _id }) {
    let ID = _id;
    return {
      NOME_REGIONAL,
      PAIS,
      COORDENADOR_ID,
      ID,
    };
  }
};
