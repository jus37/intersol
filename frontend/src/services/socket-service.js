import io from 'socket.io-client';
const SOCKET_URL = '';

const socket = {
  install(Vue, store, router) {
    const socket = io(SOCKET_URL);
    Vue.prototype.$socket = socket;

    socket.on('users', data => {
      store.commit('setUsers', data)
    });

    socket.on('messagesHistory', data => {
      store.commit('setMessages', data);
    });

    socket.on('message', data => {
      store.commit('pushMessage', data);
    });

    socket.on('error', data => {
      Vue.prototype.$Notice.warning({
        title: 'Ошибка',
        desc: data.error
      });
    })
  }
};

export default socket;