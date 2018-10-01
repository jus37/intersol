import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    privateChat: null,
    messages: [],
    users: []
  },
  mutations: {
    setMessages(state, data) {
      state.messages = data;
    },
    pushMessage(state, data) {
      state.messages.push(data);
    },
    setPrivateChat(state, data) {
      state.privateChat = data;
    },
    setUsers(state, data) {
      state.users = data;
    }
  }
})