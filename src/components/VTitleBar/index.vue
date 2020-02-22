<template>
  <div class="title" :class="{'no-border':noBorder}">
    <div class="label" :class="`tip-${tipPos}`">
      <b-icon :name="icon" v-if="icon"></b-icon>
      <span>{{ label }}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'VTitleBar',
    props: {
      label: {
        type: String,
        default: '标题'
      },
      icon: {
        type: String
      },
      tipPos: {
        type: String,
        validator(value) {
          return ['bottom', 'left'].includes(value)
        },
        default: 'bottom'
      },
      noBorder: Boolean
    }
  }
</script>

<style scoped lang="stylus">
  .title {
    width: 100%;
    font-size: 18px;
    border-bottom: 1px solid #f0f0f0;
    color: #333333;
    background: #fff;

    &.no-border {
      border-bottom: none;
    }

    .label {
      position: relative;
      display: inline-block;
      vertical-align: middle;
      padding: 10px 12px;

      &:after {
        content: '';
        position: absolute;
        background-color: #1890ff;
      }

      &.tip-left {
        &:after {
          left: 0;
          top: 12px;
          bottom: 12px;
          width: 2px;
        }
      }

      &.tip-bottom {
        &:after {
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
        }
      }

      .iconfont {
        display: inline-block;
        vertical-align: baseline;
        margin-right: 4px;
      }

      span {
        display: inline-block;
        vertical-align: baseline;
      }
    }
  }
</style>
