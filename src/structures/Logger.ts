import * as chalk from "chalk";

export function log(data: string, type = "log") {
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
  }
}

export function customLog(prefixColor: string, prefix: string, data: string) {
  prefixColor.replace("#", "") && prefixColor.replace("0x", "");

  console.log(`${chalk.hex(prefixColor)(`${prefix.toLowerCase()}`)} ${data}`);
}
