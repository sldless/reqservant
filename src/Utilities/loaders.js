const fs = require("fs");
const mongoClient = require("mongoose");
const { mongoose } = require("../config.json");
const chalk = require("chalk");

function loadCommands() {
  log(
    `Attempting to load ${chalk.bold(
      fs.readdirSync("./src/Commands").filter((file) => file.endsWith(".js"))
        .length
    )} commands`,
    "wait"
  );

  let cmds = 0;

  for (const file of fs
    .readdirSync("./src/Commands")
    .filter((file) => file.endsWith(".js"))) {
    const command = require(`../Commands/${file.slice(0, -3)}`);

    try {
      require(`../Commands/${file.slice(0, -3)}`);
      log(`${chalk.hex("#E2678A")(command.data.name)} loaded`, "sub");
      cmds++;
    } catch (e) {
      log(`${chalk.hex("#E2678A")(command.data.name)} failed\n\n${chalk.hex("#ce3b3b")(e)}\n`, "error");
      cmds--;
    }
  }

  if (cmds === 0) {
    log(chalk.hex("#ce3b3b")("No commands loaded"), "error");
  } else if (cmds === fs.readdirSync("./src/Commands").length) {
    log(chalk.hex("#3bceac")("All commands loaded"), "success");
  } else {
    log(
      `${chalk.hex("#ce3b3b")(cmds)}/${chalk.bold(
        fs.readdirSync("./src/Commands").length
      )} commands loaded`,
      "error"
    );
  }
}

function loadEvents() {
  log(
    `Attempting to load ${chalk.bold(
      fs.readdirSync("./src/Events").filter((file) => file.endsWith(".js"))
        .length
    )} events`,
    "wait"
  );

  let evnts = 0;

  for (const file of fs.readdirSync("./src/Events").filter((file) =>
    file.endsWith(".js")
  )) {
    const event = require(`../Events/${file.slice(0, -3)}`);

    if (event.once) {
      client.once(event.name, async (...args) =>
        event.run(...args)
      );
    } else {
      client.on(event.name, async (...args) =>
        event.run(...args)
      );
    }
    events.set(event.name, event);

    try {
      require(`../Events/${file.slice(0, -3)}`);
      log(`${chalk.hex("#E2678A")(event.name)} loaded`, "sub");
      evnts++;
    } catch (e) {
      log(`${chalk.hex("#E2678A")(event.name)} failed\n\n${chalk.hex("#ce3b3b")(e)}\n`, "error");
      evnts--;
    }
  }

  if (evnts === 0) {
    log(chalk.hex("#ce3b3b")("No events loaded"), "error");
  } else if (evnts === fs.readdirSync("./src/Events").length) {
    log(chalk.hex("#3bceac")("All events loaded"), "success");
  } else {
    log(
      `${chalk.hex("#ce3b3b")(cmds)}/${chalk.bold(
        fs.readdirSync("./src/Events").length
      )} events loaded`,
      "error"
    );
  }
}

async function loadDatabase() {
  try {
    await mongoClient.connect(mongoose);
    log(`Connected to MongoDB`, "success");
  } catch (e) {
    log(`Mongo Error\n\n${chalk.hex("#ce3b3b")(e)}\n`, "error");
  }
}

module.exports = { loadCommands, loadEvents, loadDatabase};
