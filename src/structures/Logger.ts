import * as chalk from "chalk";
import * as dayjs from "dayjs";

const color = "#1a242c";

export function log(data: string, type = "log") {
  const timeFormat = `[ ${chalk
    .hex("#6DF3B9")
    .bold(dayjs().format("MM/DD/YY"))} ]`;

  switch (type) {
    case "log":
      console.log(`${timeFormat} ${data}`);
      break;
    case "warn":
      console.warn(
        `${timeFormat} ${chalk
          .bgHex("#EC9513")
          .hex(color)
          .bold(" WARN ")} ${data}`
      );
      break;
    case "error":
      console.error(
        `${timeFormat} ${chalk
          .bgHex("#ce3b3b")
          .hex(color)
          .bold(" ERROR ")} ${data}`
      );
      break;
    case "success":
      console.log(
        `${timeFormat} ${chalk
          .bgHex("#3bceac")
          .hex(color)
          .bold(" SUCCESS ")} ${data}`
      );
  }
}

export function customLog(
  prefixColor: string,
  prefix: string,
  data: string,
  time: boolean = true
) {
  const timeFormat = `[ ${chalk
    .hex("#6DF3B9")
    .bold(dayjs().format("MM/DD/YY"))} ]`;

  prefixColor.replace("#", "") && prefixColor.replace("0x", "");

  if (time) {
    console.log(
      `${timeFormat} ${chalk
        .bgHex(prefixColor)
        .hex(color)
        .bold(` ${prefix.toUpperCase()} `)} ${data}`
    );
  } else {
    console.log(
      `${chalk
        .bgHex(prefixColor)
        .hex(color)
        .bold(` ${prefix.toUpperCase()} `)} ${data}`
    );
  }
}
