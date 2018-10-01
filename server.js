const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const io = require('socket.io');
const cookieParser = require('cookie-parser');

const Routing = require('./routing/routes');
const Db = require('./db/mongo');
const Events = require('./routing/events');

class Server {
  constructor() {
    this.app = express();

    this.init();
  }

  async init() {
    this.initEnv();
    this.initConfig();
    this.initRouting();
    await this.initDb();
    this.createServer();
    this.initSockets();
  }

  initEnv() {
    process.env.NODE_ENV = process.env.NODE_ENV? process.env.NODE_ENV : 'dev';
    console.log('Init env:', process.env.NODE_ENV);
  }

  initConfig() {
    try {
      this.config = require(`./config_${process.env.NODE_ENV}.json`)
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  }

  initRouting() {
    const routing = new Routing(this.config);

    this.app.use(cookieParser(this.config.vk.clientSecret));
    this.app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });

    this.app.use(routing.initRouting())
  }

  async initDb() {
    try {
      this.db = new Db(this.config.db);
      await this.db.connect();
      this.db.initModels();

      console.log("Db connected");
    } catch (e) {
      console.error(`Can't connect to db: ${e}`);
      process.exit(1);
    }
  }

  initSockets() {
    this.io = io(this.server);
    const events = new Events(this.io, this.db, this.config.vk);
    this.io.on('connection', events.initEvents.bind(events));
  }

  createServer() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({extended: false}));
    this.app.use(express.static(__dirname + this.config.frontendBundles));

    const host =  process.env.HOST || this.config.server.host || "localhost";
    const port = process.env.PORT || this.config.server.port || 8040;

    this.server = http.createServer(this.app);

    this.server.listen(port, host, () => {
      console.log(`Start listening on ${host}:${port}`)
    });
  }
}

module.exports = new Server();