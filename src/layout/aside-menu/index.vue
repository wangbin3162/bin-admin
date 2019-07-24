<template>
  <el-menu class="el-menu-demo" mode="vertical" @select="handleMenuSelect"
           :default-active="activeMenu" :collapse="!sidebar"
           :background-color="bgColor" :text-color="txColor"
           unique-opened :collapse-transition="false">
    <template v-for="(menu, menuIndex) in asideMenu">
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
      },
      bgColor () {
        return this.theme === 'dark' ? '#001529' : '#ffffff'
      },
      txColor () {
        return this.theme === 'dark' ? '#bfcbd9' : '#303133'
      }
    },
    methods: {
      handleMenuSelect (index, indexPath) {
        this.$router.push({ path: index })
      }
    },
    components: {
      MenuSub,
      MenuItem
    }
  }
</script>
