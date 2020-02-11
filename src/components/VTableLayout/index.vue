<template>
  <div class="table-layout-wrapper">
    <div class="tree-view" v-if="$slots.tree">
      <div class="tree-inner">
        <slot name="tree">树插槽</slot>
      </div>
    </div>
    <div class="table-view">
      <div class="view-inner" style="margin-right: 20px;">
        <slot name="filter" v-if="$slots.filter">查询条件插槽</slot>
        <div class="button-bar" v-if="$slots.ctrl">
          <slot name="ctrl"></slot>
        </div>
        <div class="table-inner">
          <slot name="table"></slot>
        </div>
      </div>
      <div class="page-bar" slot="footer" v-if="$slots.pager">
        <slot name="pager"></slot>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'VTableLayout'
  }
</script>
