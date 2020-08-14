<template>
  <div class="index-group-widget-item" :style="widgetStyle">
    <div class="group-wrap">
      <div class="number-wrap"
           v-for="(item,index) in element.options.groupList" :key="index"
           :style="numberStyle(item)">
        <div class="icon">
          <b-icon :name="item.icon" :size="item.iconSize" v-if="item.icon"/>
        </div>
        <div class="title-box">
          <h2>{{ item.title }}</h2>
          <p>{{ isDynamic ? dynamicIndex[index] : item.value }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { renderingChart } from '@/api/excavate-analyze/excavate-cfg.api'
import { isNotEmpty } from '@/common/utils/assist'

export default {
  name: 'IndexGroupPreviewItem',
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
  data() {
    return {
      dynamicIndex: []
    }
  },
  computed: {
    // 容器的宽高样式
    widgetStyle() {
      if (!this.element.options) {
        return null
      }
      return {
        height: `${this.element.options.height}px`,
        margin: `0 0 ${this.gapBottom}px`
      }
    },
    isDynamic() {
      return this.element.isOpen === 'dynamic' && this.dynamic
    }
  },
  methods: {
    initOptions() {
      if (this.isDynamic) {
        this.updateData()
      }
    },
    // 更新数据项
    updateData() {
      let condition = this.getAPiConditions(this.conditions)
      renderingChart(this.element.key, condition).then(resp => {
        if (resp.data.code === '0') {
          if (resp.data.data[0]) {
            let { data } = resp.data.data[0]
            if (data && data[0] && data[0].val) {
              let { val } = data[0]
              // 遍历groupList值，并根据是否有配置field字段进行填充
              this.dynamicIndex = []
              this.element.options.groupList.forEach(item => {
                if (isNotEmpty(item.field) && val[item.field] !== undefined) {
                  this.dynamicIndex.push(val[item.field])
                } else {
                  this.dynamicIndex.push('')
                }
              })
            }
          }
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
    },
    numberStyle(item) {
      let width = 1 / this.element.options.groupList.length * 100
      let { backgroundColor } = item
      let gap = this.itemGap / 2
      return {
        width: `calc(${width}% - ${this.itemGap}px)`,
        margin: `0 ${gap}px ${this.gapBottom}px`,
        backgroundColor
      }
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
  }
}
</script>

<style scoped lang="stylus">
.index-group-widget-item {
  width: 100%;
  .group-wrap {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 100%;
  }
  .number-wrap {
    height: 100%;
    display: flex;
    align-items: center;
    padding: 20px;
    color: #fff;
    border-radius: 5px;
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
