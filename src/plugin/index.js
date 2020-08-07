// bin-ui
import BinUI from 'bin-ui'
import 'bin-ui/lib/styles/index.css'
import BinCharts from 'bin-charts'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/radar'
import 'echarts/lib/chart/scatter'
import 'echarts/lib/chart/effectScatter'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
// 本项目的全局自定义组件
import BaseLayout from '../components/BaseLayout/index'
import BaseHeader from '../components/BaseHeader/index'
import BaseFooter from '../components/BaseFooter/index'
import BaseSearch from '../components/BaseSearch/index'
import TopSearch from '../components/TopSearch/index'
import TitleBar from '../components/TitleBar/index'
import KeyLabelWrap from '../components/KeyLabel/KeyLabelWrap'
import KeyLabel from '../components/KeyLabel/KeyLabel'
import SimpleLabel from '../components/SimpleLabel/SimpleLabel'
import { VTableWrap, VTableToolBar, VFilterBar, VFilterItem, VEditWrap } from '../components/VTableLayout'
import { isEmpty, isNotEmpty } from '../common/utils/assist'

export default {
  async install(Vue, options) {
    // bin-ui引用
    Vue.use(BinUI)
    Vue.component(BinCharts.name, BinCharts)
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
    // 标题组件
    Vue.component(TitleBar.name, TitleBar)
    // 查看显示组件容器
    Vue.component(KeyLabelWrap.name, KeyLabelWrap)
    // 查看显示组件
    Vue.component(KeyLabel.name, KeyLabel)
    // 查看显示组件简单
    Vue.component(SimpleLabel.name, SimpleLabel)
    // 查询列表相关
    Vue.component(VTableWrap.name, VTableWrap)
    Vue.component(VTableToolBar.name, VTableToolBar)
    Vue.component(VFilterBar.name, VFilterBar)
    Vue.component(VFilterItem.name, VFilterItem)
    Vue.component(VEditWrap.name, VEditWrap)

    Vue.component('CollapseTransition', BinUI.CollapseTransition)
    // 全局通信
    Vue.prototype.$EventBus = new Vue()

    // 全局函数，为空和不为空的判断
    Vue.prototype.$isEmpty = isEmpty
    Vue.prototype.$isNotEmpty = isNotEmpty
    /**
     * 全局枚举
     */
    Vue.prototype.ENUM = {
      Leg: '1', // 法人
      Nat: '2', // 自然人
      Positive: '1', // 正面信息
      Negative: '2' // 负面面信息
    }
  }
}
