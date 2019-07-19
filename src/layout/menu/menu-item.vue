<template>
  <el-menu-item :index="menu.path">
    <i v-if="menu.icon" :class="`iconfont icon-${menu.icon}`"></i>
    <span slot="title">{{menu.title}}</span>
  </el-menu-item>
</template>

<script>
  export default {
    name: 'menu-item',
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
