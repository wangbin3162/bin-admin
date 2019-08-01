// 按需加载element-ui
import './lazy_lib/components_use'
// bin-ui
import BinUI from 'bin-ui'
import 'bin-ui/lib/styles/index.css'
// 本项目的全局自定义组件
import Breadcrumb from '../components/v-breadcrumb/Breadcrumb'
import FilterBar from '../components/v-filter-bar/FilterBar'
import FilterItem from '../components/v-filter-bar/FilterItem'
import TableLayout from '../components/v-table-layout/TableLayout'

export default {
  async install (Vue, options) {
    // bin-ui引用
    Vue.use(BinUI)
    // 路由面包屑
    Vue.component(Breadcrumb.name, Breadcrumb)
    // 查询条件容器
    Vue.component(FilterBar.name, FilterBar)
    // 查询条件内容
    Vue.component(FilterItem.name, FilterItem)
    // 表格布局
    Vue.component(TableLayout.name, TableLayout)
    // 全局通信
    Vue.prototype.$EventBus = new Vue()
  }
}
