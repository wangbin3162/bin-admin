<template>
  <b-submenu :name="menu.name" transfer>
    <template slot="title">
      <i v-if="menu.icon" :class="`iconfont icon-${menu.icon}`"></i>
      {{ menu.title }}
    </template>
    <template v-for="(child,childIndex) in menu.children">
      <menu-item v-if="!child.children" :menu="child" :key="childIndex"></menu-item>
      <submenu v-else :menu="child" :key="childIndex"></submenu>
    </template>
  </b-submenu>
</template>

<script>
import MenuItem from './MenuItem'

export default {
  name: 'Submenu',
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
