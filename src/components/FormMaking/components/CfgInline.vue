<template>
  <div class="gui-inline">
    <slot></slot>
    <div class="label">{{ label }}</div>
  </div>
</template>

<script>
export default {
  name: 'CfgInline',
  props: {
    label: String
  }
}
</script>

<style lang="stylus" scoped>
.gui-inline {
  display: inline-block;
  width: 140px;
  margin-right: 8px;
  &:last-child {
    margin-right: 0;
  }
  .label {
    color: #647279;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 12px;
    line-height: 18px;
    text-align: left;
  }
  .bin-input-number-small {
    width: 100%;
  }
}
</style>
