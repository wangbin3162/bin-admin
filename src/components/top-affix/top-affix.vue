<template>
  <div>
    <div ref="point" :class="affixClass" :style="styles">
      <slot></slot>
    </div>
    <div v-show="slot" :style="slotStyle"></div>
  </div>
</template>

<script>
  export default {
    name: 'top-affix',
    props: {
      offsetTop: {
        type: Number,
        default: 0
      },
      zIndex: {
        type: Number,
        default: 10
      }
    },
    data () {
      return {
        affix: false,
        styles: {},
        slot: false,
        slotStyle: {}
      }
    },
    computed: {
      affixClass () {
        if (this.affix) {
          return 'affix'
        }
        return null
      }
    },
    mounted () {
      // 查找最近的滚动组件
      this.domEl = this.$parent.$el.querySelector('.scroll-box')
      this.domEl.addEventListener('scroll', this.handleScroll)
      this.$nextTick(() => {
        this.handleScroll()
      })
    },
    beforeDestroy () {
      this.domEl.removeEventListener('scroll', this.handleScroll)
    },
    methods: {
      handleScroll () {
        const affix = this.affix
        const scrollTop = this.domEl.pageYOffset || this.domEl.scrollTop
        const oTop = this.$el.offsetTop
        const oLeft = this.$el.offsetLeft

        // Fixed Top
        if ((oTop - this.offsetTop) < scrollTop && !affix) {
          this.affix = true
          this.slotStyle = {
            width: this.$refs.point.clientWidth + 'px',
            height: this.$refs.point.clientHeight + 'px'
          }
          this.slot = true
          this.styles = {
            top: `${this.offsetTop}px`,
            left: `${oLeft}px`,
            width: `${this.$el.offsetWidth}px`,
            zIndex: this.zIndex
          }
          this.$emit('on-change', true)
        } else if ((oTop - this.offsetTop) > scrollTop && affix) {
          this.slot = false
          this.slotStyle = {}
          this.affix = false
          this.styles = null
          this.$emit('on-change', false)
        }
      }
    }
  }
</script>

<style scoped>
  .affix {
    position: fixed;
  }
</style>
