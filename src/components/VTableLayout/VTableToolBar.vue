<template>
  <div class="table-tool-bar">
    <div class="left">
      <slot></slot>
    </div>
    <div class="right" v-if="$slots.right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'VTableToolBar'
  }
</script>

<style scoped lang="stylus">
  .table-tool-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 0;
  }
</style>
