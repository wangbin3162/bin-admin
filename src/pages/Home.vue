<template>
  <div class="index-wrap">
    <Analyze/>
  </div>
</template>

<script>
  import Analyze from './data-analyze/theme-sample/Analyze'

  export default {
    name: 'Home',
    components: { Analyze }
  }
</script>

<style scoped lang="stylus">
  .index-wrap {
    // position: relative;
    // background: url("../assets/images/index-bg.png") no-repeat 0 -60px;
    // height: 100vh;
    // margin: -24px -24px 0;
    .info {
      position: absolute;
      top: 40%;
      left: 40px;
      padding: 20px;
      color: #1eb2fc;
      font-size: 14px;
      line-height: 2;
      h2, h3 {
        font-weight: normal;
        margin: 0;
      }
      h2 {
        font-size: 40px;
      }
      h3 {
        font-size: 30px;
      }
    }
  }
</style>
