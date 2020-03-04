<template>
  <div class="groove">
    <div class="sliding-block" :style="selected===0?'left: 0':selected===1?'left: 80px':selected===2?'left: 160px':''">
    </div>
    <div class="btn-box" flex>
      <div class="btn"
           @click="choose(index)"
           :class="selected === index ? 'selected':''"
           v-for="(item, index) in yearList"
           :key="item.value">
        {{ item.label }}
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'GrooveSelect',
    props: {
      yearList: {},
      selected: {}
    },
    methods: {
      choose(index) {
        this.$emit('choose', index)
      }
    }
  }
</script>

<style scoped lang="stylus">
  .groove
    top: 10px
    width: 240px
    position relative
    background-color: #fff
    -webkit-border-radius: 15px
    -moz-border-radius: 15px
    border-radius: 15px
    border: 1px solid rgba(240,239,252,.8)
    .sliding-block
      background-color: rgba(236,239,252,.8)
      position absolute
      top:0
      left: 0
      width: 80px
      height: 30px
      z-index 10
      -webkit-border-radius: 15px
      -moz-border-radius: 15px
      border-radius: 15px
      transition ease-in-out .2s
    .btn-box
      position relative
      z-index 20
      .btn
        font-size: 14px
        cursor pointer
        text-align center
        line-height: 30px
        width: 80px
        height: 30px
        color: rgba(0,0,0,0.65);
      .selected
        color #333
</style>
