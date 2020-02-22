<template>
  <div class="table-layout-wrapper">
    <div class="tree-wrap" v-if="this.$slots.tree">
      <slot name="tree">tree</slot>
    </div>
    <div class="table-wrap">
      <slot></slot>
      <div class="table-inner">
        <slot name="table"></slot>
      </div>
      <div class="pager-wrap">
        <slot name="pager"></slot>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'VTableWrap'
  }
</script>

<style lang="stylus" scoped>
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
      .table-inner {
        padding: 0 16px;
      }
      .pager-wrap {
        text-align: right;
        padding: 16px 24px;
      }
    }
  }
</style>
