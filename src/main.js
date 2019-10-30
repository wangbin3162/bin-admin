import '@babel/polyfill'
import Vue from 'vue'
import App from './App.vue'
import Router from 'vue-router'
import router from './router'
import store from './store'
import BinAdmin from './plugin'
import './assets/styles/index.styl'

Vue.use(BinAdmin)

const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
