"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _path = _interopRequireDefault(require("path"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _gitClone = _interopRequireDefault(require("git-clone"));

var _clipboardy = _interopRequireDefault(require("clipboardy"));

var _utils = require("./utils");

/**
 * Clones a new project from a starter:
 * - cloning it from GitHub as default behaviour
 * - or downloading a ZIP from any url
 */
var _default =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2.default)(function* (argv) {
    const projectName = argv._[1];
    const starter = argv.template;

    const projectCwd = _path.default.join(process.cwd(), projectName);

    const repoUrl = `https://github.com/${starter}.git`;

    if (_fsExtra.default.existsSync(projectCwd)) {
      throw new Error(`Project "${projectName}" already exists`);
    }

    console.log(`[forrest] cloning "${repoUrl}" to "${projectCwd}"...`);
    yield new Promise((resolve, reject) => {
      (0, _gitClone.default)(repoUrl, projectCwd, err => {
        if (err) {
          const error = new Error(`Failed to clone "${repoUrl}" - ${err.message}`);
          error.originalError = err;
          reject(error);
        } else {
          resolve();
        }
      });
    });
    console.log(`[forrest] Installing dependencies...`);

    try {
      yield (yield (0, _utils.hasYarn)()) ? (0, _utils.spawn)('yarn', {
        log: console.log,
        cwd: projectCwd
      }) : (0, _utils.spawn)('npm install --loglevel verbose', {
        log: console.log,
        cwd: projectCwd
      });
    } catch (err) {
      const error = new Error(`Failed to install dependencies "${repoUrl}" - ${err.message}`);
      error.originalError = err;
      throw error;
    }

    console.log(`[forrest] Cleaning up...`);

    try {
      const repoPath = _path.default.join(projectCwd, '.git');

      if (_fsExtra.default.existsSync(repoPath)) {
        _fsExtra.default.remove(repoPath);
      }

      yield (0, _utils.exec)('git init', {
        log: console.log,
        cwd: projectCwd
      });
    } catch (err) {
      const error = new Error(`Failed to cleanup project "${repoUrl}" - ${err.message}`);
      error.originalError = err;
      throw error;
    }

    _clipboardy.default.writeSync(`cd ./${projectName} && npm start`);

    console.log(`[forrest] Your project is ready to use!`);
    console.log(`[forrest]     `);
    console.log(`[forrest]     cd ./${projectName} && npm start`);
    console.log(`[forrest]     `);
    console.log(`[forrest] (it's in your clipboard :-)`);
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.default = _default;