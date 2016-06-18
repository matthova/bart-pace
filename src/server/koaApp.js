const Koa = require(`koa`);
const cors = require(`koa-cors`);
const convert = require(`koa-convert`);
const bodyparser = require(`koa-bodyparser`);
const json = require(`koa-json`);
const serve = require(`koa-static`);
const winston = require(`winston`);
const IO = require(`koa-socket`);
const path = require(`path`);
const router = require(`koa-router`)();

const React = require(`react`);
const renderToString = require(`react-dom/server`).renderToString;
const match = require(`react-router`).match;
const RouterContext = require(`react-router`).RouterContext;

const Bart = require(`./middleware/bart`);

// NOTE THIS FILE IS COPIED IN BY GULP FROM CLIENT/JS
const routes = require(`./react/routes`);


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

    // attach socket middleware
    const io = new IO();
    io.attach(this.app);

    const bart = new Bart(this.app);
    await bart.initialize();

    // Set up Koa to match any routes to the React App. If a route exists, render it.
    router.get('*', (ctx) => {
      match({ routes, location: ctx.req.url }, (err, redirect, props) => {
        if (err) {
          ctx.status = 500;
          ctx.body = err.message;
        } else if (redirect) {
          ctx.redirect(redirect.pathname + redirect.search);
        } else if (props) {
          const appHtml = renderToString(<RouterContext {...props}/>);
          ctx.body = this.renderPage(appHtml);
        } else {
          ctx.redirect('/bots');
        }
      });
    });

    this.app.use(router.routes(), router.allowedMethods());
    this.app.context.logger.info(`App has been initialized successfully.`);

    this.app.on(`error`, (err, ctx) => {
      this.app.context.logger.error(`server error`, err, ctx);
    });
  }

  renderPage(appHtml) {
    return `
      <!doctype html public="storage">
      <html>
      <meta charset=utf-8/>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Hydra-Print</title>
      <link rel=stylesheet href=/styles.css>
      <div id=app>${appHtml}</div>
      <script src="/vendorJs/socket.io.js"></script>
      <script src="/bundle.js"></script>
     `;
  }
}

module.exports = KoaApp;
