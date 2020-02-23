<template>
  <div class="table-layout-wrapper">
    <div class="tree-wrap" v-if="this.$slots.tree">
      <slot name="tree">tree</slot>
    </div>
    <div class="table-wrap">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'VTableWrap'
  }
</script>

<style lang="stylus">
  .table-layout-wrapper {
    position: relative;
    width: 100%;
    overflow: hidden;
    background: #ffffff;
    display: flex;
    flex: auto;
    justify-content: space-between;
    border-radius: 2px;
    .tree-wrap {
      width: 224px;
      flex: 0 0 224px;
      border-right: 1px solid #eee;
      padding: 20px 5px 20px 10px;
      overflow-x: auto;
    }
    .table-wrap {
      position: relative;
      flex: auto;
      overflow-x: hidden;
      padding: 16px;
      .table-inner {
        width: 100%;
      }
      .bin-page {
        text-align: right;
        margin: 16px 0;
      }
    }
  }
</style>
