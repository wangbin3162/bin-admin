import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 按需加载element-ui
import './core/lazy_lib/components_use'
// bin-ui
import BinUI from 'bin-ui'
import 'bin-ui/lib/styles/index.css'
// mock
import './mock'
// bin-ui引用
Vue.use(BinUI)
// 全局通信
Vue.prototype.$EventBus = new Vue()

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
