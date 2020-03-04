// bin-ui
import BinUI from 'bin-ui'
import 'bin-ui/lib/styles/index.css'
// 本项目的全局自定义组件
import PageHeaderWrap from '../components/PageHeaderWrap'
import { VTableWrap, VTableToolBar, VFilterBar, VFilterItem, VEditWrap } from '../components/VTableLayout'
import VKeyLabel from '../components/VKeyLabel'
import VSimpleLabel from '../components/VKeyLabel/Simple'
import VTitleBar from '../components/VTitleBar'
import VSortArrow from '../components/VSortArrow'
import VCascade from '../components/VCascade'
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/legend'

export default {
  async install(Vue, options) {
    // bin-ui引用
    Vue.use(BinUI)
    Vue.component(PageHeaderWrap.name, PageHeaderWrap)
    Vue.component(VTableWrap.name, VTableWrap)
    Vue.component(VEditWrap.name, VEditWrap)
    Vue.component(VTableToolBar.name, VTableToolBar)
    Vue.component(VFilterBar.name, VFilterBar)
    Vue.component(VFilterItem.name, VFilterItem)
    Vue.component(VKeyLabel.name, VKeyLabel)
    Vue.component(VSimpleLabel.name, VSimpleLabel)
    Vue.component(VTitleBar.name, VTitleBar)
    Vue.component(VSortArrow.name, VSortArrow)
    Vue.component(VCascade.name, VCascade)
    Vue.component('v-chart', ECharts)
    // 全局通信
    Vue.prototype.$EventBus = new Vue()
    // 扩展string方法
    // eslint-disable-next-line no-extend-native
    String.prototype.isNotEmpty = function () {
      return this.length > 0 || this !== ''
    }
  }
}
