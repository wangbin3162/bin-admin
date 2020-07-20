<template>
  <div class="gui-group">
    <div class="gui-group-name"><span>{{groupName}}</span></div>
    <div class="gui-group-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      groupName: String
    }
  }
</script>

<style lang="stylus" scoped>
  .gui-group-name {
    border-bottom: 1px solid #e0e0e0;
    line-height: 39px;
    cursor: pointer;
    text-align: left;
    span {
      line-height: 24px;
      padding: 0 18px;
      border-left: 2px solid #1089ff;
    }
  }
  .gui-group-content {
    background: #fafafa;
    padding: 5px 0;
  }
</style>
