<template>
  <div class="list-widget-item" :class="{'active' : selected}"
       :style="widgetStyle"
       @click="handleSelectWidget">
    <template v-if="selected">
      <div class="widget-view-drag">
        <b-icon name="ios-move"/>
      </div>
      <div class="widget-view-action" @click="handleWidgetDelete">
        <b-icon name="ios-trash"/>
      </div>
    </template>
    <template v-if="data.options">
      <h2><span :style="titleStyle">{{ data.options.title }}</span></h2>
      <div class="chart-wrap" :style="chartStyle">
        <b-charts :height="chartHeight" theme="charts-theme" :options="chartOptions"/>
      </div>
    </template>
  </div>
</template>

<script>
  import Enum from './enum'
  import { buildOptions } from './uitls'

  require('bin-charts/src/theme/charts-theme')

  export default {
    name: 'ChartsWrap',
    inject: ['Ctrl'],
    props: {
      data: {
        type: Object
      },
      index: {
        type: Number,
        required: true
      },
      previewModel: Boolean // 预览模式
    },
    data() {
      return {
        widthMap: Enum.widthMap
      }
    },
    methods: {
      // 选中widget
      handleSelectWidget() {
        this.$emit('select-one', this.index)
      },
      // 删除一个
      handleWidgetDelete() {
        this.$emit('delete-one', this.index)
      }
    },
    computed: {
      // 是否选中
      selected() {
        return this.index === this.Ctrl.selectIndex
      },
      // 图表标题样式
      titleStyle() {
        if (!this.data.options) {
          return null
        }
        let { color, fontSize } = this.data.options.titleStyle
        return {
          color: color,
          fontSize: `${fontSize}px`
        }
      },
      // 容器高度
      widgetHeight() {
        if (!this.data.options) {
          return 400
        }
        let { height } = this.data.options
        return this.previewModel ? height : (height >= 400 ? height / 2 : 200)
      },
      // 图表高度
      chartHeight() {
        return `${this.widgetHeight - 30}px`
      },
      // 容器的宽高样式
      widgetStyle() {
        if (!this.data.options) {
          return null
        }
        let { width } = this.data.options
        return {
          width: this.widthMap[width],
          height: `${this.widgetHeight}px`
        }
      },
      // 图表容器的样式
      chartStyle() {
        return {
          width: '100%',
          height: this.chartHeight
        }
      },
      // 根据类型和已配置项创建对应图表的options
      chartOptions() {
        return buildOptions(this.data)
      }
    }
  }
</script>

<style scoped lang="stylus">
  .list-widget-item {
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
