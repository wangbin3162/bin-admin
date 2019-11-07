// 按需加载element-ui
// import './lazy_lib/components_use'
// bin-ui
import BinUI from 'bin-ui'
import 'bin-ui/lib/styles/index.css'
// 本项目的全局自定义组件
import BaseLayout from '../components/base-layout/base-layout'
import BaseHeader from '../components/base-header/header'
import BaseFooter from '../components/base-footer/footer'
import BaseSearch from '../components/base-search/search'
import TopSearch from '../components/top-search/top-search'
import TopAffix from '../components/top-affix/top-affix'
import TitleBar from '../components/title-bar/index'
import KeyLabel from '../components/key-label/KeyLabel'

export default {
  async install (Vue, options) {
    // bin-ui引用
    Vue.use(BinUI)
    // 通用基本布局
    Vue.component(BaseLayout.name, BaseLayout)
    // 顶部通用导航
    Vue.component(BaseHeader.name, BaseHeader)
    // 底部通用导航
    Vue.component(BaseFooter.name, BaseFooter)
    // 基础查询框
    Vue.component(BaseSearch.name, BaseSearch)
    // 顶部查询
    Vue.component(TopSearch.name, TopSearch)
    // 图钉固定
    Vue.component(TopAffix.name, TopAffix)
    // 标题组件
    Vue.component(TitleBar.name, TitleBar)
    // 查看显示组件
    Vue.component(KeyLabel.name, KeyLabel)
    // 查看显示组件
    Vue.component('CollapseTransition', BinUI.CollapseTransition)
    // 注册全局过滤器
    Vue.filter('valueFilter', (value) => {
        if (!value || value.toString().length === 0) {
          return '-'
        }
        return value
      }
    )
    // 全局通信
    Vue.prototype.$EventBus = new Vue()
  }
}
