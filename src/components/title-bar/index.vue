<template>
  <div class="title" :style="titleStyle">
    <div class="label" :class="`tip-${tipPos}`">
      <slot>
        <b-icon :name="icon" v-if="icon"></b-icon>
        <span>{{ label }}</span>
      </slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'TitleBar',
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
        validator (value) {
          return ['bottom', 'left'].includes(value)
        },
        default: 'bottom'
      },
      fontSize: {
        type: Number,
        default: 18
      }
    },
    computed: {
      titleStyle () {
        return {
          fontSize: `${this.fontSize}px`,
          borderBottom: this.tipPos === 'left' ? null : '1px solid #f0f0f0'
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
  .title {
    width: 100%;
    color: #333333;
    background: #fff;
    .label {
      position: relative;
      display: inline-block;
      vertical-align: middle;
      padding: 10px 5px;
      &:after {
        content: '';
        position: absolute;
        background-color: #1890ff;
      }
      &.tip-bottom {
        &:after {
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          margin-bottom: -1px;
        }
      }
      &.tip-left {
        padding-left: 20px;
        &:after {
          top: 12px;
          bottom: 12px;
          left: 0;
          width: 3px;
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
