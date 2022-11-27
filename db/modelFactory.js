class modelFactory {
  static insertModel(name, Model) {
    modelFactory.models[name] = Model;
  }
  static getModel(name) {
    return modelFactory.models[name];
  }
}

modelFactory.models = {};

module.exports = modelFactory;
