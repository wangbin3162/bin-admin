<template>
  <div class="key-label">
    <div class="inner" flex="box:first">
      <span class="key">{{ label }}</span>
      <span class="label"><slot>文字</slot></span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'VSimpleLabel', // 显示简单文字详情使用
    props: {
      label: {
        type: String,
        default: 'label',
        required: true
      }
    }
  }
</script>

<style scoped lang="stylus">
  .key-label {
    line-height: 1.5;
    padding-bottom: 16px;
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
