const chalk = require("chalk")

module.exports = function log(data, type = "log") {
  switch (type) {
    case "log":
      console.log(`${data}`);
      break;
    case "warn":
      console.warn(`${chalk.hex("#EC9513")("⚠")} ${data}`);
      break;
    case "error":
      console.error(`${chalk.hex("#ce3b3b")("✘")} ${data}`);
      break;
    case "success":
      console.log(`${chalk.hex("#3bceac")("✓")} ${data}`);
      break;
    case "wait":
      console.log(`${chalk.hex("#866BAE")("⦿")} ${data}`);
      break;
    case "sub":
      console.log(`${chalk.hex("#3b9bce")("○")} ${data}`)
  }
}