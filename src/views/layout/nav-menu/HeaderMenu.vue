<template>
  <b-menu class="header-menu" mode="horizontal" :active-name="activeMenu" @on-select="handleMenuSelect">
    <template v-for="(menu, menuIndex) in headerMenu">
      <menu-item v-if="!menu.children" :menu="menu" :key="menuIndex" :base-path="menu.path"></menu-item>
      <submenu v-else :menu="menu" :key="menuIndex" :base-path="menu.path"></submenu>
    </template>
  </b-menu>
</template>

<script>
  import { mapGetters } from 'vuex'
  import MenuItem from './MenuItem'
  import Submenu from './Submenu'

  export default {
    name: 'HeaderMenu',
    computed: {
      ...mapGetters(['headerMenu']),
      activeMenu () {
        const route = this.$route
        const { meta, path } = route
        if (meta.activeMenu) {
          return meta.activeMenu
        }
        return path
      }
    },
    methods: {
      handleMenuSelect (index) {
        if (index === this.$route.path) {
          return
        }
        this.$router.push({ path: index })
      }
    },
    components: { Submenu, MenuItem }
  }
</script>
