const request = require(`request-promise`);
const XML = require(`pixl-xml`);

/**
 * A Bart class.
 * Responsible for providing socket events for the front end
 */
class Bart {
  /**
   * @param {Object} app - The parent Koa app.
   * @param {string} routeEndpoint - The relative endpoint.
   */
  constructor(app) {
    app.context.bart = this; // External app reference variable

    this.app = app;
    this.logger = app.context.logger;
    this.currentTime = this.getTime();
  }

  /**
   * initialize the Bart endpoint
   */
  async initialize() {
    try {
      this.heartbeat();
      this.logger.info(`Bart backend initialized`);
    } catch (ex) {
      this.logger.error(`Bart backend initialization error`, ex);
    }
  }

  getTime() {
    return new Date();
  }

  heartbeat() {
    setInterval(async () => {
      const res = await request(`http://api.bart.gov/api/etd.aspx?cmd=etd&orig=DBRK&key=MW9S-E7SL-26DU-VV8V`);
      const times = XML.parse(res);
      const stations = [];
      times.station.etd.forEach((etd) => {
        if (etd.estimate.length > 0 && etd.estimate[0] !== undefined) {
          stations.push(etd.estimate[0]);
        }
      });
      console.log('stations', stations);
      this.app.io.emit('update', stations);
    }, 5000);
  }
}

module.exports = Bart;
