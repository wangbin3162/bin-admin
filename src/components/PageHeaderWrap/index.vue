<template>
  <div class="page-header-wrap">
    <div class="page-header-wrap-page-header-warp" v-if="showTitleBox">
      <div class="grid-content">
        <div class="page-header has-breadcrumb">
          <div class="breadcrumb-box" v-if="!showTagsView">
            <v-breadcrumb/>
          </div>
          <div class="page-header-heading">
            <span class="page-header-heading-title">
              {{ normalTitle }}
            </span>
            <b-icon v-if="showClose" name="close" @click.native="$emit('on-close')"></b-icon>
          </div>
          <slot name="desc"></slot>
        </div>
      </div>
    </div>
    <div class="grid-content">
      <div class="page-header-wrap-children-content">
        <slot>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import VBreadcrumb from '../VBreadcrumb'

export default {
  name: 'PageHeaderWrap',
  components: { VBreadcrumb },
  props: {
    title: {
      type: String
    },
    showClose: {
      type: Boolean
    }
  },
  computed: {
    ...mapGetters(['menuType', 'tagsView']),
    normalTitle() {
      return this.title ? this.title : this.$route.meta.title || 'no-title'
    },
    isAside() {
      return this.menuType === 'aside'
    },
    showTagsView() {
      return this.isAside && this.tagsView
    },
    showTitleBox() {
      return !this.showTagsView || !!this.title || this.showClose
    }
  }
}
</script>

<style scoped lang="stylus">
.page-header-wrap {
  background: #f5f7f9;
  .page-header {
    box-sizing: border-box;
    margin: 0;
    color: #515a6e;
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.5;
    list-style: none;
    font-feature-settings: "tnum";
    position: relative;
    padding: 16px 24px;
    background-color: #fff;
    border-bottom: 1px solid #e8eaec;
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
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      overflow: hidden;
      &-title {
        color: #17233d;
        font-weight: 500;
        font-size: 20px;
        margin-bottom: 0;
        padding-right: 12px;
      }
      .icon-close {
        cursor: pointer;
        font-size: 22px;
        margin-right: 6px;
      }
    }
  }
  &-children-content {
    padding: 20px 20px 0;
  }
}
.grid-content {
  width: 100%;
  min-height: 100%;
  transition: .3s;
}
</style>
