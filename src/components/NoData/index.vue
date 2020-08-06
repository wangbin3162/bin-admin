<template>
  <div class="no-data t-center" :class="mode">
    <img src="../../assets/images/no-data.png" alt="no-data"/>
    <p class="text">暂无数据</p>
  </div>
</template>

<script>
export default {
  name: 'NoData',
  props: {
    mode: {
      type: String,
      default: 'default'
    },
    noDataText: {
      type: String,
      default: '暂无数据'
    }
  }
}
</script>

<style scoped lang="stylus">
.no-data {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 30px 0 40px;
  .text {
    font-size: 16px;
    color: rgba(0, 0, 0, .65);
  }
  &.mini {
    padding: 8px 0;
    img {
      width: 152px;
      height: 118px;
    }
    .text {
      font-size: 14px;
    }
  }
}
</style>
