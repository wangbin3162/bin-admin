<template>
  <aside class="layout-aside" :class="{'fixed-aside':fixedAside}" :style="asideStyle">
    <div class="logo" flex="cross:center">
      <img class="icon" src="../../../assets/images/logo-icon-b.png" alt="logo-small"/>
      <transition name="zoom-in">
        <h1 v-show="sidebar">Bin Admin Pro</h1>
      </transition>
    </div>
    <div class="layout-aside-children">
      <b-menu @select="handleMenuSelect" :theme="theme" class="aside-menu" v-if="sidebar"
              style="width: 100%;" :open-names="openNames" accordion
              :active-name="activeMenu" ref="sideMenu">
        <template v-for="(menu, menuIndex) in navMenu">
          <menu-item v-if="!menu.children" :menu="menu" :key="menuIndex"></menu-item>
          <submenu v-else :menu="menu" :key="menuIndex"></submenu>
        </template>
      </b-menu>
      <div v-else class="menu-collapsed">
        <template v-for="menu in navMenu">
          <collapsed-menu v-if="menu.children && menu.children.length > 0" :key="`drop-menu-${menu.name}`"
                          :menu="menu" hide-title @click="handleSelect"
          ></collapsed-menu>
          <!--如果只有一级则需要显示提示-->
          <b-tooltip append-to-body v-else :content="menu.title" :theme="theme"
                     placement="right" :key="`drop-menu-${menu.name}`">
            <a class="drop-menu-a" @click="handleSelect(menu.name)">
              <b-icon :name="menu.icon" size="20"></b-icon>
            </a>
          </b-tooltip>
        </template>
      </div>
    </div>
  </aside>
</template>

<script>
import { mapGetters } from 'vuex'
import MenuItem from './MenuItem'
import Submenu from './Submenu'
import CollapsedMenu from './CollapsedMenu'

export default {
  name: 'AsideMenu',
  components: { Submenu, MenuItem, CollapsedMenu },
  data() {
    return {
      activeMenu: '',
      openNames: []
    }
  },
  computed: {
    ...mapGetters(['theme', 'sidebar', 'fixedAside', 'navMenu', 'navMenuItems', 'addRouters']),
    asideStyle() {
      const width = this.sidebar ? 256 : 64
      return {
        flex: `0 0 ${width}px`,
        maxWidth: `${width}px`,
        minWidth: `${width}px`,
        width: `${width}px`
      }
    }
  },
  watch: {
    $route: {
      handler: function (val) {
        // 展开的菜单
        this.openNames = this.getMenuItemNamePath(val.path)
        this.$nextTick(() => {
          // 选中的菜单
          this.activeMenu = val.path.replace('/', '')
          this.$refs.sideMenu && this.$refs.sideMenu.updateOpened()
        })
      },
      immediate: true
    }
  },
  methods: {
    // 获取菜单项名称路径
    getMenuItemNamePath(name) {
      let activeRoute = this.navMenuItems.find(item => `/${item.name}` === name)
      if (activeRoute) {
        return activeRoute.parents
      }
      return []
    },
    handleSelect(name) {
      this.handleMenuSelect(name)
    },
    handleMenuSelect(name) {
      let path = `/${name}`
      if (path === this.$route.fullPath) {
        console.log('refresh')
        this.$router.push({ path: '/refresh' })
        return
      }
      if (name === 'index' || this.addRouters.findIndex(item => item.path === name) > -1 || name.indexOf('Form/') === 0) {
        this.$router.push({ path })
      } else {
        this.$router.push('/404')
      }
    }
  }
}
</script>
