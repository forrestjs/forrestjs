"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.hasYarn = exports.exec = exports.spawn = void 0;

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _child_process = require("child_process");

const spawn = (cmd, options = {}) => {
  return new Promise((resolve, reject) => {
    const tokens = cmd.split(' ');
    const log = options.log,
          otherOptions = (0, _objectWithoutPropertiesLoose2.default)(options, ["log"]);
    let lastErrorMsg = '';
    const process = (0, _child_process.spawn)(tokens.shift(), tokens, otherOptions);

    if (log) {
      process.stdout.on('data', data => {
        log(data.toString().trim());
      });
    }

    process.stderr.on('data', data => {
      lastErrorMsg = data.toString().trim();
    });
    process.on('close', code => {
      if (code === 0) {
        resolve(code);
      } else {
        const error = new Error(lastErrorMsg);
        error.spawnCode = code;
        reject(error);
      }
    });
    process.on('error', err => {
      reject(err);
    });
  });
};

exports.spawn = spawn;

const exec = (cmd, options = {}) => {
  return new Promise((resolve, reject) => {
    (0, _child_process.exec)(cmd, options, (err, stdout, stderr) => {
      if (err) {
        reject(new Error(err));
        return;
      }

      resolve(stdout.toString());
    });
  });
};

exports.exec = exec;

const hasYarn =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2.default)(function* () {
    try {
      yield exec('which yarn');
      return true;
    } catch (err) {
      return false;
    }
  });

  return function hasYarn() {
    return _ref.apply(this, arguments);
  };
}();

exports.hasYarn = hasYarn;