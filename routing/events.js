const cookieParser = require('cookie-parser');
const utils = require('../utils');

const AnonymousUser = {first_name: 'Anonymous', photo_50: 'https://pp.userapi.com/c852120/v852120674/166bd/m9ygsN5kBfo.jpg'};

class Events {
  constructor(io, db, vkConfig) {
    this.io = io;
    this.db = db;
    this.vkConfig = vkConfig;
  }

  initEvents(socket) {
    const cookies = socket.request.headers.cookie;

    // При socket коннекте декодируем и пишем в сокет объект авторизации, взятый из cookie. Cookie устанавливаются при авторизации VK
    socket.user = AnonymousUser;
    if (cookies) {
      const parsedCookies = utils.parseCookies(cookies);
      if (parsedCookies.user)
        socket.user = cookieParser.JSONCookie(cookieParser.signedCookie(parsedCookies.user, this.vkConfig.clientSecret));
    }

    console.log('User connected', socket.user);

    socket.on('message', this.sendMessage.bind(this, socket));
    socket.on('messagesHistory', this.sendMessagesHistory.bind(this, socket));
    socket.on('disconnect', this.disconnect.bind(this, socket));

    this.io.emit('users', this._getConnectedUsers());
  }

  disconnect(socket) {
    console.log('User disconnected', socket.user);
    this.io.emit('users', this._getConnectedUsers())
  }

  async sendMessagesHistory(socket, chat) {
    if (!socket.user.id && chat)
      return;

    const chatId = chat?
        socket.user.id <= chat.id?
          `${socket.user.id}_${chat.id}`
          : `${chat.id}_${socket.user.id}`
        : null;

    const messages = await this.db.messages.getAll(chatId);
    socket.emit('messagesHistory', messages);
  }

  async sendMessage(socket, data, cb) {
    try {
      if (!data.text)
        return;

      if(!socket.user.id)
        return socket.error({error: 'Авторизуйтесь, чтобы начать общаться'});

      if (data.chat && !data.chat.id)
        return socket.error({error: 'Адресат не авторизован!'});

      const chatId = data.chat?
        socket.user.id <= data.chat.id?
          `${socket.user.id}_${data.chat.id}`
          : `${data.chat.id}_${socket.user.id}`
        : null;

      const message = {
        user: socket.user,
        text: data.text,
        date: new Date(),
        chatId
      };

      await this.db.messages.add(message);
      this.io.emit('message', message);
    } catch (e) {
      console.error("Can't send message: ", e);
      socket.error({error: "Can't send message"});
    }
  }

  _getConnectedUsers() {
    const users = [];
    for (let key in this.io.sockets.connected) {
      if (this.io.sockets.connected[key].user.id) {
        if (users.findIndex(user => user.id === this.io.sockets.connected[key].user.id) === -1)
          users.push(this.io.sockets.connected[key].user);
      } else {
        users.push(this.io.sockets.connected[key].user);
      }
    }

    return users;
  }
}

module.exports = Events;