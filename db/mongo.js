const MongoClient = require('mongodb').MongoClient;

const Messages = require('./models/messages');

class Db {
  constructor(dbConfig) {
    this.dbConfig = dbConfig;
  }

  async connect() {
    return new Promise((res, rej) => {
      const url = `mongodb://${this.dbConfig.user}:${this.dbConfig.password}@${this.dbConfig.url}/${this.dbConfig.database}`;
      MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
        if (err)
          return rej(err);

        this.db = client.db(this.dbConfig.database);
        res();
      })
    })
  }

  initModels() {
    this.messages = new Messages(this.db);
  }
}

module.exports = Db;