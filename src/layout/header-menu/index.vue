<template>
  <el-menu class="header-menu" mode="horizontal" @select="handleMenuSelect" :default-active="activeMenu">
    <template v-for="(menu, menuIndex) in headerMenu">
      <menu-item v-if="!menu.children" :menu="menu" :key="menuIndex" :base-path="menu.path"></menu-item>
      <menu-sub v-else :menu="menu" :key="menuIndex" :base-path="menu.path"></menu-sub>
    </template>
  </el-menu>
</template>

<script>
  import { mapGetters } from 'vuex'
  import MenuItem from '../menu/menu-item'
  import MenuSub from '../menu/menu-sub'

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
      handleMenuSelect (index, indexPath) {
        // console.log(index)
        this.$router.push({ path: index })
      }
    },
    components: {
      MenuSub,
      MenuItem
    }
  }
</script>
