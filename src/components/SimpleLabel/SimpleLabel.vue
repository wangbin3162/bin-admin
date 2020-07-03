<template>
  <div class="key-label" :style="{marginBottom}">
    <div class="inner" flex="box:first">
      <span class="key">{{ label }}</span>
      <span class="label"><slot>文字</slot></span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'SimpleLabel', // 显示简单文字详情使用
    props: {
      label: {
        type: String,
        default: 'label',
        required: true
      },
      marginBottom: {
        type: String
      }
    }
  }
</script>

<style scoped lang="stylus">
  .key-label {
    > span {
      display: inline-block;
    }
    .key {
      color: rgba(0, 0, 0, .85);
      font-weight: 400;
      font-size: 14px;
      line-height: 32px;
      white-space: nowrap;
      &:after {
        position: relative;
        top: -.5px;
        margin: 0 8px 0 2px;
        content: ": ";
      }
    }
    .label {
      color: rgba(0, 0, 0, .65);
      font-size: 14px;
      line-height: 32px;
      user-select: text;
    }
  }
</style>
