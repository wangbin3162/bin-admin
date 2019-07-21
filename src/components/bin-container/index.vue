<template>
  <div class="bin-container" :style="wrapStyleBind">
    <b-scrollbar style="height: 100%;" ref="scroll">
      <slot></slot>
      <b-back-top v-if="showBackTop"></b-back-top>
    </b-scrollbar>
  </div>
</template>

<script>
  export default {
    name: 'BinContainer',
    props: {
      bgColor: {
        type: String,
        default: '#fff'
      },
      showBackTop: {
        type: Boolean,
        default: true
      },
      wrapStyle: {}
    },
    data () {
      return {}
    },
    methods: {
      scrollTo: function (to) {
        // 如果父级是自定义滚动则绑定滚动为父级元素dom
        if (!this.domEl) {
          this.domEl = this.$refs.scroll.$el.querySelector('.bin-scrollbar__wrap')
        }
        let sTop = this.domEl.pageYOffset || this.domEl.scrollTop
        this.$scrollTop(this.domEl, sTop, to, 1000)
      }
    },
    computed: {
      wrapStyleBind () {
        return Object.assign({}, {
          backgroundColor: this.bgColor
        }, this.wrapStyle)
      }
    }
  }
</script>

<style scoped lang="stylus">
  .bin-container {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
</style>
