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
          <div class="layout-content-wrap">
            <router-view/>
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
  }
}
</script>
