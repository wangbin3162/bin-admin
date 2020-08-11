<template>
  <div class="tab-wrapper">
    <div flex>
      <template v-for="(date, index) in dateText">
        <div class="tab" :class="{ actived: index === tab }"
          :key="index" @click="handleClick(index)">
          {{ date }}
        </div>
      </template>
    </div>
    <div v-if="tab > -1" class="slide" :style="{ left: tab * 50 + 'px'}"></div>
  </div>
</template>

<script>
  export default {
    name: 'QuickDateSelect',
    props: {
      selected: {
        type: Number,
        default: 2
      },
      dateMode: {
        type: String,
        default: '{y}-{m}-{d}'
      }
    },
    watch: {
      selected (newVal) {
        this.tab = newVal
      }
    },
    data () {
      return {
        tab: this.selected,
        dateText: [
          '本周',
          '本月',
          '本年'
        ]
      }
    },
    created () {

    },
    methods: {
      handleClick (index) {
        this.tab = index
        let res = {}
        if (index === 0) {
          res = this.$util.rangeTime(-7, this.dateMode)
        }
        if (index === 1) {
          res = this.$util.rangeTime(-30, this.dateMode)
        }
        if (index === 2) {
          res = this.$util.rangeTime(-365, this.dateMode)
        }
        this.$emit('tab-click', { ...res, index })
      }
    }
  }
</script>

<style scoped lang="stylus">
  .tab-wrapper {
    position: relative;
    z-index: 1;
    padding: 7px 0;
    width: 150px;
    // border: 1px solid #DCDFE6;
    border-radius: 30px;

    .tab {
      width: 50px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 400;
      text-align: center;
      border-radius: 30px;
    }

    .actived {
      font-weight: 600;
    }

    .slide {
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      width: 50px;
      height: 33.6px;
      border-radius: 30px;
      background-color: rgba(233, 233, 255, 0.5);
      transition: left 0.2s;
    }
  }
</style>
