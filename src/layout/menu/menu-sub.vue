<template>
  <el-submenu :index="resolvePath(menu.path)">
    <template slot="title">
      <i v-if="menu.icon" :class="`iconfont icon-${menu.icon}`"></i>
      <span slot="title">{{menu.title}}</span>
    </template>
    <template v-for="child in menu.children">
      <menu-item v-if="!child.children" :menu="child" :key="child.path"
                 :base-path="resolvePath(menu.path)"></menu-item>
      <menu-sub v-else :menu="child" :key="child.path"
                :base-path="resolvePath(menu.path)"></menu-sub>
    </template>
  </el-submenu>
</template>

<script>
  import path from 'path'
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
