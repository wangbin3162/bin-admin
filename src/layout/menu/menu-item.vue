<template>
  <el-menu-item :index="resolvePath(menu.path)">
    <i v-if="menu.icon" :class="`iconfont icon-${menu.icon}`"></i>
    <span slot="title">{{menu.title}}</span>
  </el-menu-item>
</template>

<script>
  import path from 'path'

  export default {
    name: 'menu-item',
    props: {
      menu: {
        type: Object,
        required: false,
        default: () => {
        }
      },
      basePath: {
        type: String,
        default: ''
      }
    },
    methods: {
      resolvePath (routePath) {
        return path.resolve(this.basePath, routePath)
      }
    }
  }
</script>
