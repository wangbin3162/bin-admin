<template>
  <b-menu class="header-menu" mode="horizontal" :theme="theme"
          :active-name="activeMenu" @on-select="handleMenuSelect">
    <template v-for="(menu, menuIndex) in navMenu">
      <menu-item v-if="!menu.children" :menu="menu" :key="menuIndex" :base-path="menu.path"></menu-item>
      <submenu v-else :menu="menu" :key="menuIndex" :base-path="menu.path"></submenu>
    </template>
  </b-menu>
</template>

<script>
  import MenuItem from '../AsideMenu/MenuItem'
  import Submenu from '../AsideMenu/Submenu'
  import { mapGetters } from 'vuex'

  export default {
    name: 'HeaderMenu',
    components: { Submenu, MenuItem },
    computed: {
      ...mapGetters(['navMenu', 'theme']),
      activeMenu() {
        const route = this.$route
        const { meta, path } = route
        if (meta.activeMenu) {
          return meta.activeMenu
        }
        return path
      }
    },
    methods: {
      handleMenuSelect(index) {
        if (index === this.$route.path) {
          return
        }
        this.$router.push({ path: index })
      }
    }
  }
</script>
