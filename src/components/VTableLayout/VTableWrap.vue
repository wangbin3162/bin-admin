<template>
  <div class="table-layout-wrapper">
    <div class="tree-wrap" v-if="this.$slots.tree">
      <slot name="tree">tree</slot>
    </div>
    <div class="table-wrap" :style="{width:$slots.tree?'calc(100% - 224px)':'100%'}">
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
    width: 100%;
    background: #ffffff;
    display: flex;
    flex: auto;
    justify-content: space-between;
    border-radius: 2px;
    .tree-wrap {
      width: 224px;
      border-right: 1px solid #eee;
      padding: 16px 10px;
      overflow-x: auto;
    }
    .table-wrap {
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
