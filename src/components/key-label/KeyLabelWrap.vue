<template>
  <div class="key-label-wrap">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'KeyLabelWrap'
  }
</script>

<style scoped>
  .key-label-wrap {
    border-top: 1px solid #f0f3f5;
    border-left: 1px solid #f0f3f5;
    border-right: 1px solid #f0f3f5;
  }
</style>
