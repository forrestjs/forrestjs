"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _path = _interopRequireDefault(require("path"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _cmdNew = _interopRequireDefault(require("./cmd-new"));

var _utils = require("./utils");

var _default =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2.default)(function* (argv) {
    const projectCwd = argv._[1] ? _path.default.join(process.cwd(), argv._[1]) : process.cwd(); // ensure package.json exists in cwd
    // this is if the CLI is invoked without a project name:
    // $> forrest run 

    const packagePath = _path.default.join(projectCwd, 'package.json');

    if (!argv._[1] && !_fsExtra.default.existsSync(packagePath)) {
      throw new Error('package.json not found\n          is this a Forrest project?');
    } // optionally create the project


    if (!_fsExtra.default.existsSync(projectCwd)) {
      try {
        yield (0, _cmdNew.default)(argv);
      } catch (err) {
        throw err;
      }
    } // ensure package.json exists in cwd
    // this works for both a named project or inside a project folder


    if (!_fsExtra.default.existsSync(packagePath)) {
      throw new Error('package.json not found\n          is this a Forrest project?');
    } // create a custom environment to run the app


    const env = Object.assign({}, process.env);

    if (argv.port) {
      env.REACT_APP_PORT = argv.port;
    } // run production or development (default)


    if (argv.d) {
      const cmd = (yield (0, _utils.hasYarn)()) ? 'yarn start' : 'npm run start';
      (0, _utils.spawn)(cmd, {
        log: console.log,
        cwd: projectCwd,
        env
      });
    } else {
      const cmd = (yield (0, _utils.hasYarn)()) ? 'yarn start' : 'npm run start';
      (0, _utils.spawn)(cmd, {
        log: console.log,
        cwd: projectCwd,
        env
      });
    }
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.default = _default;