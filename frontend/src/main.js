import Vue from 'vue'
import App from './App.vue'
import store from './store'
import socket from './services/socket-service'
import './plugins/iview.js'

Vue.config.productionTip = false;

Vue.use(socket, store);

new Vue({
  store,
  render: h => h(App)
}).$mount('#app');
