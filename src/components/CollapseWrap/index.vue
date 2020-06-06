<template>
  <div :class="itemClasses">
    <div class="header" :class="{'is-collapse':collapse}" @click="toggle">
      <div class="label">
        <slot name="title">
          {{ title }}
        </slot>
      </div>
      <div class="right" v-if="$slots.right">
        <slot name="right">
          {{ title }}
        </slot>
      </div>
      <div class="arrow">
        <b-icon name="ios-arrow-down" v-if="collapse"></b-icon>
      </div>
    </div>
    <collapse-transition v-if="mounted">
      <div class="content" v-show="isActive">
        <div class="content-box">
          <slot></slot>
        </div>
      </div>
    </collapse-transition>
  </div>
</template>

<script>
  export default {
    name: 'VCollapseWrap',
    props: {
      value: {
        type: Boolean,
        default: true
      },
      title: String,
      collapse: {
        type: Boolean
      }
    },
    watch: {
      value: {
        handler(val) {
          this.isActive = val
        },
        immediate: true
      }
    },
    data() {
      return {
        isActive: true,
        mounted: false
      }
    },
    mounted() {
      this.mounted = true
    },
    computed: {
      itemClasses() {
        return [
          'collapse-wrap',
          {
            'collapse-wrap-active': this.isActive
          }
        ]
      }
    },
    methods: {
      toggle() {
        if (this.collapse) {
          this.isActive = !this.isActive
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .collapse-wrap {
    background: #fff;
    .header {
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      font-size: 18px;
      color: #333333;
      background: #fff;
      transition: .3s;
      &.is-collapse {
        cursor: pointer;
      }
      .label {
        position: relative;
        display: inline-block;
        vertical-align: middle;
        padding: 16px 24px;
        &:after {
          content: '';
          position: absolute;
          background-color: #1890ff;
          left: 0;
          top: 18px;
          bottom: 18px;
          width: 3px;
        }
      }
      .right {
        padding-right: 24px;
      }
      .arrow {
        position: absolute;
        top: 16px;
        right: 16px;
        transition: .3s;
        .iconfont {
          font-size: 20px;
          vertical-align: -1px;
        }
      }
    }
    .content {
      color: rgba(0, 0, 0, 0.65);
      padding: 0 16px;
      background-color: #fff;
    }
    .content-box {
      padding: 16px 0;
    }
    &-active {
      .header {
        box-shadow: 0 1px 3px 1px #eeeeee;
        .arrow {
          transform: rotate(180deg);
        }
      }
    }
    + .collapse-wrap {
      margin-top: 16px;
    }
  }
</style>
