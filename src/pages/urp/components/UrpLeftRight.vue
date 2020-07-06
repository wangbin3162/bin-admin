<template>
  <div class="left-right-wrapper">
    <div class="left-panel">
      <div class="top">
        <title-bar tip-pos="left" :font-size="16">
          <slot name="left-header">左边标题</slot>
        </title-bar>
      </div>
      <div class="panel">
        <slot name="left">left</slot>
      </div>
    </div>
    <div class="right-panel">
      <div class="top">
        <title-bar tip-pos="left" :font-size="16">
          <slot name="right-header">右边标题</slot>
        </title-bar>
      </div>
      <div class="panel">
        <slot name="right">right</slot>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'UrpLeftRight'
  }
</script>

<style scoped lang="stylus">
  .left-right-wrapper {
    background: #fff;
    display: flex;
    border: 1px solid #eeeeee;
    .left-panel {
      width: 220px;
      border-right: 1px solid #eeeeee;
    }
    .right-panel {
      width: calc(100% - 220px);
    }
    .top {
      border-bottom: 1px solid #eeeeee;
    }
    .panel {
      padding: 16px 24px;
      height: 500px;
      overflow: auto;
    }
  }
</style>
