<template>
  <b-menu-item :name="menu.name">
    <i v-if="menu.icon" :class="`iconfont icon-${menu.icon}`"></i>
    {{ menu.title }}
  </b-menu-item>
</template>

<script>
export default {
  name: 'MenuItem',
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
