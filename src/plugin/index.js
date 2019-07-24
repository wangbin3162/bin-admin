// 按需加载element-ui
import './lazy_lib/components_use'
// bin-ui
import BinUI from 'bin-ui'
import 'bin-ui/lib/styles/index.css'
// 本项目的全局自定义组件
// import BinContainer from '../components/bin-container' // 现已收录到bin-ui库

export default {
  async install (Vue, options) {
    // bin-ui引用
    Vue.use(BinUI)
    // 容器组件
    // Vue.component(BinContainer.name, BinContainer)
    // 全局通信
    Vue.prototype.$EventBus = new Vue()
  }
}
