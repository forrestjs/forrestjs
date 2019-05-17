#!/usr/bin/env node
// Check if update is available
"use strict";

const pkg = require('../package.json');

const updateNotifier = require('update-notifier');

updateNotifier({
  pkg
}).notify(); // Check on Node version

const version = process.version;
const verDigit = Number(version.match(/\d+/)[0]);

if (verDigit < 6) {
  report.panic([`Forrest 1.0+ requires node.js v6 or higher (you have ${version}).`, `Upgrade node to the latest stable release.`].join(' \n'));
} // Handle global exceptions


process.on(`unhandledRejection`, error => {
  // This will exit the process in newer Node anyway so lets be consistent
  // across versions and crash
  console.error(`UNHANDLED REJECTION`, error);
  process.exit(1);
});
process.on(`uncaughtException`, error => {
  console.error(`UNHANDLED EXCEPTION`, error);
  process.exit(1);
}); // Start the CLI tool

require('./cli').create(process.argv);