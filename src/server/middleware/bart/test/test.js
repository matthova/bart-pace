/* global describe, it */
const should = require(`should`);
const request = require(`request-promise`);

module.exports = function bartTests() {
  describe('Bart unit test', async function () {
    it('should test something better than this', async function (done) {
      should(1).equal(1);
      done();
    });
  });
};
