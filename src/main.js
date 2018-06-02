import Vue from 'vue'
import App from './App.vue'
import routes from './routes'
import Router from 'vue-router'

Vue.use(Router)
new Vue({
  el: '#app',
  render: h => h(App),
  router: new Router(routes)
})