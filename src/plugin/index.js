// 按需加载element-ui
// import './lazy_lib/components_use'
// bin-ui
import BinUI from 'bin-ui'
import 'bin-ui/lib/styles/index.css'
// 本项目的全局自定义组件
import BaseHeader from '../components/base-header/header'
import BaseFooter from '../components/base-footer/footer'
import BaseSearch from '../components/base-search/search'
import TitleBar from '../components/title-bar/index'
import KeyLabel from '../components/key-label/KeyLabel'

export default {
  async install (Vue, options) {
    // bin-ui引用
    Vue.use(BinUI)
    // 顶部通用导航
    Vue.component(BaseHeader.name, BaseHeader)
    // 底部通用导航
    Vue.component(BaseFooter.name, BaseFooter)
    // 基础查询框
    Vue.component(BaseSearch.name, BaseSearch)
    // 标题组件
    Vue.component(TitleBar.name, TitleBar)
    // 查看显示组件
    Vue.component(KeyLabel.name, KeyLabel)
    // 查看显示组件
    Vue.component('CollapseTransition', BinUI.CollapseTransition)
    // 全局通信
    Vue.prototype.$EventBus = new Vue()
  }
}
