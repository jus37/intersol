const COLLECTION = 'MESSAGES';

class Messages {
  constructor(db) {
    this.db = db;
    this.collection = this.db.collection(COLLECTION);
  }

  async add(data) {
    return this.collection.insertOne(data)
  }

  async getAll(chatId) {
    return this.collection.find({chatId}).toArray()
  }
}

module.exports = Messages;