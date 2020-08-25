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

export default {
  name: 'IndexCard',
  props: {
    element: Object,
    select: Object,
    list: Array,
    index: Number
  },
  data() {
    return {
      selectWidget: this.select,
      count: 0
    }
  },
  computed: {
    // 容器的宽高样式
    widgetStyle() {
      if (!this.element.options) {
        return null
      }
      let { width, height, backgroundColor } = this.element.options
      return {
        width: `calc(${width} - 4px)`,
        height: `${height}px`,
        backgroundColor
      }
    }
  },
  methods: {
    initOptions() {
      let { staticDataSource } = this.element
      this.count = staticDataSource[0].value || 0
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
        this.$emit('on-delete')
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
