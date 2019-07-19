<template>
  <el-menu class="el-menu-demo" mode="vertical" @select="handleMenuSelect" :default-active="active">
    <template v-for="(menu, menuIndex) in headerMenu">
      <menu-item v-if="!menu.children" :menu="menu" :key="menuIndex"></menu-item>
      <menu-sub v-else :menu="menu" :key="menuIndex"></menu-sub>
    </template>
  </el-menu>
</template>

<script>
  import { mapGetters } from 'vuex'
  import MenuItem from '../menu/menu-item'
  import MenuSub from '../menu/menu-sub'

  export default {
    name: 'AsideMenu',
    data () {
      return {
        active: ''
      }
    },
    watch: {
      '$route.matched': {
        handler (val) {
          let fullPath = val[val.length - 1].path
          this.active = fullPath.slice(fullPath.lastIndexOf('/') + 1)
        },
        immediate: true
      }
    },
    computed: {
      ...mapGetters(['headerMenu'])
    },
    methods: {
      handleMenuSelect (index, indexPath) {
        let to = indexPath.join('/')
        this.$router.push({ path: to })
      }
    },
    components: {
      MenuSub,
      MenuItem
    }
  }
</script>
