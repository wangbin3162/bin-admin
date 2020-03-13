<template>
  <div class="edit-wrap">
    <b-row type="flex" justify="center">
      <b-col :xs="22" :sm="22" :md="22" :lg="18" :xl="18" :xxl="18">
        <slot></slot>
      </b-col>
    </b-row>
    <slot name="full"></slot>
    <div class="edit-form-footer" :style="footerStyle">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'VEditWrap',
    computed: {
      ...mapGetters(['menuType', 'sidebar']),
      footerStyle() {
        if (this.menuType === 'aside') {
          return {
            width: `calc(100% - ${this.sidebar ? 256 : 64}px)`,
            transition: 'width .2s'
          }
        }
        return null
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .edit-wrap {
    position: relative;
    width: 100%;
    overflow: hidden;
    background: #ffffff;
    border-radius: 2px;
    padding: 32px 16px 24px;
    .edit-form-footer {
      position: fixed;
      right: 0;
      bottom: 0;
      z-index: 99;
      width: 100%;
      height: 56px;
      padding: 0 24px;
      line-height: 56px;
      background: #fff;
      border-top: 1px solid #e8e8e8;
      border-left 1px solid #e8e8e8;
      box-shadow: 0 -1px 2px rgba(0, 0, 0, .03);
      text-align: right;
    }
  }
</style>
