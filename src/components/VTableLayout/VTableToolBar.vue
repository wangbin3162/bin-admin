<template>
  <div class="table-tool-bar">
    <slot></slot>
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
    margin-bottom: 17px;
  }
</style>
