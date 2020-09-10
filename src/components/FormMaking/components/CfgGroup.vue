<template>
  <div class="gui-group">
    <div class="gui-group-name"><span>{{ groupName }}</span></div>
    <div class="gui-group-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CfgGroup',
  props: {
    groupName: String
  }
}
</script>

<style lang="stylus" scoped>
.gui-group {
  .gui-group-name {
    border-top: 1px solid #e0e0e0;
    border-bottom: 1px solid #e0e0e0;
    line-height: 34px;
    cursor: pointer;
    text-align: left;
    background-color: #fafafa;
    span {
      line-height: 24px;
      padding: 0 18px;
      border-left: 2px solid #1089ff;
    }
  }
  &:first-child .gui-group-name {
    border-top: none;
  }
  .gui-group-content {
    padding: 5px 0;
  }
}
</style>
