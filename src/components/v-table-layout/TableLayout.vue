<template>
  <div class="table-layout-wrapper">
    <div class="tree-view" v-if="$slots.tree">
      <div class="tree-inner">
        <slot name="tree">树插槽</slot>
      </div>
    </div>
    <div class="table-view">
      <slot name="filter" v-if="$slots.filter">查询条件插槽</slot>
      <div class="button-bar" v-if="$slots.ctrl">
        <b-button type="primary" v-waves size="small" @click="handleAdd">
          <i class="el-icon-circle-plus-outline"></i> 新增
        </b-button>
        <slot name="ctrl"></slot>
      </div>
      <div class="table-inner">
        <slot name="table"></slot>
      </div>
      <div class="page-bar">
        <slot name="pager"></slot>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'VTableLayout',
    methods: {
      handleAdd () {
        this.$emit('on-create')
      }
    }
  }
</script>
