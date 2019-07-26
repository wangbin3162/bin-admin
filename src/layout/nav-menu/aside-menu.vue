<template>
  <div class="side-menu-wrapper">
    <b-menu @on-select="handleMenuSelect" :theme="theme" class="aside-menu" v-show="sidebar"
            :active-name="activeMenu" accordion>
      <template v-for="(menu, menuIndex) in asideMenu">
        <menu-item v-if="!menu.children" :menu="menu" :key="menuIndex" :base-path="menu.path"></menu-item>
        <submenu v-else :menu="menu" :key="menuIndex" :base-path="menu.path"></submenu>
      </template>
    </b-menu>
    <div v-show="!sidebar" class="menu-collapsed">
      <template v-for="menu in asideMenu">
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
</template>

<script>
  import { mapGetters } from 'vuex'
  import MenuItem from './menu-item'
  import Submenu from './submenu'
  import CollapsedMenu from './collapsed-menu'

  export default {
    name: 'AsideMenu',
    computed: {
      ...mapGetters(['asideMenu', 'sidebar', 'theme']),
      activeMenu () {
        const route = this.$route
        const { meta, path } = route
        // 如果设置路径，侧栏将突出显示您设置的路径
        if (meta.activeMenu) {
          return meta.activeMenu
        }
        return path
      }
    },
    methods: {
      handleSelect (name) {
        this.handleMenuSelect(name)
      },
      handleMenuSelect (index) {
        this.$router.push({ path: index })
      }
    },
    components: { Submenu, MenuItem, CollapsedMenu }
  }
</script>
