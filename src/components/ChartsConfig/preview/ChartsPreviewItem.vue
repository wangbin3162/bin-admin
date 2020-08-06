<template>
  <div class="chart-widget-item" :style="widgetStyle">
    <h2><span :style="titleStyle">{{ element.options.title }}</span></h2>
    <div class="chart-wrap" :style="chartStyle">
      <b-charts :height="chartHeight" :options="chartOptions"/>
    </div>
  </div>
</template>

<script>
import { buildOptions, WIDTH_MAP } from '../utils/util'
import 'echarts/lib/component/visualMap'
import 'echarts/lib/component/geo'
import china from 'echarts/map/json/china.json'
import echarts from 'echarts/lib/echarts'
import { renderingChart } from '@/api/excavate-analyze/excavate-cfg.api'

echarts.registerMap('china', china)
export default {
  name: 'ChartsPreviewItem',
  props: {
    element: Object,
    itemGap: { // 容器项间隔
      type: Number,
      default: 10
    },
    gapBottom: { // 容器项底部间隔
      type: Number,
      default: 24
    },
    dynamic: Boolean, // 动态开关
    conditions: {
      type: Array,
      default() {
        return []
      }
    },
    log: Boolean // 打印配置项
  },
  data() {
    return {
      widthMap: WIDTH_MAP,
      chartOptions: {}
    }
  },
  watch: {
    element: {
      handler() {
        this.initOptions()
      },
      immediate: true
    }
  },
  methods: {
    initOptions() {
      this.chartOptions = buildOptions(this.element, this.dynamic)
      if (this.dynamic && this.element.isOpen === 'dynamic') {
        this.updateData()
      }
      // 打印options
      this.log && console.log(this.chartOptions)
    },
    // 更新数据项
    updateData() {
      let condition = this.getAPiConditions(this.conditions)
      renderingChart(this.element.key, condition).then(resp => {
        if (resp.data.code === '0') {
          this.chartOptions = buildOptions(this.element, this.dynamic, resp.data.data)
          // 打印options
          this.log && console.log(this.chartOptions)
        }
      })
    },
    // 判断条件为空情况做剔除
    getAPiConditions(conditions) {
      let list = []
      for (const item of conditions) {
        if (JSON.stringify(item.value) === '[]' ||
            JSON.stringify(item.value) === JSON.stringify({ gte: '', lt: '' })) {
          continue
        }
        list.push(item)
      }
      return list
    }
  },
  computed: {
    // 图表标题样式
    titleStyle() {
      if (!this.element.options) {
        return null
      }
      let { color, fontSize } = this.element.options.titleStyle
      return {
        color: color,
        fontSize: `${fontSize}px`
      }
    },
    // 容器高度
    widgetHeight() {
      let { height } = this.element.options
      return height || 400
    },
    // 容器的宽高样式
    widgetStyle() {
      let { width } = this.element.options
      let gap = this.itemGap / 2
      return {
        width: width === '100%' ? width : `calc(${this.widthMap[width]} - ${this.itemGap}px)`,
        height: `${this.widgetHeight}px`,
        margin: `0 ${gap}px ${this.gapBottom}px`
      }
    },
    // 图表高度
    chartHeight() {
      return `${this.widgetHeight - 30}px`
    },
    // 图表容器的样式
    chartStyle() {
      return {
        width: '100%',
        height: this.chartHeight
      }
    }
  }
}
</script>

<style scoped lang="stylus">
.chart-widget-item {
  position: relative;
  display: inline-block;
  vertical-align: top;
  h2 {
    font-weight: normal;
    font-size: 16px;
    span {
      line-height: 30px;
      padding: 0 18px;
      border-left: 2px solid #1089ff;
    }
  }
}
</style>
