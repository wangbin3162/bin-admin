<template>
  <el-submenu :index="menu.path">
    <template slot="title">
      <i v-if="menu.icon" :class="`iconfont icon-${menu.icon}`"></i>
      <span slot="title">{{menu.title}}</span>
    </template>
    <template v-for="(child, childIndex) in menu.children">
      <menu-item v-if="!child.children" :menu="child" :key="childIndex"></menu-item>
      <menu-sub v-else :menu="child" :key="childIndex"></menu-sub>
    </template>
  </el-submenu>
</template>

<script>
  import MenuItem from './menu-item'

  export default {
    name: 'menu-sub',
    components: {
      MenuItem
    },
    props: {
      menu: {
        type: Object,
        required: false,
        default: () => {
        }
      }
    }
  }
</script>
