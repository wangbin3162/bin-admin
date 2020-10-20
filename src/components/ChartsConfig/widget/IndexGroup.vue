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
    <div class="group-wrap">
      <div class="number-wrap"
           v-for="(item,index) in element.options.groupList" :key="index"
           :style="numberStyle(item)">
        <div class="icon">
          <b-icon :name="item.icon" :size="item.iconSize" v-if="item.icon"/>
        </div>
        <div class="title-box">
          <h2>{{ item.title }}</h2>
          <p>{{ item.value }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IndexGroup',
  props: {
    element: Object,
    select: Object,
    list: Array,
    index: Number
  },
  data() {
    return {
      selectWidget: this.select
    }
  },
  computed: {
    // 容器的宽高样式
    widgetStyle() {
      if (!this.element.options) {
        return null
      }
      return {
        height: `${this.element.options.height}px`
      }
    }
  },
  methods: {
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
    },
    numberStyle(item) {
      let width = 1 / this.element.options.groupList.length * 100
      let { backgroundColor } = item
      return {
        width: `calc(${width}% - 4px)`,
        backgroundColor
      }
    }
  },
  watch: {
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
  width: calc(100% - 4px);
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
