// bin-ui
import BinUI from 'bin-ui'
import 'bin-ui/lib/styles/index.css'
// 以下为bpmn工作流绘图工具的样式
import 'bpmn-js/dist/assets/diagram-js.css' // 左边工具栏以及编辑节点的样式
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'
import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css'

// bin-ace-editor
import Editor from 'bin-ace-editor'

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
import PageHeaderWrap from '../components/PageHeaderWrap'
import { VTableWrap, VTableToolBar, VFilterBar, VFilterItem, VEditWrap } from '../components/VTableLayout'
import VKeyLabel from '../components/VKeyLabel'
import VSimpleLabel from '../components/VKeyLabel/Simple'
import VTitleBar from '../components/VTitleBar'
import VSortArrow from '../components/VSortArrow'

require('brace/ext/emmet')
require('brace/ext/language_tools') // language extension
let language = ['json', 'javascript', 'markdown', 'sql', 'java', 'elixir', 'html', 'css', 'stylus']

let theme = [
  'chrome',
  'xcode',
  'clouds',
  'crimson_editor',
  'sqlserver',
  'github',
  'textmate',
  'tomorrow',
  'solarized_light',
  'cobalt',
  'dracula',
  'monokai',
  'solarized_dark',
  'terminal',
  'vibrant_ink'
]

language.forEach(lang => {
  require('brace/mode/' + lang)
  require('brace/snippets/' + lang)
})

theme.forEach(item => {
  require('brace/theme/' + item)
})

export default {
  async install(Vue, options) {
    // bin-ui引用
    Vue.use(BinUI)
    Vue.component(BinCharts.name, BinCharts)
    // 注册editor
    Vue.component(Editor.name, Editor)

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
    // 全局通信
    Vue.prototype.$EventBus = new Vue()
    // 扩展string方法
    // eslint-disable-next-line no-extend-native
    String.prototype.isNotEmpty = function () {
      return this.length > 0 || this !== ''
    }
  }
}
