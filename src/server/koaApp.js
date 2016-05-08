const Koa = require(`koa`);
const co = require(`co`);
const cors = require(`koa-cors`);
const convert = require(`koa-convert`);
const bodyparser = require(`koa-bodyparser`);
const json = require(`koa-json`);
const serve = require(`koa-static`);
const views = require(`koa-views`);
const winston = require(`winston`);
const IO = require(`koa-socket`);
const path = require(`path`);
// const Sequelize = require(`sequelize`);
const router = require(`koa-router`)();

const Bart = require(`./middleware/bart`);

class KoaApp {
  constructor(config) {
    this.app = new Koa();
    this.app.context.config = config;
    this.apiVersion = config.apiVersion;
  }

  async initialize() {
    // Setup logger
    const filename = path.join(__dirname, `../../${this.app.context.config.logFileName}`);
    this.app.context.logger = new (winston.Logger)({
      level: `debug`,
      transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename }),
      ],
    });

    // Add middleware
    this.app.use(convert(cors()));
    this.app.use(convert(bodyparser()));
    this.app.use(convert(json()));
    this.app.use(convert(serve(path.join(__dirname, `../client`))));

    // set jade render path
    this.app.use(convert(views(path.join(__dirname, `../client`), {
      root: path.join(__dirname, `../client`),
      default: 'ejs',
    })));

    // set ctx function for rendering jade
    this.app.use(async (ctx, next) => {
      ctx.render = co.wrap(ctx.render);
      await next();
    });

    // attach socket middleware
    const io = new IO();
    io.attach(this.app);

    const bart = new Bart(this.app);
    await bart.initialize();

    router.get('*', async (ctx) => {
      await ctx.render(`index`);
    });

    this.app.use(router.routes(), router.allowedMethods());

    this.app.context.logger.info(`App has been initialized successfully.`);

    this.app.on(`error`, (err, ctx) => {
      this.app.context.logger.error(`server error`, err, ctx);
    });
  }
}

module.exports = KoaApp;
