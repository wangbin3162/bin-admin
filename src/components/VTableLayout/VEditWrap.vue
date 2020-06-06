<template>
  <div class="edit-wrap" :class="{'transparent':transparent}">
    <slot></slot>
    <div class="full" v-if="$slots.full">
      <slot slot="full"></slot>
    </div>
    <div class="edit-form-footer" :style="footerStyle">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'VEditWrap',
    props: {
      transparent: {
        type: Boolean
      }
    },
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
    width: 100%;
    background: #ffffff;
    border-radius: 2px;
    padding: 24px 16px;
    &.transparent {
      padding: 0;
      border-radius: 0;
      background: none;
    }
    .edit-form-footer {
      position: fixed;
      right: 0;
      bottom: 0;
      z-index: 10;
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
