const express = require('express');
const router = express.Router();

const VKAPi = require('./vkAPi');
const VKAuth = require('./handlers/vkAuth');

class Router {
  constructor(config) {
    this.config = config;
  }

  initRouting() {
    const vkApi = new VKAPi(this.config.vk);
    const vkAuth = new VKAuth(this.config.vk, vkApi);

    router.get('/vkAuth', vkAuth.handle.bind(vkAuth));

    return router
  }
}

module.exports = Router;