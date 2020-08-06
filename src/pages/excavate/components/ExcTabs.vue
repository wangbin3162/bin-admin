<template>
  <div class="exc-tabs">
    <div class="exc-tabs-inner">
      <div class="tab-item" :class="{active:currentIndex===0}" @click="change(0)">
        <b-icon name="ios-trending-up"/>
        趋势研究
      </div>
      <div class="tab-item" :class="{active:currentIndex===1}" @click="change(1)">
        <b-icon name="ios-analytics"/>
        归集分析
      </div>
      <div class="tab-item" :class="{active:currentIndex===2}" @click="change(2)">
        <b-icon name="ios-contacts"/>
        群体分析
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExcTabs',
  props: {
    activeIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      currentIndex: 0
    }
  },
  methods: {
    change(index) {
      this.currentIndex = index
      this.$emit('on-change', index)
    }
  }
}
</script>

<style scoped lang="stylus">
.exc-tabs {
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
