const mongoose = require("mongoose");
const { Schema } = mongoose;

const regionalSchema = new Schema({
  NOME_REGIONAL: {
    type: String,
    require: true,
  },
  ESTADO: {
    type: String,
    require: true,
  },
  PAIS: {
    type: String,
    require: true,
  },
  COORDENADOR_ID: {
    type: Schema.Types.ObjectId,
    require: false,
  },
});

module.exports = {
  model: mongoose.model("regional", regionalSchema),
};
