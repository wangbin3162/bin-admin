// 按需加载element-ui
// import './lazy_lib/components_use'
// bin-ui
import BinUI from 'bin-ui'
import 'bin-ui/lib/styles/index.css'
// 本项目的全局自定义组件
import Breadcrumb from '../components/VBreadcrumb/index'
import TitleBar from '../components/VTitleBar/index'
import FilterBar from '../components/VFilterBar/FilterBar'
import FilterItem from '../components/VFilterBar/FilterItem'
import TableLayout from '../components/VTableLayout/index'
import KeyLabel from '../components/VKeyLabel/index'

export default {
  async install (Vue, options) {
    // bin-ui引用
    Vue.use(BinUI)
    // 路由面包屑
    Vue.component(Breadcrumb.name, Breadcrumb)
    // 标题组件
    Vue.component(TitleBar.name, TitleBar)
    // 查询条件容器
    Vue.component(FilterBar.name, FilterBar)
    // 查询条件内容
    Vue.component(FilterItem.name, FilterItem)
    // 表格布局
    Vue.component(TableLayout.name, TableLayout)
    // 查看显示组件
    Vue.component(KeyLabel.name, KeyLabel)
    // 查看显示组件
    Vue.component('CollapseTransition', BinUI.CollapseTransition)
    // 全局通信
    Vue.prototype.$EventBus = new Vue()
  }
}
