import '@babel/polyfill'
import Vue from 'vue'
import App from './App.vue'
import Router from 'vue-router'
import router from './router'
import store from './store'
import BinAdmin from './plugin'
import './icons'
import './assets/styles/index.styl'
// mock
import './mock'

Vue.use(BinAdmin)

const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}
new Vue({
  router,
  store,
  render: h => h(App),
  mounted() {
    // 展示系统信息
    // 用户登录后从数据库加载一系列的设置
    this.$store.dispatch('loadApp')
  }
}).$mount('#app')
