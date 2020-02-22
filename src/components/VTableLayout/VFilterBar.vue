<template>
  <div class="filter-bar">
    <b-row :gutter="8">
      <slot></slot>
    </b-row>
  </div>
</template>

<script>
  export default {
    name: 'VFilterBar'
  }
</script>

<style scoped lang="stylus">
  .filter-bar {
    padding: 16px 16px 0;
  }
</style>
