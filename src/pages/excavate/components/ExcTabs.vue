<template>
  <div class="exc-tabs">
    <div class="exc-tabs-inner">
      <div class="tab-item" v-for="item in tabs" :key="item.code"
           :class="{active: item.code===currentCode}" @click="change(item.code)">
        <b-icon :name="item.icon"/>
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExcTabs',
  props: {
    value: {
      type: String,
      default: 'resource'
    }
  },
  data() {
    return {
      tabs: [
        { code: 'resource', name: '业务分析', icon: 'ios-trending-up' },
        { code: 'person', name: '群体分析', icon: 'ios-contacts' },
        { code: 'gather', name: '归集分析', icon: 'ios-analytics' }
      ],
      currentCode: ''
    }
  },
  watch: {
    value: {
      handler(newVal) {
        this.currentCode = newVal
      },
      immediate: true
    }
  },
  methods: {
    change(code) {
      this.currentCode = code
      this.$emit('input', this.currentCode)
      this.$emit('on-change', this.currentCode)
    }
  }
}
</script>

<style scoped lang="stylus">
.exc-tabs {
  background-color: #fff;
  box-shadow: 0 0 8px rgba(200, 200, 200, 0.5);
  &-inner {
    position: relative;
    display: flex;
    align-items: center;
    width: 1300px;
    margin: 0 auto;
    .tab-item {
      cursor: pointer;
      line-height: 40px;
      padding: 0 8px;
      color: rgba(0, 0, 0, .65);
      margin-right: 8px;
      transition: .25s;
      &:hover, &.active {
        color: #0d85ff;
      }
      &:hover {
        box-shadow: 0 0 15px 0 rgba(100, 100, 100, .15) inset;
      }
      .iconfont {
        vertical-align: -1px;
        margin-right: 6px;
      }
    }
  }
}
</style>
