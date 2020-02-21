<template>
  <aside class="layout-aside" :class="{'fixed-aside':fixedAside}" :style="asideStyle">
    <div class="logo" flex="cross:center">
      <img class="icon" src="../../../assets/images/logo-icon-b.png" alt="logo-small"/>
      <transition name="zoom-in">
        <h1 v-show="sidebar">Bin Admin Pro</h1>
      </transition>
    </div>
    <div class="layout-aside-children">
      <b-menu @on-select="handleMenuSelect" :theme="theme" class="aside-menu" v-show="sidebar"
              style="width: 100%;"
              :active-name="activeMenu" accordion ref="sideMenu">
        <template v-for="(menu, menuIndex) in navMenu">
          <menu-item v-if="!menu.children" :menu="menu" :key="menuIndex" :base-path="menu.path"></menu-item>
          <submenu v-else :menu="menu" :key="menuIndex"></submenu>
        </template>
      </b-menu>
      <div v-show="!sidebar" class="menu-collapsed">
        <template v-for="menu in navMenu">
          <collapsed-menu v-if="menu.children && menu.children.length > 0" :key="`drop-menu-${menu.path}`"
                          :menu="menu" :base-path="menu.path" hide-title @on-click="handleSelect"
          ></collapsed-menu>
          <!--如果只有一级则需要显示提示-->
          <b-tooltip transfer v-else :content="menu.title" theme="dark"
                     placement="right" :key="`drop-menu-${menu.path}`">
            <a class="drop-menu-a" @click="handleSelect(menu.path)">
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
        activeMenu: ''
      }
    },
    computed: {
      ...mapGetters(['theme', 'sidebar', 'fixedAside', 'navMenu']),
      asideStyle() {
        const width = this.sidebar ? 240 : 64
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
          this.$nextTick(() => {
            this.activeMenu = val.path
          })
        },
        immediate: true
      }
    },
    methods: {
      handleSelect(name) {
        this.handleMenuSelect(name)
      },
      handleMenuSelect(index) {
        if (index === this.$route.path) {
          return
        }
        this.$router.push({ path: index })
      }
    }
  }
</script>
