<template>
  <div class="basic-layout">
    <section class="layout layout-has-aside">
      <!--侧边栏,如果menuType为aside则显示侧边栏-->
      <aside-menu v-if="hasAside"></aside-menu>
      <section class="layout" :style="rightStyle">
        <!--占位顶部-->
        <header class="layout-header" v-if="fixedHeader"></header>
        <!--通用顶部-->
        <global-header></global-header>
        <main class="layout-main">
          <div class="layout-content-wrap" ref="contentWrapper">
            <router-view/>
          </div>
        </main>
        <footer class="layout-footer" style="padding: 0;">
          <global-footer></global-footer>
        </footer>
      </section>
    </section>
    <b-back-top :height="200"></b-back-top>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import GlobalFooter from './components/GlobalFooter'
  import GlobalHeader from './components/GlobalHeader'
  import AsideMenu from './components/AsideMenu'

  export default {
    name: 'Layout',
    components: { AsideMenu, GlobalHeader, GlobalFooter },
    computed: {
      ...mapGetters(['theme', 'sidebar', 'menuType', 'fixedHeader', 'fixedAside']),
      hasAside() {
        return this.menuType === 'aside'
      },
      asideStyle() {
        const width = this.sidebar ? 256 : 64
        return {
          flex: `0 0 ${width}px`,
          maxWidth: `${width}px`,
          minWidth: `${width}px`,
          width: `${width}px`
        }
      },
      rightStyle() {
        return {
          position: 'relative',
          paddingLeft: (this.hasAside && this.fixedAside) ? (this.sidebar ? '256px' : '64px') : null
        }
      }
    },
    mounted() {
      this.wrap = this.$refs.contentWrapper
      if (this.wrap) {
        this.$nextTick(() => {
          this.calcTableWidth()
        })
        window.addEventListener('resize', this.calcTableWidth)
        this.sidebarElm = document.getElementsByClassName('layout-aside')[0]
        this.sidebarElm && this.sidebarElm.addEventListener('transitionend', this.sidebarResizeHandler)
      }
    },
    methods: {
      calcTableWidth() {
        let width = this.wrap ? this.wrap.clientWidth : 800
        // 全局通信，这里不缓存至vuex中，用于传递当前app-main宽度, mixin中监听此方法用于统一窗口宽度
        this.$EventBus.$emit('/layout/resize', width)
      },
      sidebarResizeHandler(e) {
        if (e.propertyName === 'width') {
          this.calcTableWidth()
        }
      }
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.calcTableWidth)
      if (this.sidebarElm) {
        this.sidebarElm.removeEventListener('transitionend', this.sidebarResizeHandler)
      }
    }
  }
</script>
