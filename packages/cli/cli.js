"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.create = void 0;

var _yargs = _interopRequireDefault(require("yargs"));

var _cmdNew = _interopRequireDefault(require("./cmd-new"));

var _cmdRun = _interopRequireDefault(require("./cmd-run"));

const create = () => _yargs.default.usage('Usage: $0 <command> [options]').command({
  command: 'new',
  desc: 'Create a new project based on a starter',
  builder: yargs => yargs.default('template', 'forrestjs/starter-universal').demandCommand(1, 'please pass down the project name'),
  handler: _cmdNew.default
}).command({
  command: 'run',
  desc: 'Runs a local project or creates it based on a starter',
  builder: yargs => yargs.alias('t', 'template').alias('p', 'port').default('template', 'forrestjs/starter-universal'),
  handler: _cmdRun.default
}).demandCommand(1, `Pass --help to see all available commands and options.`).fail((msg, err, yargs) => {
  const message = msg || err.message;
  console.error(`[forrest] ${message}`);
}).argv;

exports.create = create;