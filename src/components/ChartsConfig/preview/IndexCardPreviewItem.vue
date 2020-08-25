<template>
  <div class="index-widget-item" :style="widgetStyle">
    <div class="number-wrap">
      <div class="icon">
        <b-icon :name="element.options.icon" :size="element.options.iconSize" v-if="element.options.icon"/>
      </div>
      <div class="title-box">
        <h2>{{ element.options.title }}</h2>
        <p>{{ count }}</p>
      </div>
    </div>
  </div>
</template>

<script>
// import { renderingChart } from '@/api/excavate-analyze/excavate-cfg.api'

export default {
  name: 'IndexCardPreviewItem',
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
    }
  },
  computed: {
    // 容器的宽高样式
    widgetStyle() {
      if (!this.element.options) {
        return null
      }
      let { width, height, backgroundColor } = this.element.options
      let gap = this.itemGap / 2
      return {
        width: width === '100%' ? width : `calc(${width} - ${this.itemGap}px)`,
        height: `${height}px`,
        margin: `0 ${gap}px ${this.gapBottom}px`,
        backgroundColor
      }
    }
  },
  data() {
    return {
      count: 0
    }
  },
  watch: {
    element: {
      handler() {
        this.initOptions()
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    initOptions() {
      let dynamic = this.element.isOpen === 'dynamic' && this.dynamic
      let { staticDataSource } = this.element
      this.count = staticDataSource[0].value || 0
      if (dynamic) {
        this.updateData()
      }
    },
    // 更新数据项
    updateData() {
      let dynamic = this.dynamic && this.element.isOpen === 'dynamic'
      if (dynamic) {
        let condition = this.getAPiConditions(this.conditions)
        // renderingChart(this.element.key, condition).then(resp => {
        //   if (resp.data.code === '0') {
        //     this.count = resp.data.data
        //   }
        // })
      } else {
        let { staticDataSource } = this.element
        this.count = staticDataSource[0].value || 0
      }
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
  }
}
</script>

<style scoped lang="stylus">
.index-widget-item {
  position: relative;
  display: inline-block;
  vertical-align: top;
  border-radius: 5px;
  .number-wrap {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    padding: 20px;
    color: #fff;
    .icon {
      flex-shrink: 0;
      background-color: rgba(255, 255, 255, 0.267);
      display: flex;
      justify-content: center;
      align-items: center;
      min-width: 50px;
      min-height: 50px;
      border-radius: 50%;
      margin-right: 16px;
      .iconfont {
        font-size: 24px;
      }
    }
    .title-box {
      width: calc(100% - 66px)
      h2 {
        display: block;
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-weight: normal;
        font-size: 14px;
      }
      p {
        font-size: 22px;
        font-weight: 700;
      }
    }
  }
}
</style>
