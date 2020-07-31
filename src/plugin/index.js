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

import Editor from 'bin-ace-editor'

// 本项目的全局自定义组件
import PageHeaderWrap from '../components/PageHeaderWrap'
import { VTableWrap, VTableToolBar, VFilterBar, VFilterItem, VEditWrap } from '../components/VTableLayout'
import VKeyLabel from '../components/VKeyLabel'
import VSimpleLabel from '../components/VKeyLabel/Simple'
import VTitleBar from '../components/VTitleBar'
import VSortArrow from '../components/VSortArrow'
import VCascade from '../components/VCascade'
import { isEmpty, isNotEmpty } from '../common/utils/assist'
import VueTinymce from '@packy-tang/vue-tinymce'

// 按需引入需要的语言包皮肤等资源
require('brace/ext/language_tools') // language extension

require('brace/mode/json')
require('brace/snippets/json')
require('brace/mode/elixir')
require('brace/snippets/elixir')
require('brace/mode/sql')
require('brace/snippets/sql')
require('brace/theme/chrome')

export default {
  async install(Vue, options) {
    // bin-ui引用
    Vue.use(BinUI)
    Vue.use(VueTinymce)
    //  bin-ace-editor
    Vue.component(Editor.name, Editor)
    Vue.component(BinCharts.name, BinCharts)
    // 本项目自有内容
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
    // 全局通信
    Vue.prototype.$EventBus = new Vue()
    // 全局函数，为空和不为空的判断
    Vue.prototype.$isEmpty = isEmpty
    Vue.prototype.$isNotEmpty = isNotEmpty
  }
}
