<template>
  <div class="list-widget-item" :class="{'active' : selectWidget.key===element.key}"
       :style="widgetStyle"
       @click.stop="handleSelectWidget(index,element.key)">

    <template v-if="selectWidget.key===element.key">
      <div class="widget-view-drag">
        <b-icon name="ios-move"/>
      </div>
      <div class="widget-view-action" @click.stop="handleWidgetDelete(index)">
        <b-icon name="ios-trash"/>
      </div>
      <div class="widget-view-key">{{ element.key }}</div>
    </template>

    <h2><span :style="titleStyle">{{ element.options.title }}</span></h2>
    <div class="chart-wrap" :style="chartStyle">
      <b-charts :height="chartHeight" :options="chartOptions"/>
    </div>
  </div>
</template>

<script>
import { buildOptions } from '../utils/util'
import 'echarts/lib/component/visualMap'
import 'echarts/lib/component/geo'
import china from 'echarts/map/json/china.json'
import echarts from 'echarts/lib/echarts'

echarts.registerMap('china', china)

export default {
  name: 'ChartsWrap',
  props: {
    element: Object,
    select: Object,
    list: Array,
    index: Number,
    log: Boolean // 打印配置项
  },
  data() {
    return {
      selectWidget: this.select,
      chartOptions: {}
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
      if (!this.element.options) {
        return null
      }
      let { width } = this.element.options
      return {
        width: `calc(${width} - 4px)`,
        height: `${this.widgetHeight}px`
      }
    },
    // 图表高度
    chartHeight() {
      return `${this.widgetHeight - 43}px`
    },
    // 图表容器的样式
    chartStyle() {
      return {
        width: '100%',
        height: this.chartHeight
      }
    }
  },
  methods: {
    initOptions() {
      this.chartOptions = buildOptions(this.element)
      // 打印options
      this.log && console.log(this.chartOptions)
    },
    // 选中widget
    handleSelectWidget(index, key) {
      if (key === this.selectWidget.key) {
        // this.selectWidget = {}
        return
      }
      // this.$log.primary(`====SelectWidget:${index}====`)
      this.selectWidget = this.list[index]
    },
    // 删除一个
    handleWidgetDelete(index) {
      if (this.list.length - 1 === index) {
        if (index === 0) {
          this.selectWidget = {}
        } else {
          this.selectWidget = this.list[index - 1]
        }
      } else {
        this.selectWidget = this.list[index + 1]
      }
      this.$nextTick(() => {
        this.list.splice(index, 1)
        this.$emit('delete')
      })
    }
  },
  watch: {
    element: {
      handler() {
        this.initOptions()
      },
      deep: true,
      immediate: true
    },
    select(val) {
      this.selectWidget = val
    },
    selectWidget: {
      handler(val) {
        this.$emit('update:select', val)
      },
      deep: true
    }
  }
}
</script>

<style scoped lang="stylus">
.list-widget-item {
  h2 {
    font-weight: normal;
    font-size: 16px;
    border-bottom: 1px solid #eeeeee;
    padding: 6px 2px;
    span {
      position: relative;
      line-height: 30px;
      padding: 0 18px;
      &:before {
        content: '';
        position: absolute;
        left: 2px
        top: 2px;
        bottom: 2px;
        width: 2px;
        background-color: #1089ff;
      }
    }
  }
}
</style>
