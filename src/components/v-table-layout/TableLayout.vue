<template>
  <div class="table-layout-wrapper">
    <div class="tree-view" v-if="$slots.tree">
      <div class="tree-inner">
        <b-scrollbar style="height: 100%;">
          <slot name="tree">树插槽</slot>
        </b-scrollbar>
      </div>
    </div>
    <div class="table-view">
      <b-container footer-fixed>
        <div class="view-inner" style="margin-right: 20px;">
          <slot name="filter" v-if="$slots.filter">查询条件插槽</slot>
          <div class="button-bar" v-if="$slots.ctrl">
            <slot name="ctrl"></slot>
          </div>
          <div class="table-inner">
            <slot name="table"></slot>
          </div>
        </div>
        <div class="page-bar" slot="footer">
          <slot name="pager"></slot>
        </div>
      </b-container>
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'VTableLayout'
  }
</script>
