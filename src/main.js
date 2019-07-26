import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import BinAdmin from './plugin'
import './assets/styles/index.styl'
// mock
import './mock'

Vue.use(BinAdmin)

new Vue({
  router,
  store,
  render: h => h(App),
  mounted () {
    // 展示系统信息
    // 用户登录后从数据库加载一系列的设置
    this.$store.dispatch('loadApp')
  }
}).$mount('#app')
