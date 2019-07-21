// 按需加载element-ui
import './lazy_lib/components_use'
// bin-ui
import BinUI from 'bin-ui'
import 'bin-ui/lib/styles/index.css'
// 本项目的全局自定义组件
import BinContainer from '../components/bin-container'
import BinTable from '../components/bin-table'
import BinTree from '../components/bin-tree'

export default {
  async install (Vue, options) {
    // bin-ui引用
    Vue.use(BinUI)
    // 容器组件
    Vue.component(BinContainer.name, BinContainer)
    // 表格组件
    Vue.component(BinTable.name, BinTable)
    // 简单树
    Vue.component(BinTree.name, BinTree)
    // 全局通信
    Vue.prototype.$EventBus = new Vue()
  }
}
