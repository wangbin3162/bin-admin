<template>
  <header class="layout-header" :class="{'fixed-header':fixedHeader}" :style="fixedHeaderStyle">
    <div v-if="isAside" class="global-header">
      <div class="global-header-trigger" @click="toggleSideBar">
        <b-icon :name="sidebar?'outdent':'indent'"></b-icon>
      </div>
      <div style="flex: 1 1 0;padding-left: 8px;">
        <v-breadcrumb v-if="showTagsView"></v-breadcrumb>
      </div>
      <div class="global-header-right">
        <weather/>
        <search/>
        <setting/>
        <user-avatar/>
      </div>
    </div>
    <!--顶部导航栏时的内容-->
    <div v-else class="top-nav-header">
      <div class="top-nav-header-main" :class="{'wide':isWide}">
        <div class="logo" style="width: 200px;">
          <img class="icon" src="../../../assets/images/logo-icon-b.png" alt="logo-small"/>
          <h1>公共信用信息共享平台</h1>
        </div>
        <!--顶部导航栏菜单-->
        <div style="flex: 1 1 0;">
          <header-menu/>
        </div>
        <div class="global-header-right">
          <setting/>
          <user-avatar/>
        </div>
      </div>
    </div>
    <!--tagsView-->
    <tags-view v-if="showTagsView"/>
  </header>
</template>

<script>
import { mapGetters } from 'vuex'
import HeaderMenu from './HeaderMenu'
import UserAvatar from './UserAvatar'
import TagsView from '@/layout/components/GlobalHeader/TagsView'
import VBreadcrumb from '@/components/VBreadcrumb/index'
import Weather from '@/layout/components/GlobalHeader/Weather/index'
import Setting from '@/layout/components/GlobalHeader/Setting'
import Search from '@/layout/components/GlobalHeader/Search'

export default {
  name: 'GlobalHeader',
  components: { Search, Setting, Weather, VBreadcrumb, TagsView, HeaderMenu, UserAvatar },
  computed: {
    ...mapGetters(['sidebar', 'menuType', 'tagsView', 'wideType', 'fixedHeader']),
    isAside() {
      return this.menuType === 'aside'
    },
    isWide() {
      return this.menuType === 'header' && this.wideType === 'wide'
    },
    fixedHeaderStyle() {
      return {
        padding: 0,
        width: this.isAside ? (this.fixedHeader ? `calc(100% - ${this.sidebar ? 256 : 64}px)` : '100%') : '100%',
        height: this.showTagsView ? '108px' : null,
        zIndex: 9,
        right: this.fixedHeader ? 0 : null
      }
    },
    showTagsView() {
      return this.isAside && this.tagsView
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    }
  }
}
</script>
