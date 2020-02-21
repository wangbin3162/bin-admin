<template>
  <div class="table-layout-wrapper">
    <div class="tree-view" v-if="$slots.tree">
      <div class="tree-inner">
        <slot name="tree">树插槽</slot>
      </div>
    </div>
    <div class="table-view">
      <div class="view-inner">
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

<style lang="stylus">
  .table-layout-wrapper {
    position: relative;
    width: 100%;
    overflow: hidden;
    background: #f5f7f9;
    display: flex;
    flex: auto;
    justify-content: space-between;
    .tree-view {
      width: 200px;
      flex: 0 0 200px;
      background: #fff;
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
      border-right: 1px solid #eee;
      .tree-inner {
        height: 100%;
        padding: 20px 5px 20px 10px;
      }
    }
    .table-view {
      position: relative;
      flex: 1;
      background: #fff;
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
      .view-inner {
        padding: 20px;
      }
      .table-inner {
        padding-top: 10px;
        .bin-tag {
          margin: 0;
        }
        .bin-button {
          font-weight: normal;
        }
        .bin-button.is-disabled, .bin-button.is-disabled:focus, .bin-button.is-disabled:hover {
          background-color: transparent;
        }
      }

    }
  }

  .button-bar {
    padding: 10px 0 0;
  }

  .filter-container {
    background #f8f9fb;
    border-radius: 4px;
    .row {
      display: flex;
      align-content: flex-start;
      padding: 10px 0;
      .filter-item {
        display: flex;
        align-items: center;
        .label {
          width: 100px;
          padding: 10px 0;
          font-size: 12px;
          color: #606266;
          text-align: center;
        }
        .bin-input-wrapper, .bin-select-wrapper {
          flex: 1;
        }
        .search-btn {
          padding-left: 20px;
          .open {
            display: inline-block;
            margin-left: 10px;
            color: rgb(32, 160, 255);
            font-size: 12px;
            cursor: pointer;
            &:hover {
              color: #337ab7;
            }
          }
        }
      }
    }
  }

  .page-bar {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 48px;
    .bin-page-options {
      vertical-align: top;
    }
  }

</style>
