<template>
  <div class="collect-analysis-header">
    <div class="con">
      <span class="title">归集分析</span>

      <span class="link-home">
        首页
      </span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CollectAnalysisHeader',
    data () {
      return {

      }
    },
    created () {

    },
    methods: {

    }
  }
</script>

<style lang="stylus" scoped>
  .collect-analysis-header {
    height: 80px;
    background: rgba(0, 0, 0, 0.7)
    box-shadow: 0 0 8px rgba(100,100,100,0.5);

    .con {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100%;
      width: 1300px;
      margin: 0 auto;

      .title {
        font-size: 27px;
        color: #ffffff;
      }

      .link-home {
        font-size: 16px;
        color: #ffffff;
      }
    }
  }
</style>
