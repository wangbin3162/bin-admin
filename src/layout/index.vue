<template>
  <div class="basic-layout">
    <section class="layout layout-has-aside">
      <!--侧边栏,如果menuType为aside则显示侧边栏-->
      <aside-menu v-if="isAside"></aside-menu>
      <section class="layout" :style="rightStyle">
        <!--占位顶部-->
        <header class="layout-header" :style="fixedHeaderStyle" v-if="fixedHeader"></header>
        <!--通用顶部-->
        <global-header></global-header>
        <main class="layout-main">
          <div class="layout-content-wrap" :class="{'wide':isWide}">
            <transition name="fade-transverse"
                        @before-leave="beforeLeave"
                        @afterLeave="afterLeave">
              <keep-alive :include="cachedViews">
                <router-view :key="key"/>
              </keep-alive>
            </transition>
          </div>
        </main>
        <footer class="layout-footer" style="padding: 0;">
          <global-footer></global-footer>
        </footer>
      </section>
    </section>
    <b-back-top :height="200" :right="10"></b-back-top>
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
    ...mapGetters(['theme', 'sidebar', 'menuType', 'tagsView', 'fixedHeader', 'fixedAside', 'cachedViews', 'menuType', 'wideType']),
    key() {
      return this.$route.name
    },
    isWide() {
      return this.menuType === 'header' && this.wideType === 'wide'
    },
    isAside() {
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
        paddingLeft: (this.isAside && this.fixedAside) ? (this.sidebar ? '256px' : '64px') : null
      }
    },
    fixedHeaderStyle() {
      return {
        height: this.showTagsView ? '108px' : '64px'
      }
    },
    showTagsView() {
      return this.isAside && this.tagsView
    }
  },
  methods: {
    beforeLeave(el) {
      el.style.position = 'absolute'
      el.style.top = '0'
      el.style.left = '0'
      el.style.width = '100%'
      el.style.height = '100%'
      el.style.overflow = 'hidden'
    },
    afterLeave(el) {
      el.style = ''
    }
  }
}
</script>
