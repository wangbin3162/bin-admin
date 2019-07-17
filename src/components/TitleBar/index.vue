<template>
  <div class="title">
    <i class="iconfont" :class="icon"></i>
    <span>{{ label }}</span>
  </div>
</template>

<script>
  export default {
    props: {
      label: {
        type: String,
        default: '标题'
      },
      icon: {
        type: String,
        default: 'icon-ios-leaf'
      }
    }
  }
</script>

<style scoped lang="scss">
  .title {
    width: 100%;
    font-size: 14px;
    padding: 10px 12px;
    border-bottom: 1px solid #f0f0f0;
    color: #596b77;
    background: #fff;

    .iconfont {
      display: inline-block;
      vertical-align: middle;
    }

    span {
      font-weight: 700;
      display: inline-block;
      vertical-align: middle;
      margin-left: 4px;
    }
  }
</style>
