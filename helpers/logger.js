module.exports = class Logger {
  info(data) {
    console.log("[INFO]", data);
  }

  error(error) {
    console.log("[ERROR]", error);
  }
};
