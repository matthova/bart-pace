/* global describe, it */
'use strict';

/*******************************************************************************
 * The is framework for allowing each piece of middleware to run its own tests
 * Each middleware will place their tests in the following location:
 * src/server/middleware/<your middleware>/test/test.js
 ******************************************************************************/

const path = require(`path`);
const walk = require(`fs-walk`);
const winston = require('winston');

const tests = [];
const config = require(`./dist/server/config`);

// Setup test logger
const filename = path.join(__dirname, `./${config.testLogFileName}`);
const logger = new (winston.Logger)({
  level: 'debug',
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({ filename }),
  ],
});
logger.info(`Test initialized.`);

// Collect the test file from each middleware module
walk.walkSync('./dist/server', (basedir, file) => {
  if (file === 'test.js') {
    const filepath = path.join(__dirname, `${basedir}/${file}`);
    tests.push(require(filepath));
  }
});

// Run each middleware test
describe('Server Tests', function middlewareTest() {
  // Set a custom timeout, if necessary
  // this.timeout(1000);
  for (let i = 0; i < tests.length; i++) {
    try {
      tests[i]();
    } catch (ex) {
      logger.error(ex);
    }
  }
});
