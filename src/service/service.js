'use strict';

const fs = require(`fs`);

const FILE_DIR = `logs`;
const FILE_NAME = `./logs/api.log`;

try {
  if (!fs.existsSync(FILE_NAME)) {
    fs.mkdirSync(FILE_DIR);
    fs.writeFileSync(FILE_NAME, `w`);
  }
} catch (err) {
  console.error(`Can't create file`);
}

const {Cli} = require(`./cli`);
const {
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  ExitCode
} = require(`../constants`);

const userArguments = process.argv.slice(USER_ARGV_INDEX);
const [userCommand] = userArguments;

if (userArguments.length === 0 || !Cli[userCommand]) {
  Cli[DEFAULT_COMMAND].run();
  process.exit(ExitCode.success);
}

Cli[userCommand].run(userArguments.slice(1));

