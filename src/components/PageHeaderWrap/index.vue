<template>
  <div class="page-header-wrap">
    <div class="page-header-wrap-page-header-warp">
      <div class="grid-content wide">
        <div class="page-header has-breadcrumb">
          <div class="breadcrumb-box">
            <v-breadcrumb/>
          </div>
          <div class="page-header-heading">
            <span class="page-header-heading-title">
              {{ normalTitle }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="grid-content wide">
      <div class="page-header-wrap-children-content">
        <slot>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'PageHeaderWrap',
    props: {
      title: {
        type: String
      }
    },
    computed: {
      normalTitle() {
        return this.title ? this.title : this.$route.meta.title || 'no-title'
      }
    }
  }
</script>

<style scoped lang="stylus">
  .page-header-wrap {
    margin: -24px -24px 0;
    .page-header {
      box-sizing: border-box;
      margin: 0;
      color: rgba(0, 0, 0, .65);
      font-size: 14px;
      font-variant: tabular-nums;
      line-height: 1.5;
      list-style: none;
      font-feature-settings: "tnum";
      position: relative;
      padding: 16px 24px;
      background-color: #fff;
      .breadcrumb-box {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        color: rgba(0, 0, 0, .65);
        font-variant: tabular-nums;
        line-height: 1.5;
        list-style: none;
        font-feature-settings: "tnum";
        font-size: 14px;
        + .page-header-heading {
          margin-top: 8px;
        }
      }
      &-heading {
        width: 100%;
        overflow: hidden;
        &-title {
          display: block;
          float: left;
          margin-bottom: 0;
          padding-right: 12px;
          color: rgba(0, 0, 0, .85);
          font-weight: 600;
          font-size: 20px;
          line-height: 32px;
        }
      }
    }
    &-children-content {
      margin: 24px 24px 0;
    }
  }
  .page-header-wrap-page-header-warp {
    background-color: #fff;
  }
  .grid-content {
    width: 100%;
    min-height: 100%;
    transition: .3s;
    &.wide {
      max-width: 1200px;
      margin: 0 auto;
    }
  }
</style>
