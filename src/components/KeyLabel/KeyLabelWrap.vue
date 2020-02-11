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
    border-top: 1px solid #eeeeee;
    border-left: 1px solid #eeeeee;
    border-right: 1px solid #eeeeee;
  }
</style>
